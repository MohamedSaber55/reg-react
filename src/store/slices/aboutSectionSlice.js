import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    aboutSections: [],
    currentAboutSection: null,
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
export const fetchAboutSections = createAsyncThunk(
    'aboutSection/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/AboutSection/get-all-about-sections',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about sections');
        }
    }
);

export const fetchAboutSectionById = createAsyncThunk(
    'aboutSection/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/AboutSection/get-about-section-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about section');
        }
    }
);

export const createAboutSection = createAsyncThunk(
    'aboutSection/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/AboutSection/create-about-section',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create about section');
        }
    }
);

export const updateAboutSection = createAsyncThunk(
    'aboutSection/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/AboutSection/update-about-section/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update about section');
        }
    }
);

export const deleteAboutSection = createAsyncThunk(
    'aboutSection/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/AboutSection/delete-about-section/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete about section');
        }
    }
);

export const changeAboutSectionStatus = createAsyncThunk(
    'aboutSection/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/AboutSection/change-about-section-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change about section status');
        }
    }
);

const aboutSectionSlice = createSlice({
    name: 'aboutSection',
    initialState,
    reducers: {
        clearCurrentAboutSection: (state) => {
            state.currentAboutSection = null;
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
            .addCase(fetchAboutSections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAboutSections.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutSections = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchAboutSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchAboutSectionById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchAboutSectionById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentAboutSection = action.payload;
            })
            .addCase(fetchAboutSectionById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createAboutSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createAboutSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.aboutSections.unshift(action.payload);
            })
            .addCase(createAboutSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAboutSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateAboutSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.aboutSections.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.aboutSections[index] = action.payload;
                }
                if (state.currentAboutSection?.id === action.payload.id) {
                    state.currentAboutSection = action.payload;
                }
            })
            .addCase(updateAboutSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteAboutSection.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteAboutSection.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.aboutSections = state.aboutSections.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteAboutSection.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeAboutSectionStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeAboutSectionStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.aboutSections.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.aboutSections[index].isActive = action.payload.isActive;
                    }
                    if (state.currentAboutSection?.id === action.payload.id) {
                        state.currentAboutSection.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeAboutSectionStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentAboutSection, clearError, setPagination } = aboutSectionSlice.actions;
export default aboutSectionSlice.reducer;