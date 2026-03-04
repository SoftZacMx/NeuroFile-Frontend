export interface ApiResponse<T = unknown> {
  error: boolean;
  result: boolean;
  data: T | null;
  message?: string;
  status_code: number;
}
