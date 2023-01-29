import { ChangePasswordInput, ProfileDto, UpdateProfileDto } from "@abp/ng.account.core/proxy";
import axios from "axios";

export const logout = () => axios.get(`/api/account/logout`, {});
export const getProfile = () => axios.get<ProfileDto>(`/api/account/my-profile`, {});
export const updateProfile = (update: UpdateProfileDto) => axios.put<ProfileDto>(`/api/account/my-profile`, { ...update });
export const changePassword = (update: ChangePasswordInput) => axios.post(`/api/account/my-profile/change-password`, { ...update });
