provider "aws" {
  region = "us-east-1"
}

resource "aws_apigatewayv2_api" "example_api" {
  name          = "pytho-score-api"
  protocol_type = "HTTP"
  description   = "HTTP API"
}

resource "aws_apigatewayv2_stage" "example_stage" {
  name             = "pytho-score-api"
  api_id           = aws_apigatewayv2_api.example_api.id
  auto_deploy      = true
}

resource "aws_apigatewayv2_route" "example_route" {
  api_id    = aws_apigatewayv2_api.example_api.id
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.example_integration.id}"
}

resource "aws_apigatewayv2_integration" "example_integration" {
  api_id = aws_apigatewayv2_api.example_api.id
  integration_type = "HTTP_PROXY"
  integration_method = "ANY"
  integration_uri = "http://35.175.109.166:8081"  # Replace with your backend service URL

  connection_type = "INTERNET"
}

