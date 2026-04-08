// dashboard/components/ContactPageForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export default function ContactPageForm({ item, onSubmit, onCancel, loading }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        titleEn: item?.titleEn || '',
        titleAr: item?.titleAr || '',
        subtitleEn: item?.subtitleEn || '',
        subtitleAr: item?.subtitleAr || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* English Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.englishContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleEn')}
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleChange}
                    required
                />
                <Textarea
                    label={t('dashboard.forms.subtitleEn')}
                    name="subtitleEn"
                    value={formData.subtitleEn}
                    onChange={handleChange}
                    rows={6}
                    required
                />
            </div>

            {/* Arabic Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.arabicContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleAr')}
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleChange}
                    dir="rtl"
                    required
                />
                <Textarea
                    label={t('dashboard.forms.subtitleAr')}
                    name="subtitleAr"
                    value={formData.subtitleAr}
                    onChange={handleChange}
                    dir="rtl"
                    rows={6}
                    required
                />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}