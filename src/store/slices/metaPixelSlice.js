import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const initialState = {
    metaPixels: [],
    currentMetaPixel: null,
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
export const fetchMetaPixels = createAsyncThunk(
    'metaPixel/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/MetaPixel/get-all-meta-pixels',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch meta pixels');
        }
    }
);

export const fetchMetaPixelById = createAsyncThunk(
    'metaPixel/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/MetaPixel/get-meta-pixel-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch meta pixel');
        }
    }
);

export const createMetaPixel = createAsyncThunk(
    'metaPixel/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/MetaPixel/create-meta-pixel',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create meta pixel');
        }
    }
);

export const updateMetaPixel = createAsyncThunk(
    'metaPixel/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/MetaPixel/update-meta-pixel/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update meta pixel');
        }
    }
);

export const deleteMetaPixel = createAsyncThunk(
    'metaPixel/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/MetaPixel/delete-meta-pixel/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete meta pixel');
        }
    }
);

const metaPixelSlice = createSlice({
    name: 'metaPixel',
    initialState,
    reducers: {
        clearCurrentMetaPixel: (state) => {
            state.currentMetaPixel = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
        toggleMetaPixelActive: (state) => {
            const metaPixel = state.metaPixels.find(pixel => pixel.id === action.payload);
            if (metaPixel) {
                metaPixel.isActive = !metaPixel.isActive;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all meta pixels
            .addCase(fetchMetaPixels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMetaPixels.fulfilled, (state, action) => {
                state.loading = false;
                state.metaPixels = action.payload || [];
                // If your API returns paginated data, update accordingly:
                // state.pagination = {
                //   totalCount: action.payload.totalCount,
                //   pageNumber: action.payload.pageNumber,
                //   pageSize: action.payload.pageSize,
                //   totalPages: action.payload.totalPages,
                //   hasPreviousPage: action.payload.hasPreviousPage,
                //   hasNextPage: action.payload.hasNextPage,
                // };
            })
            .addCase(fetchMetaPixels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch meta pixel by ID
            .addCase(fetchMetaPixelById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchMetaPixelById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentMetaPixel = action.payload;
            })
            .addCase(fetchMetaPixelById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Create meta pixel
            .addCase(createMetaPixel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createMetaPixel.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.metaPixels.unshift(action.payload);
            })
            .addCase(createMetaPixel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Update meta pixel
            .addCase(updateMetaPixel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateMetaPixel.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.metaPixels.findIndex(pixel => pixel.id === action.payload.id);
                if (index !== -1) {
                    state.metaPixels[index] = action.payload;
                }
                if (state.currentMetaPixel?.id === action.payload.id) {
                    state.currentMetaPixel = action.payload;
                }
            })
            .addCase(updateMetaPixel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })

            // Delete meta pixel
            .addCase(deleteMetaPixel.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteMetaPixel.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.metaPixels = state.metaPixels.filter(
                        pixel => pixel.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteMetaPixel.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentMetaPixel,
    clearError,
    setPagination,
    toggleMetaPixelActive
} = metaPixelSlice.actions;

export default metaPixelSlice.reducer;