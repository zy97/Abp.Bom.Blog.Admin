import { GetFeatureListResultDto, UpdateFeaturesDto } from "@abp/ng.feature-management/proxy";
import { ProviderInfoDto } from "@abp/ng.permission-management/proxy";
import axios from "axios";

// 获取可分配角色
export const getFeatures = (params: ProviderInfoDto) =>
    axios.get<GetFeatureListResultDto>(`/api/feature-management/features`, { params });

// 获取可分配角色
export const updateFeatures = (params: ProviderInfoDto, features: UpdateFeaturesDto) =>
    axios.put(`/api/feature-management/features`, { ...features }, { params });