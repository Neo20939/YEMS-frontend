"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  selectedRows?: Set<string | number>;
  onRowSelect?: (id: string | number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  rowKey?: keyof T | ((item: T) => string | number) | string;
  className?: string;
  getRowId?: (item: T) => string;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  onSort,
  sortKey,
  sortOrder,
  selectedRows,
  onRowSelect,
  onSelectAll,
  rowKey = "id",
  className,
}: TableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;

    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    onSort(key, newOrder);
  };

  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    if (column.render) {
      return column.render(item, data.indexOf(item));
    }

    const keys = String(column.key).split(".");
    let value: unknown = item;
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
    }
    return value as React.ReactNode;
  };

  const getRowIdentifier = (item: T): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(item);
    }
    return item[rowKey as keyof T] as string | number;
  };

  const allSelected = selectedRows && data.length > 0 && data.every((item) => selectedRows.has(getRowIdentifier(item)));
  const someSelected = selectedRows && data.some((item) => selectedRows.has(getRowIdentifier(item)));

  return (
    <div className={cn("overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
              {onSelectAll && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected || false}
                    ref={(el) => {
                      if (el) el.indeterminate = !allSelected && !!someSelected;
                    }}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider",
                    column.headerClassName,
                    column.sortable && "cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="text-slate-400">
                        {sortKey === String(column.key) ? (
                          sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronUp className="w-4 h-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {onSelectAll && <td className="px-4 py-4"><div className="w-4 h-4 bg-stone-200 dark:bg-stone-700 rounded" /></td>}
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onSelectAll ? 1 : 0)} className="px-4 py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowId = getRowIdentifier(item);
                const isSelected = selectedRows?.has(rowId) || false;

                return (
                  <tr
                    key={String(rowId)}
                    className={cn(
                      "transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/30",
                      isSelected && "bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    {onRowSelect && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onRowSelect(rowId, e.target.checked)}
                          className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn("px-4 py-4 text-sm text-slate-900 dark:text-slate-100", column.className)}
                      >
                        {getCellValue(item, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
