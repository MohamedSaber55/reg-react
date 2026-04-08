import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    contactEmails: [],
    currentContactEmail: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchContactEmails = createAsyncThunk(
    'contactEmail/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/ContactEmail/get-all-contact-emails'
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact emails');
        }
    }
);

export const fetchContactEmailById = createAsyncThunk(
    'contactEmail/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/ContactEmail/get-contact-email-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact email');
        }
    }
);

export const createContactEmail = createAsyncThunk(
    'contactEmail/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/ContactEmail/create-contact-email',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create contact email');
        }
    }
);

export const updateContactEmail = createAsyncThunk(
    'contactEmail/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ContactEmail/update-contact-email/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact email');
        }
    }
);

export const deleteContactEmail = createAsyncThunk(
    'contactEmail/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/ContactEmail/delete-contact-email/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete contact email');
        }
    }
);

const contactEmailSlice = createSlice({
    name: 'contactEmail',
    initialState,
    reducers: {
        clearCurrentContactEmail: (state) => {
            state.currentContactEmail = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchContactEmails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactEmails.fulfilled, (state, action) => {
                state.loading = false;
                state.contactEmails = action.payload || [];
            })
            .addCase(fetchContactEmails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchContactEmailById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchContactEmailById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentContactEmail = action.payload;
            })
            .addCase(fetchContactEmailById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createContactEmail.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createContactEmail.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.contactEmails.unshift(action.payload);
            })
            .addCase(createContactEmail.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateContactEmail.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateContactEmail.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.contactEmails.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.contactEmails[index] = action.payload;
                }
                if (state.currentContactEmail?.id === action.payload.id) {
                    state.currentContactEmail = action.payload;
                }
            })
            .addCase(updateContactEmail.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteContactEmail.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteContactEmail.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.contactEmails = state.contactEmails.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteContactEmail.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentContactEmail, clearError } = contactEmailSlice.actions;
export default contactEmailSlice.reducer;