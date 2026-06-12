resource "aws_dynamodb_table" "candidates" {
  name         = "candidates"
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

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "StatusRankingScoreIndex"
    hash_key        = "status"
    range_key       = "rankingScore"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "StatusCreatedAtIndex"
    hash_key        = "status"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Project = var.project_name
    Purpose = "candidate-metadata"
  }
}

resource "aws_dynamodb_table" "hr_users" {

  name         = "hr-users"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "hrUserId"

  attribute {
    name = "hrUserId"
    type = "S"
  }

  tags = {
    Name = "hr-users"
  }
}