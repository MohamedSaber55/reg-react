import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RouteGuard = ({ children, roles }) => {
    const { role, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!roles || roles.length === 0) return;
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, role, roles, navigate]);

    if (!isAuthenticated) return null;

    if (roles?.length > 0 && isAuthenticated && !roles.includes(role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500">403</h1>
                    <p className="text-lg text-gray-600 mt-2">Access Denied</p>
                </div>
            </div>
        );
    }

    return children;
};

export default RouteGuard;
