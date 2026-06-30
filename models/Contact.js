const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name parameter input element cannot be empty.'],
    trim: true,
    minlength: [2, 'The name must be least 2 characters.'],
    maxlength: [100, 'The name cannot exceed 100 character.']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please input a valid communication email.']
  },
  phone: {
    type: String,
    required: [true, 'Please enter your Phone number.'],
    trim: true,
    match: [/^[0-9]{10}$/, 'The Phone number must consist of exactly 10 digits.']
  },
  message: {
    type: String,
    required: [true, 'Please enter your descriptive query feedback.'],
    trim: true,
    minlength: [1, 'The descriptive query message must be atleast be 1 minimal character long.'],
    maxlength: [10000, 'The contextual narrative parameter is strictly restricted to a maximum of 10000 characters.']
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