import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "./EmptyState";
import { SearchInput } from "./SearchInput";

type SortDir = "asc" | "desc" | null;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  "data-ocid"?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  searchKeys,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters.",
  className,
  "data-ocid": ocid,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    } else if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };

  return (
    <div className={cn("space-y-4", className)} data-ocid={ocid}>
      {searchable && (
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search..."
          data-ocid={ocid ? `${ocid}.search_input` : "table.search_input"}
        />
      )}
      <div className="rounded-xl border border-border overflow-hidden shadow-elevation-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      col.sortable &&
                      handleSort(String(col.key))
                    }
                    className={cn(
                      "px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider",
                      col.sortable &&
                        "cursor-pointer hover:text-foreground select-none",
                      col.headerClassName,
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable &&
                        (sortKey === String(col.key) ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((row, ri) => (
                  <tr
                    key={`table-row-${ri}-${JSON.stringify(row).length}`}
                    className="bg-card hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn(
                          "px-4 py-3 text-foreground",
                          col.className,
                        )}
                      >
                        {col.render
                          ? col.render(row[String(col.key) as keyof T], row)
                          : String(row[String(col.key) as keyof T] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-ocid={
                  ocid ? `${ocid}.pagination_prev` : "table.pagination_prev"
                }
                className="p-1.5 rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 font-medium">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                data-ocid={
                  ocid ? `${ocid}.pagination_next` : "table.pagination_next"
                }
                className="p-1.5 rounded hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
