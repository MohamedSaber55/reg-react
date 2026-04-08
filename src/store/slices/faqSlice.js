// store/slices/faqSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    faqs: [],
    currentFAQ: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchFAQs = createAsyncThunk(
    'faq/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/FAQ/get-all-faqs');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch FAQs');
        }
    }
);

export const fetchFAQById = createAsyncThunk(
    'faq/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/FAQ/get-faq-by-id/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch FAQ');
        }
    }
);

export const createFAQ = createAsyncThunk(
    'faq/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/FAQ/create-faq', data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create FAQ');
        }
    }
);

export const updateFAQ = createAsyncThunk(
    'faq/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/FAQ/update-faq/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update FAQ');
        }
    }
);

export const deleteFAQ = createAsyncThunk(
    'faq/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/api/FAQ/delete-faq/${id}`);
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete FAQ');
        }
    }
);

const faqSlice = createSlice({
    name: 'faq',
    initialState,
    reducers: {
        clearCurrentFAQ: (state) => {
            state.currentFAQ = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchFAQs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFAQs.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = action.payload || [];
            })
            .addCase(fetchFAQs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchFAQById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchFAQById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentFAQ = action.payload;
            })
            .addCase(fetchFAQById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createFAQ.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createFAQ.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.faqs.unshift(action.payload);
            })
            .addCase(createFAQ.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateFAQ.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateFAQ.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.faqs.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.faqs[index] = action.payload;
                }
                if (state.currentFAQ?.id === action.payload.id) {
                    state.currentFAQ = action.payload;
                }
            })
            .addCase(updateFAQ.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteFAQ.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteFAQ.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.faqs = state.faqs.filter((item) => item.id !== action.payload.id);
                }
            })
            .addCase(deleteFAQ.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentFAQ, clearError } = faqSlice.actions;

export default faqSlice.reducer;