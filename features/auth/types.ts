export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  id: number;
  token: string;
  type: string; // "Bearer"
  username: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  status: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  status: string;
}

export interface RoleOption {
  roleId: number;
  roleName: string;
}