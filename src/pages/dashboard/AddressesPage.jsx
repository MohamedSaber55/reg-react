// app/(dashboard)/dashboard/addresses/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from '@/store/slices/addressSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import AddressForm from '@/dashboard/components/AddressForm';
import { FiMapPin, FiGlobe } from 'react-icons/fi';

export default function AddressesPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { addresses, loading } = useAppSelector((state) => state.address);
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createAddress(formData)).unwrap();
        dispatch(fetchAddresses());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateAddress({ id, data: formData })).unwrap();
        dispatch(fetchAddresses());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteAddress(id)).unwrap();
        dispatch(fetchAddresses());
    };

    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    const columns = [
        {
            header: t('dashboard.addresses.columns.country'),
            field: 'country',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100   flex items-center justify-center">
                        <FiGlobe className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-third-900">
                            {getLocalizedText(item, 'country')}
                        </p>
                        <p className="text-xs text-third-500">
                            {isRTL ? item.countryEn : item.countryAr}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.addresses.columns.city'),
            field: 'city',
            render: (item) => (
                <div>
                    <p className="font-medium text-third-900">
                        {getLocalizedText(item, 'city')}
                    </p>
                    {(item.cityEn && item.cityAr) && (
                        <p className="text-sm text-third-500">
                            {isRTL ? item.cityEn : item.cityAr}
                        </p>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.addresses.columns.street'),
            field: 'street',
            render: (item) => (
                <div>
                    <div className="flex items-start gap-2">
                        <FiMapPin className="w-4 h-4 text-primary-600  mt-0.5 shrink-0" />
                        <div>
                            <p className="text-third-900">
                                {getLocalizedText(item, 'street')}
                            </p>
                            {(item.streetEn && item.streetAr) && (
                                <p className="text-sm text-third-500">
                                    {isRTL ? item.streetEn : item.streetAr}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.addresses.columns.details'),
            field: 'details',
            render: (item) => {
                const details = getLocalizedText(item, 'details');
                return details ? (
                    <div className="max-w-xs">
                        <p className="text-sm text-third-500   line-clamp-2">
                            {details}
                        </p>
                    </div>
                ) : (
                    <span className="text-sm text-third-500   italic">
                        {t('dashboard.common.notAvailable', 'N/A')}
                    </span>
                );
            }
        },
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <AddressForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.addresses.title')}
            description={t('dashboard.addresses.description')}
            data={addresses}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.addresses.searchPlaceholder')}
        />
    );
}