const Resource = require('../models/Resource');

// @desc    Upload file
// @route   POST /api/uploads
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    // This would typically handle file upload using multer
    // For now, we'll assume the file URL is provided in the request
    const { title, description, category, fileType, fileUrl, fileSize } = req.body;

    const resource = await Resource.create({
      title,
      description,
      category,
      fileType,
      fileUrl,
      fileSize,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get user's uploads
// @route   GET /api/uploads
// @access  Private
exports.getMyUploads = async (req, res, next) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user.id });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete upload
// @route   DELETE /api/uploads/:id
// @access  Private
exports.deleteUpload = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Make sure user is resource owner
    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this resource'
      });
    }

    await resource.deleteOne();

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