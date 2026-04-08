// store/slices/userManagementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchAllUsers = createAsyncThunk(
    'userManagement/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/UserManagement/all-users');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'userManagement/fetchById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/UserManagement/user/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'userManagement/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/UserManagement/profile');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const createUser = createAsyncThunk(
    'userManagement/create',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/UserManagement/add-user', userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'userManagement/update',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/UserManagement/update-user/${userId}`, userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'userManagement/delete',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/api/UserManagement/delete-user/${userId}`);
            return { userId, success: response.data.success };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch by ID
            .addCase(fetchUserById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Fetch profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createUser.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload?.userId) {
                    state.users.unshift(action.payload);
                }
            })
            .addCase(createUser.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateUser.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.operationLoading = false;
                // Optional: you may want to update `users` list or just refetch
                const index = state.users.findIndex((user) => user.id === action.meta.arg.userId);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...action.meta.arg.userData };
                }
                if (state.currentUser?.id === action.meta.arg.userId) {
                    state.currentUser = { ...state.currentUser, ...action.meta.arg.userData };
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteUser.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.users = state.users.filter((user) => user.id !== action.payload.userId);
                    if (state.currentUser?.id === action.payload.userId) {
                        state.currentUser = null;
                    }
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentUser, clearError } = userManagementSlice.actions;

export default userManagementSlice.reducer;