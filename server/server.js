require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Smart Resume Screening Server running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📁 API: http://localhost:${PORT}/api`);
    console.log(`=========================================`);
  });
}

startServer();
