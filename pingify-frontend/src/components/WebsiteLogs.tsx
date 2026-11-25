import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getMonitorLogs } from "../api/monitor.api";
import { PaginationBar } from "./PaginationBar";
import type { PingLog, Pagination } from "../types/monitor.types";

interface Props {
  websiteId: string;
  websiteName: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    year:"numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second:"2-digit"
  });
}

export function WebsiteLogs({ websiteId }: Props) {
  const [logs, setLogs] = useState<PingLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  // Key of the last request that finished; differs from requestKey while a fetch is in flight.
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const requestKey = `${websiteId}:${page}:${reloadKey}`;
  const isRefreshing = settledKey !== requestKey;

  useEffect(() => {
    getMonitorLogs(websiteId, { page, limit: 10 })
      .then((res) => {
        setLogs(res.data);
        setPagination(res.pagination);
      })
      .finally(() => {
        setIsLoading(false);
        setSettledKey(`${websiteId}:${page}:${reloadKey}`);
      });
  }, [websiteId, page, reloadKey]);

  const refresh = () => setReloadKey((k) => k + 1);

  const refreshButton = (
    <button
      type="button"
      className="btn btn-sm btn-ghost gap-2"
      onClick={refresh}
      disabled={isRefreshing}
      aria-label="Refresh logs"
    >
      <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
      Refresh
    </button>
  );

  const chartData = [...logs]
    .reverse()
    .map((log) => ({
      time: formatTime(log.pinged_at),
      ms: log.response_time_ms ?? null,
    }));

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading logs">
        <div className="skeleton h-60 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-sm font-medium opacity-80">No logs yet.</p>
        <p className="text-sm opacity-60">
          The first check usually takes a few seconds. Click Refresh to see the latest logs.
        </p>
        <p className="text-xs opacity-50">
          If the monitor is paused, resume it to start checks.
        </p>
        <div>{refreshButton}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Response Time Chart */}
      <div className="card card-border card-sm bg-base-100 border-base-content/15">
        <div className="card-body">
          <h2 className="card-title text-sm opacity-70">Response Time (ms)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val) => [`${val ?? "—"} ms`, "Response time"]}
                contentStyle={{
                  backgroundColor: "var(--color-base-200)",
                  border: "1px solid color-mix(in oklab, var(--color-base-content) 15%, transparent)",
                  borderRadius: "var(--radius-box)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="ms"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs Table */}
      <div className="flex items-center justify-between">
        <p className="text-xs opacity-60">Checked every ~3s</p>
        {refreshButton}
      </div>
      <div className="overflow-x-auto rounded-box border">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Status</th>
              <th>Code</th>
              <th>Response Time</th>
              <th>Error</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <span
                    className={`badge badge-sm ${
                      log.status === "up" ? "badge-success" : "badge-error"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="opacity-70">{log.status_code ?? "—"}</td>
                <td className="opacity-70">
                  {log.response_time_ms != null
                    ? `${log.response_time_ms} ms`
                    : "—"}
                </td>
                <td className="opacity-70 max-w-xs truncate">
                  {log.error ?? "—"}
                </td>
                <td className="opacity-70">{formatDateTime(log.pinged_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar pagination={pagination} page={page} onPageChange={setPage} />
    </div>
  );
}

export default WebsiteLogs;
