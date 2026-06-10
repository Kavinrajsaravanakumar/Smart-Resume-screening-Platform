import dotenv from 'dotenv';

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'change-this-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoDbTable: process.env.DYNAMODB_TABLE || 'candidates',
  hrTable: process.env.HR_TABLE || 'hr-users',
  s3Bucket: process.env.S3_BUCKET_NAME || 'srs-platform',
  s3PresignedUrlExpirySeconds: Number(process.env.S3_PRESIGNED_URL_EXPIRY_SECONDS || 900),
  snsTopicArn: process.env.SNS_TOPIC_ARN || '',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS || 60)
};

export default config;
