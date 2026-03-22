import apiClient from "./client";
import type { ApiResponse } from "../types/api";

export interface RecurringTransaction {
  id: number;
  type: "income" | "expense";
  category: {
    id: number;
    name: string;
    name_fr: string | null;
    name_ar: string | null;
    icon: string | null;
    color: string | null;
  };
  amount: number;
  currency: string;
  source: string | null;
  description: string | null;
  frequency: string;
  start_date: string;
  end_date: string | null;
  next_due_date: string;
  is_active: boolean;
  last_generated_at: string | null;
  created_at: string;
}

export interface RecurringFormData {
  type: "income" | "expense";
  category_id: number;
  amount: number;
  currency?: string;
  source?: string;
  description?: string;
  frequency: string;
  start_date: string;
  end_date?: string;
}

export const recurringApi = {
  list(type?: "income" | "expense") {
    return apiClient.get<ApiResponse<RecurringTransaction[]>>("/recurring-transactions", {
      params: type ? { type } : {},
    });
  },

  create(data: RecurringFormData) {
    return apiClient.post<ApiResponse<RecurringTransaction>>("/recurring-transactions", data);
  },

  update(id: number, data: RecurringFormData) {
    return apiClient.put<ApiResponse<RecurringTransaction>>(`/recurring-transactions/${id}`, data);
  },

  deactivate(id: number) {
    return apiClient.delete(`/recurring-transactions/${id}`);
  },

  forceDelete(id: number) {
    return apiClient.delete(`/recurring-transactions/${id}/force`);
  },
};
