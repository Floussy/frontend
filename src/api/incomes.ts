import apiClient from "./client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { Income } from "../types/transaction";

export interface IncomeFilters {
  category_id?: number;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export const incomesApi = {
  list(filters: IncomeFilters = {}) {
    return apiClient.get<PaginatedResponse<Income>>("/incomes", { params: filters });
  },

  get(id: number) {
    return apiClient.get<ApiResponse<Income>>(`/incomes/${id}`);
  },

  create(data: Record<string, unknown>) {
    return apiClient.post<ApiResponse<Income>>("/incomes", data);
  },

  update(id: number, data: Record<string, unknown>) {
    return apiClient.put<ApiResponse<Income>>(`/incomes/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete(`/incomes/${id}`);
  },
};
