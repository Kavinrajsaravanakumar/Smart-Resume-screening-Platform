import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import config from '../config/index.js';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.awsRegion }));

export async function putCandidate(candidate) {
  await client.send(new PutCommand({
    TableName: config.dynamoDbTable,
    Item: {
      status: candidate.status || 'review',
      scoreBreakdown: candidate.scoreBreakdown || {},
      skillGroups: candidate.skillGroups || {},
      educationDetails: candidate.educationDetails || {},
      projects: candidate.projects || [],
      experienceDetails: candidate.experienceDetails || [],
      certifications: candidate.certifications || [],
      achievements: candidate.achievements || {},
      additionalInfo: candidate.additionalInfo || {},
      ...candidate
    }
  }));
  return candidate;
}

export async function scanCandidates() {
  const result = await client.send(new ScanCommand({ TableName: config.dynamoDbTable }));
  return result.Items || [];
}

export async function getCandidate(candidateId) {
  const result = await client.send(new GetCommand({ TableName: config.dynamoDbTable, Key: { candidateId } }));
  return result.Item || null;
}

export async function deleteCandidate(candidateId) {
  await client.send(new DeleteCommand({ TableName: config.dynamoDbTable, Key: { candidateId } }));
}
