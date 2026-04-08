import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({
    value: '',
    onValueChange: () => { },
});

export const Tabs = ({
    defaultValue,
    value,
    onValueChange,
    children,
    className = ''
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (newValue) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={`w-full ${className}`}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = '' }) => {
    return (
        <div className={`flex items-center space-x-1 border-b border-neutral-400   ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({
    value,
    children,
    className = ''
}) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within Tabs');
    }

    const isActive = context.value === value;

    return (
        <button
            type="button"
            onClick={() => context.onValueChange(value)}
            className={`
                px-4 py-3 text-sm font-medium transition-all duration-200 relative
                ${isActive
                    ? 'text-primary-600  border-b-2 border-primary-600  '
                    : 'text-third-500   hover:text-third-900  '
                }
                ${className}
            `}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 inset-s-0 inset-e-0 h-0.5 bg-primary-600" />
            )}
        </button>
    );
};

export const TabsContent = ({
    value,
    children,
    className = ''
}) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    if (context.value !== value) {
        return null;
    }

    return (
        <div className={`mt-6 animate-in fade-in duration-200 ${className}`}>
            {children}
        </div>
    );
};