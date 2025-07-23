import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { message } from 'antd';
import Commerce from '../services/Commerce';

const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem('user');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkStatus = async () => {
            const storedUser = JSON.parse(isAuthenticated);
            if (!storedUser || !storedUser._id) return;

            try {
                const response = await Commerce.getById(storedUser._id);
                if (response?.data?.active === false) {
                    message.error('Servicio suspendido por falta de pago.');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error al verificar estado del comercio:', error);
                message.error('No se pudo verificar el estado del servicio');
            }
        };

        checkStatus();
    }, [location.pathname]); // Revisa en cada cambio de ruta

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
