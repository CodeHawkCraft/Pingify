import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getMonitors } from "../api/monitor.api";
import type { Monitor, Pagination } from "../types/monitor.types";

export function WebsitesPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getMonitors(page, 10)
      .then((res) => {
        setMonitors(res.data);
        setPagination(res.pagination);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Globe size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Websites</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner" />
        </div>
      ) : monitors.length === 0 ? (
        <div className="text-center py-16 opacity-60">
          <Globe size={40} className="mx-auto mb-3" />
          <p className="text-sm">
            No monitors yet. Add one from the Monitors page.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {monitors.map((m) => (
                  <tr key={m.id}>
                    <td className="font-medium">{m.name}</td>
                    <td>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-sm break-all"
                      >
                        {m.url}
                      </a>
                    </td>
                    <td className="text-sm opacity-70">
                        {new Date(m.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </td>
                    <td>
                      <Link
                        to={`/websites/${m.id}/logs`}
                        state={{ websiteName: m.name }}
                        className="btn btn-sm btn-primary"
                      >
                        Show Logs
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
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
        </>
      )}
    </div>
  );
}
