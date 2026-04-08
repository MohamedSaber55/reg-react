import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    unitModels: [],
    currentUnitModel: null,
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
export const fetchUnitModels = createAsyncThunk(
    'unitModel/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/UnitModel/get-all-unit-models',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit models');
        }
    }
);

export const fetchUnitModelsByStage = createAsyncThunk(
    'unitModel/fetchByStage',
    async ({ stageId, params }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/UnitModel/get-unit-models-by-stage/${stageId}`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit models by stage');
        }
    }
);

export const fetchUnitModelById = createAsyncThunk(
    'unitModel/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/UnitModel/get-unit-model-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit model');
        }
    }
);

export const createUnitModel = createAsyncThunk(
    'unitModel/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/UnitModel/create-unit-model',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create unit model');
        }
    }
);

export const updateUnitModel = createAsyncThunk(
    'unitModel/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/UnitModel/update-unit-model/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update unit model');
        }
    }
);

export const deleteUnitModel = createAsyncThunk(
    'unitModel/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/UnitModel/delete-unit-model/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete unit model');
        }
    }
);

export const changeUnitModelAvailability = createAsyncThunk(
    'unitModel/changeAvailability',
    async ({ id, isAvailable }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/UnitModel/change-unit-model-availability/${id}/${isAvailable}`
            );
            return { id, isAvailable, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change unit model availability');
        }
    }
);

const unitModelSlice = createSlice({
    name: 'unitModel',
    initialState,
    reducers: {
        clearCurrentUnitModel: (state) => {
            state.currentUnitModel = null;
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
            .addCase(fetchUnitModels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnitModels.fulfilled, (state, action) => {
                state.loading = false;
                state.unitModels = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchUnitModels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by stage
            .addCase(fetchUnitModelsByStage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnitModelsByStage.fulfilled, (state, action) => {
                state.loading = false;
                state.unitModels = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchUnitModelsByStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchUnitModelById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchUnitModelById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentUnitModel = action.payload;
            })
            .addCase(fetchUnitModelById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createUnitModel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createUnitModel.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.unitModels.unshift(action.payload);
            })
            .addCase(createUnitModel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateUnitModel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateUnitModel.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.unitModels.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.unitModels[index] = action.payload;
                }
                if (state.currentUnitModel?.id === action.payload.id) {
                    state.currentUnitModel = action.payload;
                }
            })
            .addCase(updateUnitModel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteUnitModel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteUnitModel.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.unitModels = state.unitModels.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteUnitModel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Availability
            .addCase(changeUnitModelAvailability.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeUnitModelAvailability.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.unitModels.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.unitModels[index].isAvailable = action.payload.isAvailable;
                    }
                    if (state.currentUnitModel?.id === action.payload.id) {
                        state.currentUnitModel.isAvailable = action.payload.isAvailable;
                    }
                }
            })
            .addCase(changeUnitModelAvailability.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentUnitModel, clearError, setPagination } = unitModelSlice.actions;
export default unitModelSlice.reducer;