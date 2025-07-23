import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Table, Button, Space, Input, Modal, Form, message, Switch, Card, Pagination, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useComplaints from '../../hooks/useComplaints';
import Complaints from '../../services/Complaints';
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;

const Reclamos = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const isMobile = useMediaQuery({ maxWidth: 768 });

    const { data, isLoading, refetch } = useComplaints({ page: 1, limit: 100 });

    const complaints = data?.data?.docs || [];
    const dataToRender = searchText ? filteredData : complaints;

    const itemsPerPage = 5;
    const paginatedData = dataToRender.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Correo', dataIndex: 'mail', key: 'mail' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        { title: 'Reclamo', dataIndex: 'complaint', key: 'complaint' },
        { title: '¿Resuelto?', dataIndex: 'solved', key: 'solved', render: (solved) => (solved ? 'Sí' : 'No') },
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
        setEditingComplaint(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditar = (complaint) => {
        setEditingComplaint(complaint);
        form.setFieldsValue({
            name: complaint.name,
            mail: complaint.mail,
            phone: complaint.phone,
            complaint: complaint.complaint,
            solved: complaint.solved,
        });
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                let response;
                if (editingComplaint) {
                    response = await Complaints.edit(editingComplaint.sub, values);
                } else {
                    response = await Complaints.create(values);
                }

                if (response?.success) {
                    message.success(response.message || (editingComplaint ? 'Reclamo actualizado' : 'Reclamo creado'));
                    refetch();
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingComplaint(null);
                } else {
                    message.warning(response.message || 'No se pudo completar la acción');
                }
            } catch (error) {
                message.error(error?.response?.data?.message || error.message || 'No se pudo conectar con el servidor');
            }
        }).catch(() => {
            message.error('Por favor completá correctamente el formulario.');
        });
    };

    const handleDelete = (complaint) => {
        Modal.confirm({
            title: '¿Eliminar reclamo?',
            content: `Esta acción no se puede deshacer. Reclamo de: ${complaint.name}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await Complaints.delete(complaint.sub);
                    if (response?.success) {
                        message.success(response.message || 'Reclamo eliminado exitosamente');
                        refetch();
                    } else {
                        message.warning(response.message || 'No se pudo eliminar el reclamo');
                    }
                } catch (error) {
                    message.error(error?.response?.data?.message || error.message || 'No se pudo conectar con el servidor');
                }
            },
        });
    };

    const handleBuscar = (value) => {
        setCurrentPage(1);
        setSearchText(value);
        const filtered = complaints.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingComplaint(null);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 pt-16 px-4 lg:pt-8 lg:px-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Reclamos</h1>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAgregar}>
                        Agregar Reclamo
                    </Button>
                </div>

                <div className="mb-6">
                    <Search
                        placeholder="Buscar reclamo..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        onSearch={handleBuscar}
                        onChange={(e) => handleBuscar(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    {!isMobile ? (
                        <Table
                            dataSource={dataToRender}
                            columns={columns}
                            loading={isLoading}
                            pagination={{ pageSize: itemsPerPage }}
                            bordered
                            rowKey="sub"
                        />
                    ) : (
                        <>
                            {paginatedData.length > 0 ? (
                                <>
                                    <div className="flex flex-col gap-4">
                                        {paginatedData.map((complaint) => (
                                            <Card key={complaint.sub} title={complaint.name} bordered className="shadow">
                                                <p><b>Correo:</b> {complaint.mail}</p>
                                                <p><b>Teléfono:</b> {complaint.phone}</p>
                                                <p><b>Reclamo:</b> {complaint.complaint}</p>
                                                <p><b>¿Resuelto?:</b> {complaint.solved ? 'Sí' : 'No'}</p>
                                                <div className="mt-4 flex gap-2">
                                                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditar(complaint)}>
                                                        Editar
                                                    </Button>
                                                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(complaint)}>
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <Pagination
                                            current={currentPage}
                                            pageSize={itemsPerPage}
                                            total={dataToRender.length}
                                            onChange={(page) => setCurrentPage(page)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-center items-center min-h-[300px]">
                                    <Empty description="No hay reclamos" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Modal
                    title={editingComplaint ? 'Editar Reclamo' : 'Agregar Reclamo'}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingComplaint ? 'Guardar Cambios' : 'Agregar'}
                    cancelText="Cancelar"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Nombre requerido' }]}>
                            <Input placeholder="Nombre" />
                        </Form.Item>
                        <Form.Item name="mail" label="Correo" rules={[
                            { required: true, message: 'Correo requerido' },
                            { type: 'email', message: 'Correo inválido' }
                        ]}>
                            <Input placeholder="Correo" />
                        </Form.Item>
                        <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Teléfono requerido' }]}>
                            <Input placeholder="Teléfono" />
                        </Form.Item>
                        <Form.Item name="complaint" label="Reclamo" rules={[{ required: true, message: 'Reclamo requerido' }]}>
                            <Input.TextArea placeholder="Escribe el reclamo..." autoSize={{ minRows: 3 }} />
                        </Form.Item>
                        <Form.Item name="solved" label="¿Resuelto?" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Reclamos;
