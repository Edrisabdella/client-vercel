import axios from 'axios'

const API_URL = '/api/resources'

// Get all resources
const getResources = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Get single resource
const getResource = async (resourceId) => {
  const response = await axios.get(`${API_URL}/${resourceId}`)
  return response.data
}

// Download resource
const downloadResource = async (resourceId) => {
  const response = await axios.get(`${API_URL}/${resourceId}/download`)
  return response.data
}

// Upload resource
const uploadResource = async (resourceData) => {
  const response = await axios.post(API_URL, resourceData)
  return response.data
}

// Get my resources
const getMyResources = async () => {
  const response = await axios.get(`${API_URL}/my-resources`)
  return response.data
}

const resourceService = {
  getResources,
  getResource,
  downloadResource,
  uploadResource,
  getMyResources,
}

export default resourceService