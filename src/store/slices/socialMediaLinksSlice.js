import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const initialState = {
    socialMediaLinks: [],
    currentSocialMediaLinks: null,
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
export const fetchSocialMediaLinks = createAsyncThunk(
    'socialMediaLinks/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/SocialMediaLinks/get-all-social-media-links',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch social media links');
        }
    }
);

export const createSocialMediaLinks = createAsyncThunk(
    'socialMediaLinks/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/SocialMediaLinks/create-social-media-link',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create social media links');
        }
    }
);

export const updateSocialMediaLinks = createAsyncThunk(
    'socialMediaLinks/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/SocialMediaLinks/update-social-media-link/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update social media links');
        }
    }
);

const socialMediaLinksSlice = createSlice({
    name: 'socialMediaLinks',
    initialState,
    reducers: {
        clearCurrentSocialMediaLinks: (state) => {
            state.currentSocialMediaLinks = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
        resetSocialMediaLinks: (state) => {
            state.socialMediaLinks = [];
            state.currentSocialMediaLinks = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchSocialMediaLinks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSocialMediaLinks.fulfilled, (state, action) => {
                state.loading = false;
                state.socialMediaLinks = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchSocialMediaLinks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createSocialMediaLinks.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createSocialMediaLinks.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.socialMediaLinks.unshift(action.payload);
            })
            .addCase(createSocialMediaLinks.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateSocialMediaLinks.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateSocialMediaLinks.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.socialMediaLinks.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.socialMediaLinks[index] = action.payload;
                }
                if (state.currentSocialMediaLinks?.id === action.payload.id) {
                    state.currentSocialMediaLinks = action.payload;
                }
            })
            .addCase(updateSocialMediaLinks.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { 
    clearCurrentSocialMediaLinks, 
    clearError, 
    setPagination,
    resetSocialMediaLinks 
} = socialMediaLinksSlice.actions;

export default socialMediaLinksSlice.reducer;