import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    unitModelImages: [],
    currentUnitModelImage: null,
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
export const fetchUnitModelImages = createAsyncThunk(
    'unitModelImage/fetchAll',
    async ({ unitModelId, params }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/UnitModelImage/unit-model/${unitModelId}/get-all-images`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit model images');
        }
    }
);

export const fetchUnitModelImageById = createAsyncThunk(
    'unitModelImage/fetchById',
    async ({ unitModelId, imageId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/UnitModelImage/unit-model/${unitModelId}/get-image/${imageId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit model image');
        }
    }
);

export const addUnitModelImage = createAsyncThunk(
    'unitModelImage/add',
    async ({ unitModelId, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/api/UnitModelImage/unit-model/${unitModelId}/add-image`,
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
            return rejectWithValue(error.response?.data?.message || 'Failed to add unit model image');
        }
    }
);

export const addUnitModelImagesBulk = createAsyncThunk(
    'unitModelImage/addBulk',
    async ({ unitModelId, images }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                `/api/UnitModelImage/unit-model/${unitModelId}/add-images-bulk`,
                { images },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add unit model images in bulk');
        }
    }
);

export const updateUnitModelImage = createAsyncThunk(
    'unitModelImage/update',
    async ({ unitModelId, imageId, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/UnitModelImage/unit-model/${unitModelId}/update-image/${imageId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update unit model image');
        }
    }
);

export const deleteUnitModelImage = createAsyncThunk(
    'unitModelImage/delete',
    async ({ unitModelId, imageId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/UnitModelImage/unit-model/${unitModelId}/delete-image/${imageId}`
            );
            return { imageId, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete unit model image');
        }
    }
);

export const setMainUnitModelImage = createAsyncThunk(
    'unitModelImage/setMain',
    async ({ unitModelId, imageId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/UnitModelImage/unit-model/${unitModelId}/set-main-image/${imageId}`
            );
            return { imageId, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to set main unit model image');
        }
    }
);

const unitModelImageSlice = createSlice({
    name: 'unitModelImage',
    initialState,
    reducers: {
        clearCurrentUnitModelImage: (state) => {
            state.currentUnitModelImage = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
        resetUnitModelImages: (state) => {
            state.unitModelImages = [];
            state.currentUnitModelImage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchUnitModelImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUnitModelImages.fulfilled, (state, action) => {
                state.loading = false;
                state.unitModelImages = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchUnitModelImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchUnitModelImageById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchUnitModelImageById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentUnitModelImage = action.payload;
            })
            .addCase(fetchUnitModelImageById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Add single image
            .addCase(addUnitModelImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(addUnitModelImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.unitModelImages.unshift(action.payload);
            })
            .addCase(addUnitModelImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Add bulk images
            .addCase(addUnitModelImagesBulk.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(addUnitModelImagesBulk.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload && Array.isArray(action.payload)) {
                    state.unitModelImages = [...action.payload, ...state.unitModelImages];
                }
            })
            .addCase(addUnitModelImagesBulk.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateUnitModelImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateUnitModelImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.unitModelImages.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.unitModelImages[index] = action.payload;
                }
                if (state.currentUnitModelImage?.id === action.payload.id) {
                    state.currentUnitModelImage = action.payload;
                }
            })
            .addCase(updateUnitModelImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteUnitModelImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteUnitModelImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.unitModelImages = state.unitModelImages.filter(
                        item => item.id !== action.payload.imageId
                    );
                }
            })
            .addCase(deleteUnitModelImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Set main image
            .addCase(setMainUnitModelImage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(setMainUnitModelImage.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    // Set all images to not main
                    state.unitModelImages.forEach(img => {
                        img.isMain = false;
                    });
                    // Set the selected image as main
                    const index = state.unitModelImages.findIndex(item => item.id === action.payload.imageId);
                    if (index !== -1) {
                        state.unitModelImages[index].isMain = true;
                    }
                }
            })
            .addCase(setMainUnitModelImage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentUnitModelImage,
    clearError,
    setPagination,
    resetUnitModelImages,
} = unitModelImageSlice.actions;

export default unitModelImageSlice.reducer;