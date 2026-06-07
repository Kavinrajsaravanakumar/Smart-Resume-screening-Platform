variable "aws_region" {
  description = "AWS region for the resume screening platform."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project prefix for AWS resources."
  type        = string
  default     = "resume-screening-platform"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the application host."
  type        = string
  default     = "t3.micro"
}
