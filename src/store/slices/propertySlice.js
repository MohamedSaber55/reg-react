import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    properties: [],
    currentProperty: null,
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
    filters: {
        pageNumber: 1,
        pageSize: 10,
        search: '',
    },
};

// Async thunks
export const fetchProperties = createAsyncThunk(
    'property/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Property/get-all-properties',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
        }
    }
);

export const fetchPropertyById = createAsyncThunk(
    'property/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Property/get-property-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
        }
    }
);

export const createProperty = createAsyncThunk(
    'property/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Property/create-property',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000, // 60 seconds timeout for image uploads
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            // Better error handling
            if (error.code === 'ECONNABORTED') {
                return rejectWithValue('Upload timeout - Images may be too large. Please compress images and try again.');
            }
            
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to create property'
            );
        }
    }
);

export const updateProperty = createAsyncThunk(
    'property/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Property/update-property/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000, // 60 seconds timeout for image uploads
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                    },
                }
            );
            return response.data.data;
        } catch (error) {            
            // Better error handling
            if (error.code === 'ECONNABORTED') {
                return rejectWithValue('Upload timeout - Images may be too large. Please compress images and try again.');
            }
            
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to update property'
            );
        }
    }
);

export const deleteProperty = createAsyncThunk(
    'property/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Property/delete-property/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
        }
    }
);

export const changePropertyStatus = createAsyncThunk(
    'property/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Property/change-property-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change property status');
        }
    }
);
// export const changePropertyAvailability = createAsyncThunk(
//     'property/changeAvailability',
//     async ({ id, isAvailable }, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.put(
//                 `/api/Property/change-property-availability/${id}/${isAvailable}`
//             );
//             return { id, isAvailable, success: response.data.data };
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to change property availability');
//         }
//     }
// );

const propertySlice = createSlice({
    name: 'property',
    initialState,
    reducers: {
        clearCurrentProperty: (state) => {
            state.currentProperty = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                pageNumber: 1,
                pageSize: 10,
                search: '',
            };
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
            state.filters.pageNumber = action.payload.pageNumber;
            state.filters.pageSize = action.payload.pageSize;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchPropertyById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentProperty = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createProperty.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.properties.unshift(action.payload);
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateProperty.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.properties.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.properties[index] = action.payload;
                }
                if (state.currentProperty?.id === action.payload.id) {
                    state.currentProperty = action.payload;
                }
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteProperty.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.properties = state.properties.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteProperty.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changePropertyStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changePropertyStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.properties.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.properties[index].isActive = action.payload.isActive;
                    }
                    if (state.currentProperty?.id === action.payload.id) {
                        state.currentProperty.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changePropertyStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentProperty,
    clearError,
    setFilters,
    clearFilters,
    setPagination,
} = propertySlice.actions;

export default propertySlice.reducer;