const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadFile, getMyUploads, deleteUpload } = require('../controllers/uploads');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyUploads)
  .post(uploadFile);

router.route('/:id')
  .delete(deleteUpload);

module.exports = router;