import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LineChartOutlined,
    UserOutlined,
    ShopOutlined,
    TeamOutlined,
    ExclamationCircleOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Mapea las rutas a las claves del menú
    const getSelectedKey = () => {
        switch (location.pathname) {
            case '/metricas':
                return ['1'];
            case '/usuarios':
                return ['2'];
            case '/locales':
                return ['3'];
            case '/reclamos':
                return ['4'];
            case '/ajustes':
                return ['5'];
            default:
                return ['1'];
        }
    };

    return (
        <Sider
            theme="light"
            className="h-screen shadow-lg border-r border-gray-200 font-[Poppins]"
            breakpoint="lg"
            collapsedWidth="0"
        >
            {/* Logo y nombre de la app */}
            <div className="flex items-center justify-center p-6 font-[Poppins]">
                <div className="text-3xl font-bold text-gray-800">Fluvi</div>
            </div>

            {/* Menú */}
            <Menu
                mode="inline"
                selectedKeys={getSelectedKey()}
                className="mt-4 font-[Poppins]"
                style={{ fontSize: '16px' }}
            >
                <Menu.Item key="1" icon={<LineChartOutlined className="text-xl" />}>
                    <Link to="/metricas" className="flex items-center font-[Poppins]">
                        Métricas
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined className="text-xl" />}>
                    <Link to="/usuarios" className="flex items-center font-[Poppins]">
                        Usuarios
                    </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<ShopOutlined className="text-xl" />}>
                    <Link to="/locales" className="flex items-center font-[Poppins]">
                        Locales
                    </Link>
                </Menu.Item>
                {/* <Menu.Item key="4" icon={<TeamOutlined className="text-xl" />}>
                    <Link to="/clientes" className="flex items-center font-[Poppins]">
                        Clientes
                    </Link>
                </Menu.Item> */}
                <Menu.Item key="4" icon={<ExclamationCircleOutlined className="text-xl" />}>
                    <Link to="/reclamos" className="flex items-center font-[Poppins]">
                        Reclamos
                    </Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<SettingOutlined className="text-xl" />}>
                    <Link to="/ajustes" className="flex items-center font-[Poppins]">
                        Ajustes
                    </Link>
                </Menu.Item>
            </Menu>

            {/* Footer con logout */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 font-[Poppins]">
                <Menu mode="inline" selectable={false}>
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined className="text-xl" />}
                        onClick={handleLogout}
                        className="text-red-500"
                    >
                        Cerrar sesión
                    </Menu.Item>
                </Menu>

                <div className="text-center text-sm text-gray-500 p-2">
                    © 2020 Fluvi
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar;
