import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { Button, IconButton } from '@/components/common/Button';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import { Skeleton } from '@/components/common/Spinner';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination';

export default function CRUDTable({
    title,
    description,
    data = [],
    columns = [],
    loading = false,
    pagination = {},
    onPageChange,
    onSearch,
    onCreate,
    onEdit,
    onDelete,
    renderForm,
    searchPlaceholder = 'Search...'
}) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToEdit, setItemToEdit] = useState(null);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleCreate = () => {
        setItemToEdit(null);
        setFormModalOpen(true);
    };

    const handleEdit = (item) => {
        setItemToEdit(item);
        setFormModalOpen(true);
    };

    const handleDelete = async () => {
        if (itemToDelete && onDelete) {
            await onDelete(itemToDelete.id);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleFormSubmit = async (formData) => {
        if (itemToEdit) {
            if (onEdit) {
                await onEdit(itemToEdit.id, formData);
            }
        } else {
            if (onCreate) {
                await onCreate(formData);
            }
        }
        setFormModalOpen(false);
        setItemToEdit(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-5">
                <div>
                    <h1 className="text-3xl font-bold text-third-900 font-serif mb-2">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-third-500">
                            {description}
                        </p>
                    )}
                </div>
                <Button variant="primary" leftIcon={<FiPlus />} onClick={handleCreate}>
                    {t('dashboard.crud.addNew')}
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                <div className="relative">
                    <FiSearch className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-third-500" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder || t('dashboard.crud.search')}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full ps-10 pe-4 py-3 rounded-xl bg-neutral-50 border border-neutral-400   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-third-900   outline-none transition-all"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-100  border-b border-neutral-400">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-4 text-start text-sm font-semibold text-third-900"
                                    >
                                        {column.header}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-end text-sm font-semibold text-third-900">
                                    {t('dashboard.crud.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-neutral-400">
                                        <td className="px-6 py-4" colSpan={columns.length + 1}>
                                            <Skeleton height="40px" />
                                        </td>
                                    </tr>
                                ))
                            ) : data.length > 0 ? (
                                data.map((item, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b border-neutral-400   hover:bg-neutral-100/50   transition-colors"
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4">
                                                {column.render ? column.render(item) : item[column.field]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<FiEdit />}
                                                    aria-label={t('dashboard.common.edit')}
                                                    onClick={() => handleEdit(item)}
                                                />
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<FiTrash2 />}
                                                    aria-label={t('dashboard.common.delete')}
                                                    onClick={() => {
                                                        setItemToDelete(item);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                        <p className="text-third-500">
                                            {t('dashboard.crud.noData')}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <Pagination
                        currentPage={pagination.pageNumber}
                        totalPages={pagination.totalPages}
                        totalCount={pagination.totalCount}
                        pageSize={pagination.pageSize}
                        hasPreviousPage={pagination.hasPreviousPage}
                        hasNextPage={pagination.hasNextPage}
                        onPageChange={onPageChange}
                    />
                )}
            </div>

            {/* Form Modal */}
            {renderForm && (
                <Modal
                    isOpen={formModalOpen}
                    onClose={() => {
                        setFormModalOpen(false);
                        setItemToEdit(null);
                    }}
                    title={itemToEdit ? t('dashboard.crud.edit') : t('dashboard.crud.addNew')}
                    size="md"
                >
                    {renderForm({
                        item: itemToEdit,
                        onSubmit: handleFormSubmit,
                        onCancel: () => {
                            setFormModalOpen(false);
                            setItemToEdit(null);
                        }
                    })}
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDelete}
                title={t('dashboard.crud.deleteTitle')}
                message={t('dashboard.crud.deleteConfirm')}
                variant="danger"
                confirmText={t('dashboard.crud.delete')}
                cancelText={t('dashboard.crud.cancel')}
            />
        </div>
    );
}