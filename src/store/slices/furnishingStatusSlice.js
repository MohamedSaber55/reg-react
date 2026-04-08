import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const initialState = {
    furnishingStatuses: [],
    currentFurnishingStatus: null,
    pagination: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    },
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchFurnishingStatuses = createAsyncThunk(
    'furnishingStatus/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/FurnishingStatus/get-all-furnishing-statuses',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch furnishing statuses');
        }
    }
);

export const fetchFurnishingStatusById = createAsyncThunk(
    'furnishingStatus/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/FurnishingStatus/get-furnishing-status-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch furnishing status');
        }
    }
);

export const createFurnishingStatus = createAsyncThunk(
    'furnishingStatus/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/FurnishingStatus/create-furnishing-status',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create furnishing status');
        }
    }
);

export const updateFurnishingStatus = createAsyncThunk(
    'furnishingStatus/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/FurnishingStatus/update-furnishing-status/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update furnishing status');
        }
    }
);

export const deleteFurnishingStatus = createAsyncThunk(
    'furnishingStatus/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/FurnishingStatus/delete-furnishing-status/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete furnishing status');
        }
    }
);

const furnishingStatusSlice = createSlice({
    name: 'furnishingStatus',
    initialState,
    reducers: {
        clearCurrentFurnishingStatus: (state) => {
            state.currentFurnishingStatus = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchFurnishingStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFurnishingStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.furnishingStatuses = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchFurnishingStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchFurnishingStatusById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchFurnishingStatusById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentFurnishingStatus = action.payload;
            })
            .addCase(fetchFurnishingStatusById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createFurnishingStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createFurnishingStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.furnishingStatuses.unshift(action.payload);
            })
            .addCase(createFurnishingStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateFurnishingStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateFurnishingStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.furnishingStatuses.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.furnishingStatuses[index] = action.payload;
                }
                if (state.currentFurnishingStatus?.id === action.payload.id) {
                    state.currentFurnishingStatus = action.payload;
                }
            })
            .addCase(updateFurnishingStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteFurnishingStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteFurnishingStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.furnishingStatuses = state.furnishingStatuses.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteFurnishingStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentFurnishingStatus, clearError, setPagination } = furnishingStatusSlice.actions;
export default furnishingStatusSlice.reducer;