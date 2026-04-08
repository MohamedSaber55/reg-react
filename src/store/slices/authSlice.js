import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const getInitialAuthState = () => {
    if (typeof window === 'undefined') {
        return {
            token: null,
            role: null,
            userData: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            resetEmail: null,
            otpVerified: false,
            resetOtp: null,
        };
    }

    try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userDataStr = localStorage.getItem('userData');

        return {
            token,
            role,
            userData: userDataStr ? JSON.parse(userDataStr) : null,
            isAuthenticated: !!token,
            loading: false,
            error: null,
            resetEmail: null,
            otpVerified: false,
            resetOtp: null,

        };
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return {
            token: null,
            role: null,
            userData: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            resetEmail: null,
            otpVerified: false,
            resetOtp: null,
        };
    }
};

const initialState = getInitialAuthState();

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/Account/login', credentials);
            if (response.data.success && response.data.data) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Login failed');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/Account/forgot-password', { email });
            if (response.data.success) {
                return { email, message: response.data.message };
            } else {
                return rejectWithValue(response.data.message || 'Failed to send reset email');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/Account/verify-otp', data);
            if (response.data.success && response.data.data?.isVerified) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Invalid OTP');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (
        data,
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.post('/api/Account/reset-password', data);
            if (response.data.success) {
                return response.data.message;
            } else {
                return rejectWithValue(response.data.message || 'Password reset failed');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password reset failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('userData');
            }
            state.token = null;
            state.role = null;
            state.userData = null;
            state.isAuthenticated = false;
            state.resetEmail = null;
            state.otpVerified = false;
            state.resetOtp = null;
            
        },
        clearError: (state) => {
            state.error = null;
        },
        clearResetState: (state) => {
            state.resetEmail = null;
            state.otpVerified = false;
            state.resetOtp = null;
            state.error = null;
        },
        syncWithLocalStorage: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                const userDataStr = localStorage.getItem('userData');

                state.token = token;
                state.role = role;
                state.userData = userDataStr ? JSON.parse(userDataStr) : null;
                state.isAuthenticated = !!token;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                const { token, role, email, firstName, lastName, ...rest } = action.payload;
                state.token = token;
                state.role = role;
                state.userData = { email, firstName, lastName, ...rest };
                state.isAuthenticated = true;
                state.error = null;

                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('token', token);
                        localStorage.setItem('role', role);
                        localStorage.setItem('userData', JSON.stringify(state.userData));
                    } catch (error) {
                        console.error('Error saving to localStorage:', error);
                    }
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.resetEmail = action.payload.email;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = true;
                state.resetOtp = action.meta.arg.otpCode;
                state.error = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpVerified = false;
                state.error = action.payload;
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.resetEmail = null;
                state.otpVerified = false;
                state.resetOtp = null;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, clearResetState, syncWithLocalStorage } = authSlice.actions;
export default authSlice.reducer;