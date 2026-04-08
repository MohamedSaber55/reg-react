import React from 'react';

/**
 * Card Component
 * @param {Object} props
 * @param {'default' | 'hover' | 'glass' | 'bordered'} props.variant
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.padding
 * @param {boolean} props.shadow
 * @param {string} props.className
 * @param {React.ReactNode} props.children
 */
export const Card = ({
    variant = 'default',
    padding = 'md',
    shadow = true,
    className = '',
    children,
    onClick,
    ...props
}) => {
    const baseStyles = 'rounded-2xl bg-neutral-50   transition-all duration-300';

    const variants = {
        default: 'border border-neutral-400  ',
        hover: 'border border-neutral-400   hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        glass: 'backdrop-blur-xl bg-neutral-50/80  /80 border border-neutral-400/50  /50',
        bordered: 'border-2 border-primary-500',
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
    };

    const shadowClass = shadow ? 'shadow-lg' : '';

    return (
        <div
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${shadowClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Header
export const CardHeader = ({ title, subtitle, action, className = '' }) => {
    return (
        <div className={`flex items-start justify-between mb-6 ${className}`}>
            <div className="flex-1">
                {title && (
                    <h3 className="text-2xl font-bold text-third-900   mb-1 font-serif">
                        {title}
                    </h3>
                )}
                {subtitle && (
                    <p className="text-third-500">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="ms-4">{action}</div>}
        </div>
    );
};

// Card Body
export const CardBody = ({ children, className = '' }) => {
    return <div className={className}>{children}</div>;
};

// Card Footer
export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`mt-6 pt-6 border-t border-neutral-400   ${className}`}>
            {children}
        </div>
    );
};

// Stats Card
export const StatsCard = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    className = '',
}) => {
    const trendColor = trend === 'up' ? 'text-success-500' : trend === 'down' ? 'text-error-500' : 'text-third-500  ';

    return (
        <Card variant="default" padding="lg" className={className}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-third-500   mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-third-900   mb-2">
                        {value}
                    </p>
                    {trendValue && (
                        <p className={`text-sm font-medium ${trendColor}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 rounded-xl bg-primary-50">
                        <div className="text-primary-500 text-2xl">{icon}</div>
                    </div>
                )}
            </div>
        </Card>
    );
};

// Feature Card
export const FeatureCard = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <Card variant="hover" padding="lg" className={`text-center ${className}`}>
            {icon && (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50   mb-4">
                    <div className="text-primary-500 text-3xl">{icon}</div>
                </div>
            )}
            {title && (
                <h3 className="text-xl font-bold text-third-900   mb-3 font-serif">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-third-500   mb-4">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </Card>
    );
};