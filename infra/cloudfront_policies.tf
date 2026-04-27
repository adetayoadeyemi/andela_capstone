# Custom policies avoid hardcoded managed-policy UUIDs (some accounts/API paths return NoSuchCachePolicy).

resource "aws_cloudfront_cache_policy" "frontend_static" {
  name        = "${local.name_prefix}-static-cache"
  comment     = "S3 static SPA: compress, long TTL for hashed assets"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_origin_request_policy" "frontend_s3" {
  name    = "${local.name_prefix}-s3-origin"
  comment = "Minimal origin request for private S3 + OAC"

  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "none"
  }
  query_strings_config {
    query_string_behavior = "none"
  }
}
