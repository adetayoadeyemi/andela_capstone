variable "project_name" {
  type        = string
  description = "Short name used in resource names (lowercase, no spaces)."
  default     = "capstone"
}

variable "environment" {
  type        = string
  description = "Deployment stage (e.g. dev, staging, prod)."
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS region for App Runner, ECR, S3, and CloudFront origin metadata."
  default     = "us-east-1"
}

variable "extra_tags" {
  type        = map(string)
  description = "Additional tags applied to supported resources."
  default     = {}
}

variable "backend_image_tag" {
  type        = string
  description = "ECR image tag App Runner deploys (e.g. latest or a git SHA)."
  default     = "latest"
}

variable "backend_environment" {
  type        = map(string)
  description = <<-EOT
    Environment variables for the Nest API (include secrets only if you accept they live in Terraform state).
    Typical keys: DATABASE_URL, OPENAI_API_KEY, WHATSAPP_VERIFY_TOKEN, WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WHATSAPP_API_URL, etc.
  EOT
  sensitive   = true
  default     = {}
}

variable "cloudfront_price_class" {
  type        = string
  description = "CloudFront price class (PriceClass_100 | PriceClass_200 | PriceClass_All)."
  default     = "PriceClass_100"
}
