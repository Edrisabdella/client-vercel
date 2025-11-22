const mongoose = require('mongoose');

const tutoringSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic'],
    trim: true
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Please add a scheduled time']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add duration'],
    min: 30,
    max: 180
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: String,
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String
}, {
  timestamps: true
});

module.exports = mongoose.model('TutoringSession', tutoringSessionSchema);