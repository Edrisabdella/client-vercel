const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['programming', 'mathematics', 'science', 'test-prep', 'business', 'arts']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  students: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  content: [{
    title: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    videoUrl: String,
    resources: [String],
    isFree: {
      type: Boolean,
      default: false
    }
  }],
  requirements: [String],
  learningOutcomes: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'English'
  },
  subtitles: [String]
}, {
  timestamps: true
});

// Static method to get average rating
courseSchema.statics.getAverageRating = async function(courseId) {
  const obj = await this.aggregate([
    {
      $match: { _id: courseId }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'course',
        as: 'reviews'
      }
    },
    {
      $project: {
        averageRating: { $avg: '$reviews.rating' },
        ratingsCount: { $size: '$reviews' }
      }
    }
  ]);

  try {
    await this.model('Course').findByIdAndUpdate(courseId, {
      rating: obj[0]?.averageRating || 0,
      ratingsCount: obj[0]?.ratingsCount || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Reverse populate with virtuals
courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

module.exports = mongoose.model('Course', courseSchema);