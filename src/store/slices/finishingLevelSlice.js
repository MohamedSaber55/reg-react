import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    finishingLevels: [],
    currentFinishingLevel: null,
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
export const fetchFinishingLevels = createAsyncThunk(
    'finishingLevel/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/FinishingLevel/get-all-finishing-levels',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch finishing levels');
        }
    }
);

export const fetchFinishingLevelById = createAsyncThunk(
    'finishingLevel/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/FinishingLevel/get-finishing-level-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch finishing level');
        }
    }
);

export const createFinishingLevel = createAsyncThunk(
    'finishingLevel/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/FinishingLevel/create-finishing-level',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create finishing level');
        }
    }
);

export const updateFinishingLevel = createAsyncThunk(
    'finishingLevel/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/FinishingLevel/update-finishing-level/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update finishing level');
        }
    }
);

export const deleteFinishingLevel = createAsyncThunk(
    'finishingLevel/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/FinishingLevel/delete-finishing-level/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete finishing level');
        }
    }
);

const finishingLevelSlice = createSlice({
    name: 'finishingLevel',
    initialState,
    reducers: {
        clearCurrentFinishingLevel: (state) => {
            state.currentFinishingLevel = null;
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
            .addCase(fetchFinishingLevels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFinishingLevels.fulfilled, (state, action) => {
                state.loading = false;
                state.finishingLevels = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchFinishingLevels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchFinishingLevelById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchFinishingLevelById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentFinishingLevel = action.payload;
            })
            .addCase(fetchFinishingLevelById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createFinishingLevel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createFinishingLevel.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.finishingLevels.unshift(action.payload);
            })
            .addCase(createFinishingLevel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateFinishingLevel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateFinishingLevel.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.finishingLevels.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.finishingLevels[index] = action.payload;
                }
                if (state.currentFinishingLevel?.id === action.payload.id) {
                    state.currentFinishingLevel = action.payload;
                }
            })
            .addCase(updateFinishingLevel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteFinishingLevel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteFinishingLevel.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.finishingLevels = state.finishingLevels.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteFinishingLevel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentFinishingLevel, clearError, setPagination } = finishingLevelSlice.actions;
export default finishingLevelSlice.reducer;