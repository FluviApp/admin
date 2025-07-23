import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    MenuOutlined,
    LineChartOutlined,
    UserOutlined,
    ShopOutlined,
    ExclamationCircleOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);

    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

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
        <>
            {/* Botón hamburguesa solo visible en mobile */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    icon={<MenuOutlined />}
                    shape="circle"
                    onClick={toggleSidebar}
                    className="shadow-md"
                />
            </div>

            {/* Sidebar móvil */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transition-transform duration-300 shadow-lg ${collapsed ? '-translate-x-full' : 'translate-x-0'
                    } lg:hidden`}
            >
                <div className="flex items-center justify-center p-6 font-bold text-2xl text-gray-800">
                    Fluvi
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKey()}
                    onClick={() => setCollapsed(true)}
                >
                    <Menu.Item key="1" icon={<LineChartOutlined />}>
                        <Link to="/metricas">Métricas</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/usuarios">Usuarios</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ShopOutlined />}>
                        <Link to="/locales">Locales</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ExclamationCircleOutlined />}>
                        <Link to="/reclamos">Reclamos</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SettingOutlined />}>
                        <Link to="/ajustes">Ajustes</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="text-red-500"
                    >
                        Cerrar sesión
                    </Menu.Item>
                </Menu>
                <div className="text-center text-sm text-gray-500 p-2">
                    © 2020 GoApp
                </div>
            </div>

            {/* Sidebar de escritorio */}
            <Sider
                theme="light"
                breakpoint="lg"
                collapsedWidth="0"
                width={250}
                className="hidden lg:block h-screen border-r border-gray-200"
            >
                <div className="flex items-center justify-center p-6 font-bold text-2xl text-gray-800">
                    Fluvi
                </div>
                <Menu mode="inline" selectedKeys={getSelectedKey()}>
                    <Menu.Item key="1" icon={<LineChartOutlined />}>
                        <Link to="/metricas">Métricas</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/usuarios">Usuarios</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ShopOutlined />}>
                        <Link to="/locales">Locales</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ExclamationCircleOutlined />}>
                        <Link to="/reclamos">Reclamos</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<SettingOutlined />}>
                        <Link to="/ajustes">Ajustes</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="text-red-500"
                    >
                        Cerrar sesión
                    </Menu.Item>
                </Menu>
                <div className="text-center text-sm text-gray-500 p-2">
                    © 2020 Fluvi
                </div>
            </Sider>
        </>
    );
};

export default Sidebar;
