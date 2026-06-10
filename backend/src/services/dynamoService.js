import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import config from "../config/index.js";
import logger from "../utils/logger.js";

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: config.awsRegion }),
);

const dynamoService = {
  async createCandidate(candidate) {
    await client.send(
      new PutCommand({
        TableName: config.dynamoDbTable,
        Item: candidate,
      }),
    );
    logger.info(`Candidate created in DynamoDB: ${candidate.candidateId}`);
    return candidate;
  },

  async getCandidate(candidateId) {
    const result = await client.send(
      new GetCommand({
        TableName: config.dynamoDbTable,
        Key: { candidateId },
      }),
    );
    return result.Item || null;
  },

  async getCandidates({ limit, lastEvaluatedKey } = {}) {
    const result = await client.send(
      new ScanCommand({
        TableName: config.dynamoDbTable,
        Limit: limit || undefined,
        ExclusiveStartKey: lastEvaluatedKey || undefined,
      }),
    );

    return {
      items: result.Items || [],
      lastEvaluatedKey: result.LastEvaluatedKey || null,
    };
  },

  async updateCandidate(candidateId, updates) {
    const entries = Object.entries(updates).filter(
      ([, value]) => value !== undefined,
    );
    if (!entries.length) {
      return this.getCandidate(candidateId);
    }

    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    const setExpressions = entries.map(([field, value], index) => {
      const nameKey = `#field${index}`;
      const valueKey = `:value${index}`;
      expressionAttributeNames[nameKey] = field;
      expressionAttributeValues[valueKey] = value;
      return `${nameKey} = ${valueKey}`;
    });

    const result = await client.send(
      new UpdateCommand({
        TableName: config.dynamoDbTable,
        Key: { candidateId },
        UpdateExpression: `SET ${setExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    logger.info(`Candidate updated in DynamoDB: ${candidateId}`);
    return result.Attributes || null;
  },

  async deleteCandidate(candidateId) {
    await client.send(
      new DeleteCommand({
        TableName: config.dynamoDbTable,
        Key: { candidateId },
      }),
    );
    logger.info(`Candidate deleted from DynamoDB: ${candidateId}`);
  },

  async createHrUser(user) {
    await client.send(
      new PutCommand({
        TableName: config.hrTable,
        Item: user,
      }),
    );
    logger.info(`HR user created in DynamoDB: ${user.hrUserId}`);
    return user;
  },

  async getHrUserByEmail(email) {
    const result = await client.send(
      new ScanCommand({
        TableName: config.hrTable,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      }),
    );
    return result.Items?.[0] || null;
  },

  async getHrUserById(hrUserId) {
    console.log("LOOKUP TABLE:", config.hrTable);
    console.log("LOOKUP USER:", hrUserId);

    const result = await client.send(
      new GetCommand({
        TableName: config.hrTable,
        Key: { hrUserId },
      }),
    );

    console.log("DYNAMO RESULT:", JSON.stringify(result));

    return result.Item || null;
  },
};

export default dynamoService;
