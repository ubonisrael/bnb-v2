import { useMutation } from '@tanstack/react-query';
import ApiService from '@/services/api-service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useLogoutMutation() {
    const router = useRouter();
    const apiService = new ApiService();

    return useMutation({
        mutationFn: async () => {
            const source = axios.CancelToken.source();
            try {
                const response = await apiService.post('/auth/logout', {}, {
                    cancelToken: source.token
                });
                return response;
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    throw error;
                }
            }
        },
        onSuccess: () => {
            toast.success('Logged out successfully');
            router.push('/auth/signin');
        },
        onError: (error: any) => {
            if (!axios.isCancel(error)) {
                console.error('Logout failed:', error);
                toast.error('Failed to logout. Please try again.');
            }
        },
    });
} 