import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const s3Client = new S3Client({ region: config.awsRegion });

function resolveContentType(extension) {
  if (extension === '.pdf') return 'application/pdf';
  if (extension === '.docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return 'application/octet-stream';
}

const s3Service = {
  async uploadResume(buffer, filename, mimetype) {
    const extension = path.extname(filename).toLowerCase() || '.pdf';
    const key = `resumes/${uuidv4()}${extension}`;
    const contentType = mimetype || resolveContentType(extension);

    await s3Client.send(new PutObjectCommand({
      Bucket: config.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType
    }));

    logger.info(`Resume uploaded to S3: ${key}`);
    return { resumeS3Key: key };
  },

  async generatePresignedUrl(key, expiresInSeconds = config.s3PresignedUrlExpirySeconds) {
    if (!key) return null;

    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: config.s3Bucket,
        Key: key
      }),
      { expiresIn: expiresInSeconds }
    );

    logger.info(`Generated presigned URL for resume: ${key}`);
    return url;
  },

  async deleteResume(key) {
    if (!key) return;

    await s3Client.send(new DeleteObjectCommand({
      Bucket: config.s3Bucket,
      Key: key
    }));

    logger.info(`Resume deleted from S3: ${key}`);
  }
};

export default s3Service;
