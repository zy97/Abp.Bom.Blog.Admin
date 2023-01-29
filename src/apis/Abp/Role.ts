import { ListResultDto, PagedResultDto } from "@abp/ng.core";
import { IdentityRoleCreateDto, IdentityRoleDto, IdentityRoleUpdateDto } from "@abp/ng.identity/proxy";
import { GetIdentityRolesInput } from "@abp/ng.identity/proxy/lib";
import axios from "axios";

// 添加
export const addRole = (role: IdentityRoleCreateDto) =>
  axios.post<IdentityRoleDto>(`/api/identity/roles`, { ...role });

// 获取列表
export const getRoles = (params: GetIdentityRolesInput) =>
  axios.get<PagedResultDto<IdentityRoleDto>>(`/api/identity/roles`, { params });

// 获取列表
export const getAllRoles = () =>
  axios.get<ListResultDto<IdentityRoleDto>>(`/api/identity/roles/all`, {});

// 删除
export const deleteRole = (id: string) =>
  axios.delete(`/api/identity/roles/${id}`);

// 获取指定项
export const getRoleById = (id: string) =>
  axios.get<IdentityRoleDto>(`/api/identity/roles/${id}`, {});

// 更新
export const updateRole = (id: string, role: IdentityRoleUpdateDto) =>
  axios.put<IdentityRoleDto>(`/api/identity/roles/${id}`, { ...role });
