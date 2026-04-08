import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    testimonials: [],
    activeTestimonials: [],
    currentTestimonial: null,
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
export const fetchTestimonials = createAsyncThunk(
    'testimonial/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Testimonial/get-all-testimonials',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonials');
        }
    }
);

export const fetchActiveTestimonials = createAsyncThunk(
    'testimonial/fetchActive',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Testimonial/get-active-testimonials',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch active testimonials');
        }
    }
);

export const fetchTestimonialById = createAsyncThunk(
    'testimonial/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Testimonial/get-testimonial-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonial');
        }
    }
);

export const createTestimonial = createAsyncThunk(
    'testimonial/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Testimonial/create-testimonial',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create testimonial');
        }
    }
);

export const updateTestimonial = createAsyncThunk(
    'testimonial/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Testimonial/update-testimonial/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update testimonial');
        }
    }
);

export const deleteTestimonial = createAsyncThunk(
    'testimonial/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Testimonial/delete-testimonial/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete testimonial');
        }
    }
);

export const changeTestimonialStatus = createAsyncThunk(
    'testimonial/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Testimonial/change-testimonial-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change testimonial status');
        }
    }
);

const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState,
    reducers: {
        clearCurrentTestimonial: (state) => {
            state.currentTestimonial = null;
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
            // Fetch all testimonials
            .addCase(fetchTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.testimonials = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch active testimonials
            .addCase(fetchActiveTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.activeTestimonials = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchActiveTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchTestimonialById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchTestimonialById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentTestimonial = action.payload;
            })
            .addCase(fetchTestimonialById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createTestimonial.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createTestimonial.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.testimonials.unshift(action.payload);
            })
            .addCase(createTestimonial.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateTestimonial.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateTestimonial.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.testimonials.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.testimonials[index] = action.payload;
                }
                if (state.currentTestimonial?.id === action.payload.id) {
                    state.currentTestimonial = action.payload;
                }
            })
            .addCase(updateTestimonial.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteTestimonial.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteTestimonial.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.testimonials = state.testimonials.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteTestimonial.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeTestimonialStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeTestimonialStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.testimonials.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.testimonials[index].isActive = action.payload.isActive;
                    }
                    if (state.currentTestimonial?.id === action.payload.id) {
                        state.currentTestimonial.isActive = action.payload.isActive;
                    }
                    // Also update active testimonials
                    if (action.payload.isActive) {
                        const activeIndex = state.activeTestimonials.findIndex(item => item.id === action.payload.id);
                        if (activeIndex === -1) {
                            const testimonial = state.testimonials.find(item => item.id === action.payload.id);
                            if (testimonial) {
                                state.activeTestimonials.unshift(testimonial);
                            }
                        }
                    } else {
                        state.activeTestimonials = state.activeTestimonials.filter(
                            item => item.id !== action.payload.id
                        );
                    }
                }
            })
            .addCase(changeTestimonialStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentTestimonial,
    clearError,
    setFilters,
    clearFilters,
    setPagination,
} = testimonialSlice.actions;

export default testimonialSlice.reducer;