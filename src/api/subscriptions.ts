import apiClient from "./client";

export const subscriptionsApi = {
  list: (params?: Record<string, unknown>) => apiClient.get("/subscriptions", { params }),
  create: (data: Record<string, unknown>) => apiClient.post("/subscriptions", data),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/subscriptions/${id}`, data),
  delete: (id: number) => apiClient.delete(`/subscriptions/${id}`),
  pause: (id: number) => apiClient.patch(`/subscriptions/${id}/pause`),
  resume: (id: number) => apiClient.patch(`/subscriptions/${id}/resume`),
  cancel: (id: number) => apiClient.patch(`/subscriptions/${id}/cancel`),
  upcoming: () => apiClient.get("/subscriptions-upcoming"),
};
