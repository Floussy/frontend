export type ProfileType = "employee" | "freelancer" | "business_owner";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  profile_type: ProfileType;
  default_currency: string;
  is_premium: boolean;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  profile_type: ProfileType;
  default_currency: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
