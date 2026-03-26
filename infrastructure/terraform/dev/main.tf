# ─────────────────────────────────────────────────────────────────
# Unkov — Dev / Sandbox VPC + Infrastructure
# terraform/dev/main.tf
#
# What this provisions:
#   • VPC (10.0.0.0/16) with DNS support
#   • 2 private subnets (Lambda / ECS scan runner)
#   • 1 public subnet (NAT Gateway)
#   • Internet Gateway + NAT Gateway
#   • Route tables (public → IGW, private → NAT)
#   • Security groups (scan runner, API Lambda)
#   • VPC Endpoints (DynamoDB, SSM — avoids NAT charges)
#   • SSM Parameter Store entries for secrets
#   • EventBridge Scheduler — nightly engine scan (02:00 UTC)
#   • CloudWatch Log Groups (engine, API, scheduler)
#   • IAM roles: scanner-role, api-role
#
# Usage:
#   cd terraform/dev
#   terraform init
#   terraform plan
#   terraform apply
#
# Prerequisites:
#   • AWS CLI configured (aws configure)
#   • Terraform >= 1.5
#   • S3 bucket for state (update backend config below)
# ─────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional: remote state in S3
  # Uncomment and update bucket name after creating it manually:
  # backend "s3" {
  #   bucket = "unkov-terraform-state-dev"
  #   key    = "dev/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "unkov"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}

# ── Variables ─────────────────────────────────────────────────────
variable "aws_region"      { default = "us-east-1" }
variable "vpc_cidr"        { default = "10.0.0.0/16" }
variable "env"             { default = "dev" }
variable "scan_schedule"   {
  description = "EventBridge cron for engine scan (UTC)"
  default     = "cron(0 2 * * ? *)"   # 02:00 UTC every day
}

# Optional: pass real secrets via tfvars or environment vars
# These go into SSM Parameter Store (not in state file)
variable "okta_org_url"         { default = "" sensitive = true }
variable "okta_api_token"       { default = "" sensitive = true }
variable "entra_tenant_id"      { default = "" sensitive = true }
variable "entra_client_id"      { default = "" sensitive = true }
variable "entra_client_secret"  { default = "" sensitive = true }
variable "github_token"         { default = "" sensitive = true }
variable "github_org"           { default = "" }
variable "dashboard_api_key"    { default = "dev-key" sensitive = true }

# ── Data sources ──────────────────────────────────────────────────
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" { state = "available" }

locals {
  account_id  = data.aws_caller_identity.current.account_id
  region      = var.aws_region
  name_prefix = "unkov-${var.env}"
  azs         = slice(data.aws_availability_zones.available.names, 0, 2)
}

# ═════════════════════════════════════════════════════════════════
# VPC
# ═════════════════════════════════════════════════════════════════
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "${local.name_prefix}-vpc" }
}

# ── Internet Gateway ──────────────────────────────────────────────
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${local.name_prefix}-igw" }
}

# ── Public subnets (one per AZ for NAT Gateway HA) ───────────────
resource "aws_subnet" "public" {
  count                   = length(local.azs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)    # 10.0.0.0/24, 10.0.1.0/24
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "${local.name_prefix}-public-${count.index + 1}" }
}

# ── Private subnets (Lambda / ECS scan runner) ───────────────────
resource "aws_subnet" "private" {
  count             = length(local.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)     # 10.0.10.0/24, 10.0.11.0/24
  availability_zone = local.azs[count.index]
  tags = { Name = "${local.name_prefix}-private-${count.index + 1}" }
}

# ── Elastic IP + NAT Gateway (single NAT for dev cost savings) ───
resource "aws_eip" "nat" {
  domain = "vpc"
  tags   = { Name = "${local.name_prefix}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  tags          = { Name = "${local.name_prefix}-nat" }
  depends_on    = [aws_internet_gateway.igw]
}

# ── Route tables ──────────────────────────────────────────────────
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = { Name = "${local.name_prefix}-rt-public" }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  tags = { Name = "${local.name_prefix}-rt-private" }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ═════════════════════════════════════════════════════════════════
# VPC Endpoints (avoid NAT Gateway charges for AWS service traffic)
# ═════════════════════════════════════════════════════════════════

# DynamoDB Gateway endpoint — free, no data charges
resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${local.region}.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id, aws_route_table.public.id]
  tags = { Name = "${local.name_prefix}-vpce-dynamodb" }
}

