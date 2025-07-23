import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Card, Avatar, Descriptions, Button, Form, Input, Spin, message } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import useCommerce from '../../hooks/useCommerce';
import Commerce from '../../services/Commerce';

const Ajustes = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const { data, isLoading, refetch } = useCommerce({ page: 1, limit: 1 });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (data?.data?.docs?.[0]) {
            setUser(data.data.docs[0]);
        }
    }, [data]);

    const handleEdit = () => {
        if (user) {
            setIsEditing(true);
            form.setFieldsValue({
                password: user.password || '',
                phone: user.phone || '',
                facebook: user.social?.facebook || '',
                instagram: user.social?.instagram || '',
                twitter: user.social?.twitter || '',
            });
        }
    };

    const handleSave = () => {
        form.validateFields().then(async (values) => {
            try {
                const updated = {
                    password: values.password,
                    phone: values.phone,
                    social: {
                        facebook: values.facebook,
                        instagram: values.instagram,
                        twitter: values.twitter,
                    }
                };

                const response = await Commerce.edit(user.sub, updated);
                if (response?.success) {
                    message.success(response.message || 'Información actualizada correctamente');
                    setIsEditing(false);
                    refetch();
                } else {
                    message.warning(response.message || 'No se pudo actualizar');
                }
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message || error.message || 'Error al conectar con el servidor';
                message.error(errorMessage);
            }
        });
    };

    if (isLoading || !user) return <Spin className="p-8" tip="Cargando datos..." />;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Ajustes</h1>
                </div>

                <Card
                    className="max-w-2xl shadow-md rounded-2xl"
                    title="Perfil del comercio"
                    actions={[
                        isEditing ? (
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                                Guardar
                            </Button>
                        ) : (
                            <Button icon={<EditOutlined />} onClick={handleEdit}>
                                Editar
                            </Button>
                        ),
                    ]}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar size={64}>{user.name[0]}</Avatar>
                        <div>
                            <p className="text-xl font-semibold">{user.name}</p>
                            <p className="text-gray-500">{user.mail}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <Form layout="vertical" form={form}>
                            <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Ingrese la contraseña' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Ingrese el teléfono' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="facebook" label="Facebook">
                                <Input placeholder="https://facebook.com/tucomercio" />
                            </Form.Item>
                            <Form.Item name="instagram" label="Instagram">
                                <Input placeholder="https://instagram.com/tucomercio" />
                            </Form.Item>
                            <Form.Item name="twitter" label="Twitter">
                                <Input placeholder="https://twitter.com/tucomercio" />
                            </Form.Item>
                        </Form>
                    ) : (
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Nombre">{user.name}</Descriptions.Item>
                            <Descriptions.Item label="Correo">{user.mail}</Descriptions.Item>
                            <Descriptions.Item label="Monto">{user.amount}</Descriptions.Item>
                            <Descriptions.Item label="Activo">{user.active ? 'Sí' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Teléfono">{user.phone}</Descriptions.Item>
                            <Descriptions.Item label="Logo">{user.logo}</Descriptions.Item>
                            <Descriptions.Item label="Facebook">{user.social?.facebook || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Instagram">{user.social?.instagram || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Twitter">{user.social?.twitter || '-'}</Descriptions.Item>
                        </Descriptions>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Ajustes;
