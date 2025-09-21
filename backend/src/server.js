require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to database first, then start server
connectDB().then(() => {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Medi-Hub Backend running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

module.exports = app;