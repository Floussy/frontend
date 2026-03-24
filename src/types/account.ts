export type AccountType = "checking" | "savings" | "credit_card" | "cash" | "e_wallet";

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  initial_balance: number;
  current_balance: number;
  color: string | null;
  icon: string | null;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Transfer {
  id: number;
  from_account: Account;
  to_account: Account;
  amount: number;
  currency: string;
  exchange_rate: number;
  converted_amount: number | null;
  description: string | null;
  transfer_date: string;
  created_at: string;
}
