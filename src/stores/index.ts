import React from "react";
import { useAccountStore } from "./Abp/Account";
import { useApplicationConfigurationStore } from "./Abp/ApplicationConfiguration";
import { useEmailSettingStore } from "./Abp/EmailSetting";
import { usePermissionStore } from "./Abp/Permission";
import { useRoleStore } from "./Abp/Role";
import { useSettingStore } from "./Abp/setting";
import { useTenantsStore } from "./Abp/tenants";
import { useUserStore } from "./Abp/User";
import { useAuditLogStore } from './AuditLog'
import { useNavigateMenuStore } from "./NavigateMenu";
export const storesContext = React.createContext({
  useAuditLogStore,
  useAccountStore,
  usePermissionStore,
  useRoleStore,
  useSettingStore,
  useTenantsStore,
  useUserStore,
  useEmailSettingStore,
  useNavigateMenuStore
});
export const abpApplicationConfigurationContext = React.createContext({
  useApplicationConfigurationStore,
});

