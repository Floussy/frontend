import type { Category } from "./transaction";

export type SharedBudgetRole = "admin" | "editor" | "viewer";
export type InvitationStatus = "pending" | "accepted" | "declined";

export interface SharedBudgetMember {
  id: number;
  user: { id: number; name: string; email: string; avatar: string | null };
  role: SharedBudgetRole;
  status: InvitationStatus;
  invited_at: string;
  accepted_at: string | null;
}

export interface SharedBudgetExpense {
  id: number;
  user: { id: number; name: string };
  category: Category | null;
  amount: number;
  currency: string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

export interface SharedBudget {
  id: number;
  name: string;
  description: string | null;
  total_amount: number;
  currency: string;
  period: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  owner: { id: number; name: string; email: string; avatar: string | null };
  accepted_members: SharedBudgetMember[];
  members?: SharedBudgetMember[];
  expenses?: SharedBudgetExpense[];
  total_spent: number;
  remaining: number;
  percent_used: number;
  current_user_role?: SharedBudgetRole;
  created_at: string;
}

export interface SharedBudgetInvitation {
  id: number;
  shared_budget: { id: number; name: string; total_amount: number; currency: string; period: string };
  inviter: { id: number; name: string };
  role: SharedBudgetRole;
  status: InvitationStatus;
  invited_at: string;
}
