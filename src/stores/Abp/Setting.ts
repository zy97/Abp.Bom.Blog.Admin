import { create } from "zustand";
import { settingApi } from "../../apis";
import { SettingDto } from "../../data/models/abp/settingDto";

interface SettingStoreState {
    changeSetting: (setting: SettingDto) => Promise<void>
}
export const useSettingStore = create<SettingStoreState>()(() => ({
    changeSetting: async (setting: SettingDto) => {
        await settingApi.updateSetting(setting);
    }
}))