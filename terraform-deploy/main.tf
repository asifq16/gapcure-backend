terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.0.0"  # Use the version you need
    }
  }
}

module "table_module" {
  source = "./modules/tables"
}

module "ECS_deploy_module" {
  source = "./modules/deploy"
}

# .. other module define here
