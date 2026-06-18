import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('active_user')) || null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // action.payload має містити: { user: { id, email, name, is_staff, ... }, token: "..." }
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      
      localStorage.setItem('active_user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('active_user');
      localStorage.removeItem('token');
    }
  }
});

export const { loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;