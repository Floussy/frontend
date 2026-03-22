import apiClient from "./client";
import type { ApiResponse } from "../types/api";
import type { DashboardData } from "../types/dashboard";

export const dashboardApi = {
  get() {
    return apiClient.get<ApiResponse<DashboardData>>("/dashboard");
  },
};
