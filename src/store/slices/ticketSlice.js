import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';


const initialState = {
    tickets: [],
    currentTicket: null,
    ticketReasons: [],
    ticketStatuses: [],
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
    filters: {
        pageNumber: 1,
        pageSize: 10,
        search: '',
    },
};

// Async thunks
export const fetchTickets = createAsyncThunk(
    'ticket/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Tickets/get-all-tickets',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
        }
    }
);

export const fetchTicketById = createAsyncThunk(
    'ticket/fetchById',
    async (ticketId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                `/api/Tickets/get-ticket-by-id/${ticketId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket');
        }
    }
);

export const createTicket = createAsyncThunk(
    'ticket/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(
                '/api/Tickets/create-ticket',
                data
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
        }
    }
);

export const changeTicketStatus = createAsyncThunk(
    'ticket/changeStatus',
    async ({ ticketId, statusId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(
                `/api/Tickets/change-ticket-status/${ticketId}/${statusId}`
            );
            return { ticketId, statusId, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change ticket status');
        }
    }
);

export const fetchTicketReasons = createAsyncThunk(
    'ticket/fetchReasons',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Tickets/get-ticket-reasons',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket reasons');
        }
    }
);

export const fetchTicketStatuses = createAsyncThunk(
    'ticket/fetchStatuses',
    async (params, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(
                '/api/Tickets/get-ticket-statuses',
                { params }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket statuses');
        }
    }
);

export const deleteTickets = createAsyncThunk(
    'ticket/deleteMultiple',
    async (ticketIds, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(
                '/api/Tickets/delete-tickets',
                { data: ticketIds }
            );
            return { ticketIds, success: response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete tickets');
        }
    }
);

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                pageNumber: 1,
                pageSize: 10,
                search: '',
            };
        },
        setPagination: (state, action) => {
            state.pagination.pageNumber = action.payload.pageNumber;
            state.pagination.pageSize = action.payload.pageSize;
            state.filters.pageNumber = action.payload.pageNumber;
            state.filters.pageSize = action.payload.pageSize;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all tickets
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload.items || [];
                state.pagination = {
                    totalCount: action.payload.totalCount,
                    pageNumber: action.payload.pageNumber,
                    pageSize: action.payload.pageSize,
                    totalPages: action.payload.totalPages,
                    hasPreviousPage: action.payload.hasPreviousPage,
                    hasNextPage: action.payload.hasNextPage,
                };
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch by ID
            .addCase(fetchTicketById.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.currentTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createTicket.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.tickets.unshift(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Change status
            .addCase(changeTicketStatus.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(changeTicketStatus.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    const index = state.tickets.findIndex(item => item.id === action.payload.ticketId);
                    if (index !== -1) {
                        state.tickets[index].ticketStatus.id = action.payload.statusId;
                    }
                    if (state.currentTicket?.id === action.payload.ticketId) {
                        state.currentTicket.ticketStatus.id = action.payload.statusId;
                    }
                }
            })
            .addCase(changeTicketStatus.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Fetch ticket reasons
            .addCase(fetchTicketReasons.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketReasons.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.ticketReasons = action.payload.items || [];
            })
            .addCase(fetchTicketReasons.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Fetch ticket statuses
            .addCase(fetchTicketStatuses.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketStatuses.fulfilled, (state, action) => {
                state.operationLoading = false;
                state.ticketStatuses = action.payload.items || [];
            })
            .addCase(fetchTicketStatuses.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            })
            // Delete multiple
            .addCase(deleteTickets.pending, (state) => {
                state.operationLoading = true;
                state.error = null;
            })
            .addCase(deleteTickets.fulfilled, (state, action) => {
                state.operationLoading = false;
                if (action.payload.success) {
                    state.tickets = state.tickets.filter(
                        ticket => !action.payload.ticketIds.includes(ticket.id)
                    );
                }
            })
            .addCase(deleteTickets.rejected, (state, action) => {
                state.operationLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentTicket,
    clearError,
    setFilters,
    clearFilters,
    setPagination,
} = ticketSlice.actions;
export default ticketSlice.reducer;