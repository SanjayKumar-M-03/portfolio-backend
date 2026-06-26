require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactApiRouteModule = require('./routes/contact');

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

// 2. CRITICAL: Explicitly Handle Preflight OPTIONS Requests Globally
networkApplicationServerInstance.options('*', (req, res) => {
  res.status(204).end();
});

networkApplicationServerInstance.use(express.json());

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

networkApplicationServerInstance.use('/api/contact', contactApiRouteModule);

networkApplicationServerInstance.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource routing configuration target unknown.' });
});

networkApplicationServerInstance.use((errorContext, req, res, next) => {
  res.status(500).json({
    success: false,
    message: errorContext.message || 'An unhandled structural exception occurred inside the active API loop.'
  });
});

networkApplicationServerInstance.listen(portAllocationIndex, () => {
  console.log(`Portfolio API execution pipeline functional on port configuration: ${portAllocationIndex}`);
});

module.exports = networkApplicationServerInstance;