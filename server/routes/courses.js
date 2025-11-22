const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses,
  getCourseProgress,
  updateCourseProgress
} = require('../controllers/courses');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getCourses);

router.route('/:id')
  .get(getCourse);

// Protected routes
router.use(protect);

router.route('/my-courses')
  .get(getMyCourses);

router.route('/:id/enroll')
  .post(enrollCourse);

router.route('/:id/progress')
  .get(getCourseProgress)
  .put(updateCourseProgress);

// Admin/Tutor routes
router.route('/')
  .post(authorize('admin', 'tutor'), createCourse);

router.route('/:id')
  .put(authorize('admin', 'tutor'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;