import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    sliders: [],
    currentSlider: null,
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
export const fetchSliders = createAsyncThunk(
    'slider/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Slider/get-all-sliders',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch sliders');
        }
    }
);

export const fetchSliderById = createAsyncThunk(
    'slider/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Slider/get-slider-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slider');
        }
    }
);

export const createSlider = createAsyncThunk(
    'slider/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Slider/create-slider',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create slider');
        }
    }
);

export const updateSlider = createAsyncThunk(
    'slider/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Slider/update-slider/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update slider');
        }
    }
);

export const deleteSlider = createAsyncThunk(
    'slider/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Slider/delete-slider/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete slider');
        }
    }
);

const sliderSlice = createSlice({
    name: 'slider',
    initialState,
    reducers: {
        clearCurrentSlider: (state) => {
            state.currentSlider = null;
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
            .addCase(fetchSliders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSliders.fulfilled, (state, action) => {
                state.loading = false;
                state.sliders = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchSliders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchSliderById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchSliderById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentSlider = action.payload;
            })
            .addCase(fetchSliderById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createSlider.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createSlider.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.sliders.unshift(action.payload);
            })
            .addCase(createSlider.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateSlider.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateSlider.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.sliders.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.sliders[index] = action.payload;
                }
                if (state.currentSlider?.id === action.payload.id) {
                    state.currentSlider = action.payload;
                }
            })
            .addCase(updateSlider.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteSlider.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteSlider.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.sliders = state.sliders.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteSlider.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentSlider, clearError, setPagination } = sliderSlice.actions;
export default sliderSlice.reducer;