// app/reset-password/page.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { resetPassword, clearError, clearResetState } from '@/store/slices/authSlice';
import { PasswordInput } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { FiLock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, resetEmail, otpVerified, resetOtp } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [validationError, setValidationError] = useState('');

    // Redirect if not verified or no email
    useEffect(() => {
        if (!resetEmail || !otpVerified) {
            navigate('/forgot-password');
        }
    }, [resetEmail, otpVerified]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validatePasswords = () => {
        if (formData.newPassword.length < 6) {
            setValidationError(t('auth.resetPassword.passwordTooShort', 'Password must be at least 6 characters'));
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setValidationError(t('auth.resetPassword.passwordsDontMatch', 'Passwords do not match'));
            return false;
        }
        setValidationError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePasswords() || !resetEmail || !resetOtp) return;

        try {
            await dispatch(resetPassword({
                email: resetEmail,
                otpCode: resetOtp,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            })).unwrap();

            setIsSuccess(true);
            dispatch(clearResetState());

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Reset password failed:', err);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-neutral-50 rounded-2xl shadow-2xl p-8 border border-neutral-400 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <FiCheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-third-900 font-serif mb-4">
                            {t('auth.resetPassword.successTitle', 'Password Reset!')}
                        </h1>
                        <p className="text-third-500 mb-6">
                            {t('auth.resetPassword.successMessage', 'Your password has been reset successfully. Redirecting to login...')}
                        </p>
                        <Link to="/login">
                            <Button variant="primary" fullWidth>
                                {t('auth.resetPassword.goToLogin', 'Go to Login')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50 p-4 transition-colors duration-300">
            {/* Language Switcher - Top Right */}
            <div className="fixed top-4 inset-e-4 flex items-center gap-3 z-50">
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-md">
                <div className="bg-neutral-50 rounded-2xl shadow-2xl p-8 border border-neutral-400 transition-all duration-300">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-20 mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-third-900 font-serif transition-colors duration-300">
                            {t('auth.resetPassword.title', 'Reset Password')}
                        </h1>
                        <p className="text-third-500 mt-2 transition-colors duration-300">
                            {t('auth.resetPassword.subtitle', 'Create a new password for your account')}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {(error || validationError) && (
                        <Alert variant="error" dismissible className="mb-6" onDismiss={() => setValidationError('')}>
                            {error || validationError}
                        </Alert>
                    )}

                    {/* Reset Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PasswordInput
                            label={t('auth.resetPassword.newPassword', 'New Password')}
                            required
                            leftIcon={<FiLock />}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder={t('auth.resetPassword.newPasswordPlaceholder', 'Enter new password')}
                        />

                        <PasswordInput
                            label={t('auth.resetPassword.confirmPassword', 'Confirm Password')}
                            required
                            leftIcon={<FiLock />}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder', 'Confirm new password')}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                        >
                            {t('auth.resetPassword.resetButton', 'Reset Password')}
                        </Button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline transition-colors duration-300"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            {t('auth.resetPassword.backToLogin', 'Back to Login')}
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-third-500 transition-colors duration-300">
                        {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                    </p>
                </div>
            </div>
        </div>
    );
}