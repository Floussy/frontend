import apiClient from "./client";

export const feedbacksApi = {
  list: () => apiClient.get("/feedbacks"),
  create: (data: FormData) =>
    apiClient.post("/feedbacks", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
