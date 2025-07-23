import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Table, Button, Space, Input, Modal, Form, Select, Pagination, Card, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useUsers from '../../hooks/useUsers';
import Users from '../../services/Users';
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;
const { Option } = Select;

const Usuarios = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, refetch } = useUsers({ page: 1, limit: 100 });

    const usuarios = data?.data?.docs || [];

    const pageSize = 5;

    const isMobile = useMediaQuery({ maxWidth: 768 });

    const filteredUsers = searchText
        ? usuarios.filter(
            (item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                item.email.toLowerCase().includes(searchText.toLowerCase()) ||
                item.role.toLowerCase().includes(searchText.toLowerCase())
        )
        : usuarios;

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Correo', dataIndex: 'email', key: 'email' },
        { title: 'Rol', dataIndex: 'role', key: 'role' },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditar(record)}>
                        Editar
                    </Button>
                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAgregar = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditar = (usuario) => {
        setEditingUser(usuario);
        form.setFieldsValue({
            nombre: usuario.name,
            email: usuario.email,
            rol: usuario.role,
            clave: usuario.password || '',
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                let response;

                if (editingUser) {
                    response = await Users.edit(editingUser.sub, values);
                } else {
                    response = await Users.create(values);
                }

                if (response?.success) {
                    message.success(response.message || (editingUser ? 'Usuario actualizado' : 'Usuario creado'));
                    refetch();
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingUser(null);
                } else {
                    message.warning(response.message || 'No se pudo completar la acción');
                }
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message ||
                    error.message ||
                    'No se pudo conectar con el servidor';
                message.error(errorMessage);
            }
        }).catch(() => {
            message.error('Por favor completá correctamente el formulario.');
        });
    };

    const handleDelete = (user) => {
        Modal.confirm({
            title: '¿Estás seguro que deseas eliminar este usuario?',
            content: `Esta acción no se puede deshacer. Usuario: ${user.name}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await Users.delete(user.sub);

                    if (response?.success) {
                        message.success(response.message || 'Usuario eliminado exitosamente');
                        refetch();
                    } else {
                        message.warning(response.message || 'No se pudo eliminar el usuario');
                    }
                } catch (error) {
                    const errorMessage =
                        error?.response?.data?.message ||
                        error.message ||
                        'No se pudo conectar con el servidor';
                    message.error(errorMessage);
                }
            }
        });
    };

    const handleBuscar = (value) => {
        setCurrentPage(1);
        setSearchText(value);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingUser(null);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 pt-16 px-4 lg:pt-8 lg:px-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAgregar}>
                        Agregar Usuario
                    </Button>
                </div>

                <div className="mb-6">
                    <Search
                        placeholder="Buscar usuario..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleBuscar}
                        onChange={(e) => handleBuscar(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    {isMobile ? (
                        <>
                            {paginatedUsers.length > 0 ? (
                                <>
                                    <div className="grid gap-4">
                                        {paginatedUsers.map((user) => (
                                            <Card key={user.sub} bordered>
                                                <p><strong>Nombre:</strong> {user.name}</p>
                                                <p><strong>Correo:</strong> {user.email}</p>
                                                <p><strong>Rol:</strong> {user.role}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        size="small"
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEditar(user)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        type="danger"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="flex justify-center my-4">
                                        <Pagination
                                            className="text-center mt-6"
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={filteredUsers.length}
                                            onChange={page => setCurrentPage(page)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-center items-center min-h-[300px]">
                                    <Empty description="No hay usuarios" />
                                </div>
                            )}
                        </>
                    ) : (
                        <Table
                            dataSource={filteredUsers}
                            columns={columns}
                            loading={isLoading}
                            pagination={{ pageSize: pageSize }}
                            bordered
                            rowKey="sub"
                        />
                    )}
                </div>

                <Modal
                    title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingUser ? 'Guardar Cambios' : 'Agregar'}
                    cancelText="Cancelar"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
                        >
                            <Input placeholder="Nombre" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Correo"
                            rules={[
                                { required: true, message: 'Por favor ingresa el correo' },
                                { type: 'email', message: 'Ingresa un correo válido' },
                            ]}
                        >
                            <Input placeholder="Correo" />
                        </Form.Item>
                        <Form.Item
                            name="clave"
                            label="Clave"
                            rules={[{ required: true, message: 'Por favor ingresa la clave' }]}
                        >
                            <Input.Password placeholder="Clave" />
                        </Form.Item>
                        <Form.Item
                            name="rol"
                            label="Rol"
                            rules={[{ required: true, message: 'Por favor selecciona el rol' }]}
                        >
                            <Select placeholder="Selecciona un rol">
                                <Option value="CEO">CEO</Option>
                                <Option value="Admin">Admin</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Usuarios;
