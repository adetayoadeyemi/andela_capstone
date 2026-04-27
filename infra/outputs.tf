output "frontend_bucket_name" {
  description = "S3 bucket for static Nuxt assets (sync .output/public here)."
  value       = aws_s3_bucket.frontend.id
}

output "frontend_cloudfront_domain" {
  description = "CloudFront hostname for the SPA (https://<this>)."
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_cloudfront_url" {
  description = "HTTPS URL for the deployed frontend."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "frontend_cloudfront_distribution_id" {
  description = "Use for cache invalidation after uploads: aws cloudfront create-invalidation --distribution-id <id> --paths '/*'."
  value       = aws_cloudfront_distribution.frontend.id
}

output "backend_ecr_repository_url" {
  description = "docker build -t <url>:tag ../backend && docker push <url>:tag"
  value       = aws_ecr_repository.backend.repository_url
}

output "backend_apprunner_service_url" {
  description = "Public HTTPS URL for the Nest API."
  value       = "https://${aws_apprunner_service.backend.service_url}"
}

output "backend_apprunner_service_arn" {
  value = aws_apprunner_service.backend.arn
}
