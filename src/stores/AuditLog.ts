import { create } from "zustand";
import { audit_logApi } from "../apis";
import { AuditLogDto } from "../data/models/AuditLog";
interface AuditLogState {
  getAuditLogs: (data: { current: number; pageSize: number }, form: any) => Promise<{ total: number; list: any[]; }>
  getAuditLogById: (id: string) => Promise<AuditLogDto | undefined>
}
export const useAuditLogStore = create<AuditLogState>()(() => ({
  getAuditLogs: async (data: { current: number; pageSize: number }, form: any) => {
    try {
      const result = await audit_logApi.getAuditLogs({
        skipCount: data.pageSize * (data.current - 1),
        maxResultCount: data.pageSize,
        ...form,
      });
      return {
        total: result.data.totalCount ?? 0,
        list: result.data.items ?? [],
      };
    } catch (error) {
      return { total: 0, list: [] };
    }
  },
  getAuditLogById: async (id: string) => {
    try {
      const audit_log = await audit_logApi.getAuditLogById(id);
      return audit_log.data;
    } catch (error) {
      console.log(error);
    }
  }
}));
