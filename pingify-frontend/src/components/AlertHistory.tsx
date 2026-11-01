import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getMonitorAlerts } from "../api/monitor.api";
import type { Alert } from "../types/monitor.types";

export function AlertHistory({ websiteId }: { websiteId: string }) {
  const [alerts, setAlerts] = useState<Alert[] | null>(null);

  useEffect(() => {
    getMonitorAlerts(websiteId)
      .then(setAlerts)
      .catch(() => setAlerts([]));
  }, [websiteId]);

  return (
    <div className="border p-4">
      <p className="text-sm font-medium mb-3 opacity-70 flex items-center gap-2">
        <Bell size={14} /> Alert History
      </p>

      {alerts === null ? (
        <div className="space-y-2" aria-busy="true" aria-label="Loading alerts">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-6 w-full" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <p className="text-sm opacity-60">
          No alerts yet. You'll get an email after 3 failed checks in a row, and again when it recovers.
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {alerts.map((a) => (
            <li key={a.id} className="flex items-center gap-3">
              <span className={`badge badge-sm ${a.type === "down" ? "badge-error" : "badge-success"}`}>
                {a.type === "down" ? "Went down" : "Recovered"}
              </span>
              <span className="opacity-70 flex-1 truncate">{a.reason ?? "—"}</span>
              <span className="opacity-60">{new Date(a.created_at).toLocaleString("en-IN")}</span>
              <span className="opacity-60 w-20 text-right">{a.sent_at ? "✉️ emailed" : "not sent"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
