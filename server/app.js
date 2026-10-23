const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const jobProfileRoutes = require('./routes/jobProfileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Middleware ───
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running healthy' });
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/job-profiles', jobProfileRoutes);

// ─── 404 Route ───
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

module.exports = app;
