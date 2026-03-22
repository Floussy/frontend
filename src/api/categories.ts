import apiClient from "./client";
import type { ApiResponse } from "../types/api";
import type { Category } from "../types/transaction";

export const categoriesApi = {
  list(type?: "income" | "expense") {
    return apiClient.get<ApiResponse<Category[]>>("/categories", {
      params: type ? { type } : {},
    });
  },

  create(data: Record<string, unknown>) {
    return apiClient.post<ApiResponse<Category>>("/categories", data);
  },

  update(id: number, data: Record<string, unknown>) {
    return apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete(`/categories/${id}`);
  },
};
