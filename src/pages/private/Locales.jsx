import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Table, Button, Space, Input, Modal, Form, message, Switch, Select, Card, Pagination, Empty, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import useStores from '../../hooks/useStores';
import useAdminUsers from '../../hooks/useAdminUsers';
import Stores from '../../services/Stores';
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;
const BACKEND_URL = 'http://localhost:5001';

const Locales = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingStore, setEditingStore] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageFile, setImageFile] = useState(null);


    const isMobile = useMediaQuery({ maxWidth: 768 });

    const { data, isLoading, refetch } = useStores({ page: 1, limit: 100 });
    const { data: adminsData, isLoading: isLoadingAdmins } = useAdminUsers();
    const stores = data?.data?.docs || [];
    const dataToRender = searchText ? filteredData : stores;

    const itemsPerPage = 5;
    const paginatedData = dataToRender.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Dirección', dataIndex: 'address', key: 'address' },
        { title: 'Administrador', dataIndex: ['admin', 'name'], key: 'admin' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Marketplace',
            dataIndex: 'availableInMarketplace',
            key: 'availableInMarketplace',
            render: (val) => (val ? 'Sí' : 'No'),
        },
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
        setEditingStore(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditar = (store) => {
        if (store.image) {
            setImageFile({
                uid: `existing-${store.sub}`,
                name: store.image.split('/').pop(),
                status: 'done',
                url: `${BACKEND_URL}${store.image}`,
            });
        } else {
            setImageFile(null);
        }


        setEditingStore(store);
        form.setFieldsValue({
            name: store.name,
            address: store.address,
            admin: store.admin?.sub,
            holiday: store.holiday === 'true' || store.holiday === true,
            paymentmethod: store.paymentmethod,
            phone: store.phone,
            availableInMarketplace: store.availableInMarketplace,
            startTime: store.schedules ? store.schedules.split(' - ')[0] : undefined,
            endTime: store.schedules ? store.schedules.split(' - ')[1] : undefined,
        });

        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                if (!imageFile?.originFileObj && !editingStore) {
                    return message.error('La imagen de la tienda es obligatoria');
                }

                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('address', values.address);
                formData.append('holiday', values.holiday);
                formData.append('paymentmethod', values.paymentmethod);
                formData.append('schedules', `${values.startTime} - ${values.endTime}`);
                formData.append('phone', values.phone);
                formData.append('availableInMarketplace', values.availableInMarketplace);


                const selectedAdmin = adminsData.find((admin) => admin._id === values.admin);
                if (!selectedAdmin) return message.error('Administrador inválido');

                formData.append('admin[sub]', selectedAdmin._id);
                formData.append('admin[name]', selectedAdmin.name);
                formData.append('admin[email]', selectedAdmin.mail);

                if (imageFile?.originFileObj) {
                    formData.append('image', imageFile.originFileObj);
                }

                let response;
                if (editingStore) {
                    response = await Stores.edit(editingStore.sub, formData);
                } else {
                    response = await Stores.create(formData);
                }

                if (response?.success) {
                    message.success(response.message || 'Guardado correctamente');
                    refetch();
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingStore(null);
                    setImageFile(null);
                } else {
                    message.warning(response.message || 'No se pudo guardar');
                }
            } catch (error) {
                message.error(error.message || 'Error inesperado');
            }
        });
    };


    const handleDelete = (store) => {
        Modal.confirm({
            title: '¿Eliminar tienda?',
            content: `Esta acción no se puede deshacer. Tienda: ${store.name}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await Stores.delete(store.sub);
                    if (response?.success) {
                        message.success(response.message || 'Tienda eliminada exitosamente');
                        refetch();
                    } else {
                        message.warning(response.message || 'No se pudo eliminar la tienda');
                    }
                } catch (error) {
                    message.error(error?.response?.data?.message || error.message || 'Error al conectar con el servidor');
                }
            },
        });
    };

    const handleBuscar = (value) => {
        setCurrentPage(1);
        setSearchText(value);
        const filtered = stores.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(value.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingStore(null);
    };

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const formatted = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                options.push(
                    <Select.Option key={formatted} value={formatted}>
                        {formatted}
                    </Select.Option>
                );
            }
        }
        return options;
    };

    const validateStoreImageSize = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width === 600 && img.height === 600) {
                        resolve(true);
                    } else {
                        message.error(`La imagen "${file.name}" debe ser de 600x600 píxeles`);
                        resolve(false);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 pt-16 px-4 lg:pt-8 lg:px-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Tiendas</h1>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAgregar}>
                        Agregar Tienda
                    </Button>
                </div>

                <div className="mb-6">
                    <Search
                        placeholder="Buscar tienda..."
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
                                        {paginatedData.map((store) => (

                                            <Card key={store.sub} title={store.name} bordered className="shadow">
                                                <p><b>Dirección:</b> {store.address}</p>
                                                <p><b>Administrador:</b> {store.admin?.name}</p>
                                                <p><b>Teléfono:</b> {store.phone}</p>
                                                <p><b>Marketplace:</b> {store.availableInMarketplace ? 'Sí' : 'No'}</p>

                                                <div className="mt-4 flex gap-2">
                                                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditar(store)}>
                                                        Editar
                                                    </Button>
                                                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleDelete(store)}>
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
                                    <Empty description="No hay tiendas" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Modal
                    title={editingStore ? 'Editar Tienda' : 'Agregar Tienda'}
                    open={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingStore ? 'Guardar Cambios' : 'Agregar'}
                    cancelText="Cancelar"
                    destroyOnClose
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Nombre de la Tienda"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
                        >
                            <Input placeholder="Nombre de la tienda" />
                        </Form.Item>

                        <Form.Item label="Imagen de la tienda (600x600)">
                            <Upload
                                maxCount={1}
                                listType="picture"
                                beforeUpload={async (file) => {
                                    const isValid = await validateStoreImageSize(file);
                                    if (!isValid) return Upload.LIST_IGNORE;

                                    setImageFile({
                                        uid: file.uid || '-1',
                                        name: file.name,
                                        status: 'done',
                                        url: URL.createObjectURL(file),
                                        originFileObj: file,
                                    });

                                    return false; // evita subida automática
                                }}
                                showUploadList={{ showRemoveIcon: !editingStore }}
                                fileList={
                                    imageFile
                                        ? [{
                                            uid: imageFile.uid || '-1',
                                            name: imageFile.name,
                                            status: 'done',
                                            url: imageFile.url || (imageFile.originFileObj ? URL.createObjectURL(imageFile.originFileObj) : undefined),
                                        }]
                                        : []
                                }
                                onRemove={() => setImageFile(null)}
                                customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                            >
                                <Button icon={<PlusOutlined />}>Seleccionar imagen</Button>
                            </Upload>
                        </Form.Item>


                        <Form.Item
                            name="address"
                            label="Dirección"
                            rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}
                        >
                            <Input placeholder="Dirección" />
                        </Form.Item>


                        <Form.Item
                            name="admin"
                            label="Administrador"
                            rules={[{ required: true, message: 'Por favor selecciona un administrador' }]}
                        >
                            <Select
                                placeholder="Selecciona un administrador"
                                loading={isLoadingAdmins}
                                options={(adminsData || []).map((admin) => ({
                                    value: admin._id,
                                    label: admin.name,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="holiday"
                            label="¿Abre en feriados?"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="paymentmethod"
                            label="Métodos de pago"
                            rules={[{ required: true, message: 'Por favor selecciona al menos un método de pago' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecciona métodos de pago"
                            >
                                <Select.Option value="Efectivo">Efectivo</Select.Option>
                                <Select.Option value="Débito">Débito</Select.Option>
                                <Select.Option value="Crédito">Crédito</Select.Option>
                                <Select.Option value="Transferencia">Transferencia</Select.Option>
                                    <Select.Option value="Mercado Pago">Mercado Pago</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Teléfono"
                            rules={[{ required: true, message: 'Por favor ingresa un número de teléfono' }]}
                        >
                            <Input addonBefore="+56" placeholder="912345678" />
                        </Form.Item>

                        <Form.Item
                            name="availableInMarketplace"
                            label="¿Disponible en Marketplace?"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>


                        <Form.Item
                            name="startTime"
                            label="Hora de apertura"
                            rules={[{ required: true, message: 'Por favor selecciona la hora de apertura' }]}
                        >
                            <Select placeholder="Selecciona hora de apertura">
                                {generateTimeOptions()}
                            </Select>
                        </Form.Item>

                        {/* Horario de cierre */}
                        <Form.Item
                            name="endTime"
                            label="Hora de cierre"
                            rules={[{ required: true, message: 'Por favor selecciona la hora de cierre' }]}
                        >
                            <Select placeholder="Selecciona hora de cierre">
                                {generateTimeOptions()}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        </div>
    );
};

export default Locales;
