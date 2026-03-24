import apiClient from "./client";

export const tagsApi = {
  list: () => apiClient.get("/tags"),
  create: (data: { name: string; color?: string }) => apiClient.post("/tags", data),
  update: (id: number, data: { name?: string; color?: string }) => apiClient.put(`/tags/${id}`, data),
  delete: (id: number) => apiClient.delete(`/tags/${id}`),
};
