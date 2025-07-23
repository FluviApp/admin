import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Commerce from '../services/Commerce';
import { message } from 'antd';

const useCheckCommerceStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkStatus = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
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

        checkStatus(); // Verifica cada vez que cambia la ruta

    }, [location.pathname]); // se ejecuta en cada cambio de ruta
};

export default useCheckCommerceStatus;
