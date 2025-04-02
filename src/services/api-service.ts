import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import CookieService from './cookie-service';
import { BANKNBOOK_AUTH_COOKIE_NAME } from '@/utils/strings';
import toast from 'react-hot-toast';

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

class ApiService {
    private baseUrl: string;
    private api: AxiosInstance;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1/web/';
        const cookieService = new CookieService();
        const accessToken = cookieService.getCookie(BANKNBOOK_AUTH_COOKIE_NAME);
        this.api = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'x-access-token': `${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Add response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log(error.response?.status);
                if (error.response?.status === 401) {
                    // Show timeout modal with 5 minutes countdown
                    toast.error('Session expired, please sign in again', { id: "error" });
                    setTimeout(() => {
                        window.location.href = '/auth/signin';
                    }, 2000);
                }
                return Promise.reject(error);
            }
        );
    }

    async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return (await this.api.post<ApiResponse<T>>(url, data, config)).data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return (await this.api.get<ApiResponse<T>>(url, config)).data;
    }

    async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return (await this.api.put<ApiResponse<T>>(url, data, config)).data;
    }

    async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return (await this.api.patch<ApiResponse<T>>(url, data, config)).data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return (await this.api.delete<ApiResponse<T>>(url, config)).data;
    }
}

export default ApiService;