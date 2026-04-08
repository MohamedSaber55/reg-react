// app/login/page.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { login, clearError } from '@/store/slices/authSlice';
import { Input, PasswordInput } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated]);

    // Cleanup auth error on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(login(formData)).unwrap();
            // No need to manually set localStorage here anymore
            // The auth slice will handle it automatically
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-50 to-secondary-50     p-4 transition-colors duration-300">
            {/* Theme and Language Switchers - Top Right */}
            <div className="fixed top-4 inset-e-4 flex items-center gap-3 z-50">
                {/* <ThemeSwitcher /> */}
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-md">
                <div className="bg-neutral-50 rounded-2xl shadow-2xl p-8 border border-neutral-400   transition-all duration-300">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-20 mx-auto mb-4"
                        />
                        <h1 className="text-3xl font-bold text-third-900 font-serif transition-colors duration-300">
                            {t('auth.login.title', 'Welcome Back')}
                        </h1>
                        <p className="text-third-500   mt-2 transition-colors duration-300">
                            {t('auth.login.subtitle', 'Sign in to your dashboard')}
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="error" dismissible className="mb-6">
                            {error || t('auth.login.loginFailed', 'Login failed. Please check your credentials.')}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label={t('auth.login.email', 'Email')}
                            type="email"
                            required
                            leftIcon={<FiMail />}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t('auth.login.emailPlaceholder', 'admin@example.com')}
                        />

                        <PasswordInput
                            label={t('auth.login.password', 'Password')}
                            required
                            leftIcon={<FiLock />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {/* Remember me checkbox if needed */}
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary-600 hover:underline transition-colors duration-300"
                            >
                                {t('auth.login.forgotPassword', 'Forgot password?')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                        >
                            {t('auth.login.signIn', 'Sign In')}
                        </Button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-primary-600  hover:underline transition-colors duration-300"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            {t('auth.login.backToHome', 'Back to Home')}
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-third-500   transition-colors duration-300">
                        {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                    </p>
                </div>
            </div>
        </div>
    );
}