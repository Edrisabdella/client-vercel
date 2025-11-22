const express = require('express');
const {
  getTutors,
  getTutor,
  createTutorApplication,
  getTutoringSessions,
  createTutoringSession,
  updateTutoringSession,
  deleteTutoringSession
} = require('../controllers/tutoring');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/tutors')
  .get(getTutors);

router.route('/tutors/:id')
  .get(getTutor);

// Protected routes
router.use(protect);

router.route('/sessions')
  .get(getTutoringSessions)
  .post(createTutoringSession);

router.route('/sessions/:id')
  .put(updateTutoringSession)
  .delete(deleteTutoringSession);

router.route('/apply')
  .post(createTutorApplication);

module.exports = router;