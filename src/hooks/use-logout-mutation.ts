import { useMutation } from '@tanstack/react-query';
import api from '@/services/api-service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useLogoutMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            try {
                const response = await api.post('/auth/logout', {});
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
            router.push('/auth/login');
        },
        onError: (error: any) => {
            if (!axios.isCancel(error)) {
                console.error('Logout failed:', error);
                toast.error('Failed to logout. Please try again.');
            }
        },
    });
} 