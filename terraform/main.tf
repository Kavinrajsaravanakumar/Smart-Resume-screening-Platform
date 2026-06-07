resource "aws_s3_bucket" "resumes" {
  bucket = "${var.project_name}-resumes"
}

resource "aws_s3_bucket_public_access_block" "resumes" {
  bucket                  = aws_s3_bucket.resumes.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "candidates" {
  name         = "Candidates"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "candidateId"

  attribute {
    name = "candidateId"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "rankingScore"
    type = "N"
  }

  global_secondary_index {
    name            = "StatusRankingScoreIndex"
    hash_key        = "status"
    range_key       = "rankingScore"
    projection_type = "ALL"
  }
}

resource "aws_sns_topic" "resume_events" {
  name = "${var.project_name}-resume-events"
}

resource "aws_iam_role" "app_role" {
  name = "${var.project_name}-app-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "app_policy" {
  name = "${var.project_name}-app-policy"
  role = aws_iam_role.app_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
        Resource = "${aws_s3_bucket.resumes.arn}/*"
      },
      {
        Effect = "Allow"
        Action = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Scan", "dynamodb:DeleteItem"]
        Resource = aws_dynamodb_table.candidates.arn
      },
      {
        Effect = "Allow"
        Action = ["sns:Publish"]
        Resource = aws_sns_topic.resume_events.arn
      }
    ]
  })
}
