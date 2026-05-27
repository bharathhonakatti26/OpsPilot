import { createSlice } from '@reduxjs/toolkit'
import { storage } from '../utils/storage.js'

const initialState = {
  user: storage.getUser(),
  accessToken: storage.getAccessToken(),
  status: storage.getAccessToken() ? 'authenticated' : 'anonymous',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.status = 'authenticated'
      storage.setUser(action.payload.user)
      storage.setAccessToken(action.payload.accessToken)
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.status = 'anonymous'
      storage.clear()
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
