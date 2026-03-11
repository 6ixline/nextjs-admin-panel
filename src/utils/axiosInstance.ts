import axios, { AxiosError, AxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: '/api/', // Proxy via Next.js
  timeout: 15000, // Increase timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies automatically
});

// Response interceptor to handle 401 and refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await axios.post(
          '/api/admin/auth/refresh-token',
          {},
          {
            withCredentials: true, // important: send refresh_token cookie
          }
        );

        processQueue(null);

        // Retry original request (cookies sent automatically)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        console.log('refreshError', refreshError);

        // If refresh fails, force user to login again (but avoid redirect loops on /login).
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname + window.location.search;

          // If we're already on the login page, don't hard-redirect again.
          if (!window.location.pathname.startsWith('/login')) {
            const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
            window.location.href = loginUrl;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
