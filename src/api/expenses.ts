import apiClient from "./client";
import type { ApiResponse, PaginatedResponse } from "../types/api";
import type { Expense } from "../types/transaction";

export interface ExpenseFilters {
  category_id?: number;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export const expensesApi = {
  list(filters: ExpenseFilters = {}) {
    return apiClient.get<PaginatedResponse<Expense>>("/expenses", { params: filters });
  },

  get(id: number) {
    return apiClient.get<ApiResponse<Expense>>(`/expenses/${id}`);
  },

  create(data: FormData) {
    return apiClient.post<ApiResponse<Expense>>("/expenses", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update(id: number, data: FormData) {
    return apiClient.post<ApiResponse<Expense>>(`/expenses/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { _method: "PUT" },
    });
  },

  delete(id: number) {
    return apiClient.delete(`/expenses/${id}`);
  },
};
