import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useLoader } from "../components/loader/LoaderContext";

const baseURL: string = process.env.NEXT_PUBLIC_API_URL || "/";

const DEBUG_API_CALLS = true;
const requestCounts: Record<string, number> = {};
const lastRequestTime: Record<string, number> = {};
const MIN_REQUEST_INTERVAL = 1000;

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
  response?: ApiResponse<unknown>;
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

    this.client.interceptors.request.use(
      (config) => {
        if (DEBUG_API_CALLS && config.url) {
          const requestKey = `${config.method || "unknown"}-${
            config.url
          }${JSON.stringify(config.params || {})}`;
          const now = Date.now();

          requestCounts[requestKey] = (requestCounts[requestKey] || 0) + 1;

          // Check if we're making too many identical requests too quickly
          if (
            lastRequestTime[requestKey] &&
            now - lastRequestTime[requestKey] < MIN_REQUEST_INTERVAL
          ) {
            console.warn(
              `Frequent API call detected: ${requestKey} - ${requestCounts[requestKey]} calls`,
              `Time since last call: ${now - lastRequestTime[requestKey]}ms`
            );
            console.trace("API call stack trace");
          }

          lastRequestTime[requestKey] = now;
        }

        const token = localStorage.getItem("jwtToken");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error:", error);

        if (error.response && error.response.status === 401) {
          console.log("Unauthorized request detected");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userId");

          localStorage.setItem(
            "authError",
            "Sua sessão expirou. Por favor, faça login novamente."
          );

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
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

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return await this.client
      .patch<T>(url, data, config)
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

export const apiService = new ApiService();

export function useApiWithLoader() {
  const { setLoading } = useLoader();

  return {
    get: async <T>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        return await apiService.get<T>(url, config);
      } finally {
        setLoading(false);
      }
    },
    post: async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        return await apiService.post<T>(url, data, config);
      } finally {
        setLoading(false);
      }
    },
    put: async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        return await apiService.put<T>(url, data, config);
      } finally {
        setLoading(false);
      }
    },
    patch: async <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        return await apiService.patch<T>(url, data, config);
      } finally {
        setLoading(false);
      }
    },
    delete: async <T>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        return await apiService.delete<T>(url, config);
      } finally {
        setLoading(false);
      }
    },
  };
}
