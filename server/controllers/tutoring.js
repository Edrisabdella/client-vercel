const TutoringSession = require('../models/TutoringSession');
const User = require('../models/User');

// @desc    Get all tutors
// @route   GET /api/tutoring/tutors
// @access  Public
exports.getTutors = async (req, res, next) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).select('name email bio subjects rating');

    res.status(200).json({
      success: true,
      count: tutors.length,
      data: tutors
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single tutor
// @route   GET /api/tutoring/tutors/:id
// @access  Public
exports.getTutor = async (req, res, next) => {
  try {
    const tutor = await User.findOne({ 
      _id: req.params.id, 
      role: 'tutor' 
    }).select('-password');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create tutor application
// @route   POST /api/tutoring/apply
// @access  Private
exports.createTutorApplication = async (req, res, next) => {
  try {
    // For now, just update user role to tutor
    // In a real application, you would create an application process
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role: 'tutor' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Tutor application submitted successfully',
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get tutoring sessions
// @route   GET /api/tutoring/sessions
// @access  Private
exports.getTutoringSessions = async (req, res, next) => {
  try {
    let sessions;

    if (req.user.role === 'tutor') {
      sessions = await TutoringSession.find({ tutor: req.user.id })
        .populate('student', 'name email')
        .populate('tutor', 'name email');
    } else {
      sessions = await TutoringSession.find({ student: req.user.id })
        .populate('tutor', 'name email')
        .populate('student', 'name email');
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create tutoring session
// @route   POST /api/tutoring/sessions
// @access  Private
exports.createTutoringSession = async (req, res, next) => {
  try {
    req.body.student = req.user.id;
    
    const session = await TutoringSession.create(req.body);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update tutoring session
// @route   PUT /api/tutoring/sessions/:id
// @access  Private
exports.updateTutoringSession = async (req, res, next) => {
  try {
    let session = await TutoringSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Make sure user is session participant
    if (session.student.toString() !== req.user.id && session.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this session'
      });
    }

    session = await TutoringSession.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete tutoring session
// @route   DELETE /api/tutoring/sessions/:id
// @access  Private
exports.deleteTutoringSession = async (req, res, next) => {
  try {
    const session = await TutoringSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    // Make sure user is session participant
    if (session.student.toString() !== req.user.id && session.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this session'
      });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};