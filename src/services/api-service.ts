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
    private cookieService: CookieService;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1/web/';
        this.cookieService = new CookieService();
        this.api = axios.create({
            baseURL: this.baseUrl,
            withCredentials: true, // This is important for handling cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to set auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = this.cookieService.getCookie(BANKNBOOK_AUTH_COOKIE_NAME);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor
        this.api.interceptors.response.use(
            (response) => {
                // Handle any response cookies here if needed
                return response;
            },
            (error) => {
                console.log(error.response?.status);
                if (error.response?.status === 401) {
                    // Show timeout modal with 5 minutes countdown
                    toast.error('Session expired, please sign in again', { id: "error" });
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 2000);
                }
                return Promise.reject(error);
            }
        );
    }

    async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return (await this.api.post<T>(url, data, config)).data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return (await this.api.get<T>(url, config)).data;
    }

    async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return (await this.api.put<T>(url, data, config)).data;
    }

    async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return (await this.api.patch<T>(url, data, config)).data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return (await this.api.delete<T>(url, config)).data;
    }
}

export default ApiService;