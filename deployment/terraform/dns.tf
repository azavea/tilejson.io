#
# Public DNS resources
#
resource "aws_route53_zone" "external" {
  name = "${var.r53_public_hosted_zone}."
}

resource "aws_route53_record" "app" {
  zone_id = "${aws_route53_zone.external.zone_id}"
  name    = "${var.r53_public_hosted_zone}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.app.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.app.hosted_zone_id}"
    evaluate_target_health = false
  }
}