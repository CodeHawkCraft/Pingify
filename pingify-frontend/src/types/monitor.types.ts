export interface AddMonitorPayload {
  name: string;
  url: string;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export type PingStatus = "up" | "down";

export interface PingLog {
  id: string;
  website_id: string;
  status_code: number | null;
  response_time_ms: number | null;
  status: PingStatus;
  error: string | null;
  pinged_at: string;
}

export interface MonitorLogsQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: PingStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MonitorListResponse {
  data: Monitor[];
  pagination: Pagination;
}

export interface MonitorLogsResponse {
  data: PingLog[];
  pagination: Pagination;
}
