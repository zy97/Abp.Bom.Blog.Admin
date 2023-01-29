
import { GetTenantsInput, TenantCreateDto, TenantDto, TenantUpdateDto } from "@abp/ng.tenant-management/proxy";
import axios from "axios";
import { PagedResultDto } from "@abp/ng.core"

// 添加
export const addTenant = (tenant: TenantCreateDto) =>
  axios.post<TenantDto>(`/api/multi-tenancy/tenants`, { ...tenant });

// 获取列表
export const getTenants = (params: GetTenantsInput) =>
  axios.get<PagedResultDto<TenantDto>>(`/api/multi-tenancy/tenants`, { params });

// 删除
export const deleteTenant = (id: string) =>
  axios.delete(`/api/multi-tenancy/tenants/${id}`);

// 获取指定项
export const getTenantById = (id: string) =>
  axios.get<TenantDto>(`/api/multi-tenancy/tenants/${id}`, {});

// 更新
export const updateTenant = (id: string, tenant: TenantUpdateDto) =>
  axios.put<TenantDto>(`/api/multi-tenancy/tenants/${id}`, { ...tenant });