# SSM Interface endpoint — Lambda reads secrets from Parameter Store
resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${local.region}.ssm"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpce.id]
  private_dns_enabled = true
  tags = { Name = "${local.name_prefix}-vpce-ssm" }
}

# ═════════════════════════════════════════════════════════════════
# Security Groups
# ═════════════════════════════════════════════════════════════════
resource "aws_security_group" "scan_runner" {
  name        = "${local.name_prefix}-scan-runner-sg"
  description = "Engine scan runner (Lambda/ECS) — outbound only to SaaS APIs"
  vpc_id      = aws_vpc.main.id

  # No inbound — scan runner is never called directly, only triggered
  egress {
    description = "HTTPS to SaaS identity providers (Okta, GitHub, Entra, etc.)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-scan-runner-sg" }
}

resource "aws_security_group" "api_lambda" {
  name        = "${local.name_prefix}-api-lambda-sg"
  description = "Dashboard API Lambda — inbound from API Gateway, outbound to DynamoDB"
  vpc_id      = aws_vpc.main.id

  egress {
    description = "HTTPS outbound (DynamoDB via VPC endpoint)"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-api-lambda-sg" }
}

resource "aws_security_group" "vpce" {
  name        = "${local.name_prefix}-vpce-sg"
  description = "Interface VPC endpoints (SSM)"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTPS from private subnets"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.scan_runner.id, aws_security_group.api_lambda.id]
  }

  tags = { Name = "${local.name_prefix}-vpce-sg" }
}

# ═════════════════════════════════════════════════════════════════
# SSM Parameter Store — secrets (not plaintext .env)
# ═════════════════════════════════════════════════════════════════
resource "aws_ssm_parameter" "dashboard_api_key" {
  name  = "/unkov/${var.env}/DASHBOARD_API_KEY"
  type  = "SecureString"
  value = var.dashboard_api_key != "" ? var.dashboard_api_key : "dev-key-CHANGE-ME"
  tags  = { Name = "unkov-dev-dashboard-api-key" }
}

resource "aws_ssm_parameter" "okta_org_url" {
  count = var.okta_org_url != "" ? 1 : 0
  name  = "/unkov/${var.env}/OKTA_ORG_URL"
  type  = "SecureString"
  value = var.okta_org_url
}

resource "aws_ssm_parameter" "okta_api_token" {
  count = var.okta_api_token != "" ? 1 : 0
  name  = "/unkov/${var.env}/OKTA_API_TOKEN"
  type  = "SecureString"
  value = var.okta_api_token
}

resource "aws_ssm_parameter" "entra_tenant_id" {
  count = var.entra_tenant_id != "" ? 1 : 0
  name  = "/unkov/${var.env}/ENTRA_TENANT_ID"
  type  = "SecureString"
  value = var.entra_tenant_id
}

resource "aws_ssm_parameter" "github_token" {
  count = var.github_token != "" ? 1 : 0
  name  = "/unkov/${var.env}/GITHUB_TOKEN"
  type  = "SecureString"
  value = var.github_token
}

# ═════════════════════════════════════════════════════════════════
# IAM Roles
# ═════════════════════════════════════════════════════════════════

