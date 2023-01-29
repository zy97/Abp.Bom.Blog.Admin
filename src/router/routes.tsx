import { RouteObject } from "react-router-dom";
import App from "../App";
import AuditLog from "../pages/Admin/AuditLog";
import EmailSetting from "../pages/Admin/EmailSetting";
import Role from "../pages/Admin/Role";
import SystemSetting from "../pages/Admin/SystemSetting";
import Tenant from "../pages/Admin/Tenant";
import User from "../pages/Admin/User";
import NotFound from "../pages/NotFound";

export type Route = RouteObject & {
    title?: string;
    showInMenu?: boolean;
    children?: Route[];
    permission?: string
}
const app = <App />

export const ROUTES: Route[] = [
    {
        path: "/",
        element: app,
        children: [
            { index: true, element: <User /> },
            {
                title: "系统管理",
                path: "/sysmanage",
                children: [
                    { index: true, element: <User /> },
                    { title: "用户管理", path: "user", element: <User />, permission: "AbpIdentity.Users" },
                    { title: "角色管理", path: "role", element: <Role />, permission: "AbpIdentity.Roles" },
                    { title: "审计日志", path: "auditlog", element: <AuditLog />, permission: "Blog.Admin" },
                    { title: "邮件设置", path: "emailsetting", element: <EmailSetting />, permission: "SettingManagement.Emailing" },
                    { title: "租户设置", path: "tenants", element: <Tenant />, permission: "AbpTenantManagement.Tenants" },
                    { title: "系统设置", path: "systemSetting", element: <SystemSetting />, permission: "Blog.SystemSetting" },
                ] as Route[],
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ] as Route[],
    },
];