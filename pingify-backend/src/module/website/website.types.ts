import type { Websites, PingLogs } from "../../database/types.ts";

export type WebsiteResponse = Pick<Websites, "id" | "name" | "url" | "is_paused" | "created_at">;

export type PingLogResponse = PingLogs;

// export interface StatusSummary {
//   uptimePercentage: number;
//   avgResponseTime: number | null;
// }
