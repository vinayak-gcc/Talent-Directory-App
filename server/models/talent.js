const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill must be provided'
    }
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience seems unrealistic']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
talentSchema.index({ skills: 1 });
talentSchema.index({ email: 1 });

module.exports = mongoose.model('Talent', talentSchema);