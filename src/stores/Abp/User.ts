import { ListResultDto } from "@abp/ng.core";
import { IdentityRoleDto, IdentityUserCreateDto, IdentityUserDto, IdentityUserUpdateDto } from "@abp/ng.identity/proxy";
import { create } from "zustand";
import { userApi } from "../../apis";

interface UserState {
  getUsers: (data: { current: number; pageSize: number; }, form: any) => Promise<{ total: number; list: IdentityUserDto[]; }>
  deleteUser: (id: string) => Promise<boolean>
  addUser: (user: IdentityUserCreateDto) => Promise<false | IdentityUserDto>
  getUserById: (id: string) => Promise<IdentityUserDto | undefined>
  updateUser: (id: string, user: IdentityUserUpdateDto) => Promise<IdentityUserDto | undefined>
  getUserRoleById: (id: string) => Promise<ListResultDto<IdentityRoleDto>>
  getAssignableRoles: () => Promise<ListResultDto<IdentityRoleDto>>
}
export const useUserStore = create<UserState>()(() => ({
  getUsers: async (data: { current: number; pageSize: number }, form: any) => {
    try {
      const result = await userApi.getUsers({
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
  deleteUser: async (id: string) => {
    try {
      await userApi.deleteUser(id);
      return true;
    } catch (error) {
      return false;
    }
  },
  addUser: async (user: IdentityUserCreateDto) => {
    try {
      const data = await userApi.addUser(user);
      return data.data;
    } catch (error) {
      return false;
    }
  },
  getUserById: async (id: string) => {
    try {
      const user = await userApi.getUserById(id);
      return user.data;
    } catch (error) {
      console.log(error);
    }
  },
  updateUser: async (id: string, user: IdentityUserUpdateDto) => {
    try {
      const result = await userApi.updateUser(id, user);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
  getUserRoleById: async (id: string) => {
    try {
      const result = await userApi.getUserRoleById(id);
      return result.data;
    } catch (error) {
      console.log(error);
      return { items: [] };
    }
  },
  getAssignableRoles: async () => {
    try {
      const result = await userApi.getAssignableRoles();
      return result.data;
    } catch (error) {
      console.log(error);
      return { items: [] };
    }
  }
}));

