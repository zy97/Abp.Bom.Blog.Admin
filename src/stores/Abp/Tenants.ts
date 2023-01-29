import { featureApi, tenantsApi } from "../../apis";
import { TenantCreateDto, TenantDto, TenantUpdateDto } from "@abp/ng.tenant-management/proxy";
import { GetFeatureListResultDto, UpdateFeaturesDto } from "@abp/ng.feature-management/proxy";
import { create } from "zustand";

interface TenantsStoreState {
  getTenants: (data: { current: number; pageSize: number }, form: any) => Promise<{ total: number; list: any[]; }>;
  deleteTenant: (id: string) => Promise<boolean>;
  addTenant: (tenant: TenantCreateDto) => Promise<any>;
  getTenantById: (id: string) => Promise<TenantDto>;
  updateTenant: (id: string, tenant: TenantUpdateDto) => Promise<any>;
  getTenantFeatures: (id: string) => Promise<GetFeatureListResultDto>;
  updateTenantFeatures: (id: string, features: UpdateFeaturesDto) => Promise<any>;
  getHostFeatures: () => Promise<GetFeatureListResultDto>;
  updateHostFeatures: (features: UpdateFeaturesDto) => Promise<any>;
}
export const useTenantsStore = create<TenantsStoreState>()(() => ({
  getTenants: async (data: { current: number; pageSize: number }, form: any) => {
    try {
      const result = await tenantsApi.getTenants({ skipCount: data.pageSize * (data.current - 1), maxResultCount: data.pageSize, ...form, });
      return { total: result.data.totalCount ?? 0, list: result.data.items ?? [], };
    } catch (error) {
      return { total: 0, list: [] };
    }
  },
  deleteTenant: async (id: string) => {
    try {
      await tenantsApi.deleteTenant(id);
      return true;
    } catch (error) {
      return false;
    }
  },
  addTenant: async (tenant: TenantCreateDto) => {
    try {
      const data = await tenantsApi.addTenant(tenant);
      return data.data;
    } catch (error) {
      return;
    }
  },
  getTenantById: async (id: string) => {
    const tenant = await tenantsApi.getTenantById(id);
    return tenant.data;
  },
  updateTenant: async (id: string, tenant: TenantUpdateDto) => {
    try {
      const result = await tenantsApi.updateTenant(id, tenant);
      return result.data;
    } catch (error) {
      return;
    }
  },
  getTenantFeatures: async (id: string) => {
    const result = await featureApi.getFeatures({ providerName: "T", providerKey: id });
    return result.data;
  },
  updateTenantFeatures: async (id: string, features: UpdateFeaturesDto) => {
    try {
      const result = await featureApi.updateFeatures({ providerName: "T", providerKey: id }, features);
      return result.data;
    } catch (error) {
      return;
    }
  },
  getHostFeatures: async () => {
    const result = await featureApi.getFeatures({ providerName: "T" });
    return result.data;
  },
  updateHostFeatures: async (features: UpdateFeaturesDto) => {
    try {
      const result = await featureApi.updateFeatures({ providerName: "T" }, features);
      return result.data;
    } catch (error) {
      return;
    }
  },
}));

