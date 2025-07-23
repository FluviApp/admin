import { useQuery } from '@tanstack/react-query'
import Users from '../services/Users'

const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => Users.getAll(),
        refetchOnWindowFocus: false,
        retry: 1
    })
}
export default useUsers