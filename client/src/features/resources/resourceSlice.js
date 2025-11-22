import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import resourceService from './resourceService'

const initialState = {
  resources: [],
  resource: null,
  myResources: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get all resources
export const getResources = createAsyncThunk(
  'resources/getAll',
  async (_, thunkAPI) => {
    try {
      return await resourceService.getResources()
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

// Get single resource
export const getResource = createAsyncThunk(
  'resources/getOne',
  async (resourceId, thunkAPI) => {
    try {
      return await resourceService.getResource(resourceId)
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

// Download resource
export const downloadResource = createAsyncThunk(
  'resources/download',
  async (resourceId, thunkAPI) => {
    try {
      return await resourceService.downloadResource(resourceId)
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

// Upload resource
export const uploadResource = createAsyncThunk(
  'resources/upload',
  async (resourceData, thunkAPI) => {
    try {
      return await resourceService.uploadResource(resourceData)
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

// Get my resources
export const getMyResources = createAsyncThunk(
  'resources/getMyResources',
  async (_, thunkAPI) => {
    try {
      return await resourceService.getMyResources()
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

export const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    clearResource: (state) => {
      state.resource = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all resources
      .addCase(getResources.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getResources.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.resources = action.payload.data
      })
      .addCase(getResources.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.resources = []
      })
      // Get single resource
      .addCase(getResource.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getResource.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.resource = action.payload.data
      })
      .addCase(getResource.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.resource = null
      })
      // Download resource
      .addCase(downloadResource.fulfilled, (state, action) => {
        state.message = action.payload.message
      })
      // Upload resource
      .addCase(uploadResource.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadResource.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = 'Resource uploaded successfully'
        state.resources.unshift(action.payload.data)
      })
      .addCase(uploadResource.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Get my resources
      .addCase(getMyResources.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMyResources.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.myResources = action.payload.data
      })
      .addCase(getMyResources.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.myResources = []
      })
  },
})

export const { reset, clearResource } = resourceSlice.actions
export default resourceSlice.reducer