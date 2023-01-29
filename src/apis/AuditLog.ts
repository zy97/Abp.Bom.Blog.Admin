import { PagedResultDto, PagedResultRequestDto } from "@abp/ng.core";
import axios from "axios";
import { AuditLogDto } from "../data/models/AuditLog";

// 获取列表
export const getAuditLogs = (params: PagedResultRequestDto) =>
  axios.get<PagedResultDto<AuditLogDto>>(`/api/app/audit-log`, { params });

// 获取指定项
export const getAuditLogById = (id: string) =>
  axios.get<AuditLogDto>(`/api/app/audit-log/${id}`, {});
