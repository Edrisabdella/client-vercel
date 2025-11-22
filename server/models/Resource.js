const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['programming', 'mathematics', 'science', 'test-prep', 'business', 'arts']
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'video', 'audio', 'document', 'presentation', 'image', 'link']
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  isApproved: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);