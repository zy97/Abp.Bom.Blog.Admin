import { EmailSettingsDto, UpdateEmailSettingsDto } from "@abp/ng.setting-management/config";
import { SendTestEmailInput } from "@abp/ng.setting-management/config/public-api";
import axios from "axios";

export const getEmailSetting = () => axios.get<EmailSettingsDto>(`/api/setting-management/emailing`, {});
export const updateEmailSetting = (update: UpdateEmailSettingsDto) => axios.post(`/api/setting-management/emailing`, { ...update });
export const sendTestEmail = (email: SendTestEmailInput) => axios.post(`/api/setting-management/emailing/send-test-email`, { ...email });