const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name parameter input element cannot be empty.'],
    trim: true,
    minlength: [2, 'The name value data payload must contain at least 2 characters.'],
    maxlength: [100, 'The name input cannot exceed 100 character elements.']
  },
  email: {
    type: String,
    required: [true, 'The target electronic mail routing string parameter is required.'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please input a structurally valid communication email signature layout sequence.']
  },
  phone: {
    type: String,
    required: [true, 'The numeric database phone contact identifier sequence is required.'],
    trim: true,
    match: [/^[0-9]{10}$/, 'The contact element phone block parameter must consist of exactly 10 programmatic digits.']
  },
  message: {
    type: String,
    required: [true, 'The descriptive contact query feedback communication narrative text parameter is mandatory.'],
    trim: true,
    minlength: [10, 'The contextual narrative value must extend beyond 10 minimal character definitions.'],
    maxlength: [2000, 'The contextual narrative parameter is strictly restricted to a maximum of 2000 characters.']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  collection: 'contacts',
  versionKey: false
});

module.exports = mongoose.model('Contact', ContactSchema);