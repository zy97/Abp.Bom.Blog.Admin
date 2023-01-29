import { UpdateEmailSettingsDto } from "@abp/ng.setting-management/config";
import { EmailSettingsDto, SendTestEmailInput } from "@abp/ng.setting-management/config/public-api";
import { create } from "zustand";
import { emailSettingApi } from "../../apis/Abp";

interface EmailSettingState {
    getEmailSetting: () => Promise<EmailSettingsDto>
    updateEmailSetting: (update: UpdateEmailSettingsDto) => Promise<void>
    sendTestEmail: (email: SendTestEmailInput) => Promise<void>
}
export const useEmailSettingStore = create<EmailSettingState>()(() => ({
    getEmailSetting: async () => {
        const setting = await emailSettingApi.getEmailSetting();
        return setting.data;
    },
    updateEmailSetting: async (update: UpdateEmailSettingsDto) => {
        await emailSettingApi.updateEmailSetting(update);
    },
    sendTestEmail: async (email: SendTestEmailInput) => {
        await emailSettingApi.sendTestEmail(email);
    }
}))