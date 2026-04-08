import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    contactPage: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchContactPage = createAsyncThunk(
    'contactPage/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/ContactPage/get-contact-page'
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact page');
        }
    }
);

export const createContactPage = createAsyncThunk(
    'contactPage/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/ContactPage/create-contact-page',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create contact page');
        }
    }
);

export const updateContactPage = createAsyncThunk(
    'contactPage/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/ContactPage/update-contact-page/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact page');
        }
    }
);

export const deleteContactPage = createAsyncThunk(
    'contactPage/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/ContactPage/delete-contact-page/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete contact page');
        }
    }
);

const contactPageSlice = createSlice({
    name: 'contactPage',
    initialState,
    reducers: {
        clearContactPage: (state) => {
            state.contactPage = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchContactPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactPage.fulfilled, (state, action) => {
                state.loading = false;
                state.contactPage = action.payload;
            })
            .addCase(fetchContactPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createContactPage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createContactPage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.contactPage = action.payload;
            })
            .addCase(createContactPage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateContactPage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateContactPage.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.contactPage = action.payload;
            })
            .addCase(updateContactPage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteContactPage.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteContactPage.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.contactPage = null;
                }
            })
            .addCase(deleteContactPage.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearContactPage, clearError } = contactPageSlice.actions;
export default contactPageSlice.reducer;