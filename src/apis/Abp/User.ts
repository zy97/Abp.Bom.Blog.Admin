import { IdentityUserDto } from "@abp/ng.account.core/proxy";
import { ListResultDto, PagedResultDto } from "@abp/ng.core";
import { IdentityRoleDto, IdentityUserCreateDto, IdentityUserUpdateDto } from "@abp/ng.identity/proxy";
import { GetIdentityUsersInput } from "@abp/ng.identity/proxy/lib";
import axios from "axios";
// 添加
export const addUser = (user: IdentityUserCreateDto) =>
  axios.post<IdentityUserDto>(`/api/identity/users`, { ...user });

// 获取列表
export const getUsers = (params: GetIdentityUsersInput) =>
  axios.get<PagedResultDto<IdentityUserDto>>(`/api/identity/users`, { params });

// 删除
export const deleteUser = (id: string) =>
  axios.delete(`/api/identity/users/${id}`);

// 获取指定项
export const getUserById = (id: string) =>
  axios.get<IdentityUserDto>(`/api/identity/users/${id}`, {});

// 更新
export const updateUser = (id: string, user: IdentityUserUpdateDto) =>
  axios.put<IdentityUserDto>(`/api/identity/users/${id}`, { ...user });

// 获取用户角色
export const getUserRoleById = (id: string) =>
  axios.get<ListResultDto<IdentityRoleDto>>(`/api/identity/users/${id}/roles`, {});

// 获取可分配角色
export const getAssignableRoles = () =>
  axios.get<ListResultDto<IdentityRoleDto>>(`/api/identity/users/assignable-roles`, {});
