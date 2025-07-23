import { useQuery } from '@tanstack/react-query'
import Stores from '../services/Stores'

const useStores = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => Stores.getAll(),
        refetchOnWindowFocus: false,
        retry: 1
    })
}
export default useStores