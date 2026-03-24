import apiClient from "./client";

export const sharedBudgetsApi = {
  list: () => apiClient.get("/shared-budgets"),
  create: (data: Record<string, unknown>) => apiClient.post("/shared-budgets", data),
  show: (id: number) => apiClient.get(`/shared-budgets/${id}`),
  update: (id: number, data: Record<string, unknown>) => apiClient.put(`/shared-budgets/${id}`, data),
  delete: (id: number) => apiClient.delete(`/shared-budgets/${id}`),

  // Members
  invite: (budgetId: number, data: { email: string; role?: string }) =>
    apiClient.post(`/shared-budgets/${budgetId}/invite`, data),
  accept: (budgetId: number) => apiClient.patch(`/shared-budgets/${budgetId}/accept`),
  decline: (budgetId: number) => apiClient.patch(`/shared-budgets/${budgetId}/decline`),
  removeMember: (budgetId: number, memberId: number) =>
    apiClient.delete(`/shared-budgets/${budgetId}/members/${memberId}`),

  // Expenses
  listExpenses: (budgetId: number, params?: Record<string, unknown>) =>
    apiClient.get(`/shared-budgets/${budgetId}/expenses`, { params }),
  addExpense: (budgetId: number, data: Record<string, unknown>) =>
    apiClient.post(`/shared-budgets/${budgetId}/expenses`, data),
  deleteExpense: (budgetId: number, expenseId: number) =>
    apiClient.delete(`/shared-budgets/${budgetId}/expenses/${expenseId}`),

  // Invitations
  myInvitations: () => apiClient.get("/shared-budget-invitations"),
};
