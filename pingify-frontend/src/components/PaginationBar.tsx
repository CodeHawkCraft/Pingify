import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination as PaginationInfo } from "../types/monitor.types";

interface Props {
  pagination: PaginationInfo | null;
  page: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ pagination, page, onPageChange }: Props) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm opacity-60">{pagination.total} total</span>
      <div className="join">
        <button
          className="join-item btn btn-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <button className="join-item btn btn-sm pointer-events-none">
          Page {pagination.page} of {pagination.totalPages}
        </button>
        <button
          className="join-item btn btn-sm"
          aria-label="Next page"
          disabled={page >= pagination.totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
