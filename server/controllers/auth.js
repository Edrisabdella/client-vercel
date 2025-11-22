const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate email verification token
const getEmailVerificationToken = () => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  return crypto.createHash('sha256').update(verificationToken).digest('hex');
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Generate email verification token
    const emailVerificationToken = getEmailVerificationToken();
    user.emailVerificationToken = emailVerificationToken;
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${emailVerificationToken}`;

    const message = `
      <h1>Email Verification</h1>
      <p>Please verify your email by clicking on the following link:</p>
      <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
      <p>If you did not create an account, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'OpenLearn - Email Verification',
        message
      });

      sendTokenResponse(user, 200, res, 'Verification email sent');
    } catch (err) {
      user.emailVerificationToken = undefined;
      await user.save({ validateBeforeSave: false });
      
      return next(new Error('Email could not be sent'));
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate('enrolledCourses.course')
    .populate('completedCourses');

  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    phone: req.body.phone,
    linkedin: req.body.linkedin,
    github: req.body.github
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      error: 'Password is incorrect'
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'There is no user with that email'
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please make a PUT request to:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'OpenLearn - Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Error('Email could not be sent'));
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
};

// @desc    Verify email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken,
    isVerified: false
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid verification token'
    });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
};

// @desc    Resend email verification
// @route   POST /api/auth/resendverification
// @access  Public
exports.resendVerification = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email, isVerified: false });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'User not found or already verified'
    });
  }

  const emailVerificationToken = getEmailVerificationToken();
  user.emailVerificationToken = emailVerificationToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${emailVerificationToken}`;

  const message = `
    <h1>Email Verification</h1>
    <p>Please verify your email by clicking on the following link:</p>
    <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'OpenLearn - Email Verification',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new Error('Email could not be sent'));
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message = null) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      message: message || 'Success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
};