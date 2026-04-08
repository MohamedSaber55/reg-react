import React from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/priceUtils';
import defaultPropertyImage from '/default-property.jpeg';

export const UnitModelCard = ({ unit, viewMode = 'grid' }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to unit details - adjust path based on your routing structure
        navigate(`/unit-models/${unit.id}`);
    };

    const mainImage = unit.images?.find(img => img.isMain) || unit.images?.[0];
    const imageUrl = mainImage?.imageUrl || defaultPropertyImage.src;

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={handleClick}
                className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 aspect-video md:aspect-square overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={unit.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultPropertyImage.src;
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-third-900 mb-2 font-serif">
                                    {unit.name}
                                </h3>
                                {unit.modelCode && (
                                    <p className="text-sm text-third-500 mb-2">
                                        {t('units.modelCode', 'Model Code')}: {unit.modelCode}
                                    </p>
                                )}
                                {unit.stageName && (
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                                        {unit.stageName}
                                    </span>
                                )}
                            </div>
                            {unit.isAvailable ? (
                                <span className="px-3 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                                    {t('units.available', 'Available')}
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-error-100 text-error-700 text-xs font-semibold rounded-full">
                                    {t('units.soldOut', 'Sold Out')}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="text-3xl font-bold text-primary-600">
                                {formatPrice(unit.startingPrice, { t, currency: 'models.currency' })}
                            </div>
                            <div className="text-xs text-third-500">{t('units.startingFrom', 'Starting from')}</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <div className="text-xs text-third-500">{t('units.area', 'Area')}</div>
                                <div className="text-lg font-bold text-third-900">{unit.area}m²</div>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <div className="text-xs text-third-500">{t('units.beds', 'Beds')}</div>
                                <div className="text-lg font-bold text-third-900">{unit.bedrooms}</div>
                            </div>
                            <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                <div className="text-xs text-third-500">{t('units.baths', 'Baths')}</div>
                                <div className="text-lg font-bold text-third-900">{unit.bathrooms}</div>
                            </div>
                        </div>

                        {unit.description && (
                            <p className="text-sm text-third-500 mt-4 line-clamp-2">
                                {unit.description}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onClick={handleClick}
            className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
        >
            {/* Image */}
            <div className="aspect-video overflow-hidden">
                <img
                    src={imageUrl}
                    alt={unit.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultPropertyImage.src;
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-third-900 font-serif flex-1">
                        {unit.name}
                    </h3>
                    {unit.isAvailable ? (
                        <span className="px-3 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                            {t('units.available', 'Available')}
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-error-100 text-error-700 text-xs font-semibold rounded-full">
                            {t('units.soldOut', 'Sold Out')}
                        </span>
                    )}
                </div>

                {unit.modelCode && (
                    <div className="mb-2">
                        <span className="text-sm text-third-500">{unit.modelCode}</span>
                    </div>
                )}

                {unit.stageName && (
                    <div className="mb-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                            {unit.stageName}
                        </span>
                    </div>
                )}

                <div className="mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(unit.startingPrice, { t, currency: 'models.currency' })}
                    </div>
                    <div className="text-xs text-third-500">{t('units.startingFrom', 'Starting from')}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.area', 'Area')}</div>
                        <div className="font-bold text-third-900">{unit.area}m²</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.beds', 'Beds')}</div>
                        <div className="font-bold text-third-900">{unit.bedrooms}</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.baths', 'Baths')}</div>
                        <div className="font-bold text-third-900">{unit.bathrooms}</div>
                    </div>
                </div>

                {unit.description && (
                    <p className="text-sm text-third-500 mb-4 line-clamp-2">
                        {unit.description}
                    </p>
                )}

                <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                    {t('units.viewDetails', 'View Details')}
                </button>
            </div>
        </motion.div>
    );
};