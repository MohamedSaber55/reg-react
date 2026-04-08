// dashboard/components/BusinessHourForm.jsx
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input, Select, Checkbox } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiClock, FiCalendar } from 'react-icons/fi';

const WEEK_DAYS = [
    { value: "Sunday", label: 'Sunday' },
    { value: "Monday", label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' }
];

export default function BusinessHourForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Create validation schema with Yup
    const validationSchema = Yup.object({
        day: Yup.string().required(t('validation.required')),
        isWorkingDay: Yup.boolean(),
        from: Yup.string()
            .when('isWorkingDay', {
                is: true,
                then: (schema) => schema.required(t('validation.required')),
                otherwise: (schema) => schema.nullable()
            }),
        to: Yup.string()
            .when('isWorkingDay', {
                is: true,
                then: (schema) => schema
                    .required(t('validation.required'))
                    .test('time-comparison', t('dashboard.businessHours.validation.endTimeAfterStart'),
                        function (value) {
                            const { from } = this.parent;
                            if (!from || !value) return true;
                            return value > from;
                        }
                    ),
                otherwise: (schema) => schema.nullable()
            })
    });

    // Initialize Formik
    const formik = useFormik({
        initialValues: {
            day: "Sunday",
            isWorkingDay: true,
            from: '09:00',
            to: '17:00'
        },
        validationSchema,
        onSubmit: (values) => {
            const submitData = {
                ...values,
                from: values.isWorkingDay ? values.from : null,
                to: values.isWorkingDay ? values.to : null
            };
            onSubmit(submitData);
        },
        enableReinitialize: true // This allows reinitialization when item changes
    });

    // Update form when item changes
    useEffect(() => {
        if (item) {
            formik.setValues({
                day: item.day ?? "Sunday",
                isWorkingDay: item.isWorkingDay ?? true,
                from: item.from || '09:00',
                to: item.to || '17:00'
            });
        }
    }, [item]);

    const handleWorkingDayChange = (checked) => {
        formik.setValues({
            ...formik.values,
            isWorkingDay: checked,
            from: checked ? '09:00' : '',
            to: checked ? '17:00' : ''
        });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Select
                label={t('dashboard.businessHours.form.day')}
                required
                name="day"
                value={formik.values.day}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={WEEK_DAYS.map(day => ({
                    value: day.value,
                    label: t(`dashboard.businessHours.days.${day.label.toLowerCase()}`)
                }))}
                error={formik.touched.day && formik.errors.day}
            />

            <Checkbox
                label={t('dashboard.businessHours.form.isWorkingDay')}
                name="isWorkingDay"
                checked={formik.values.isWorkingDay}
                onChange={(e) => handleWorkingDayChange(e.target.checked)}
                onBlur={formik.handleBlur}
            />

            {formik.values.isWorkingDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t('dashboard.businessHours.form.from')}
                        type="time"
                        required
                        name="from"
                        leftIcon={<FiClock />}
                        value={formik.values.from}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.from && formik.errors.from}
                    />

                    <Input
                        label={t('dashboard.businessHours.form.to')}
                        type="time"
                        required
                        name="to"
                        leftIcon={<FiClock />}
                        value={formik.values.to}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.to && formik.errors.to}
                    />
                </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}