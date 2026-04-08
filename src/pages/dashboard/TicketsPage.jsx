import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchTickets,
    changeTicketStatus,
    deleteTickets,
    setPagination,
    fetchTicketStatuses
} from '@/store/slices/ticketSlice';
import { FiEye, FiTrash2, FiSearch, FiMail, FiPhone } from 'react-icons/fi';
import { Button, IconButton } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Skeleton } from '@/components/common/Spinner';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import { Select } from '@/components/common/Input';

export default function TicketsPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { tickets, loading, pagination, ticketStatuses } = useAppSelector((state) => state.ticket);
    const isRTL = i18n.language == "ar"
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [ticketToView, setTicketToView] = useState(null);

    useEffect(() => {
        dispatch(fetchTickets({ pageNumber: 1, pageSize: 10 }));
        dispatch(fetchTicketStatuses({}));
    }, [dispatch]);

    console.log(ticketStatuses);


    const handleSearch = (value) => {
        setSearchQuery(value);
        dispatch(fetchTickets({ pageNumber: 1, pageSize: 10, search: value }));
    };

    const handleStatusChange = async (ticketId, statusId) => {
        await dispatch(changeTicketStatus({ ticketId, statusId })).unwrap();
        dispatch(fetchTickets({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }));
    };

    const handleDelete = async () => {
        if (ticketToDelete) {
            await dispatch(deleteTickets([ticketToDelete.id])).unwrap();
            setDeleteModalOpen(false);
            setTicketToDelete(null);
            dispatch(fetchTickets({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }));
        }
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchTickets({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const getStatusBadge = (statusId) => {
        const status = ticketStatuses.find(s => s.id === statusId);
        const label = typeof window !== 'undefined' && document.documentElement.lang === 'ar'
            ? status?.nameAr || '—'
            : status?.nameEn || '—';

        // Optional: map variant by name or ID
        const variantMap = {
            1: 'warning', // Open
            2: 'info',    // In Progress
            3: 'error',   // Closed
        };

        const variant = variantMap[statusId] || 'secondary';

        return <Badge variant={variant}>{label}</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-third-900   font-serif mb-2">
                        {t('dashboard.ticketsPage.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.ticketsPage.description')}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                <div className="relative">
                    <FiSearch className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-third-500" />
                    <input
                        type="text"
                        placeholder={t('dashboard.ticketsPage.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full ps-10 pe-4 py-3 rounded-xl bg-neutral-50  border-neutral-400   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-third-900   outline-none transition-all"
                    />
                </div>
                <div className="mt-4 text-sm text-third-500">
                    <p>{t('dashboard.ticketsPage.showing', { count: tickets.length, total: pagination.totalCount })}</p>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-100  border-b border-neutral-400">
                            <tr>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.ticketsPage.columns.customer')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.ticketsPage.columns.message')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.ticketsPage.columns.reason')}
                                </th>
                                <th className="px-6 py-4 text-start text-sm font-semibold text-third-900">
                                    {t('dashboard.ticketsPage.columns.status')}
                                </th>
                                <th className="px-6 py-4 text-end text-sm font-semibold text-third-900">
                                    {t('dashboard.ticketsPage.columns.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-neutral-400">
                                        <td className="px-6 py-4" colSpan={5}>
                                            <Skeleton height="60px" />
                                        </td>
                                    </tr>
                                ))
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        className="border-b border-neutral-400   hover:bg-neutral-100/50   transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-third-900">
                                                    {ticket.name}
                                                </p>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    {ticket.emails?.[0]?.address && (
                                                        <p className="text-xs text-third-500   flex items-center gap-1">
                                                            <FiMail className="w-3 h-3" />
                                                            {ticket.emails[0].address}
                                                        </p>
                                                    )}
                                                    {ticket.phones?.[0]?.number && (
                                                        <p className="text-xs text-third-500   flex items-center gap-1">
                                                            <FiPhone className="w-3 h-3" />
                                                            {ticket.phones[0].number}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-third-900   line-clamp-2">
                                                {ticket.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="primary" outlined>
                                                {ticket.ticketReason?.nameEn || t('dashboard.ticketsPage.general')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Select
                                                value={ticket.ticketStatus?.id || ''}
                                                onChange={(e) => handleStatusChange(ticket.id, parseInt(e.target.value))}
                                                options={ticketStatuses.map(status => ({
                                                    value: status.id,
                                                    label: isRTL ? status.nameAr : status.nameEn
                                                }))}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<FiEye />}
                                                    aria-label={t('dashboard.ticketsPage.view')}
                                                    onClick={() => {
                                                        setTicketToView(ticket);
                                                        setViewModalOpen(true);
                                                    }}
                                                />
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<FiTrash2 />}
                                                    aria-label={t('dashboard.common.delete')}
                                                    onClick={() => {
                                                        setTicketToDelete(ticket);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <p className="text-third-500">
                                            {t('dashboard.ticketsPage.noTickets')}
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
                            {t('dashboard.ticketsPage.pagination.page', {
                                current: pagination.pageNumber,
                                total: pagination.totalPages
                            })}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => handlePageChange(pagination.pageNumber - 1)}
                            >
                                {t('dashboard.ticketsPage.pagination.previous')}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={!pagination.hasNextPage}
                                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                            >
                                {t('dashboard.ticketsPage.pagination.next')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Ticket Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setTicketToView(null);
                }}
                title={t('dashboard.ticketsPage.viewModal.title')}
                size="md"
            >
                {ticketToView && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-third-500   mb-1">
                                {t('dashboard.ticketsPage.viewModal.customerName')}
                            </h3>
                            <p className="text-third-900">{ticketToView.name}</p>
                        </div>
                        {ticketToView.emails?.[0]?.address && (
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-1">
                                    {t('dashboard.ticketsPage.viewModal.email')}
                                </h3>
                                <p className="text-third-900">{ticketToView.emails[0].address}</p>
                            </div>
                        )}
                        {ticketToView.phones?.[0]?.number && (
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-1">
                                    {t('dashboard.ticketsPage.viewModal.phone')}
                                </h3>
                                <p className="text-third-900">{ticketToView.phones[0].number}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold text-third-500   mb-1">
                                {t('dashboard.ticketsPage.viewModal.reason')}
                            </h3>
                            <p className="text-third-900">
                                {ticketToView.ticketReason?.nameEn || t('dashboard.ticketsPage.viewModal.generalInquiry')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-third-500   mb-1">
                                {t('dashboard.ticketsPage.viewModal.message')}
                            </h3>
                            <p className="text-third-900   whitespace-pre-wrap">
                                {ticketToView.message}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-third-500   mb-1">
                                {t('dashboard.ticketsPage.viewModal.status')}
                            </h3>
                            {getStatusBadge(ticketToView.ticketStatus?.id)}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTicketToDelete(null);
                }}
                onConfirm={handleDelete}
                title={t('dashboard.ticketsPage.deleteModal.title')}
                message={t('dashboard.ticketsPage.deleteModal.message', { name: ticketToDelete?.name })}
                variant="danger"
                confirmText={t('dashboard.common.delete')}
                cancelText={t('dashboard.forms.cancel')}
            />
        </div>
    );
}