import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const initialState = {
    transactionTypes: [],
    currentTransactionType: null,
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
export const fetchTransactionTypes = createAsyncThunk(
    'transactionType/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/TransactionType/get-all-transaction-types',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction types');
        }
    }
);

export const fetchTransactionTypeById = createAsyncThunk(
    'transactionType/fetchById',
    async (transactionTypeId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/TransactionType/get-transaction-type-by-id/${transactionTypeId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction type');
        }
    }
);

export const createTransactionType = createAsyncThunk(
    'transactionType/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/TransactionType/create-transaction-type',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create transaction type');
        }
    }
);

export const updateTransactionType = createAsyncThunk(
    'transactionType/update',
    async ({ transactionTypeId, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/TransactionType/update-transaction-type/${transactionTypeId}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update transaction type');
        }
    }
);

export const deleteTransactionType = createAsyncThunk(
    'transactionType/delete',
    async (transactionTypeId, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/TransactionType/delete-transaction-type/${transactionTypeId}`
            );
            return { transactionTypeId, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction type');
        }
    }
);

const transactionTypeSlice = createSlice({
    name: 'transactionType',
    initialState,
    reducers: {
        clearCurrentTransactionType: (state) => {
            state.currentTransactionType = null;
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
            .addCase(fetchTransactionTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.transactionTypes = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchTransactionTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchTransactionTypeById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactionTypeById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentTransactionType = action.payload;
            })
            .addCase(fetchTransactionTypeById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createTransactionType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createTransactionType.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.transactionTypes.unshift(action.payload);
            })
            .addCase(createTransactionType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateTransactionType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateTransactionType.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.transactionTypes.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.transactionTypes[index] = action.payload;
                }
                if (state.currentTransactionType?.id === action.payload.id) {
                    state.currentTransactionType = action.payload;
                }
            })
            .addCase(updateTransactionType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteTransactionType.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteTransactionType.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.transactionTypes = state.transactionTypes.filter(
                        item => item.id !== action.payload.transactionTypeId
                    );
                }
            })
            .addCase(deleteTransactionType.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentTransactionType, clearError, setPagination } = transactionTypeSlice.actions;
export default transactionTypeSlice.reducer;