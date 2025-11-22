const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'tutor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: String,
  phone: String,
  linkedin: String,
  github: String,
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    courseUpdates: { type: Boolean, default: true },
    tutoringReminders: { type: Boolean, default: true },
    resourceAlerts: { type: Boolean, default: true }
  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  completedCourses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  learningHours: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete courses when user is deleted
userSchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ instructor: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);