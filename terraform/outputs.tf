output "ec2_public_ip" {
  description = "Public IP of the application EC2 instance."
  value       = aws_instance.app.public_ip
}

output "resume_bucket_name" {
  description = "S3 bucket used for resume storage."
  value       = aws_s3_bucket.resumes.bucket
}

output "candidate_table_name" {
  description = "DynamoDB table used for candidate metadata."
  value       = aws_dynamodb_table.candidates.name
}

output "sns_topic_arn" {
  description = "SNS topic ARN for resume processing events."
  value       = aws_sns_topic.resume_events.arn
}

output "app_security_group_id" {
  description = "Security group attached to the application host."
  value       = aws_security_group.app.id
}

output "iam_instance_profile_name" {
  description = "IAM instance profile for the EC2 application host."
  value       = aws_iam_instance_profile.app_profile.name
}
