export interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_last_name?: string | null;
  role: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
