import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    isAuthenticated: false
  },
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload.username;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;