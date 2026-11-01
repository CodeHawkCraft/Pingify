import { useEffect, useRef, useState } from "react";
import { Globe, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteMonitor, getMonitors } from "../api/monitor.api";
import { PaginationBar } from "../components/PaginationBar";
import type { Monitor, Pagination } from "../types/monitor.types";

export function WebsitesPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Monitor | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getMonitors(page, 10)
      .then((res) => {
        setMonitors(res.data);
        setPagination(res.pagination);
      })
      .finally(() => setIsLoading(false));
  }, [page, reload]);

  const askDelete = (m: Monitor) => {
    setPendingDelete(m);
    deleteDialogRef.current?.showModal();
  };

  const handleDelete = async () => {
    const m = pendingDelete;
    if (!m) return;
    setDeletingId(m.id);
    try {
      await deleteMonitor(m.id);
      // Last item on a later page -> step back, otherwise refetch current page
      if (monitors.length === 1 && page > 1) setPage((p) => p - 1);
      else setReload((r) => r + 1);
    } catch {
      // error toast already shown by apiHandler
    } finally {
      setDeletingId(null);
      deleteDialogRef.current?.close();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Globe size={22} className="text-primary" />
        <h1 className="text-2xl font-bold">Websites</h1>
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy="true" aria-label="Loading websites">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
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
                    <td className="flex gap-2">
                      <Link
                        to={`/websites/${m.id}/logs`}
                        state={{ websiteName: m.name }}
                        className="btn btn-sm btn-primary"
                      >
                        Show Logs
                      </Link>
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        aria-label={`Delete ${m.name}`}
                        disabled={deletingId === m.id}
                        onClick={() => askDelete(m)}
                      >
                        {deletingId === m.id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationBar pagination={pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <dialog ref={deleteDialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete monitor?</h3>
          <p className="py-4">
            <span className="font-medium">"{pendingDelete?.name}"</span> and all its logs will be
            permanently deleted. This cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost" disabled={!!deletingId}>
                Cancel
              </button>
            </form>
            <button className="btn btn-error" disabled={!!deletingId} onClick={handleDelete}>
              {deletingId ? <span className="loading loading-spinner loading-sm" /> : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
