import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    sliderImages: [],
    currentSliderImage: null,
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
export const fetchSliderImages = createAsyncThunk(
    'sliderImage/fetchAll',
    async ({ sliderId, params }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/SliderImage/get-slider-images/${sliderId}`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slider images');
        }
    }
);

export const fetchSliderImageById = createAsyncThunk(
    'sliderImage/fetchById',
    async ({ sliderId, imageId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/SliderImage/get-slider-image/${sliderId}/${imageId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slider image');
        }
    }
);

// Single image upload
export const createSliderImage = createAsyncThunk(
    'sliderImage/create',
    async ({ sliderId, imageData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            
            // Append the image file
            formData.append('Image.ImageUrl', imageData.file);
            
            // Append other fields (they should match the API parameter names exactly)
            if (imageData.link) {
                formData.append('Image.Link', imageData.link);
            }
            formData.append('Image.IsActive', imageData.isActive ?? true);
            formData.append('Order', imageData.order);
            formData.append('IsActive', imageData.isActive ?? true);

            const response = await apiClient.post(
                `/api/SliderImage/add-image-to-slider/${sliderId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create slider image');
        }
    }
);

// Multiple images upload
export const createMultipleSliderImages = createAsyncThunk(
    'sliderImage/createMultiple',
    async ({ sliderId, images }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            images.forEach((image, index) => {
                // Append the image file
                formData.append(`dtos[${index}].Image.ImageUrl`, image.file);
                
                // Append other fields
                if (image.link) {
                    formData.append(`dtos[${index}].Image.Link`, image.link);
                }
                formData.append(`dtos[${index}].Image.IsActive`, image.isActive ?? true);
                formData.append(`dtos[${index}].Order`, image.order);
                formData.append(`dtos[${index}].IsActive`, image.isActive ?? true);
            });

            const response = await apiClient.post(
                `/api/SliderImage/add-images-to-slider/${sliderId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create slider images');
        }
    }
);

export const updateSliderImage = createAsyncThunk(
    'sliderImage/update',
    async ({ sliderId, imageId, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/SliderImage/update-slider-image/${sliderId}/${imageId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update slider image');
        }
    }
);

export const deleteSliderImage = createAsyncThunk(
    'sliderImage/delete',
    async ({ sliderId, imageId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/SliderImage/delete-slider-image/${sliderId}/${imageId}`
            );
            return { sliderId, imageId, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete slider image');
        }
    }
);

const sliderImageSlice = createSlice({
    name: 'sliderImage',
    initialState,
    reducers: {
        clearCurrentSliderImage: (state) => {
            state.currentSliderImage = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
        resetSliderImages: (state) => {
            state.sliderImages = [];
            state.currentSliderImage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchSliderImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSliderImages.fulfilled, (state, action) => {
                state.loading = false;
                state.sliderImages = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchSliderImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchSliderImageById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchSliderImageById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentSliderImage = action.payload;
            })
            .addCase(fetchSliderImageById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create single
            .addCase(createSliderImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createSliderImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.sliderImages.unshift(action.payload);
            })
            .addCase(createSliderImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create multiple
            .addCase(createMultipleSliderImages.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createMultipleSliderImages.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload && Array.isArray(action.payload)) {
                    state.sliderImages = [...action.payload, ...state.sliderImages];
                }
            })
            .addCase(createMultipleSliderImages.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateSliderImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateSliderImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.sliderImages.findIndex(
                    item => item.image?.id === action.payload.image?.id
                );
                if (index !== -1) {
                    state.sliderImages[index] = action.payload;
                }
                if (state.currentSliderImage?.image?.id === action.payload.image?.id) {
                    state.currentSliderImage = action.payload;
                }
            })
            .addCase(updateSliderImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteSliderImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteSliderImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.sliderImages = state.sliderImages.filter(
                        item => item.image?.id !== action.payload.imageId
                    );
                }
            })
            .addCase(deleteSliderImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentSliderImage,
    clearError,
    setPagination,
    resetSliderImages,
} = sliderImageSlice.actions;

export default sliderImageSlice.reducer;