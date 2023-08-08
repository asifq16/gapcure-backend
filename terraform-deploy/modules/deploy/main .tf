# main.tf
provider "aws" {
  region = "us-east-1"
}
# Create an ecs cluster
resource "aws_ecs_cluster" "my_cluster" {
  name = "pytho-score-api"
}

# Create an ecr repository
resource "aws_ecr_repository" "my_ecr_repo" {
  name = "pytho-score-api"
}

# Create an ecs task definition
resource "aws_ecs_task_definition" "my_task_definition" {
  family                   = "pytho-score-api" # Name your task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "pytho-score-api",
      "image": "${aws_ecr_repository.my_ecr_repo.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = "arn:aws:iam::574571384854:role/ecsTaskExecutionRole"
}

# Create an ecs service
resource "aws_ecs_service" "my_service" {
  name            = "pytho-score-api"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-05cc55755056efdc6", "subnet-026f24334f4e2df98"] # Replace with your actual subnet IDs
    security_groups = ["sg-04b863ca6064b7bd0"]   # Replace with your actual security group IDs
  }
}

# Build and Push Docker Image Locally using local-exec provisioner
resource "null_resource" "docker_build_push" {
  # Use the depends_on attribute to ensure the Docker image is built before deploying the ECS service
  depends_on = [aws_ecr_repository.my_ecr_repo]

#Authentication token
 provisioner "local-exec" {
    command = "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 574571384854.dkr.ecr.us-east-1.amazonaws.com"
 }

#Build your Docker image
  provisioner "local-exec" {
    
    command = "docker build -t ${aws_ecr_repository.my_ecr_repo.repository_url}:latest -f Dockerfile ."
  }
  
#tag your image  
provisioner "local-exec" {
    command = "docker tag pytho-score-api:latest 574571384854.dkr.ecr.us-east-1.amazonaws.com/pytho-score-api:latest"
   
  }

# push image  
  provisioner "local-exec" {
    command = "docker push ${aws_ecr_repository.my_ecr_repo.repository_url}:latest"
  }
}