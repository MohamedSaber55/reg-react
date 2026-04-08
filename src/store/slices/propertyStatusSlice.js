import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    propertyStatuses: [],
    currentPropertyStatus: null,
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
export const fetchPropertyStatuses = createAsyncThunk(
    'propertyStatus/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/PropertyStatus/get-all-property-statuses',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property statuses');
        }
    }
);

export const fetchPropertyStatusById = createAsyncThunk(
    'propertyStatus/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/PropertyStatus/get-property-status-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property status');
        }
    }
);

export const createPropertyStatus = createAsyncThunk(
    'propertyStatus/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/PropertyStatus/create-property-status',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create property status');
        }
    }
);

export const updatePropertyStatus = createAsyncThunk(
    'propertyStatus/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/PropertyStatus/update-property-status/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update property status');
        }
    }
);

export const deletePropertyStatus = createAsyncThunk(
    'propertyStatus/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/PropertyStatus/delete-property-status/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete property status');
        }
    }
);

const propertyStatusSlice = createSlice({
    name: 'propertyStatus',
    initialState,
    reducers: {
        clearCurrentPropertyStatus: (state) => {
            state.currentPropertyStatus = null;
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
            .addCase(fetchPropertyStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyStatuses = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchPropertyStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchPropertyStatusById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchPropertyStatusById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentPropertyStatus = action.payload;
            })
            .addCase(fetchPropertyStatusById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createPropertyStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createPropertyStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.propertyStatuses.unshift(action.payload);
            })
            .addCase(createPropertyStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updatePropertyStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updatePropertyStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.propertyStatuses.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.propertyStatuses[index] = action.payload;
                }
                if (state.currentPropertyStatus?.id === action.payload.id) {
                    state.currentPropertyStatus = action.payload;
                }
            })
            .addCase(updatePropertyStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deletePropertyStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deletePropertyStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.propertyStatuses = state.propertyStatuses.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deletePropertyStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentPropertyStatus, clearError, setPagination } = propertyStatusSlice.actions;
export default propertyStatusSlice.reducer;