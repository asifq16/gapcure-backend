terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0.0"  # Use the version you need
    }
  }
}

provider "aws" {
  region     = var.region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

module "table_module" {
  source = "./modules/tables"
}

module "ECS_deploy_module" {
  source = "./modules/deploy"
}

# .. other module define here
