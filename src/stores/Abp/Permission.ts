import { GetPermissionListResultDto, UpdatePermissionsDto } from "@abp/ng.permission-management/proxy";
import { create } from "zustand";
import { permissionApi } from "../../apis";
interface PermissionState {
  getPermissionByUser: (providerKey: string) => Promise<GetPermissionListResultDto>
  getPermissionByRole: (providerKey: string) => Promise<GetPermissionListResultDto>
  updatePermissionsByUser: (providerKey: string, permissions: UpdatePermissionsDto) => Promise<any>
  updatePermissionsByRole: (providerKey: string, permissions: UpdatePermissionsDto) => Promise<any>
}
export const usePermissionStore = create<PermissionState>()(() => ({
  getPermissionByUser: async (providerKey: string) => {
    try {
      const result = await permissionApi.getPermissions({ providerName: "U", providerKey });
      return result.data;
    } catch (error) {
      console.log(error);
      return {} as GetPermissionListResultDto;
    }
  },
  getPermissionByRole: async (providerKey: string) => {
    try {
      const result = await permissionApi.getPermissions({ providerName: "R", providerKey });
      return result.data;
    } catch (error) {
      console.log(error);
      return {} as GetPermissionListResultDto;
    }
  },
  updatePermissionsByUser: async (providerKey: string, permissions: UpdatePermissionsDto) => {
    try {
      const result = await permissionApi.updatePermissions(
        { providerName: "U", providerKey },
        permissions
      );
      return result.data;
    } catch (error) {
      console.log(error);
      return {} as GetPermissionListResultDto;
    }
  },
  updatePermissionsByRole: async (providerKey: string, permissions: UpdatePermissionsDto) => {
    try {
      const result = await permissionApi.updatePermissions(
        { providerName: "R", providerKey },
        permissions
      );
      return result.data;
    } catch (error) {
      console.log(error);
      return {} as GetPermissionListResultDto;
    }
  }
}));
