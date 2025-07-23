import { useQuery } from '@tanstack/react-query';
import Complaints from '../services/Complaints';

const useComplaints = (params = {}) => {
    return useQuery({
        queryKey: ['complaints', params],
        queryFn: () => Complaints.getAll(params),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
};

export default useComplaints;