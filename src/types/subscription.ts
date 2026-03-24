import type { Account } from "./account";
import type { Category } from "./transaction";

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  currency: string;
  frequency: string;
  provider: string | null;
  status: SubscriptionStatus;
  next_billing_date: string | null;
  billing_day: number | null;
  started_at: string;
  cancelled_at: string | null;
  notes: string | null;
  logo_url: string | null;
  monthly_equivalent: number;
  annual_cost: number;
  account?: Account;
  category?: Category;
  created_at: string;
}
