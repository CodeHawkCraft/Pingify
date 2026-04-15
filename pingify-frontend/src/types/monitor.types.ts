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
