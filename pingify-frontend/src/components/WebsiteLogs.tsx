import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  useEffect(() => {
    setIsLoading(true);
    getMonitorLogs(websiteId, { page, limit: 100 })
      .then((res) => {
        setLogs(res.data);
        setPagination(res.pagination);
      })
      .finally(() => setIsLoading(false));
  }, [websiteId, page]);

  const chartData = [...logs]
    .reverse()
    .map((log) => ({
      time: formatTime(log.pinged_at),
      ms: log.response_time_ms ?? null,
    }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-16 opacity-60">
        <p className="text-sm">No logs found for this monitor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Response Time Chart */}
      <div className="border p-4">
        <p className="text-sm font-medium mb-3 opacity-70">Response Time (ms)</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(val: number) => [`${val} ms`, "Response time"]}
              contentStyle={{
                backgroundColor: "var(--color-base-200)",
                borderRadius: "6px",
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

      {/* Logs Table */}
      <div className="overflow-x-auto border">
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">
            Page {pagination.page} of {pagination.totalPages} &middot;{" "}
            {pagination.total} total
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="btn btn-sm btn-ghost"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebsiteLogs;
