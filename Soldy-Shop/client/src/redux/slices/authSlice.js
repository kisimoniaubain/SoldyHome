import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

const savedUserRaw = localStorage.getItem('soldyUser');
const savedTokenRaw = localStorage.getItem('soldyToken');
const isLocalFallbackSession = Boolean(savedTokenRaw && savedTokenRaw.startsWith('local-token-'));

if (isLocalFallbackSession) {
  localStorage.removeItem('soldyToken');
  localStorage.removeItem('soldyUser');
}

const savedUser = isLocalFallbackSession ? null : savedUserRaw;
const savedToken = isLocalFallbackSession ? null : savedTokenRaw;

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    if (!err.response) return rejectWithValue('Backend not reachable. Please ensure server is running and try again.');
    return rejectWithValue(err.response.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (err) {
    if (!err.response) return rejectWithValue('Backend not reachable. Please ensure server is running and try again.');
    return rejectWithValue(err.response.data?.message || 'Login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/profile', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('soldyToken');
      localStorage.removeItem('soldyUser');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('soldyToken', action.payload.token);
      localStorage.setItem('soldyUser', JSON.stringify(action.payload.user));
    };

    builder
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, handleAuthSuccess)
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, handleAuthSuccess)
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload.user; })

      .addCase(updateProfile.fulfilled, (s, a) => {
        s.user = a.payload.user;
        localStorage.setItem('soldyUser', JSON.stringify(a.payload.user));
        toast.success('Profile updated!');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
