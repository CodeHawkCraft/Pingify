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
