import React from 'react';

export function ProjectCardSkeleton({ viewMode }) {
    const isListMode = viewMode === 'list';

    // Grid View Skeleton
    const GridSkeleton = () => (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-4/3 w-full bg-neutral-300" />

            {/* Content Skeleton */}
            <div className="p-6">
                {/* Title */}
                <div className="h-6 bg-neutral-300 rounded-lg mb-4 w-3/4" />

                {/* Description */}
                <div className="space-y-2 mb-6">
                    <div className="h-4 bg-neutral-300 rounded w-full" />
                    <div className="h-4 bg-neutral-300 rounded w-2/3" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-neutral-300 rounded-lg" />
                            <div className="space-y-1">
                                <div className="h-3 bg-neutral-300 rounded w-16" />
                                <div className="h-4 bg-neutral-300 rounded w-10" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="h-12 bg-neutral-300 rounded-lg w-full" />
            </div>
        </div>
    );

    // List View Skeleton
    const ListSkeleton = () => (
        <div className="flex gap-4 bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="w-64 shrink-0">
                <div className="relative aspect-4/3 w-full bg-neutral-300" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                        <div className="h-7 bg-neutral-300 rounded-lg w-48" />
                        <div className="h-4 bg-neutral-300 rounded w-32" />
                    </div>
                    <div className="h-6 bg-neutral-300 rounded-full w-16" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-neutral-300 rounded-lg" />
                            <div className="space-y-1">
                                <div className="h-3 bg-neutral-300 rounded w-16" />
                                <div className="h-4 bg-neutral-300 rounded w-10" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Button */}
                <div className="h-12 bg-neutral-300 rounded-lg w-full max-w-xs" />
            </div>
        </div>
    );

    return isListMode ? <ListSkeleton /> : <GridSkeleton />;
}

// Skeleton for Unit Cards
export function UnitModelCardSkeleton({ viewMode }) {
    const isListMode = viewMode === 'list';

    const GridSkeleton = () => (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden animate-pulse">
            {/* Image with badge */}
            <div className="relative aspect-4/3 w-full bg-neutral-300">
                <div className="absolute top-3 inset-e-3">
                    <div className="h-6 bg-neutral-400 rounded-full w-20" />
                </div>
            </div>

            <div className="p-6">
                {/* Header with code */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-neutral-300 rounded-lg w-3/4" />
                    <div className="h-5 bg-neutral-300 rounded w-16" />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                            <div className="w-8 h-8 bg-neutral-300 rounded" />
                            <div className="space-y-1">
                                <div className="h-3 bg-neutral-300 rounded w-12" />
                                <div className="h-4 bg-neutral-300 rounded w-8" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price and button */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-7 bg-neutral-300 rounded w-32" />
                        <div className="h-3 bg-neutral-300 rounded w-20" />
                    </div>
                    <div className="h-10 bg-neutral-300 rounded-lg w-28" />
                </div>
            </div>
        </div>
    );

    const ListSkeleton = () => (
        <div className="flex gap-4 bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden animate-pulse">
            {/* Image */}
            <div className="w-64 shrink-0">
                <div className="relative aspect-4/3 w-full bg-neutral-300">
                    <div className="absolute top-3 inset-e-3">
                        <div className="h-6 bg-neutral-400 rounded-full w-20" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-2">
                        <div className="h-7 bg-neutral-300 rounded-lg w-48" />
                        <div className="h-4 bg-neutral-300 rounded w-32" />
                    </div>
                    <div className="h-5 bg-neutral-300 rounded w-16" />
                </div>

                {/* Specs - 2 columns in list view */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                            <div className="w-8 h-8 bg-neutral-300 rounded" />
                            <div className="space-y-1">
                                <div className="h-3 bg-neutral-300 rounded w-12" />
                                <div className="h-4 bg-neutral-300 rounded w-8" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price and button */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-7 bg-neutral-300 rounded w-32" />
                        <div className="h-3 bg-neutral-300 rounded w-20" />
                    </div>
                    <div className="h-10 bg-neutral-300 rounded-lg w-28" />
                </div>
            </div>
        </div>
    );

    return isListMode ? <ListSkeleton /> : <GridSkeleton />;
}

// Generic Skeleton Loader (for details pages)
export function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-50 animate-pulse">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                            <div className="space-y-4">
                                <div className="w-full aspect-video bg-neutral-300 rounded-2xl" />
                                <div className="grid grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="aspect-video bg-neutral-300 rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                            <div className="h-10 bg-neutral-300 rounded-lg mb-4 w-3/4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-300 rounded w-full" />
                                <div className="h-4 bg-neutral-300 rounded w-2/3" />
                            </div>
                            <div className="flex items-center gap-6 pt-4 border-t border-neutral-400 mt-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-neutral-300 rounded-lg" />
                                        <div className="space-y-1">
                                            <div className="h-3 bg-neutral-300 rounded w-16" />
                                            <div className="h-4 bg-neutral-300 rounded w-10" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content sections */}
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                                <div className="h-7 bg-neutral-300 rounded-lg mb-4 w-1/3" />
                                <div className="space-y-2">
                                    <div className="h-4 bg-neutral-300 rounded w-full" />
                                    <div className="h-4 bg-neutral-300 rounded w-11/12" />
                                    <div className="h-4 bg-neutral-300 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                            <div className="h-7 bg-neutral-300 rounded-lg mb-6 w-2/3" />

                            <div className="space-y-4 mb-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-neutral-300 rounded w-1/4" />
                                        <div className="h-12 bg-neutral-300 rounded-xl" />
                                    </div>
                                ))}
                            </div>

                            <div className="h-12 bg-neutral-300 rounded-xl w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}