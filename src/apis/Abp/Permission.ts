import { GetPermissionListResultDto, UpdatePermissionsDto, ProviderInfoDto } from "@abp/ng.permission-management/proxy";
import axios from "axios";

// 获取可分配角色
export const getPermissions = (params: ProviderInfoDto) =>
  axios.get<GetPermissionListResultDto>(`/api/permission-management/permissions`, { params });

// 获取可分配角色
export const updatePermissions = (params: ProviderInfoDto, permissions: UpdatePermissionsDto) =>
  axios.put(`/api/permission-management/permissions`, { ...permissions, }, { params });
