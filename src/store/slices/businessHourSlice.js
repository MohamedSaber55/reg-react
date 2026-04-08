import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    businessHours: [],
    currentBusinessHour: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchBusinessHours = createAsyncThunk(
    'businessHour/fetchAll',
    async (params = { onlyWorkingDays: false }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/BusinessHour/get-all-business-hours',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch business hours');
        }
    }
);

export const fetchBusinessHourById = createAsyncThunk(
    'businessHour/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/BusinessHour/get-business-hour-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch business hour');
        }
    }
);

export const createBusinessHour = createAsyncThunk(
    'businessHour/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/BusinessHour/create-business-hour',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create business hour');
        }
    }
);

export const updateBusinessHour = createAsyncThunk(
    'businessHour/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/BusinessHour/update-business-hour/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update business hour');
        }
    }
);

export const deleteBusinessHour = createAsyncThunk(
    'businessHour/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/BusinessHour/delete-business-hour/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete business hour');
        }
    }
);

const businessHourSlice = createSlice({
    name: 'businessHour',
    initialState,
    reducers: {
        clearCurrentBusinessHour: (state) => {
            state.currentBusinessHour = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchBusinessHours.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBusinessHours.fulfilled, (state, action) => {
                state.loading = false;
                state.businessHours = action.payload || [];
            })
            .addCase(fetchBusinessHours.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchBusinessHourById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchBusinessHourById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentBusinessHour = action.payload;
            })
            .addCase(fetchBusinessHourById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createBusinessHour.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createBusinessHour.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.businessHours.unshift(action.payload);
            })
            .addCase(createBusinessHour.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateBusinessHour.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateBusinessHour.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.businessHours.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.businessHours[index] = action.payload;
                }
                if (state.currentBusinessHour?.id === action.payload.id) {
                    state.currentBusinessHour = action.payload;
                }
            })
            .addCase(updateBusinessHour.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteBusinessHour.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteBusinessHour.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.businessHours = state.businessHours.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteBusinessHour.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentBusinessHour, clearError } = businessHourSlice.actions;
export default businessHourSlice.reducer;