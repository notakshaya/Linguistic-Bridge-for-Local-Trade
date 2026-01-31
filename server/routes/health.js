const express = require('express');
const router = express.Router();

// Health check endpoint for deployment platforms
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'LinguaTrade API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: 'connected', // Update when real DB is connected
      redis: 'connected',     // Update when Redis is connected
      ai_services: 'ready'    // Update when AI services are connected
    }
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Service unhealthy';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

// Detailed system info for monitoring
router.get('/detailed', (req, res) => {
  const detailed = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    platform: process.platform,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };

  res.status(200).json(detailed);
});

module.exports = router;