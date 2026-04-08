import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    heroSections: [],
    currentHeroSection: null,
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
export const fetchHeroSections = createAsyncThunk(
    'heroSection/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/HeroSection/get-all-hero-sections',
                { params }
            );
            return response.data.data;
        } catch (error) {
            console.error('Fetch hero sections error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch hero sections');
        }
    }
);

export const fetchHeroSectionById = createAsyncThunk(
    'heroSection/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/HeroSection/get-hero-section-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Fetch hero section by ID error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch hero section');
        }
    }
);

export const createHeroSection = createAsyncThunk(
    'heroSection/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/HeroSection/create-hero-section',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Create hero section error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create hero section');
        }
    }
);

export const updateHeroSection = createAsyncThunk(
    'heroSection/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/HeroSection/update-hero-section/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Update hero section error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update hero section');
        }
    }
);

export const deleteHeroSection = createAsyncThunk(
    'heroSection/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/HeroSection/delete-hero-section/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            console.error('Delete hero section error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete hero section');
        }
    }
);

export const changeHeroSectionStatus = createAsyncThunk(
    'heroSection/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/HeroSection/change-hero-section-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            console.error('Change hero section status error:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change hero section status');
        }
    }
);

const heroSectionSlice = createSlice({
    name: 'heroSection',
    initialState,
    reducers: {
        clearCurrentHeroSection: (state) => {
            state.currentHeroSection = null;
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
            .addCase(fetchHeroSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHeroSections.fulfilled, (state, action) => {
                state.loading = false;
                state.heroSections = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchHeroSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchHeroSectionById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchHeroSectionById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentHeroSection = action.payload;
            })
            .addCase(fetchHeroSectionById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createHeroSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createHeroSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.heroSections.unshift(action.payload);
            })
            .addCase(createHeroSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateHeroSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateHeroSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.heroSections.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.heroSections[index] = action.payload;
                }
                if (state.currentHeroSection?.id === action.payload.id) {
                    state.currentHeroSection = action.payload;
                }
            })
            .addCase(updateHeroSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteHeroSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteHeroSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.heroSections = state.heroSections.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteHeroSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeHeroSectionStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeHeroSectionStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.heroSections.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.heroSections[index].isActive = action.payload.isActive;
                    }
                    if (state.currentHeroSection?.id === action.payload.id) {
                        state.currentHeroSection.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeHeroSectionStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentHeroSection, clearError, setPagination } = heroSectionSlice.actions;
export default heroSectionSlice.reducer;