# ── Scanner role (engine Lambda / ECS task) ───────────────────────
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "ecs-tasks.amazonaws.com", "scheduler.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "scanner" {
  name               = "${local.name_prefix}-scanner-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "scanner_inline" {
  name = "scanner-permissions"
  role = aws_iam_role.scanner.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBWrite"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:BatchWriteItem",
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:DescribeTable"
        ]
        Resource = "arn:aws:dynamodb:${local.region}:${local.account_id}:table/unkov-*"
      },
      {
        Sid    = "SSMReadSecrets"
        Effect = "Allow"
        Action = ["ssm:GetParameter", "ssm:GetParametersByPath"]
        Resource = "arn:aws:ssm:${local.region}:${local.account_id}:parameter/unkov/${var.env}/*"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:${local.region}:${local.account_id}:log-group:/unkov/*"
      },
      {
        Sid    = "VPCNetworking"
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface", "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      }
    ]
  })
}

# ── API Lambda role ───────────────────────────────────────────────
resource "aws_iam_role" "api" {
  name               = "${local.name_prefix}-api-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy" "api_inline" {
  name = "api-permissions"
  role = aws_iam_role.api.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBRead"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan",
          "dynamodb:DescribeTable", "dynamodb:BatchGetItem"
        ]
        Resource = "arn:aws:dynamodb:${local.region}:${local.account_id}:table/unkov-*"
      },
      {
        Sid    = "SSMReadApiKey"
        Effect = "Allow"
        Action = ["ssm:GetParameter"]
        Resource = "arn:aws:ssm:${local.region}:${local.account_id}:parameter/unkov/${var.env}/DASHBOARD_API_KEY"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:${local.region}:${local.account_id}:log-group:/unkov/*"
      },
      {
        Sid    = "VPCNetworking"
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface", "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      }
    ]
  })
}

# ═════════════════════════════════════════════════════════════════
# CloudWatch Log Groups
# ═════════════════════════════════════════════════════════════════
resource "aws_cloudwatch_log_group" "engine" {
  name              = "/unkov/${var.env}/engine"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/unkov/${var.env}/api"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "scheduler" {
  name              = "/unkov/${var.env}/scheduler"
  retention_in_days = 14
}

# ═════════════════════════════════════════════════════════════════
# EventBridge Scheduler — nightly engine scan
# ═════════════════════════════════════════════════════════════════
resource "aws_scheduler_schedule_group" "unkov" {
  name = "${local.name_prefix}-schedules"
}

# NOTE: The Lambda/ECS resource ARN below is a placeholder.
# After you deploy the engine Lambda (via `npm run setup:aws` or
# manually), replace LAMBDA_ARN_PLACEHOLDER with the real ARN.
# Terraform will update the schedule on next apply.
#
# resource "aws_scheduler_schedule" "nightly_scan" {
#   name                         = "${local.name_prefix}-nightly-scan"
#   group_name                   = aws_scheduler_schedule_group.unkov.name
#   schedule_expression          = var.scan_schedule
#   schedule_expression_timezone = "UTC"
#
#   flexible_time_window {
#     mode                      = "FLEXIBLE"
#     maximum_window_in_minutes = 15  # allows AWS to spread load
#   }
#
#   target {
#     arn      = "LAMBDA_ARN_PLACEHOLDER"   # replace after Lambda deploy
#     role_arn = aws_iam_role.scanner.arn
#     input    = jsonencode({ source = "scheduled", env = var.env })
#   }
# }

# ═════════════════════════════════════════════════════════════════
# Outputs
# ═════════════════════════════════════════════════════════════════
output "vpc_id"               { value = aws_vpc.main.id }
output "private_subnet_ids"   { value = aws_subnet.private[*].id }
output "public_subnet_ids"    { value = aws_subnet.public[*].id }
output "scanner_role_arn"     { value = aws_iam_role.scanner.arn }
output "api_role_arn"         { value = aws_iam_role.api.arn }
output "scan_runner_sg_id"    { value = aws_security_group.scan_runner.id }
output "api_lambda_sg_id"     { value = aws_security_group.api_lambda.id }
output "dynamodb_endpoint_id" { value = aws_vpc_endpoint.dynamodb.id }
output "engine_log_group"     { value = aws_cloudwatch_log_group.engine.name }
output "api_log_group"        { value = aws_cloudwatch_log_group.api.name }
output "nat_gateway_ip"       { value = aws_eip.nat.public_ip }

output "next_steps" {
  value = <<-EOT
    ── NEXT STEPS ──────────────────────────────────────────────────
    1. Deploy DynamoDB tables:
         cd engine && npm run setup:aws

    2. Deploy engine Lambda (or run locally):
         npm run scan:all        ← runs immediately with current .env
         OR package + deploy as Lambda in private subnets:
           subnet_ids          = [${join(", ", aws_subnet.private[*].id)}]
           security_group_ids  = [${aws_security_group.scan_runner.id}]
           role_arn            = ${aws_iam_role.scanner.arn}

    3. Enable nightly EventBridge schedule:
         Uncomment aws_scheduler_schedule in main.tf
         Replace LAMBDA_ARN_PLACEHOLDER with actual Lambda ARN
         terraform apply

    4. Deploy API Lambda:
         Same subnets + security group as scan runner
         role_arn = ${aws_iam_role.api.arn}

    5. NAT Gateway IP (add to Okta/GitHub allowlists if needed):
         ${aws_eip.nat.public_ip}
    ──────────────────────────────────────────────────────────────
  EOT
}
