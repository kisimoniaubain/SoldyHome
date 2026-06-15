import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

const safeStorageGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors to avoid hard crashes
  }
};

const safeStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors to avoid hard crashes
  }
};

const savedUserRaw = safeStorageGet('soldyUser');
const savedTokenRaw = safeStorageGet('soldyToken');
const isLocalFallbackSession = Boolean(savedTokenRaw && savedTokenRaw.startsWith('local-token-'));

if (isLocalFallbackSession) {
  safeStorageRemove('soldyToken');
  safeStorageRemove('soldyUser');
}

const savedUser = isLocalFallbackSession ? null : savedUserRaw;
const savedToken = isLocalFallbackSession ? null : savedTokenRaw;

const parseSavedUser = (rawValue) => {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) {
    safeStorageRemove('soldyUser');
    return null;
  }
};

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
    user: parseSavedUser(savedUser),
    token: savedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      safeStorageRemove('soldyToken');
      safeStorageRemove('soldyUser');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      safeStorageSet('soldyToken', action.payload.token);
      safeStorageSet('soldyUser', JSON.stringify(action.payload.user));
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
        safeStorageSet('soldyUser', JSON.stringify(a.payload.user));
        toast.success('Profile updated!');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
