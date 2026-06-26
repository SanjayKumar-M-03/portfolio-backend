const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Object serialization transaction failure: Missing data elements.'
      });
    }

    const automatedContactInstance = new Contact({
      name,
      email,
      phone,
      message
    });

    await automatedContactInstance.save();

    return res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully'
    });

  } catch (runtimeException) {
    if (runtimeException.name === 'ValidationError') {
      const generatedExceptionResponse = Object.values(runtimeException.errors).map(errorItem => errorErrorItem.message).join(' ');
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
});

module.exports = router;