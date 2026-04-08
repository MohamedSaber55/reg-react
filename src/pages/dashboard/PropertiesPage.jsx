import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchProperties,
    deleteProperty,
    changePropertyStatus,
    setFilters,
    clearFilters,
    setPagination,
} from '@/store/slices/propertySlice';
import { fetchPropertyTypes } from '@/store/slices/propertyTypeSlice';
import { fetchTransactionTypes } from '@/store/slices/transactionTypeSlice';
import {
    FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiX,
    FiSearch, FiDownload,
} from 'react-icons/fi';
import { Button, IconButton } from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { Spinner, Skeleton } from '@/components/common/Spinner';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Link } from 'react-router-dom';
import defaultPropertyImage from '/default-property.jpeg';

export default function PropertiesManagementPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { properties, loading, pagination, filters } = useAppSelector((state) => state.property);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);
    const { transactionTypes } = useAppSelector((state) => state.transactionType);

    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState([]);

    useEffect(() => {
        dispatch(fetchProperties(filters));
        dispatch(fetchPropertyTypes({ pageSize: 100 }));
        dispatch(fetchTransactionTypes({ pageSize: 100 }));
    }, [dispatch]);

    const handleApplyFilters = () => {
        dispatch(setFilters(localFilters));
        dispatch(fetchProperties(localFilters));
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        const defaultFilters = {
            pageNumber: 1,
            pageSize: 10,
            search: '',
        };
        setLocalFilters(defaultFilters);
        dispatch(clearFilters());
        dispatch(fetchProperties(defaultFilters));
    };

    const handleDelete = async () => {
        if (propertyToDelete) {
            await dispatch(deleteProperty(propertyToDelete.id));
            setDeleteModalOpen(false);
            setPropertyToDelete(null);
            dispatch(fetchProperties(filters));
        }
    };

    const handleToggleStatus = async (property) => {
        await dispatch(changePropertyStatus({
            id: property.id,
            isActive: !property.isActive
        }));
        dispatch(fetchProperties(filters));
    };
    // const handleToggleAvailable = async (property) => {
    //     await dispatch(changePropertyAvailability({
    //         id: property.id,
    //         isAvailable: !property.isAvailable
    //     }));
    //     dispatch(fetchProperties(filters));
    // };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchProperties({ ...filters, pageNumber: newPage }));
    };

    const handleSelectProperty = (propertyId) => {
        setSelectedProperties(prev =>
            prev.includes(propertyId)
                ? prev.filter(id => id !== propertyId)
                : [...prev, propertyId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProperties.length === properties.length) {
            setSelectedProperties([]);
        } else {
            setSelectedProperties(properties.map(p => p.id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-5">
                <div>
                    <h1 className="text-3xl font-bold text-third-900   font-serif mb-2">
                        {t('dashboard.properties.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.properties.description')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<FiDownload />}
                        onClick={() => {/* Handle export */ }}
                    >
                        {t('dashboard.properties.export')}
                    </Button>
                    <Link to="/dashboard/properties/create">
                        <Button variant="primary" leftIcon={<FiPlus />}>
                            {t('dashboard.properties.addNew')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-neutral-50 border border-neutral-400 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-third-500" />
                            <input
                                type="text"
                                placeholder={t('dashboard.properties.search')}
                                value={localFilters.search || ''}
                                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleApplyFilters();
                                    }
                                }}
                                className="w-full ps-10 pe-4 py-3 rounded-xl bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-third-900   outline-none transition-all"
                            />
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        leftIcon={<FiFilter />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {t('dashboard.properties.filters')}
                    </Button>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="pt-4 border-t border-neutral-400 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Select
                                label="Property Type"
                                value={localFilters.propertyTypeId || ''}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    propertyTypeId: e.target.value ? parseInt(e.target.value) : null
                                })}
                                options={[
                                    { value: '', label: 'All Types' },
                                    ...propertyTypes.map(type => ({
                                        value: type.id,
                                        label: type.nameEn
                                    }))
                                ]}
                            />
                            <Select
                                label="Transaction Type"
                                value={localFilters.transactionTypeId || ''}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    transactionTypeId: e.target.value ? parseInt(e.target.value) : null
                                })}
                                options={[
                                    { value: '', label: 'All Transactions' },
                                    ...transactionTypes.map(type => ({
                                        value: type.id,
                                        label: type.nameEn
                                    }))
                                ]}
                            />
                            <Input
                                type="number"
                                label="Min Price"
                                placeholder="0"
                                value={localFilters.minPrice || ''}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    minPrice: e.target.value ? parseFloat(e.target.value) : null
                                })}
                            />
                            <Input
                                type="number"
                                label="Max Price"
                                placeholder="0"
                                value={localFilters.maxPrice || ''}
                                onChange={(e) => setLocalFilters({
                                    ...localFilters,
                                    maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                })}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="primary" onClick={handleApplyFilters}>
                                Apply Filters
                            </Button>
                            <Button
                                variant="secondary"
                                leftIcon={<FiX />}
                                onClick={handleClearFilters}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-neutral-400   flex items-center justify-between">
                    <p className="text-sm text-third-500">
                        {t('dashboard.properties.showing')} {properties.length} {t('dashboard.properties.of')} {pagination.totalCount} {t('dashboard.properties.properties')}
                    </p>
                    {selectedProperties.length > 0 && (
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-third-500">
                                {selectedProperties.length} {t('dashboard.properties.selected')}
                            </p>
                            <Button
                                variant="danger"
                                size="sm"
                                leftIcon={<FiTrash2 />}
                                onClick={() => {/* Handle bulk delete */ }}
                            >
                                {t('dashboard.properties.deleteSelected')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-100  border-b border-neutral-400">
                            <tr>
                                <th className="px-6 py-4 text-start">
                                    <input
                                        type="checkbox"
                                        checked={selectedProperties.length === properties.length && properties.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-neutral-400"
                                    />
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.properties')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.type')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.transaction')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.price')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.status')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.availability')}
                                </th>
                                <th className="px-6 py-4 text-end text-sm font-semibold text-third-900">
                                    {t('dashboard.properties.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-neutral-400">
                                        <td className="px-6 py-4" colSpan={7}>
                                            <Skeleton height="60px" />
                                        </td>
                                    </tr>
                                ))
                            ) : properties.length > 0 ? (
                                properties.map((property) => (
                                    <tr
                                        key={property.id}
                                        className="border-b border-neutral-400   hover:bg-neutral-100/50   transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProperties.includes(property.id)}
                                                onChange={() => handleSelectProperty(property.id)}
                                                className="w-4 h-4 rounded border-neutral-400"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={property.images?.[0]?.imageUrl || defaultPropertyImage.src}
                                                    alt={property.titleEn}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="font-semibold text-third-900">
                                                        {property.titleEn}
                                                    </p>
                                                    <p className="text-sm text-third-500">
                                                        {property.location?.cityEn || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="primary" outlined>
                                                {property.propertyTypeName}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="info" outlined>
                                                {property.transactionTypeName}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-third-900">
                                                ${property.price?.toLocaleString() || '0'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(property)}
                                                className="flex items-center gap-2"
                                            >
                                                {property.isActive ? (
                                                    <Badge variant="success">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </button>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleAvailable(property)}
                                                className="flex items-center gap-2"
                                            >
                                                {property.isAvailable ? (
                                                    <Badge variant="success">Available</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Not Available</Badge>
                                                )}
                                            </button>
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/properties/${property.id}`} target="_blank">
                                                    <IconButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<FiEye />}
                                                        aria-label="View"
                                                    />
                                                </Link>
                                                <Link to={`/dashboard/properties/edit/${property.id}`}>
                                                    <IconButton
                                                        variant="ghost"
                                                        size="sm"
                                                        icon={<FiEdit />}
                                                        aria-label="Edit"
                                                    />
                                                </Link>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<FiTrash2 />}
                                                    aria-label="Delete"
                                                    onClick={() => {
                                                        setPropertyToDelete(property);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <p className="text-third-500">
                                            {t('dashboard.noProperties')}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-neutral-400   flex items-center justify-between">
                        <p className="text-sm text-third-500">
                            Page {pagination.pageNumber} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!pagination.hasNextPage}
                                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPropertyToDelete(null);
                }}
                onConfirm={handleDelete}
                title={t('dashboard.properties.delete')}
                message={t('dashboard.properties.deleteConfirm')}
                variant="danger"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
}