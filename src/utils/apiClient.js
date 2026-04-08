import axios from 'axios';

const getBaseUrl = () => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const tokenData = localStorage.getItem('token');

            if (tokenData) {
                try {
                    const parsedToken = JSON.parse(tokenData);
                    const token = parsedToken.token;

                    if (token) {
                        const Authorization = `Bearer ${token}`;
                        config.headers.Authorization = Authorization;
                    }
                } catch (error) {
                    const Authorization = `Bearer ${tokenData}`;
                    config.headers.Authorization = Authorization;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login if unauthorized
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;