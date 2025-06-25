import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useLoader } from "../components/loader/LoaderContext";

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || "/";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
  config: AxiosRequestConfig;
  request?: unknown;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: baseURL.slice(-1) === "/" ? baseURL.slice(0, -1) : baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await this.client.get<T>(url, config).then(this.handleResponse);
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await this.client
      .post<T>(url, data, config)
      .then(this.handleResponse);
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await this.client
      .put<T>(url, data, config)
      .then(this.handleResponse);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await this.client.delete<T>(url, config).then(this.handleResponse);
  }

  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
      request: response.request,
    };
  }
}

export function useApiWithLoader() {
  const { setLoading } = useLoader();
  const api = apiService;

  const wrap = async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      const result = await fn();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    get: <T>(...args: Parameters<typeof api.get<T>>) =>
      wrap(() => api.get<T>(...args)),
    post: <T>(...args: Parameters<typeof api.post<T>>) =>
      wrap(() => api.post<T>(...args)),
    put: <T>(...args: Parameters<typeof api.put<T>>) =>
      wrap(() => api.put<T>(...args)),
    delete: <T>(...args: Parameters<typeof api.delete<T>>) =>
      wrap(() => api.delete<T>(...args)),
  };
}

export const apiService = new ApiService();
