const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OpenLearn Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic info route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to OpenLearn API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      resources: '/api/resources',
      users: '/api/users'
    }
  });
});

// Database connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_TEST;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${conn.connection.name}`);
      console.log(`🎯 Host: ${conn.connection.host}`);
    }
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

// Initialize server - only start if not in test environment
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Don't start HTTP server in test environment
    if (process.env.NODE_ENV === 'test') {
      return app;
    }
    
    // Then create HTTP server
    const server = http.createServer(app);
    
    const PORT = process.env.PORT || 5001;
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 OpenLearn API is ready!`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try:`);
        console.log(`  1. Run: npx kill-port ${PORT}`);
        console.log(`  2. Or change PORT in .env file`);
        console.log(`  3. Or wait a few seconds and try again`);
      } else {
        console.error('❌ Server error:', error);
      }
      
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    });
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('\n🛑 Shutting down server gracefully...');
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('\n🛑 Server terminated');
    await mongoose.connection.close();
  }
  process.exit(0);
});

// Start the server only if not in test environment and if this file is run directly
if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { app, startServer };