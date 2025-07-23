import instance from '../apis/app'

class UsersService {

    axiosConfigFiles = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    getAdminUsers = () => instance.get('/admin/usersAdmin')
    getAll = () => instance.get('/admin/users')
    create = (data) => instance.post('/admin/users', data)
    edit = (id, data) => instance.put(`/admin/users/${id}`, data)
    delete = (id) => instance.delete(`/admin/users/${id}`)


}

const Users = new UsersService()
export default Users