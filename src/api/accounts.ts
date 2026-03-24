import apiClient from "./client";

export const accountsApi = {
  list: () => apiClient.get("/accounts"),
  create: (data: Record<string, unknown>) => apiClient.post("/accounts", data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/accounts/${id}`, data),
  delete: (id: number) => apiClient.delete(`/accounts/${id}`),
};

export const transfersApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/transfers", { params }),
  create: (data: Record<string, unknown>) => apiClient.post("/transfers", data),
  delete: (id: number) => apiClient.delete(`/transfers/${id}`),
};
