import { ChangePasswordInput, ProfileDto, UpdateProfileDto } from "@abp/ng.account.core/proxy";
import { create } from "zustand";
import { accountApi } from "../../apis";

interface AccountState {
    logout: () => Promise<void>
    getProfile: () => Promise<ProfileDto>
    updateProfile: (update: UpdateProfileDto) => Promise<ProfileDto>
    changePassword: (update: ChangePasswordInput) => Promise<void>
}
export const useAccountStore = create<AccountState>()(() => ({
    logout: async () => {
        await accountApi.logout();
    },
    getProfile: async () => {
        const profile = await accountApi.getProfile();
        return profile.data;
    },
    updateProfile: async (update: UpdateProfileDto) => {
        const profile = await accountApi.updateProfile(update);
        return profile.data;
    },
    changePassword: async (update: ChangePasswordInput) => {
        await accountApi.changePassword(update);
    }
}))
