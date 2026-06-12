variable "aws_region" {
  description = "AWS region for the resume screening platform."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project prefix for AWS resources."
  type        = string
  default     = "srs-platform"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the application host."
  type        = string
  default     = "t3.micro"
}

variable "ssh_key_name" {
  description = "EC2 key pair name for SSH access."
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance."
  type        = string
  default     = "0.0.0.0/0"
}

variable "allowed_api_cidr" {
  description = "CIDR block allowed to access the backend API and Jenkins."
  type        = string
  default     = "0.0.0.0/0"
}
