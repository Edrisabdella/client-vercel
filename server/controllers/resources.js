const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res, next) => {
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
    query = Resource.find(JSON.parse(queryStr)).populate('uploadedBy', 'name');

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
    const total = await Resource.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const resources = await query;

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
      count: resources.length,
      pagination,
      data: resources
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
exports.getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.status(200).json({
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

// @desc    Create resource
// @route   POST /api/resources
// @access  Private
exports.createResource = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.uploadedBy = req.user.id;

    const resource = await Resource.create(req.body);

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

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
exports.updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Make sure user is resource owner or admin
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to update this resource'
      });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
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

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Make sure user is resource owner or admin
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to delete this resource'
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

// @desc    Download resource
// @route   GET /api/resources/:id/download
// @access  Private
exports.downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      data: {
        fileUrl: resource.fileUrl,
        message: 'Download link generated successfully'
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get user's resources
// @route   GET /api/resources/my-resources
// @access  Private
exports.getMyResources = async (req, res, next) => {
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