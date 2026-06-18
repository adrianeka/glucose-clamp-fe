import axios from "@/lib/axios";
import { UserManagementRequest, AddUserRequest, EditUserRequest,Pagination } from "../types/user";

export const getUsers = async (
  params: UserManagementRequest
) => {
  const response = await axios.get(
    "/user-management/users/search",
    {
      params,
    }
  );

  return response.data;
};

export const addUser = async (data: AddUserRequest) => {
  const response = await axios.post(
    "/user-management/users",
    data
  );
  return response.data;
};

export const editUser = async (id: number, data: EditUserRequest) => {
  const response = await axios.put(
    `/user-management/users/${id}`,
    data
  );
  return response.data;
};

export const getRole = async (
  params: Pagination
) => {
    const response = await axios.get(
        "/roles",
        {
            params,
        }
    );
    return response.data;
}

export const getUserById = async (id: number) => {
    const response = await axios.get(
        `/user-management/users/${id}`
    );
    return response.data;
}

export const deleteUserById = async (id: number) => {
    const response = await axios.delete(
        `/user-management/users/${id}`
    );
    return response.data;
}
