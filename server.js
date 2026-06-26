require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const networkApplicationServerInstance = express();
const portAllocationIndex = process.env.PORT || 5000;
const productionCorsWhitelistOrigin = process.env.ALLOWED_ORIGIN || '*';

// 1. Production CORS Framework Configuration
networkApplicationServerInstance.use(cors({
  origin: function (incomingRequestOrigin, serverCallbackRoutine) {
    if (!incomingRequestOrigin || productionCorsWhitelistOrigin === '*' || incomingRequestOrigin === productionCorsWhitelistOrigin || incomingRequestOrigin.includes('localhost') || incomingRequestOrigin.includes('127.0.0.1')) {
      serverCallbackRoutine(null, true);
    } else {
      serverCallbackRoutine(new Error('Cross-Origin Access Management security policy restriction blocks validation processing.'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// 2. Global Preflight OPTIONS Routing Interceptor
networkApplicationServerInstance.options('*', (req, res) => {
  res.status(204).end();
});

networkApplicationServerInstance.use(express.json());

const activeDatabaseClusterConnectionString = process.env.MONGO_URI;

// 3. Serverless-Hardened Connection Gateway Function
const connectToDatabaseSafely = async () => {
  // If connection is already open (state 1), reuse it immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  // If connecting (state 2) or disconnecting (state 3), wait a moment
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve) => {
      const checkStateInterval = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(checkStateInterval);
          resolve();
        }
      }, 100);
    });
  }

  if (!activeDatabaseClusterConnectionString) {
    throw new Error('Database cluster connection string undefined inside system variables.');
  }

  // Otherwise, establish a clean connection and await its completion
  await mongoose.connect(activeDatabaseClusterConnectionString, {
    bufferCommands: false // Disable buffering to expose hidden connection faults instantly
  });
};

// 4. Core API Contact Submission Target Gateway
const contactSubmissionHandler = async (req, res) => {
  try {
    // Force the serverless container to connect to MongoDB before writing data
    await connectToDatabaseSafely();

    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Object serialization transaction failure: Missing data elements.'
      });
    }

    const automatedContactInstance = new Contact({ name, email, phone, message });
    await automatedContactInstance.save();

    return res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully'
    });

  } catch (runtimeException) {
    console.error('Database Operation Trace Error:', runtimeException);

    if (runtimeException.name === 'ValidationError') {
      const generatedExceptionResponse = Object.values(runtimeException.errors).map(errorItem => errorItem.message).join(' ');
      return res.status(400).json({
        success: false,
        message: `Validation boundary mutation failure: ${generatedExceptionResponse}`
      });
    }

    // Returns structural clarity back to the frontend trace logs
    return res.status(500).json({
      success: false,
      message: `Database Connection Fault: ${runtimeException.message || 'Operation timed out.'}`
    });
  }
};

networkApplicationServerInstance.post('/api/contact', contactSubmissionHandler);
networkApplicationServerInstance.post('/api/contact/', contactSubmissionHandler);

// 5. Unmapped Resource Handler
networkApplicationServerInstance.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource routing configuration target unknown.' });
});

networkApplicationServerInstance.listen(portAllocationIndex, () => {
  console.log(`Portfolio API execution pipeline functional on port configuration: ${portAllocationIndex}`);
});

module.exports = networkApplicationServerInstance;