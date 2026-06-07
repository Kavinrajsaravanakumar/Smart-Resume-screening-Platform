import dotenv from 'dotenv';

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'change-this-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 5),
  storageDriver: process.env.STORAGE_DRIVER || 'local',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoDbTable: process.env.DYNAMODB_TABLE || 'Candidates',
  s3Bucket: process.env.S3_BUCKET || 'resume-screening-platform-resumes'
};

export default config;
