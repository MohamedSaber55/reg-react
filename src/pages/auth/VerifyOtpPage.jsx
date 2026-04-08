// app/verify-otp/page.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { verifyOtp, forgotPassword, clearError, clearResetState } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { FiArrowLeft, FiRefreshCw, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function VerifyOtpPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error, resetEmail, otpVerified } = useAppSelector((state) => state.auth);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef([]);

    // Redirect if no email in state (user accessed directly)
    useEffect(() => {
        if (!resetEmail) {
            navigate('/forgot-password');
        }
    }, [resetEmail]);

    // Redirect to reset password if OTP verified
    useEffect(() => {
        if (otpVerified) {
            navigate('/reset-password');
        }
    }, [otpVerified]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (index, value) => {
        if (value.length > 1) return; // Only single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (index === 5 && value) {
            const otpString = [...newOtp.slice(0, 5), value].join('');
            handleVerify(otpString);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpString) => {
        if (otpString.length !== 6 || !resetEmail) return;

        try {
            await dispatch(verifyOtp({ email: resetEmail, otpCode: otpString })).unwrap();
        } catch (err) {
            // Clear inputs on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        if (!resetEmail || resendTimer > 0) return;

        try {
            await dispatch(forgotPassword(resetEmail)).unwrap();
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            console.error('Resend failed:', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleVerify(otp.join(''));
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <FiShield className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-third-900 font-serif transition-colors duration-300">
                            {t('auth.verifyOtp.title', 'Verify Code')}
                        </h1>
                        <p className="text-third-500 mt-2 transition-colors duration-300">
                            {t('auth.verifyOtp.subtitle', 'Enter the 6-digit code sent to')}<br />
                            <span className="font-semibold text-primary-600">{resetEmail}</span>
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="error" dismissible className="mb-6">
                            {error}
                        </Alert>
                    )}

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                            disabled={otp.join('').length !== 6}
                        >
                            {t('auth.verifyOtp.verify', 'Verify Code')}
                        </Button>
                    </form>

                    {/* Resend Section */}
                    <div className="mt-6 text-center space-y-3">
                        <p className="text-sm text-third-500">
                            {resendTimer > 0 ? (
                                t('auth.verifyOtp.resendIn', 'Resend code in {{seconds}}s', { seconds: resendTimer })
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="inline-flex items-center gap-2 text-primary-600 hover:underline disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <FiRefreshCw className="w-4 h-4" />
                                    {t('auth.verifyOtp.resend', 'Resend Code')}
                                </button>
                            )}
                        </p>

                        <div className="pt-4 border-t border-neutral-200">
                            <button
                                onClick={() => {
                                    dispatch(clearResetState());
                                    navigate('/forgot-password');
                                }}
                                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline transition-colors duration-300"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                {t('auth.verifyOtp.changeEmail', 'Use different email')}
                            </button>
                        </div>
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