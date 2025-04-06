export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  connect_google_calendar?: boolean;
  receive_updates?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

