import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    aboutValues: [],
    currentAboutValue: null,
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
export const fetchAboutValues = createAsyncThunk(
    'aboutValue/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/AboutValue/get-all-about-values',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about values');
        }
    }
);

export const fetchAboutValuesBySection = createAsyncThunk(
    'aboutValue/fetchBySection',
    async ({ sectionId, params }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/AboutValue/get-about-values-by-section/${sectionId}`,
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about values by section');
        }
    }
);

export const fetchAboutValueById = createAsyncThunk(
    'aboutValue/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/AboutValue/get-about-value-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about value');
        }
    }
);

export const createAboutValue = createAsyncThunk(
    'aboutValue/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/AboutValue/create-about-value',
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create about value');
        }
    }
);

export const updateAboutValue = createAsyncThunk(
    'aboutValue/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/AboutValue/update-about-value/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update about value');
        }
    }
);

export const deleteAboutValue = createAsyncThunk(
    'aboutValue/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/AboutValue/delete-about-value/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to delete about value');
        }
    }
);

export const changeAboutValueStatus = createAsyncThunk(
    'aboutValue/changeStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/AboutValue/change-about-value-status/${id}/${isActive}`
            );
            return { id, isActive, success: response.data.data };
        } catch (error) {
            // console.log(error);
            return rejectWithValue(error.response?.data?.message || 'Failed to change about value status');
        }
    }
);

const aboutValueSlice = createSlice({
    name: 'aboutValue',
    initialState,
    reducers: {
        clearCurrentAboutValue: (state) => {
            state.currentAboutValue = null;
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
            .addCase(fetchAboutValues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAboutValues.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutValues = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchAboutValues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by section
            .addCase(fetchAboutValuesBySection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAboutValuesBySection.fulfilled, (state, action) => {
                state.loading = false;
                state.aboutValues = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchAboutValuesBySection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchAboutValueById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchAboutValueById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentAboutValue = action.payload;
            })
            .addCase(fetchAboutValueById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createAboutValue.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createAboutValue.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.aboutValues.unshift(action.payload);
            })
            .addCase(createAboutValue.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAboutValue.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateAboutValue.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.aboutValues.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.aboutValues[index] = action.payload;
                }
                if (state.currentAboutValue?.id === action.payload.id) {
                    state.currentAboutValue = action.payload;
                }
            })
            .addCase(updateAboutValue.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteAboutValue.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteAboutValue.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.aboutValues = state.aboutValues.filter(
                        item => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteAboutValue.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change Status
            .addCase(changeAboutValueStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeAboutValueStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.aboutValues.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.aboutValues[index].isActive = action.payload.isActive;
                    }
                    if (state.currentAboutValue?.id === action.payload.id) {
                        state.currentAboutValue.isActive = action.payload.isActive;
                    }
                }
            })
            .addCase(changeAboutValueStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentAboutValue, clearError, setPagination } = aboutValueSlice.actions;
export default aboutValueSlice.reducer;