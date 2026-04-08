import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    serviceItems: [],
    currentServiceItem: null,
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
export const fetchServiceItems = createAsyncThunk(
    'serviceItem/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/ServiceItem/get-all-service-items',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service items');
        }
    }
);

export const fetchServiceItemsBySection = createAsyncThunk(
    'serviceItem/fetchBySection',
    async ({ sectionId, params }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/ServiceItem/get-service-items-by-section/${sectionId}`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service items by section');
        }
    }
);

export const fetchServiceItemById = createAsyncThunk(
    'serviceItem/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/ServiceItem/get-service-item-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service item');
        }
    }
);

export const createServiceItem = createAsyncThunk(
    'serviceItem/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/ServiceItem/create-service-item',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create service item');
        }
    }
);

export const updateServiceItem = createAsyncThunk(
    'serviceItem/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ServiceItem/update-service-item/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update service item');
        }
    }
);

export const deleteServiceItem = createAsyncThunk(
    'serviceItem/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/ServiceItem/delete-service-item/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete service item');
        }
    }
);

export const changeServiceItemStatus = createAsyncThunk(
    'serviceItem/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ServiceItem/change-service-item-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change service item status');
        }
    }
);

const serviceItemSlice = createSlice({
    name: 'serviceItem',
    initialState,
    reducers: {
        clearCurrentServiceItem: (state) => {
            state.currentServiceItem = null;
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
            .addCase(fetchServiceItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceItems.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceItems = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchServiceItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by section
            .addCase(fetchServiceItemsBySection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceItemsBySection.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceItems = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchServiceItemsBySection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchServiceItemById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchServiceItemById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentServiceItem = action.payload;
            })
            .addCase(fetchServiceItemById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createServiceItem.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createServiceItem.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.serviceItems.unshift(action.payload);
            })
            .addCase(createServiceItem.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateServiceItem.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateServiceItem.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.serviceItems.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.serviceItems[index] = action.payload;
                }
                if (state.currentServiceItem?.id === action.payload.id) {
                    state.currentServiceItem = action.payload;
                }
            })
            .addCase(updateServiceItem.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteServiceItem.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteServiceItem.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.serviceItems = state.serviceItems.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteServiceItem.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeServiceItemStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeServiceItemStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.serviceItems.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.serviceItems[index].isActive = action.payload.isActive;
                    }
                    if (state.currentServiceItem?.id === action.payload.id) {
                        state.currentServiceItem.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeServiceItemStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentServiceItem, clearError, setPagination } = serviceItemSlice.actions;
export default serviceItemSlice.reducer;