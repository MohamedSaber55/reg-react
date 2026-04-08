import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    propertyTypes: [],
    currentPropertyType: null,
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
export const fetchPropertyTypes = createAsyncThunk(
    'propertyType/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/PropertyType/get-all-property-types',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property types');
        }
    }
);

export const fetchPropertyTypeById = createAsyncThunk(
    'propertyType/fetchById',
    async (propertyTypeId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/PropertyType/get-property-type-by-id/${propertyTypeId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property type');
        }
    }
);

export const createPropertyType = createAsyncThunk(
    'propertyType/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/PropertyType/create-property-type',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create property type');
        }
    }
);

export const updatePropertyType = createAsyncThunk(
    'propertyType/update',
    async ({ propertyTypeId, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/PropertyType/update-property-type/${propertyTypeId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update property type');
        }
    }
);

export const deletePropertyType = createAsyncThunk(
    'propertyType/delete',
    async (propertyTypeId, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/PropertyType/delete-property-type/${propertyTypeId}`
            );
            return { propertyTypeId, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete property type');
        }
    }
);

const propertyTypeSlice = createSlice({
    name: 'propertyType',
    initialState,
    reducers: {
        clearCurrentPropertyType: (state) => {
            state.currentPropertyType = null;
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
            .addCase(fetchPropertyTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.propertyTypes = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchPropertyTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchPropertyTypeById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchPropertyTypeById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentPropertyType = action.payload;
            })
            .addCase(fetchPropertyTypeById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createPropertyType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createPropertyType.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.propertyTypes.unshift(action.payload);
            })
            .addCase(createPropertyType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updatePropertyType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updatePropertyType.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.propertyTypes.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.propertyTypes[index] = action.payload;
                }
                if (state.currentPropertyType?.id === action.payload.id) {
                    state.currentPropertyType = action.payload;
                }
            })
            .addCase(updatePropertyType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deletePropertyType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deletePropertyType.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.propertyTypes = state.propertyTypes.filter(
                        item => item.id !== action.payload.propertyTypeId
                    );
                }
            })
            .addCase(deletePropertyType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentPropertyType, clearError, setPagination } = propertyTypeSlice.actions;
export default propertyTypeSlice.reducer;