import { useEffect, useState } from "react";
import { Bell, CircleAlert, CircleCheck } from "lucide-react";
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
    <div className="card card-border card-sm bg-base-100 border-base-content/15">
      <div className="card-body">
        <h2 className="card-title text-sm opacity-70">
          <Bell size={14} /> Alert History
        </h2>

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
          <ul className="timeline timeline-vertical timeline-compact timeline-snap-icon">
            {alerts.map((a, i) => {
              const down = a.type === "down";
              return (
                <li key={a.id}>
                  {i > 0 && <hr />}
                  <div className="timeline-middle">
                    {down ? (
                      <CircleAlert size={18} className="text-error" />
                    ) : (
                      <CircleCheck size={18} className="text-success" />
                    )}
                  </div>
                  <div className="timeline-end mb-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`badge badge-sm ${down ? "badge-error" : "badge-success"}`}>
                        {down ? "Went down" : "Recovered"}
                      </span>
                      <time className="opacity-60">{new Date(a.created_at).toLocaleString("en-IN")}</time>
                      <span className="opacity-60">· {a.sent_at ? "✉️ emailed" : "not sent"}</span>
                    </div>
                    {a.reason && <p className="mt-1 opacity-70 break-words">{a.reason}</p>}
                  </div>
                  {i < alerts.length - 1 && <hr />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
