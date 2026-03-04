export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  second_last_name?: string | null;
  age: string;
  gender: string;
  address?: string | null;
  occupation: string;
  phone: string;
  user_id: number;
  is_active: boolean;
}
