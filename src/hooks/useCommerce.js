import { useQuery } from '@tanstack/react-query'
import Commerce from '../services/Commerce'

const useCommerce = () => {
    return useQuery({
        queryKey: ['commerce'],
        queryFn: () => Commerce.getAll(),
        refetchOnWindowFocus: false,
        retry: 1
    })
}
export default useCommerce