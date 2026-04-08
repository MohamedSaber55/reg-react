// app/(dashboard)/dashboard/hero-sections/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchHeroSections,
    updateHeroSection,
    createHeroSection,
} from '@/store/slices/heroSectionSlice';
import HeroSectionForm from '@/dashboard/components/HeroSectionForm';
import { Button } from '@/components/common/Button';

import {
    FiImage,
    FiTrendingUp,
    FiUsers,
    FiMapPin,
    FiAward,
    FiCalendar,
    FiExternalLink,
    FiEdit2,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import { Skeleton } from '@/components/common/Spinner';

export default function HeroSectionsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { heroSections, loading } = useAppSelector((state) => state.heroSection);
    const [isEditing, setIsEditing] = useState(false);
    const [activeHeroSection, setActiveHeroSection] = useState(null);

    useEffect(() => {
        dispatch(fetchHeroSections());
    }, [dispatch]);

    useEffect(() => {
        if (heroSections && heroSections.length > 0) {
            // Assuming you have only one hero section
            const hero = heroSections[0];
            setActiveHeroSection(hero);
        }
    }, [heroSections]);

    const handleSubmit = async (formData) => {
        if (activeHeroSection) {
            await dispatch(updateHeroSection({
                id: activeHeroSection.id,
                formData
            })).unwrap();
        } else {
            await dispatch(createHeroSection(formData)).unwrap();
        }
        setIsEditing(false);
        dispatch(fetchHeroSections());
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!activeHeroSection && !isEditing) {
        return (
            <EmptyState onCreate={() => setIsEditing(true)} t={t} />
        );
    }

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-third-900">
                            {activeHeroSection ? t('dashboard.heroSections.editTitle') : t('dashboard.heroSections.createTitle')}
                        </h1>
                        <p className="text-third-600 mt-1">
                            {activeHeroSection ? t('dashboard.heroSections.editDescription') : t('dashboard.heroSections.createDescription')}
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        {t('dashboard.forms.cancel')}
                    </Button>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <HeroSectionForm
                        item={activeHeroSection}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-third-900">
                        {t('dashboard.heroSections.title')}
                    </h1>
                    <p className="text-third-600 mt-1">
                        {t('dashboard.heroSections.description')}
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<FiEdit2 />}
                >
                    {t('dashboard.heroSections.edit')}
                </Button>
            </div>

            {/* Hero Section Preview Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Image Section */}
                <div className="relative h-64 bg-linear-to-r from-primary-50 to-secondary-50">
                    {activeHeroSection?.imageUrl ? (
                        <img
                            src={activeHeroSection.imageUrl}
                            alt={activeHeroSection.titleEn}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FiImage className="text-6xl text-third-300" />
                        </div>
                    )}
                    <div className="absolute bottom-4 inset-s-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                        <span className="flex items-center gap-2 text-sm">
                            {activeHeroSection?.isActive ? (
                                <>
                                    <FiEye className="text-success-600" />
                                    <span className="text-success-700 font-medium">
                                        {t('dashboard.common.active')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FiEyeOff className="text-error-600" />
                                    <span className="text-error-700 font-medium">
                                        {t('dashboard.common.inactive')}
                                    </span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-6">
                    {/* Title & Description */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-third-900">
                                {activeHeroSection?.titleEn}
                            </h2>
                            {activeHeroSection?.subTitleEn && (
                                <p className="text-lg text-third-600">
                                    {activeHeroSection.subTitleEn}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2" dir="rtl">
                            <h2 className="text-2xl font-bold text-third-900">
                                {activeHeroSection?.titleAr}
                            </h2>
                            {activeHeroSection?.subTitleAr && (
                                <p className="text-lg text-third-600">
                                    {activeHeroSection.subTitleAr}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeHeroSection?.descriptionEn && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-third-500 uppercase">
                                        {t('dashboard.forms.descriptionEn')}
                                    </h3>
                                    <p className="text-third-700">
                                        {activeHeroSection.descriptionEn}
                                    </p>
                                </div>
                            )}
                            {activeHeroSection?.descriptionAr && (
                                <div className="space-y-2" dir="rtl">
                                    <h3 className="text-sm font-semibold text-third-500 uppercase">
                                        {t('dashboard.forms.descriptionAr')}
                                    </h3>
                                    <p className="text-third-700">
                                        {activeHeroSection.descriptionAr}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Buttons Preview */}
                    {(activeHeroSection?.primaryCtaTitleEn || activeHeroSection?.secondaryCtaTitleEn) && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-third-500 uppercase">
                                {t('dashboard.heroSections.ctaButtons')}
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {activeHeroSection?.primaryCtaTitleEn && (
                                    <a
                                        href={activeHeroSection.primaryCtaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        <span>{activeHeroSection.primaryCtaTitleEn}</span>
                                        <FiExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                {activeHeroSection?.secondaryCtaTitleEn && (
                                    <a
                                        href={activeHeroSection.secondaryCtaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white border border-third-300 text-third-700 px-4 py-2 rounded-lg hover:bg-third-50 transition-colors"
                                    >
                                        <span>{activeHeroSection.secondaryCtaTitleEn}</span>
                                        <FiExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Statistics Grid */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-third-500 uppercase">
                            {t('dashboard.heroSections.statistics')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {activeHeroSection?.propertiesSold > 0 && (
                                <StatCard
                                    icon={<FiTrendingUp className="text-success-600" />}
                                    value={activeHeroSection.propertiesSold}
                                    label={t('dashboard.heroSections.sold')}
                                    color="text-success-700"
                                />
                            )}
                            {activeHeroSection?.propertiesRented > 0 && (
                                <StatCard
                                    icon={<FiTrendingUp className="text-info-600" />}
                                    value={activeHeroSection.propertiesRented}
                                    label={t('dashboard.heroSections.rented')}
                                    color="text-info-700"
                                />
                            )}
                            {activeHeroSection?.happyClients > 0 && (
                                <StatCard
                                    icon={<FiUsers className="text-primary-600" />}
                                    value={activeHeroSection.happyClients}
                                    label={t('dashboard.heroSections.clients')}
                                    color="text-primary-700"
                                />
                            )}
                            {activeHeroSection?.citiesCovered > 0 && (
                                <StatCard
                                    icon={<FiMapPin className="text-accent-600" />}
                                    value={activeHeroSection.citiesCovered}
                                    label={t('dashboard.heroSections.cities')}
                                    color="text-accent-700"
                                />
                            )}
                            {activeHeroSection?.satisfactionRate > 0 && (
                                <StatCard
                                    icon={<FiAward className="text-warning-600" />}
                                    value={`${activeHeroSection.satisfactionRate}%`}
                                    label={t('dashboard.heroSections.satisfaction')}
                                    color="text-warning-700"
                                />
                            )}
                            {activeHeroSection?.initYear > 0 && (
                                <StatCard
                                    icon={<FiCalendar className="text-third-600" />}
                                    value={activeHeroSection.initYear}
                                    label={t('dashboard.heroSections.since')}
                                    color="text-third-700"
                                />
                            )}
                        </div>
                    </div>

                    {/* Experience Years */}
                    {activeHeroSection?.yearsExperience !== undefined && activeHeroSection.yearsExperience !== null && (
                        <div className="bg-linear-to-r from-primary-50 to-secondary-50 rounded-xl p-6 text-center">
                            <div className="inline-flex flex-col items-center">
                                <span className="text-5xl font-bold text-primary-600">
                                    {activeHeroSection.yearsExperience}
                                </span>
                                <span className="text-lg font-medium text-third-700 mt-2">
                                    {t('dashboard.heroSections.yearsExperience')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, value, label, color }) {
    return (
        <div className="bg-third-50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2">
                <div className="text-2xl">{icon}</div>
            </div>
            <div className={`text-2xl font-bold ${color}`}>
                {value}
            </div>
            <div className="text-sm text-third-600 mt-1">
                {label}
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({ onCreate, t }) {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-third-100 rounded-full flex items-center justify-center mb-6">
                <FiImage className="text-4xl text-third-400" />
            </div>
            <h3 className="text-xl font-semibold text-third-900 mb-2">
                {t('dashboard.heroSections.noHeroSection')}
            </h3>
            <p className="text-third-600 mb-6 max-w-md mx-auto">
                {t('dashboard.heroSections.noHeroSectionDescription')}
            </p>
            <Button
                variant="primary"
                onClick={onCreate}
                leftIcon={<FiEdit2 />}
            >
                {t('dashboard.heroSections.createHeroSection')}
            </Button>
        </div>
    );
}

// Loading Skeleton
function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}