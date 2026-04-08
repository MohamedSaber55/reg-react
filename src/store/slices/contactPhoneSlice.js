import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    contactPhones: [],
    currentContactPhone: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchContactPhones = createAsyncThunk(
    'contactPhone/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/ContactPhone/get-all-contact-phones'
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact phones');
        }
    }
);

export const fetchContactPhoneById = createAsyncThunk(
    'contactPhone/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/ContactPhone/get-contact-phone-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact phone');
        }
    }
);

export const createContactPhone = createAsyncThunk(
    'contactPhone/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/ContactPhone/create-contact-phone',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create contact phone');
        }
    }
);

export const updateContactPhone = createAsyncThunk(
    'contactPhone/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ContactPhone/update-contact-phone/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact phone');
        }
    }
);

export const deleteContactPhone = createAsyncThunk(
    'contactPhone/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/ContactPhone/delete-contact-phone/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete contact phone');
        }
    }
);

const contactPhoneSlice = createSlice({
    name: 'contactPhone',
    initialState,
    reducers: {
        clearCurrentContactPhone: (state) => {
            state.currentContactPhone = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchContactPhones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactPhones.fulfilled, (state, action) => {
                state.loading = false;
                state.contactPhones = action.payload || [];
            })
            .addCase(fetchContactPhones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchContactPhoneById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchContactPhoneById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentContactPhone = action.payload;
            })
            .addCase(fetchContactPhoneById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createContactPhone.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createContactPhone.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.contactPhones.unshift(action.payload);
            })
            .addCase(createContactPhone.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateContactPhone.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateContactPhone.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.contactPhones.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.contactPhones[index] = action.payload;
                }
                if (state.currentContactPhone?.id === action.payload.id) {
                    state.currentContactPhone = action.payload;
                }
            })
            .addCase(updateContactPhone.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteContactPhone.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteContactPhone.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.contactPhones = state.contactPhones.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteContactPhone.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentContactPhone, clearError } = contactPhoneSlice.actions;
export default contactPhoneSlice.reducer;