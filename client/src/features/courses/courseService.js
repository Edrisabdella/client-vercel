import axios from 'axios'

const API_URL = '/api/courses'

// Get all courses
const getCourses = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get single course
const getCourse = async (courseId) => {
  const response = await axios.get(`${API_URL}/${courseId}`)
  return response.data
}

// Enroll in course
const enrollCourse = async (courseId) => {
  const response = await axios.post(`${API_URL}/${courseId}/enroll`)
  return response.data
}

// Get user's enrolled courses
const getEnrolledCourses = async () => {
  const response = await axios.get(`${API_URL}/my-courses`)
  return response.data
}

const courseService = {
  getCourses,
  getCourse,
  enrollCourse,
  getEnrolledCourses,
}

export default courseService