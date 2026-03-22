export interface Category {
  id: number;
  name: string;
  name_fr: string | null;
  name_ar: string | null;
  type: "income" | "expense";
  icon: string | null;
  color: string | null;
  is_default: boolean;
  sort_order: number;
}

export interface Income {
  id: number;
  category: Category;
  amount: number;
  currency: string;
  source: string | null;
  description: string | null;
  frequency: string;
  income_date: string;
  is_recurring: boolean;
  created_at: string;
}

export interface Receipt {
  id: number;
  file_name: string;
  file_size: number;
  mime_type: string;
  url: string;
  created_at: string;
}

export interface Expense {
  id: number;
  category: Category;
  amount: number;
  currency: string;
  description: string | null;
  frequency: string;
  expense_date: string;
  is_recurring: boolean;
  receipts: Receipt[];
  created_at: string;
}
