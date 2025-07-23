import instance from '../apis/app'

class commerceService {

    axiosConfigFiles = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    login = (data) => instance.post('/admin/commerce/login', data);
    getById = (id) => instance.get(`/admin/commerce/${id}`)
    getAll = () => instance.get('/admin/commerce')
    create = (data) => instance.post('/admin/commerce', data)
    edit = (id, data) => instance.put(`/admin/commerce/${id}`, data)
    delete = (id) => instance.delete(`/admin/commerce/${id}`)


}

const Commerce = new commerceService()
export default Commerce