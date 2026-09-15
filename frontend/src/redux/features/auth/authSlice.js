import { createSlice } from '@reduxjs/toolkit';

const storedUserInfo = localStorage.getItem('userInfo');

const initialState = {
  loading: false,
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  userToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCredentials: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
      localStorage.removeItem('userInfo');
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setCredentials, logout, setError } = authSlice.actions;

export default authSlice.reducer;