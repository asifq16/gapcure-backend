# Pyhto Score API

Pyhto Score API NodeJs Express backend

# Configure and use in local

Step-1:

Clone <b>Pyhto-Score-API</b> repository

Step-2:

```
yarn
```

Step-3:

Place the .env files on root, required below .env files

```
.env.development.local
.env.production.local
.env.test.local
```

Step-4:
Run the project
Development

```
yarn dev
```

Test

```
yarn start:test
```

Production

```
yarn start:prod
```

# AWS Configuration and running Terraform Script Steps

Before running Terraform, you need to configure your AWS credentials to enable Terraform to access your AWS resources. Follow the steps below to set up the AWS CLI with your credentials:

# AWS Configuration

Step 1: Open the terminal and check AWS CLI configuration by running the following command:

```
aws configure
```

Step 2: Follow the prompts in the terminal and provide your AWS account's Access Key, Secret Key, and your preferred AWS Region.

These steps will configure your AWS CLI with the necessary credentials and default region, allowing you to access AWS services from the command line.

# Terraform Configuration and Usage

Step 1:

Install Terraform
Download and install Terraform from the official website: https://www.terraform.io/downloads.html

Step 2:

# Check Terraform Version

Ensure Terraform is installed by running the following command in the terminal:

```
terraform --version
```

# Using Terraform

1. Individually Run Modules
   To run a specific module, navigate to its directory and execute the following commands:

```
cd terraform-deploy/module/table
terraform init
terraform apply

```

2. Run All Modules
   To run all modules together, navigate to the main directory and execute the following commands:

```
cd terraform-deploy
terraform init
terraform apply
```
