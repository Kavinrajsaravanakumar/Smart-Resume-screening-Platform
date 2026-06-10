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
