import { ExtensibleEntityDto } from "@abp/ng.core";

export interface AuditLogDto extends ExtensibleEntityDto<string> {
  userName: string;
  executionTime: string;
  executionDuration: number;
  clientIpAddress: string;
  browserInfo: string;
  url: string;
}
