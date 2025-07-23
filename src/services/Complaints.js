import instance from '../apis/app';

class ComplaintsService {
    axiosConfigFiles = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    getAll = () => instance.get('/admin/complaints');

    create = (data) => instance.post('/admin/complaints', data);

    edit = (id, data) => instance.put(`/admin/complaints/${id}`, data);

    delete = (id) => instance.delete(`/admin/complaints/${id}`);
}

const Complaints = new ComplaintsService();
export default Complaints;
