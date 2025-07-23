import { useQuery } from '@tanstack/react-query'
import Users from '../services/Users'

const useAdminUsers = () => {
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: () => Users.getAdminUsers(),
        refetchOnWindowFocus: false,
        retry: 1
    })
}
export default useAdminUsers