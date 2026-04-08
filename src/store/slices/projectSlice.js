import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    projects: [],
    currentProject: null,
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
export const fetchProjects = createAsyncThunk(
    'project/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Projects/get-all-projects',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const fetchProjectById = createAsyncThunk(
    'project/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Projects/get-project-by-id/${id}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
        }
    }
);

export const createProject = createAsyncThunk(
    'project/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Projects/create-project',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Projects/update-project/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'project/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                `/api/Projects/delete-project/${id}`
            );
            return { id, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
        }
    }
);

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        clearCurrentProject: (state) => {
            state.currentProject = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
        },
        clearProjects: (state) => {
            state.projects = [];
            state.pagination = initialState.pagination;
            state.currentProject = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchProjectById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create project
            .addCase(createProject.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.projects.unshift(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Update project
            .addCase(updateProject.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.operationLoading = false;
                const index = state.projects.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete project
            .addCase(deleteProject.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.projects = state.projects.filter(
                        item => item.id !== action.payload.id
                    );
                    // Clear current project if it was deleted
                    if (state.currentProject?.id === action.payload.id) {
                        state.currentProject = null;
                    }
                }
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentProject,
    clearError,
    setPagination,
    clearProjects
} = projectSlice.actions;

export default projectSlice.reducer;