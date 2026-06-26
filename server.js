require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const networkApplicationServerInstance = express();
const portAllocationIndex = process.env.PORT || 5000;
const productionCorsWhitelistOrigin = process.env.ALLOWED_ORIGIN || '*';

// 1. Standard CORS Configuration Layer
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

// 2. Explicitly Handle Preflight OPTIONS Requests Globally
networkApplicationServerInstance.options('*', (req, res) => {
  res.status(204).end();
});

networkApplicationServerInstance.use(express.json());

// 3. Connect to MongoDB Atlas
const activeDatabaseClusterConnectionString = process.env.MONGO_URI;

if (!activeDatabaseClusterConnectionString) {
  process.exit(1);
}

mongoose.connect(activeDatabaseClusterConnectionString, {
  autoIndex: true
})
.then(() => {
  console.log('MongoDB Atlas node pool validation handshake established successfully.');
})
.catch((initializationFailureException) => {
  console.error(`Database network tier fatal initialization loop error status: ${initializationFailureException}`);
});

// 4. Unified Direct Endpoints (Handles both options to completely prevent redirects)
const contactSubmissionHandler = async (req, res) => {
  try {
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
    if (runtimeException.name === 'ValidationError') {
      const generatedExceptionResponse = Object.values(runtimeException.errors).map(errorItem => errorItem.message).join(' ');
      return res.status(400).json({
        success: false,
        message: `Validation boundary mutation failure: ${generatedExceptionResponse}`
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Critical error encountered inside the database tier connection system.'
    });
  }
};

networkApplicationServerInstance.post('/api/contact', contactSubmissionHandler);
networkApplicationServerInstance.post('/api/contact/', contactSubmissionHandler);

// 5. Catch-All Unmapped Routes
networkApplicationServerInstance.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource routing configuration target unknown.' });
});

networkApplicationServerInstance.listen(portAllocationIndex, () => {
  console.log(`Portfolio API execution pipeline functional on port configuration: ${portAllocationIndex}`);
});

module.exports = networkApplicationServerInstance;