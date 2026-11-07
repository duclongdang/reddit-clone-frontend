import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Gắn access token vào mọi request nếu đã đăng nhập
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Khi test OAuth, log lỗi rõ ràng ra console thay vì để lỗi bị nuốt âm thầm —
// giúp bạn thấy ngay nếu backend trả 401/403/500 trong lúc test luồng login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API error]", error.response?.status, error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);
