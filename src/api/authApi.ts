import { apiClient } from "./client";
import type { User } from "../types/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Đổi lại đúng path thật của backend nếu bạn đặt khác /api/auth/...
export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<{ data: AuthResponse }>("/api/auth/login", payload);
  return data.data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await apiClient.post<{ data: AuthResponse }>("/api/auth/register", payload);
  return data.data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<{ data: User }>("/api/users/me");
  return data.data;
}
