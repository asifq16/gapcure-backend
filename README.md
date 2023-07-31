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
yarn dev
yarn start:prod
```

# TerraForm Configuration  and use

# Install 
https://developer.hashicorp.com/terraform/downloads  Follow the link and download/install terraform in the system.

# use
There are 2 way to run terraform folder 1. Individually run folder  2. Run all the folders .

1. Individually run folder
 go to terraform module directory like for run table module :
  go to => terraform-deploy/module/table
  than run command => terraform init 
  than run command = > terraform apply

2. Run all the folders
 go to terraform- deploy folder :
  go to => terraform-deploy
  than run command => terraform init 
  than run command = > terraform apply  