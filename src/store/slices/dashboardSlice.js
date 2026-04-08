import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
    statistics: {
        userStatistics: {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            adminUsers: 0,
            superAdminUsers: 0,
            newUsersThisMonth: 0,
            newUsersThisWeek: 0,
        },
        propertyStatistics: {
            totalProperties: 0,
            activeProperties: 0,
            inactiveProperties: 0,
            propertiesByType: [],
            propertiesByTransaction: [],
            propertiesByStatus: [],
            propertiesByFurnishing: [],
            propertiesByFinishing: [],
            propertiesWithImages: 0,
            totalPropertyImages: 0,
            averagePriceForSale: 0,
            averagePriceForRent: 0,
        },
        ticketStatistics: {
            totalTickets: 0,
            pendingTickets: 0,
            inProgressTickets: 0,
            closedTickets: 0,
            ticketsByStatus: [],
            ticketsByReason: [],
            ticketsThisMonth: 0,
            ticketsThisWeek: 0,
            ticketsToday: 0,
            averageResponseTime: 0,
        },
        testimonialStatistics: {
            totalTestimonials: 0,
            activeTestimonials: 0,
            pendingTestimonials: 0,
            rejectedTestimonials: 0,
            averageRating: 0,
            ratingDistribution: [],
            testimonialsThisMonth: 0,
            testimonialsThisWeek: 0,
        },
        sliderStatistics: {
            totalSliders: 0,
            activeSliders: 0,
            totalSliderImages: 0,
            activeSliderImages: 0,
            averageImagesPerSlider: 0,
            imagesBySlider: [],
        },
        socialMediaStatistics: {
            totalSocialMediaLinks: 0,
            activeFacebookLinks: 0,
            activeInstagramLinks: 0,
            activeTwitterLinks: 0,
            activeLinkedInLinks: 0,
            activeYouTubeLinks: 0,
            activeTikTokLinks: 0,
            totalActivePlatforms: 0,
        },
        stageStatistics: {
            totalStages: 0,
            activeStages: 0,
            inactiveStages: 0,
            totalUnitModels: 0,
            averageModelsPerStage: 0,
            modelsByStage: [],
        },
        aboutValueStatistics: {
            totalAboutValues: 0,
            activeAboutValues: 0,
            inactiveAboutValues: 0,
            valuesBySection: [],
        },
        systemOverview: {
            totalEntities: 0,
            totalActiveEntities: 0,
            systemHealthScore: 0,
            mostPopularPropertyType: '',
            mostCommonTicketReason: '',
            totalImagesInSystem: 0,
            lastUpdated: '',
        },
    },
    loading: false,
    error: null,
    lastFetched: null,
};

// Async thunk to fetch dashboard statistics
export const fetchDashboardStatistics = createAsyncThunk(
    'dashboard/fetchStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/Dashboard/get-dashboard-statistics');
            return response.data.data;
        } catch (error) {
            console.error('Dashboard statistics fetch error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch dashboard statistics'
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearStatistics: (state) => {
            state.statistics = initialState.statistics;
            state.lastFetched = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch dashboard statistics
            .addCase(fetchDashboardStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = {
                    userStatistics: action.payload.userStatistics || initialState.statistics.userStatistics,
                    propertyStatistics: action.payload.propertyStatistics || initialState.statistics.propertyStatistics,
                    ticketStatistics: action.payload.ticketStatistics || initialState.statistics.ticketStatistics,
                    testimonialStatistics: action.payload.testimonialStatistics || initialState.statistics.testimonialStatistics,
                    sliderStatistics: action.payload.sliderStatistics || initialState.statistics.sliderStatistics,
                    socialMediaStatistics: action.payload.socialMediaStatistics || initialState.statistics.socialMediaStatistics,
                    stageStatistics: action.payload.stageStatistics || initialState.statistics.stageStatistics,
                    aboutValueStatistics: action.payload.aboutValueStatistics || initialState.statistics.aboutValueStatistics,
                    systemOverview: action.payload.systemOverview || initialState.statistics.systemOverview,
                };
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchDashboardStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearStatistics } = dashboardSlice.actions;
export default dashboardSlice.reducer;