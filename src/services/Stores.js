import instance from '../apis/app'

class StoresService {

    axiosConfigFiles = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    getAll = () => instance.get('/admin/stores')
    create = (data) => instance.post('/admin/stores', data, this.axiosConfigFiles);
    edit = (id, data) => instance.put(`/admin/stores/${id}`, data, this.axiosConfigFiles);
    delete = (id) => instance.delete(`/admin/stores/${id}`)


}

const Stores = new StoresService()
export default Stores