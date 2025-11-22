const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserPreferences
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserPreferences);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;