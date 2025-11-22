import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import courseService from './courseService'

const initialState = {
  courses: [],
  course: null,
  enrolledCourses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all courses
export const getCourses = createAsyncThunk(
  'courses/getAll',
  async (_, thunkAPI) => {
    try {
      return await courseService.getCourses()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single course
export const getCourse = createAsyncThunk(
  'courses/getOne',
  async (courseId, thunkAPI) => {
    try {
      return await courseService.getCourse(courseId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Enroll in course
export const enrollCourse = createAsyncThunk(
  'courses/enroll',
  async (courseId, thunkAPI) => {
    try {
      return await courseService.enrollCourse(courseId)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user's enrolled courses
export const getEnrolledCourses = createAsyncThunk(
  'courses/getEnrolled',
  async (_, thunkAPI) => {
    try {
      return await courseService.getEnrolledCourses()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearCourse: (state) => {
      state.course = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all courses
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.courses = action.payload.data
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.courses = []
      })
      // Get single course
      .addCase(getCourse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.course = action.payload.data
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.course = null
      })
      // Enroll in course
      .addCase(enrollCourse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get enrolled courses
      .addCase(getEnrolledCourses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.enrolledCourses = action.payload.data
      })
      .addCase(getEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.enrolledCourses = []
      })
  },
})

export const { reset, clearCourse } = courseSlice.actions
export default courseSlice.reducer