import React, { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * Input Component
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.error
 * @param {string} props.helperText
 * @param {boolean} props.required
 * @param {boolean} props.disabled
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 * @param {boolean} props.success
 * @param {'sm' | 'md' | 'lg'} props.size
 */
export const Input = forwardRef(({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    leftIcon,
    rightIcon,
    success = false,
    size = 'md',
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
    };

    const baseStyles = 'w-full rounded-xl bg-neutral-50  transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed text-third-900 border  placeholder:text-third-500  ';

    const stateStyles = error
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        : success
            ? 'border-success-500 focus:border-success-500 focus:ring-success-500/20'
            : 'border-neutral-400  focus:border-primary-500 focus:ring-primary-500/20';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-third-900   mb-2"
                >
                    {label}
                    {required && <span className="text-error-500 ms-1">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-third-500">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    disabled={disabled}
                    className={`${baseStyles} ${sizes[size]} ${stateStyles} ${leftIcon ? 'ps-10' : ''
                        } ${rightIcon || error || success ? 'pe-10' : ''}`}
                    {...props}
                />

                {(rightIcon || error || success) && (
                    <div className="absolute inset-e-3 top-1/2 -translate-y-1/2">
                        {error ? (
                            <FiAlertCircle className="text-error-500" />
                        ) : success ? (
                            <FiCheckCircle className="text-success-500" />
                        ) : (
                            <span className="text-third-500">{rightIcon}</span>
                        )}
                    </div>
                )}
            </div>

            {(error || helperText) && (
                <p
                    className={`mt-2 text-sm ${error
                        ? 'text-error-500'
                        : 'text-third-500  '
                        }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// Password Input with toggle visibility
export const PasswordInput = forwardRef(({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            rightIcon={
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-third-900   transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            }
            {...props}
        />
    );
});

PasswordInput.displayName = 'PasswordInput';

// Textarea Component
export const Textarea = forwardRef(({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    rows = 4,
    className = '',
    id,
    ...props
}, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'w-full px-4 py-3 rounded-xl bg-neutral-50  transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed text-third-900  border placeholder:text-third-500   resize-none';

    const stateStyles = error
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        : 'border-neutral-400  focus:border-primary-500 focus:ring-primary-500/20';
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-third-900   mb-2"
                >
                    {label}
                    {required && <span className="text-error-500 ms-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                disabled={disabled}
                className={`${baseStyles} ${stateStyles}`}
                {...props}
            />

            {(error || helperText) && (
                <p
                    className={`mt-2 text-sm ${error
                        ? 'text-error-500'
                        : 'text-third-500  '
                        }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    options = [],
    placeholder = 'Select an option',
    className = '',
    id,
    ...props
}, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'w-full px-4 py-3 rounded-xl bg-neutral-50  transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed text-third-900 border  appearance-none';

    const stateStyles = error
        ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
        : 'border-neutral-400   focus:border-primary-500 focus:ring-primary-500/20';

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-third-900   mb-2"
                >
                    {label}
                    {required && <span className="text-error-500 ms-1">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    disabled={disabled}
                    className={`${baseStyles} ${stateStyles} pe-10`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-e-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-third-500" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {(error || helperText) && (
                <p
                    className={`mt-2 text-sm ${error
                        ? 'text-error-500'
                        : 'text-third-500  '
                        }`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

// Checkbox Component
export const Checkbox = forwardRef(({
    label,
    error,
    disabled = false,
    className = '',
    id,
    ...props
}, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`flex items-start ${className}`}>
            <div className="flex items-center h-5">
                <input
                    ref={ref}
                    id={checkboxId}
                    type="checkbox"
                    disabled={disabled}
                    className="w-5 h-5 rounded border border-neutral-400   bg-neutral-50  text-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    {...props}
                />
            </div>
            {label && (
                <label
                    htmlFor={checkboxId}
                    className="ms-3 text-sm text-third-900   cursor-pointer select-none"
                >
                    {label}
                </label>
            )}
            {error && (
                <p className="mt-1 text-sm text-error-500">{error}</p>
            )}
        </div>
    );
});

Checkbox.displayName = 'Checkbox';

// Radio Component
export const Radio = forwardRef(({
    label,
    error,
    disabled = false,
    className = '',
    id,
    ...props
}, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`flex items-start ${className}`}>
            <div className="flex items-center h-5">
                <input
                    ref={ref}
                    id={radioId}
                    type="radio"
                    disabled={disabled}
                    className="w-5 h-5 border border-neutral-400   bg-neutral-50  text-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                    {...props}
                />
            </div>
            {label && (
                <label
                    htmlFor={radioId}
                    className="ms-3 text-sm text-third-900   cursor-pointer select-none"
                >
                    {label}
                </label>
            )}
            {error && (
                <p className="mt-1 text-sm text-error-500">{error}</p>
            )}
        </div>
    );
});

Radio.displayName = 'Radio';