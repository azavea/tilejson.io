module "origin" {
  source               = "github.com/azavea/terraform-aws-s3-origin?ref=0.2.0"
  bucket_name          = "tilejson-io-${lower(var.environment)}-site-${var.aws_region}"
  logs_bucket_name     = "tilejson-io-${lower(var.environment)}-logs-${var.aws_region}"
  cors_allowed_headers = ["Authorization"]
  cors_allowed_methods = ["GET"]
  cors_allowed_origins = ["*"]
  cors_max_age_seconds = "3000"
  region               = "${var.aws_region}"

  project     = "${var.project}"
  environment = "${var.environment}"
}

resource "aws_cloudfront_distribution" "app" {
  origin {
    domain_name = "${module.origin.site_bucket}.s3.amazonaws.com"
    origin_id   = "originEastId"
    origin_path = ""
  }

  enabled             = true
  http_version        = "http2"
  comment             = "TILEJSON IO (${var.environment})"
  default_root_object = "index.html"
  retain_on_delete    = true

  price_class = "PriceClass_All"
  aliases     = ["${var.r53_public_hosted_zone}"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "originEastId"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    # Only applies if the origin adds Cache-Control headers. The
    # CloudFront default is also 0.
    min_ttl = 0

    # Five minutes, and only applies when the origin DOES NOT
    # supply Cache-Control headers.
    default_ttl = 300

    # One day, but only applies if the origin adds Cache-Control
    # headers. The CloudFront default is 31536000 (one year).
    max_ttl = 86400
  }

  custom_error_response {
    error_caching_min_ttl = "0"
    error_code            = "403"
    response_code         = "200"
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = "0"
    error_code            = "404"
    response_code         = "200"
    response_page_path    = "/index.html"
  }

  logging_config {
    include_cookies = false
    bucket          = "${module.origin.logs_bucket}.s3.amazonaws.com"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "${var.aws_certificate_arn}"
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }
}