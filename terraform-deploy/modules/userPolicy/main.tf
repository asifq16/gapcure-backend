# main.tf
provider "aws" {
  region = "us-east-1"
}

# Define the IAM user
resource "aws_iam_user" "my_user" {
  name = "purpleflysolutions"
}

# Define the IAM role for ecsTaskExecutionRole
resource "aws_iam_role" "my_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Create and attach IAM policy for TaskExecution
resource "aws_iam_policy" "policy_1" {
  name        = "ECSTaskExecutionRolePolicy"
  description = "IAM ECS task"

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
})
}

resource "aws_iam_policy_attachment" "policy_attachment_1" {
  name       = "policy-attachment-1"
  policy_arn = aws_iam_policy.policy_1.arn
  roles      = [aws_iam_role.my_role.name]
}
resource "aws_iam_user_policy_attachment" "policy_attachment_1" {
  user       = aws_iam_user.my_user.name
  policy_arn = aws_iam_policy.policy_1.arn
}

# Create and attach IAM policy 2 for ecs access
resource "aws_iam_policy" "policy_2" {
  name        = "ecs_access"
  description = "IAM ecs access"

  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "ecs:*",
                "ecr:*"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::574571384854:role/ecsTaskExecutionRole"
        }
    ]
})
}

resource "aws_iam_policy_attachment" "policy_attachment_2" {
  name       = "policy-attachment-2"
  policy_arn = aws_iam_policy.policy_2.arn
  roles      = [aws_iam_role.my_role.name]
}

resource "aws_iam_user_policy_attachment" "policy_attachment_2" {
  user       = aws_iam_user.my_user.name
  policy_arn = aws_iam_policy.policy_1.arn
}
