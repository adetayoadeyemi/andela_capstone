# AWS deployment (Terraform)

This stack provisions:

- **Frontend**: private S3 bucket + CloudFront (default TLS certificate, SPA routing via custom error pages to `index.html`).
- **Backend**: ECR repository + App Runner service pulling your Nest image (port 3000, health check `GET /health`).

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) `>= 1.5`
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured (`aws sts get-caller-identity` works)
- [Docker](https://docs.docker.com/get-docker/) for building and pushing the API image

## Configure variables

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — do not commit this file (it is gitignored).
```

## First-time deploy order

App Runner needs an image in ECR. If the first `terraform apply` fails on `aws_apprunner_service` because the image is missing, that is expected: ECR and the rest of the stack are still created. Push the image, then apply again.

1. **Initialize Terraform**

   ```bash
   cd infra
   terraform init
   ```

2. **Apply infrastructure** (may fail on App Runner until an image exists)

   ```bash
   terraform apply
   ```

3. **Build and push the Nest API** (from repo root; replace `AWS_REGION` and `ACCOUNT_ID` using outputs or `aws sts get-caller-identity`)

   ```bash
   aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

   docker build -t <backend_ecr_repository_url>:latest -f backend/Dockerfile backend
   docker push <backend_ecr_repository_url>:latest
   ```

4. **Apply again** (if App Runner failed the first time; run from `infra/`)

   ```bash
   terraform apply
   ```

   With `auto_deployments_enabled = true`, later `docker push` calls to the same tag can trigger new deployments (tag mutability is `MUTABLE` on the repository).

## Deploy the static Nuxt frontend

The app uses `ssr: false`; build outputs static assets under `frontend/.output/public`.

1. **Build with production env** (Supabase and any `NUXT_PUBLIC_*` values must be present at build time for them to be baked into the client bundle.)

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

2. **Sync to S3** (use `frontend_bucket_name` from `terraform output`)

   ```bash
   aws s3 sync .output/public s3://<frontend_bucket_name> --delete
   ```

3. **Invalidate CloudFront** (optional; speeds up seeing new `index.html` — hashed assets under `_nuxt/` often bypass stale HTML issues)

   ```bash
   aws cloudfront create-invalidation --distribution-id <frontend_cloudfront_distribution_id> --paths "/*"
   ```

Open the site at `frontend_cloudfront_url` from `terraform output`.

## Outputs

Run `terraform output` for:

- `frontend_cloudfront_url` — browser URL for the SPA  
- `backend_apprunner_service_url` — base URL for the REST API  
- `frontend_bucket_name`, `frontend_cloudfront_distribution_id` — deploy/invalidation  
- `backend_ecr_repository_url` — Docker tag/push target  

## Security notes

- `backend_environment` in `terraform.tfvars` is **sensitive** and stored in **Terraform state**. For stricter setups, migrate to [AWS Secrets Manager](https://docs.aws.amazon.com/apprunner/latest/dg/env-variable-secrets.html) and wire `runtime_environment_secrets` in Terraform instead of plain environment variables.
- S3 remains private; only CloudFront can read objects (OAC + bucket policy).

## Optional: remote state

Uncomment and fill a `backend "s3"` block in `versions.tf` if you want team-shared remote state and locking (separate bucket and DynamoDB table created once outside this module).
