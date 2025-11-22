const express = require('express');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  getMyResources
} = require('../controllers/resources');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getResources);

router.route('/:id')
  .get(getResource);

// Protected routes
router.use(protect);

router.route('/my-resources')
  .get(getMyResources);

router.route('/:id/download')
  .get(downloadResource);

router.route('/')
  .post(createResource);

router.route('/:id')
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;