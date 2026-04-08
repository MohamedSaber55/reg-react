import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    stages: [],
    currentStage: null,
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
export const fetchStages = createAsyncThunk(
    'stage/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Stage/get-all-stages',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stages');
        }
    }
);

export const fetchStageById = createAsyncThunk(
    'stage/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Stage/get-stage-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stage');
        }
    }
);

export const createStage = createAsyncThunk(
    'stage/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Stage/create-stage',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create stage');
        }
    }
);

export const updateStage = createAsyncThunk(
    'stage/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Stage/update-stage/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update stage');
        }
    }
);

export const deleteStage = createAsyncThunk(
    'stage/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Stage/delete-stage/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete stage');
        }
    }
);

export const changeStageStatus = createAsyncThunk(
    'stage/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Stage/change-stage-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change stage status');
        }
    }
);

const stageSlice = createSlice({
    name: 'stage',
    initialState,
    reducers: {
        clearCurrentStage: (state) => {
            state.currentStage = null;
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
            .addCase(fetchStages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStages.fulfilled, (state, action) => {
                state.loading = false;
                state.stages = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchStages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchStageById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchStageById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentStage = action.payload;
            })
            .addCase(fetchStageById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createStage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createStage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.stages.unshift(action.payload);
            })
            .addCase(createStage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateStage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateStage.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.stages.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.stages[index] = action.payload;
                }
                if (state.currentStage?.id === action.payload.id) {
                    state.currentStage = action.payload;
                }
            })
            .addCase(updateStage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteStage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteStage.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.stages = state.stages.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteStage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeStageStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeStageStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.stages.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.stages[index].isActive = action.payload.isActive;
                    }
                    if (state.currentStage?.id === action.payload.id) {
                        state.currentStage.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeStageStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentStage, clearError, setPagination } = stageSlice.actions;
export default stageSlice.reducer;