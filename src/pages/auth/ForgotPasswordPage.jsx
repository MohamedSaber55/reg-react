// app/forgot-password/page.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { forgotPassword, clearError } from '@/store/slices/authSlice';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, resetEmail } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Redirect to verify OTP if email is set in state
    useEffect(() => {
        if (resetEmail) {
            navigate('/verify-otp');
        }
    }, [resetEmail]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(forgotPassword(email)).unwrap();
            setIsSubmitted(true);
        } catch (err) {
            console.error('Forgot password failed:', err);
        }
    };

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
                            {t('auth.forgotPassword.title', 'Forgot Password')}
                        </h1>
                        <p className="text-third-500 mt-2 transition-colors duration-300">
                            {t('auth.forgotPassword.subtitle', 'Enter your email to receive a verification code')}
                        </p>
                    </div>

                    {/* Success Message */}
                    {isSubmitted && (
                        <Alert variant="success" dismissible className="mb-6">
                            <div className="flex items-center gap-2">
                                <FiCheckCircle className="w-5 h-5" />
                                {t('auth.forgotPassword.emailSent', 'Verification code sent to your email!')}
                            </div>
                        </Alert>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="error" dismissible className="mb-6">
                            {error}
                        </Alert>
                    )}

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('auth.forgotPassword.email', 'Email')}
                            type="email"
                            required
                            leftIcon={<FiMail />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.forgotPassword.emailPlaceholder', 'Enter your email address')}
                            disabled={isSubmitted}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                            disabled={isSubmitted}
                        >
                            {t('auth.forgotPassword.sendCode', 'Send Verification Code')}
                        </Button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-3">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline transition-colors duration-300"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            {t('auth.forgotPassword.backToLogin', 'Back to Login')}
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