import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import courseReducer from '../features/courses/courseSlice'
import resourceReducer from '../features/resources/resourceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    resources: resourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})