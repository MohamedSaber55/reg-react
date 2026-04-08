import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // State to store our value
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (item === null) return initialValue;

            // Handle string values directly
            if (typeof initialValue === 'string') {
                return item;
            }

            // Try to parse JSON for objects/arrays
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                if (valueToStore === null || valueToStore === undefined) {
                    window.localStorage.removeItem(key);
                } else if (typeof valueToStore === 'string') {
                    window.localStorage.setItem(key, valueToStore);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error('Error setting localStorage key:', key, error);
        }
    };

    // Sync between tabs
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    if (typeof initialValue === 'string') {
                        setStoredValue(e.newValue);
                    } else {
                        setStoredValue(JSON.parse(e.newValue));
                    }
                } catch (error) {
                    console.error('Error parsing storage change:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;