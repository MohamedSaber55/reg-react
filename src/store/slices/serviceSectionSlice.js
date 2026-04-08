import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    serviceSections: [],
    currentServiceSection: null,
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
export const fetchServiceSections = createAsyncThunk(
    'serviceSection/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/ServiceSection/get-all-service-sections',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service sections');
        }
    }
);

export const fetchServiceSectionById = createAsyncThunk(
    'serviceSection/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/ServiceSection/get-service-section-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service section');
        }
    }
);

export const createServiceSection = createAsyncThunk(
    'serviceSection/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/ServiceSection/create-service-section',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create service section');
        }
    }
);

export const updateServiceSection = createAsyncThunk(
    'serviceSection/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ServiceSection/update-service-section/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update service section');
        }
    }
);

export const deleteServiceSection = createAsyncThunk(
    'serviceSection/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/ServiceSection/delete-service-section/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete service section');
        }
    }
);

export const changeServiceSectionStatus = createAsyncThunk(
    'serviceSection/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ServiceSection/change-service-section-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change service section status');
        }
    }
);

const serviceSectionSlice = createSlice({
    name: 'serviceSection',
    initialState,
    reducers: {
        clearCurrentServiceSection: (state) => {
            state.currentServiceSection = null;
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
            .addCase(fetchServiceSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceSections.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceSections = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchServiceSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchServiceSectionById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchServiceSectionById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentServiceSection = action.payload;
            })
            .addCase(fetchServiceSectionById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createServiceSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createServiceSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.serviceSections.unshift(action.payload);
            })
            .addCase(createServiceSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateServiceSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateServiceSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.serviceSections.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.serviceSections[index] = action.payload;
                }
                if (state.currentServiceSection?.id === action.payload.id) {
                    state.currentServiceSection = action.payload;
                }
            })
            .addCase(updateServiceSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteServiceSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteServiceSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.serviceSections = state.serviceSections.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteServiceSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeServiceSectionStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeServiceSectionStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.serviceSections.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.serviceSections[index].isActive = action.payload.isActive;
                    }
                    if (state.currentServiceSection?.id === action.payload.id) {
                        state.currentServiceSection.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeServiceSectionStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentServiceSection, clearError, setPagination } = serviceSectionSlice.actions;
export default serviceSectionSlice.reducer;