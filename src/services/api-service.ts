import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

export const getCsrfTokenFromCookie = () => {
  if (typeof document === "undefined") {
    return null
  }
  const match = document.cookie.match(/(^| )csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
};

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

axios.defaults.withXSRFToken = true;

class ApiService {
  private baseUrl: string;
  private api: AxiosInstance;
  private csrfToken: string | null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000/api/v1/web/";
    this.csrfToken = null;
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true, // This is important for handling cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request Interceptor: attach CSRF token if needed
    this.api.interceptors.request.use(
      (config) => {
        // Attach CSRF token only on state-changing requests
        const method = config.method?.toUpperCase();
        if (!this.csrfToken) {
            this.csrfToken = getCsrfTokenFromCookie();
          }
        if (
          ["POST", "PUT", "PATCH", "DELETE"].includes(method || "") &&
          this.csrfToken
        ) {
          config.headers["x-csrf-token"] = this.csrfToken;
        }
        // config.headers['x-csrf-token'] = this.csrfToken;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // this.clearCsrfToken();
          toast.error("Session expired, please sign in again", { id: "error" });
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 2000);
        }
        return Promise.reject(error);
      }
    );
  }

  // Call this after login/email verification to store CSRF token
  setCsrfToken(token: string) {
    this.csrfToken = token;
  }

  // show csrf token in console
  getCsrfToken() {
    return this.csrfToken;
  }

  // You can also clear it on logout
  clearCsrfToken() {
    this.csrfToken = null;
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.post<T>(url, data, config)).data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.get<T>(url, config)).data;
  }

  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.put<T>(url, data, config)).data;
  }

  async patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.patch<T>(url, data, config)).data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.delete<T>(url, config)).data;
  }
}

const api = new ApiService();

export default api;
