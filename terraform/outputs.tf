output "resume_bucket_name" {
  value = aws_s3_bucket.resumes.bucket
}

output "candidate_table_name" {
  value = aws_dynamodb_table.candidates.name
}

output "sns_topic_arn" {
  value = aws_sns_topic.resume_events.arn
}
