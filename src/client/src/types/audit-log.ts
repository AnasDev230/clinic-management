export enum AuditAction {
  Create = 0,
  Update = 1,
  Delete = 2,
  Login = 3,
  Logout = 4,
  FailedLogin = 5,
  StatusChange = 6,
  Payment = 7,
  Refund = 8,
  Print = 9,
  Export = 10,
}

export interface AuditLogChangeItem {
  field: string;
  old?: unknown;
  new?: unknown;
}

export interface AuditLogDetail {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  entityDisplayName?: string | null;
  changes?: string | null;
  parsedChanges?: AuditLogChangeItem[] | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: string;
  additionalInfo?: string | null;
}

export interface AuditLogListItem {
  id: string;
  userName?: string | null;
  action: AuditAction;
  entityType: string;
  entityDisplayName?: string | null;
  timestamp: string;
  ipAddress?: string | null;
}
