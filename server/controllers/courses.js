const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Course.find(JSON.parse(queryStr)).populate('instructor', 'name email');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Course.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const courses = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      pagination,
      data: courses
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email bio')
      .populate('reviews');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to delete this course'
      });
    }

    await course.deleteOne();

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

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      enrolled => enrolled.course.toString() === req.params.id
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }

    // Add to enrolled courses
    user.enrolledCourses.push({
      course: req.params.id,
      enrolledAt: Date.now()
    });

    await user.save();

    // Increment student count
    course.students += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: user.enrolledCourses
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get user's courses
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses.course',
      populate: {
        path: 'instructor',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      data: user.enrolledCourses
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get course progress
// @route   GET /api/courses/:id/progress
// @access  Private
exports.getCourseProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const enrolledCourse = user.enrolledCourses.find(
      course => course.course.toString() === req.params.id
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        error: 'Not enrolled in this course'
      });
    }

    res.status(200).json({
      success: true,
      data: enrolledCourse
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
exports.updateCourseProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const enrolledCourse = user.enrolledCourses.find(
      course => course.course.toString() === req.params.id
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        error: 'Not enrolled in this course'
      });
    }

    // Update progress
    if (req.body.progress !== undefined) {
      enrolledCourse.progress = req.body.progress;
    }

    if (req.body.completed !== undefined) {
      enrolledCourse.completed = req.body.completed;
      
      // Add to completed courses if completed
      if (req.body.completed && !user.completedCourses.includes(req.params.id)) {
        user.completedCourses.push(req.params.id);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: enrolledCourse
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};