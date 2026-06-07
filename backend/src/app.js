import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import { metricsHandler, metricsMiddleware } from './middlewares/metricsMiddleware.js';
import config from './config/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendOrigin === '*' ? true : config.frontendOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use(metricsMiddleware);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'resume-screening-api' }));
app.get('/metrics', metricsHandler);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
