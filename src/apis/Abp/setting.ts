import axios from "axios";
import { SettingDto } from "../../data/models/abp/settingDto";

export const updateSetting = (setting: SettingDto) => axios.post(`/api/app/abp-setting/change-setting`, { ...setting });