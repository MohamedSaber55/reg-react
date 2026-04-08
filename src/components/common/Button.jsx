import React from 'react';
import { FiLoader } from 'react-icons/fi';

/**
 * Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'} props.variant
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size
 * @param {boolean} props.loading
 * @param {boolean} props.disabled
 * @param {boolean} props.fullWidth
 * @param {React.ReactNode} props.leftIcon
 * @param {React.ReactNode} props.rightIcon
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-md hover:shadow-lg hover:scale-105',
        secondary: 'bg-neutral-100  border border-neutral-400   text-third-900   hover:bg-neutral-50   shadow-sm hover:shadow-md',
        outline: 'border-2 border-primary-500 text-primary-600  hover:bg-primary-50   focus:ring-primary-500',
        ghost: 'text-third-900   hover:bg-neutral-100  ',
        danger: 'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500 shadow-md hover:shadow-lg',
        success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 shadow-md hover:shadow-lg',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            {...props}
        >
            {loading && <FiLoader className="animate-spin" />}
            {!loading && leftIcon && leftIcon}
            {children}
            {!loading && rightIcon && rightIcon}
        </button>
    );
};

// Icon Button variant
export const IconButton = ({
    variant = 'ghost',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    className = '',
    'aria-label': ariaLabel,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-md hover:shadow-lg',
        secondary: 'bg-neutral-100  border border-neutral-400   text-third-900   hover:bg-neutral-50  ',
        outline: 'border-2 border-primary-500 text-primary-600  hover:bg-primary-50  ',
        ghost: 'text-third-900   hover:bg-neutral-100  ',
        danger: 'bg-error-500 hover:bg-error-600 text-white focus:ring-error-500',
    };

    const sizes = {
        sm: 'p-1.5 text-sm',
        md: 'p-2.5 text-base',
        lg: 'p-3 text-lg',
        xl: 'p-4 text-xl',
    };

    return (
        <button
            type="button"
            disabled={disabled || loading}
            aria-label={ariaLabel}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? <FiLoader className="animate-spin" /> : icon}
        </button>
    );
};

// Button Group
export const ButtonGroup = ({ children, className = '' }) => {
    return (
        <div className={`inline-flex rounded-xl shadow-sm ${className}`} role="group">
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                const isFirst = index === 0;
                const isLast = index === React.Children.count(children) - 1;

                return React.cloneElement(child, {
                    className: `${child.props.className || ''} ${isFirst ? 'rounded-e-none' : isLast ? 'rounded-s-none' : 'rounded-none'
                        } ${!isFirst ? '-ms-px' : ''}`,
                });
            })}
        </div>
    );
};