import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchDashboardStatistics } from '@/store/slices/dashboardSlice';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiMessageSquare,
    FiStar,
    FiImage,
    FiShare2,
    FiLayers,
    FiHeart,
    FiRefreshCw,
    FiAlertCircle,
} from 'react-icons/fi';
import Loading from '@/components/layout/Loading';
import { formatPrice } from '@/utils/priceUtils';

// Fixed color configuration to avoid dynamic class names
const colorClasses = {
    primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
        bar: 'bg-primary-500',
    },
    success: {
        bg: 'bg-success-100',
        text: 'text-success-600',
        bar: 'bg-success-500',
    },
    accent: {
        bg: 'bg-accent-100',
        text: 'text-accent-600',
        bar: 'bg-accent-500',
    },
    info: {
        bg: 'bg-info-100',
        text: 'text-info-600',
        bar: 'bg-info-500',
    },
    warning: {
        bg: 'bg-warning-100',
        text: 'text-warning-600',
        bar: 'bg-warning-500',
    },
    error: {
        bg: 'bg-error-100',
        text: 'text-error-600',
        bar: 'bg-error-500',
    },
};

export default function DashboardPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { statistics, loading, error, lastFetched } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStatistics());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchDashboardStatistics());
    };

    // Memoized calculations
    const dashboardMetrics = useMemo(() => {
        if (!statistics) return null;

        return {
            propertyActivationRate: statistics.propertyStatistics.totalProperties > 0
                ? ((statistics.propertyStatistics.activeProperties / statistics.propertyStatistics.totalProperties) * 100).toFixed(1)
                : 0,
            ticketResolutionRate: statistics.ticketStatistics.totalTickets > 0
                ? ((statistics.ticketStatistics.closedTickets / statistics.ticketStatistics.totalTickets) * 100).toFixed(1)
                : 0,
            hasRentData: statistics.propertyStatistics.averagePriceForRent > 0,
        };
    }, [statistics]);

    if (loading && !lastFetched) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <FiAlertCircle className="text-6xl text-error-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-third-900 mb-2">{t("dashboard.statistics.noDataAvailable")}</h2>
                    <p className="text-third-500 mb-4">{t("dashboard.statistics.unableToLoadDashboard")}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
                    >
                        {t('dashboard.refresh', 'Refresh')}
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
        const colors = colorClasses[color] || colorClasses.primary;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-all"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                        <Icon className={`text-2xl ${colors.text}`} />
                    </div>
                    {trend && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${trend > 0 ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
                <h3 className="text-3xl font-bold text-third-900 mb-1">{value}</h3>
                <p className="text-sm text-third-500">{title}</p>
                {subtitle && (
                    <p className="text-xs text-third-400 mt-2">{subtitle}</p>
                )}
            </motion.div>
        );
    };

    const ChartCard = ({ title, data, valueKey = 'count', labelKey = 'nameEn', showPercentage = true, color = 'primary' }) => {
        const colors = colorClasses[color] || colorClasses.primary;

        if (!data || data.length === 0) {
            return (
                <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h3 className="text-lg font-bold text-third-900 mb-4">{title}</h3>
                    <p className="text-sm text-third-400 text-center py-8">{t("dashboard.statistics.noDataAvailable")}</p>
                </div>
            );
        }

        // Sort data by count descending and take top 5
        const topData = [...data]
            .sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0))
            .slice(0, 5);

        return (
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h3 className="text-lg font-bold text-third-900 mb-4">{title}</h3>
                <div className="space-y-3">
                    {topData.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-third-600 truncate flex-1">
                                    {item[labelKey] || 'N/A'}
                                </span>
                                <span className="font-semibold text-third-900 ms-2">
                                    {item[valueKey]?.toLocaleString() || 0}
                                    {showPercentage && item.percentage ? ` (${item.percentage.toFixed(1)}%)` : ''}
                                </span>
                            </div>
                            {showPercentage && item.percentage && (
                                <div className="w-full bg-neutral-100 rounded-full h-2">
                                    <div
                                        className={`${colors.bar} h-2 rounded-full transition-all duration-300`}
                                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    {data.length > 5 && (
                        <p className="text-xs text-third-400 text-center pt-2">
                            +{data.length - 5} {t("dashboard.statistics.moreItems")}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const MetricBadge = ({ label, value, color = 'primary' }) => {
        const colors = colorClasses[color] || colorClasses.primary;

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${colors.bg}`}>
                <span className="text-xs text-third-600">{label}:</span>
                <span className={`text-sm font-bold ${colors.text}`}>{value}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
            <div className="">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-third-900 mb-2">
                            {t('dashboard.statistics.title', 'Dashboard')}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            {lastFetched && (
                                <p className="text-sm text-third-500">
                                    {t('dashboard.statistics.lastUpdated', 'Last updated')}: {new Date(lastFetched).toLocaleString()}
                                </p>
                            )}
                            {dashboardMetrics && (
                                <>
                                    <MetricBadge
                                        label={t('dashboard.statistics.systemHealth', 'System Health')}
                                        value={`${statistics.systemOverview.systemHealthScore}%`}
                                        color="success"
                                    />
                                    <MetricBadge
                                        label={t('dashboard.statistics.totalEntities', 'Total Entities')}
                                        value={statistics.systemOverview.totalEntities}
                                        color="info"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                        {t('dashboard.statistics.refresh', 'Refresh')}
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6 flex items-center gap-3"
                    >
                        <FiAlertCircle className="text-error-700 text-xl shrink-0" />
                        <p className="text-error-700">{error}</p>
                    </motion.div>
                )}

                {/* Property Statistics */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-third-900 mb-4">
                        {t('dashboard.statistics.properties', 'Property Statistics')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title={t('dashboard.statistics.totalProperties', 'Total Properties')}
                            value={statistics.propertyStatistics.totalProperties.toLocaleString()}
                            icon={FiHome}
                            color="primary"
                            subtitle={`${statistics.propertyStatistics.totalPropertiesForSale} ${t('dashboard.statistics.forSale')}`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.activeProperties', 'Active Properties')}
                            value={statistics.propertyStatistics.activeProperties.toLocaleString()}
                            icon={FiHome}
                            color="success"
                            trend={dashboardMetrics?.propertyActivationRate}
                        />
                        <StatCard
                            title={t('dashboard.statistics.avgSalePrice', 'Avg Sale Price')}
                            value={formatPrice(statistics.propertyStatistics.averagePriceForSale, { currency: t("models.currency") }) || 'N/A'}
                            icon={FiHome}
                            color="accent"
                            subtitle={`${t("dashboard.statistics.min")}: ${formatPrice(statistics.propertyStatistics.minPriceForSale, { currency: t("models.currency") }) || 'N/A'}`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.maxSalePrice', 'Max Sale Price')}
                            value={formatPrice(statistics.propertyStatistics.maxPriceForSale, { currency: t("models.currency") }) || 'N/A'}
                            icon={FiHome}
                            color="info"
                            subtitle={`${statistics.propertyStatistics.propertiesWithImages} ${t('dashboard.statistics.withImages')}`}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ChartCard
                            title={t('dashboard.statistics.topPropertiesByType', 'Top Property Types')}
                            data={statistics.propertyStatistics.propertiesByType}
                            color="primary"
                        />
                        <ChartCard
                            title={t('dashboard.statistics.topPropertiesByTransaction', 'Top Transaction Types')}
                            data={statistics.propertyStatistics.propertiesByTransaction}
                            color="accent"
                        />
                        <ChartCard
                            title={t('dashboard.statistics.topPropertiesByStatus', 'Top Property Status')}
                            data={statistics.propertyStatistics.propertiesByStatus}
                            color="success"
                        />
                    </div>
                </section>

                {/* Ticket Statistics */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-third-900 mb-4">
                        {t('dashboard.statistics.tickets', 'Ticket Statistics')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title={t('dashboard.statistics.totalTickets', 'Total Tickets')}
                            value={statistics.ticketStatistics.totalTickets.toLocaleString()}
                            icon={FiMessageSquare}
                            color="primary"
                            subtitle={`${statistics.ticketStatistics.ticketsThisMonth} this month`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.pendingTickets', 'Pending Tickets')}
                            value={statistics.ticketStatistics.pendingTickets.toLocaleString()}
                            icon={FiMessageSquare}
                            color="warning"
                            subtitle={`${statistics.ticketStatistics.ticketsToday} today`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.inProgressTickets', 'In Progress')}
                            value={statistics.ticketStatistics.inProgressTickets.toLocaleString()}
                            icon={FiMessageSquare}
                            color="info"
                        />
                        <StatCard
                            title={t('dashboard.statistics.closedTickets', 'Closed Tickets')}
                            value={statistics.ticketStatistics.closedTickets.toLocaleString()}
                            icon={FiMessageSquare}
                            color="success"
                            trend={dashboardMetrics?.ticketResolutionRate}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ChartCard
                            title={t('dashboard.statistics.ticketsByStatus', 'Tickets by Status')}
                            data={statistics.ticketStatistics.ticketsByStatus}
                            color="info"
                        />
                        <ChartCard
                            title={t('dashboard.statistics.ticketsByReason', 'Tickets by Reason')}
                            data={statistics.ticketStatistics.ticketsByReason}
                            color="warning"
                        />
                    </div>
                </section>

                {/* Testimonial Statistics */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-third-900 mb-4">
                        {t('dashboard.statistics.testimonials', 'Testimonial Statistics')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title={t('dashboard.statistics.totalTestimonials', 'Total Testimonials')}
                            value={statistics.testimonialStatistics.totalTestimonials.toLocaleString()}
                            icon={FiStar}
                            color="primary"
                            subtitle={`${statistics.testimonialStatistics.testimonialsThisMonth} this month`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.activeTestimonials', 'Active')}
                            value={statistics.testimonialStatistics.activeTestimonials.toLocaleString()}
                            icon={FiStar}
                            color="success"
                        />
                        <StatCard
                            title={t('dashboard.statistics.avgRating', 'Average Rating')}
                            value={`${statistics.testimonialStatistics.averageRating.toFixed(1)} ⭐`}
                            icon={FiStar}
                            color="warning"
                        />
                        <StatCard
                            title={t('dashboard.statistics.pendingTestimonials', 'Pending')}
                            value={statistics.testimonialStatistics.pendingTestimonials.toLocaleString()}
                            icon={FiStar}
                            color="info"
                        />
                    </div>
                    <ChartCard
                        title={t('dashboard.statistics.ratingDistribution', 'Rating Distribution')}
                        data={statistics.testimonialStatistics.ratingDistribution}
                        labelKey="rating"
                        color="warning"
                    />
                </section>

                {/* Additional Statistics Grid */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-third-900 mb-4">
                        {t('dashboard.statistics.additionalStats', 'Additional Statistics')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title={t('dashboard.statistics.totalSliders', 'Total Sliders')}
                            value={statistics.sliderStatistics.totalSliders.toLocaleString()}
                            icon={FiImage}
                            color="primary"
                            subtitle={`${statistics.sliderStatistics.totalSliderImages} ${t('dashboard.statistics.totalImages')}`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.socialMediaPlatforms', 'Social Platforms')}
                            value={statistics.socialMediaStatistics.totalActivePlatforms.toLocaleString()}
                            icon={FiShare2}
                            color="accent"
                            subtitle={`${statistics.socialMediaStatistics.totalSocialMediaLinks} ${t('dashboard.statistics.totalLinks')}`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.totalStages', 'Total Stages')}
                            value={statistics.stageStatistics.totalStages.toLocaleString()}
                            icon={FiLayers}
                            color="info"
                            subtitle={`${statistics.stageStatistics.totalUnitModels} ${t('dashboard.statistics.unitModels')}`}
                        />
                        <StatCard
                            title={t('dashboard.statistics.aboutValues', 'About Values')}
                            value={statistics.aboutValueStatistics.totalAboutValues.toLocaleString()}
                            icon={FiHeart}
                            color="success"
                            subtitle={`${statistics.aboutValueStatistics.activeAboutValues} ${t('dashboard.statistics.active')}`}
                        />
                    </div>
                </section>

                {/* System Overview */}
                <section className="bg-white rounded-2xl p-6 border border-neutral-200">
                    <h2 className="text-xl font-bold text-third-900 mb-6">
                        {t('dashboard.statistics.systemOverview', 'System Overview')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="border-s-4 border-primary-500 ps-4">
                            <p className="text-sm text-third-500 mb-1">
                                {t('dashboard.statistics.totalEntities', 'Total Entities')}
                            </p>
                            <p className="text-2xl font-bold text-third-900">
                                {statistics.systemOverview.totalEntities.toLocaleString()}
                            </p>
                            <p className="text-xs text-third-400 mt-1">
                                {statistics.systemOverview.totalActiveEntities} active
                            </p>
                        </div>
                        <div className="border-s-4 border-success-500 ps-4">
                            <p className="text-sm text-third-500 mb-1">
                                {t('dashboard.statistics.systemHealth', 'System Health')}
                            </p>
                            <p className="text-2xl font-bold text-success-600">
                                {statistics.systemOverview.systemHealthScore}%
                            </p>
                            <p className="text-xs text-third-400 mt-1">
                                {t('dashboard.statistics.excellentStatus', 'Excellent status')}
                            </p>
                        </div>
                        <div className="border-s-4 border-accent-500 ps-4">
                            <p className="text-sm text-third-500 mb-1">
                                {t('dashboard.statistics.totalImages', 'Total Images')}
                            </p>
                            <p className="text-2xl font-bold text-third-900">
                                {statistics.systemOverview.totalImagesInSystem.toLocaleString()}
                            </p>
                            <p className="text-xs text-third-400 mt-1">
                                {t('dashboard.statistics.acrossAllEntities', 'Across all entities')}
                            </p>
                        </div>
                        <div className="border-s-4 border-info-500 ps-4">
                            <p className="text-sm text-third-500 mb-1">
                                {t('dashboard.statistics.popularPropertyType', 'Most Popular')}
                            </p>
                            <p className="text-lg font-bold text-third-900 truncate">
                                {statistics.systemOverview.mostPopularPropertyType || 'N/A'}
                            </p>
                            <p className="text-xs text-third-400 mt-1">
                                {t('dashboard.statistics.propertyTypes', 'Property Types')}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                        <p className="text-xs text-third-400">
                            {t("dashboard.statistics.lastSystemUpdate")}: {new Date(statistics.systemOverview.lastUpdated).toLocaleString()}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}