import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    if (!authService.isAuthenticated()) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;