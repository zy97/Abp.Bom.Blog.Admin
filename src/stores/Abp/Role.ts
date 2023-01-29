import { IdentityRoleCreateDto, IdentityRoleDto, IdentityRoleUpdateDto } from "@abp/ng.identity/proxy";
import { create } from "zustand";
import { roleApi } from "../../apis";

interface RoleState {
  getRoles: (data: { current: number; pageSize: number }, form: any) => Promise<{ total: number; list: any[]; }>
  getAllRoles: () => Promise<IdentityRoleDto[] | undefined>
  deleteRole: (id: string) => Promise<boolean>
  addRole: (role: IdentityRoleCreateDto) => Promise<boolean>
  getRoleById: (id: string) => Promise<IdentityRoleDto | undefined>
  updateRole: (id: string, role: IdentityRoleUpdateDto) => Promise<IdentityRoleDto | undefined>
}
export const useRoleStore = create<RoleState>()(() => ({
  getRoles: async (data: { current: number; pageSize: number }, form: any) => {
    try {
      const result = await roleApi.getRoles({
        skipCount: data.pageSize * (data.current - 1),
        maxResultCount: data.pageSize,
        ...form,
      });
      return {
        total: result.data.totalCount ?? 0,
        list: result.data.items ?? [],
      };
    } catch (error) {
      return { total: 0, list: [] };
    }
  },
  getAllRoles: async () => {
    try {
      const result = await roleApi.getAllRoles();
      return result.data.items;
    } catch (error) {
      return [];
    }
  },
  deleteRole: async (id: string) => {
    try {
      await roleApi.deleteRole(id);
      return true;
    } catch (error) {
      return false;
    }
  },
  addRole: async (role: IdentityRoleCreateDto) => {
    try {
      const data = await roleApi.addRole(role);
      return true;
    } catch (error) {
      return false;
    }
  },
  getRoleById: async (id: string) => {
    try {
      const role = await roleApi.getRoleById(id);
      return role.data;
    } catch (error) {
      console.log(error);
    }
  },
  updateRole: async (id: string, role: IdentityRoleUpdateDto) => {
    try {
      const result = await roleApi.updateRole(id, role);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
}));

