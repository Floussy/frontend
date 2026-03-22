import apiClient from "./client";
import type { ApiResponse } from "../types/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "../types/auth";

export const authApi = {
  login(data: LoginRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
  },

  register(data: RegisterRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
  },

  logout() {
    return apiClient.post("/auth/logout");
  },

  getUser() {
    return apiClient.get<ApiResponse<User>>("/user");
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return apiClient.post<ApiResponse<null>>("/auth/forgot-password", data);
  },

  resetPassword(data: ResetPasswordRequest) {
    return apiClient.post<ApiResponse<null>>("/auth/reset-password", data);
  },
};
