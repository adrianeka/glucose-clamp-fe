export interface Pagination {
  pageNumber: number;
  pageSize: number;
}

export interface User {
  userId: number;
  name: string;
  positionName: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface UserManagementResponse {
    userId: number;
    roleId: number;
    roleName: string;
    positionName: string;
    name: string;
    username: string;
    email: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserManagementRequest {
  keyword?: string;
  pageNumber: number;
  pageSize: number;
}

export interface AddUserRequest {
    roleId : number;
    positionName : string;
    name : string;
    username : string;
    email : string;
    status : string;
    password : string;
}

export interface EditUserRequest {
    roleId : number;
    positionName : string;
    name : string;
    username : string;
    email : string;
    password : string;
}

export interface Roles {
  roleId: number;
  roleName: string;
  status: string;
}