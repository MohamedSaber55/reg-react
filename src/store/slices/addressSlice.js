import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    addresses: [],
    currentAddress: null,
    loading: false,
    error: null,
    operationLoading: false,
};

// Async thunks
export const fetchAddresses = createAsyncThunk(
    'address/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Address/get-all-addresses'
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
        }
    }
);

export const fetchAddressById = createAsyncThunk(
    'address/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Address/get-address-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch address');
        }
    }
);

export const createAddress = createAsyncThunk(
    'address/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Address/create-address',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create address');
        }
    }
);

export const updateAddress = createAsyncThunk(
    'address/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Address/update-address/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Address/delete-address/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearCurrentAddress: (state) => {
            state.currentAddress = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload || [];
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchAddressById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchAddressById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentAddress = action.payload;
            })
            .addCase(fetchAddressById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createAddress.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.addresses.unshift(action.payload);
            })
            .addCase(createAddress.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAddress.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.addresses.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                if (state.currentAddress?.id === action.payload.id) {
                    state.currentAddress = action.payload;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteAddress.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.addresses = state.addresses.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentAddress, clearError } = addressSlice.actions;
export default addressSlice.reducer;