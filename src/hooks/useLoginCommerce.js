import { useMutation } from '@tanstack/react-query';
import Commerce from '../services/Commerce';

const useLoginCommerce = () => {
    return useMutation({
        mutationFn: (credentials) => Commerce.login(credentials),
    });
};

export default useLoginCommerce;
