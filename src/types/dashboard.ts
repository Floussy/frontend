export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  currency: string;
  month: string;
}

export interface CategoryExpense {
  category: string;
  icon: string;
  color: string;
  total: number;
}

export interface MonthlyTrend {
  month: string;
  label: string;
  income: number;
  expenses: number;
}

export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  currency: string;
  category: string;
  icon: string;
  color: string;
  description: string | null;
  date: string;
}

export interface GoalSummary {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  progress_percent: number;
  currency: string;
  deadline: string | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  expenses_by_category: CategoryExpense[];
  monthly_trend: MonthlyTrend[];
  recent_transactions: Transaction[];
  active_goals: GoalSummary[];
}
