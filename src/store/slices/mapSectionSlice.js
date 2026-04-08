// store/slices/mapSectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    mapSections: [],
    currentMapSection: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchMapSections = createAsyncThunk(
    'mapSection/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/MapSection/get-all-map-sections');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch map sections');
        }
    }
);

export const fetchMapSectionById = createAsyncThunk(
    'mapSection/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/MapSection/get-map-section-by-id/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch map section');
        }
    }
);

export const createMapSection = createAsyncThunk(
    'mapSection/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/MapSection/create-map-section', data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create map section');
        }
    }
);

export const updateMapSection = createAsyncThunk(
    'mapSection/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/MapSection/update-map-section/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update map section');
        }
    }
);

export const deleteMapSection = createAsyncThunk(
    'mapSection/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/api/MapSection/delete-map-section/${id}`);
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete map section');
        }
    }
);

const mapSectionSlice = createSlice({
    name: 'mapSection',
    initialState,
    reducers: {
        clearCurrentMapSection: (state) => {
            state.currentMapSection = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchMapSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMapSections.fulfilled, (state, action) => {
                state.loading = false;
                state.mapSections = action.payload || [];
            })
            .addCase(fetchMapSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchMapSectionById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchMapSectionById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentMapSection = action.payload;
            })
            .addCase(fetchMapSectionById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createMapSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createMapSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.mapSections.unshift(action.payload);
            })
            .addCase(createMapSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateMapSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateMapSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.mapSections.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.mapSections[index] = action.payload;
                }
                if (state.currentMapSection?.id === action.payload.id) {
                    state.currentMapSection = action.payload;
                }
            })
            .addCase(updateMapSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteMapSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteMapSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.mapSections = state.mapSections.filter((item) => item.id !== action.payload.id);
                }
            })
            .addCase(deleteMapSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentMapSection, clearError } = mapSectionSlice.actions;

export default mapSectionSlice.reducer;