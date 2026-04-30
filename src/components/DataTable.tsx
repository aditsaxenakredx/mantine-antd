"use client";

import { useState, useMemo, CSSProperties } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnPinningState,
  type Table,
} from "@tanstack/react-table";
import { Group, Text, ActionIcon, Box } from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

const BRAND = "#6366f1";
const HEADER_BG = "#f8fafc";
const ROW_BG = "#ffffff";
const HOVER_BG = "#f5f3ff";
const BORDER = "#e9ecef";
const HEADER_TEXT = "#6b7280";
const SHADOW_RIGHT = "4px 0 10px rgba(0,0,0,0.07)";
const SHADOW_LEFT = "-4px 0 10px rgba(0,0,0,0.07)";

export interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T, any>[];
  pageSize?: number;
  pagination?: boolean;
  pinnedLeft?: string[];
  pinnedRight?: string[];
  rowHeight?: string | number;
}

function getPinnedCellStyle<T>(
  colId: string,
  table: Table<T>,
  pinnedLeft: string[],
  pinnedRight: string[],
  isHeader: boolean,
  isHovered: boolean
): CSSProperties {
  const isPinnedLeft = pinnedLeft.includes(colId);
  const isPinnedRight = pinnedRight.includes(colId);
  if (!isPinnedLeft && !isPinnedRight) return {};

  const col = table.getColumn(colId);
  const isLastLeft = isPinnedLeft && pinnedLeft[pinnedLeft.length - 1] === colId;
  const isFirstRight = isPinnedRight && pinnedRight[0] === colId;

  const leftOffset = isPinnedLeft
    ? pinnedLeft.slice(0, pinnedLeft.indexOf(colId)).reduce((sum, id) => {
        return sum + (table.getColumn(id)?.getSize() ?? 150);
      }, 0)
    : undefined;

  const rightOffset = isPinnedRight
    ? pinnedRight.slice(pinnedRight.indexOf(colId) + 1).reduce((sum, id) => {
        return sum + (table.getColumn(id)?.getSize() ?? 150);
      }, 0)
    : undefined;

  return {
    position: "sticky",
    left: leftOffset,
    right: rightOffset,
    zIndex: isHeader ? 3 : 2,
    background: isHovered ? HOVER_BG : ROW_BG,
    boxShadow: isLastLeft ? SHADOW_RIGHT : isFirstRight ? SHADOW_LEFT : undefined,
  };
}

export function DataTable<T extends object>({
  data,
  columns,
  pageSize = 10,
  pagination = false,
  pinnedLeft = [],
  pinnedRight = [],
  rowHeight = "3.375rem",
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const columnPinning = useMemo<ColumnPinningState>(
    () => ({ left: pinnedLeft, right: pinnedRight }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinnedLeft.join(","), pinnedRight.join(",")]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnPinning },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: pagination ? pageSize : 10000 },
    },
  });

  const rows = pagination
    ? table.getPaginationRowModel().rows
    : table.getRowModel().rows;

  const totalSize = table.getAllLeafColumns().reduce(
    (sum, col) => sum + col.getSize(),
    0
  );

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <Box>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: totalSize,
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            {table.getAllLeafColumns().map((col) => (
              <col key={col.id} style={{ width: col.getSize() }} />
            ))}
          </colgroup>

          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const colId = header.column.id;

                  return (
                    <th
                      key={header.id}
                      style={{
                        ...getPinnedCellStyle(
                          colId,
                          table,
                          pinnedLeft,
                          pinnedRight,
                          true,
                          false
                        ),
                        background: HEADER_BG,
                        padding: "0 1rem",
                        height: "2.875rem",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: HEADER_TEXT,
                        whiteSpace: "nowrap",
                        cursor: canSort ? "pointer" : "default",
                        userSelect: "none",
                        borderBottom: `2px solid ${BORDER}`,
                        overflow: "hidden",
                      }}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <Group gap={4} wrap="nowrap" align="center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <Box
                            style={{
                              color: sorted ? BRAND : "#d1d5db",
                              flexShrink: 0,
                              lineHeight: 0,
                            }}
                          >
                            {sorted === "asc" ? (
                              <IconChevronUp size={12} />
                            ) : sorted === "desc" ? (
                              <IconChevronDown size={12} />
                            ) : (
                              <IconSelector size={12} />
                            )}
                          </Box>
                        )}
                      </Group>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => {
              const isHovered = hoveredRow === rowIdx;
              return (
                <tr
                  key={row.id}
                  onMouseEnter={() => setHoveredRow(rowIdx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: isHovered ? HOVER_BG : ROW_BG,
                    borderBottom: `1px solid ${BORDER}`,
                    transition: "background 0.1s",
                  }}
                >
                  {row.getVisibleCells().map((cell, cellIdx) => {
                    const colId = cell.column.id;
                    const isFirstCell = cellIdx === 0;
                    const pinnedStyle = getPinnedCellStyle(
                      colId,
                      table,
                      pinnedLeft,
                      pinnedRight,
                      false,
                      isHovered
                    );

                    return (
                      <td
                        key={cell.id}
                        style={{
                          ...pinnedStyle,
                          padding: "0 1rem",
                          height: rowHeight,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          fontSize: "0.8125rem",
                          borderLeft: isFirstCell
                            ? `3px solid ${isHovered ? BRAND : "transparent"}`
                            : undefined,
                          paddingLeft: isFirstCell ? "0.8125rem" : undefined,
                          transition: "border-left-color 0.1s",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    height: "7.5rem",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.8125rem",
                  }}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pageCount > 1 && (
        <Group
          justify="space-between"
          align="center"
          style={{
            padding: "0 1rem",
            height: "2.75rem",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <Text size="xs" c="dimmed">
            Showing{" "}
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length}
          </Text>
          <Group gap={4} wrap="nowrap">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <IconChevronLeft size={14} />
            </ActionIcon>

            {Array.from({ length: pageCount }, (_, i) => i)
              .filter((i) => {
                if (pageCount <= 7) return true;
                if (i === 0 || i === pageCount - 1) return true;
                return Math.abs(i - pageIndex) <= 2;
              })
              .reduce<(number | "...")[]>((acc, i, idx, arr) => {
                if (idx > 0 && (arr[idx - 1] as number) < i - 1) acc.push("...");
                acc.push(i);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <Text key={`ellipsis-${idx}`} size="xs" c="dimmed" style={{ padding: "0 0.25rem" }}>
                    …
                  </Text>
                ) : (
                  <ActionIcon
                    key={item}
                    size="sm"
                    variant={item === pageIndex ? "filled" : "subtle"}
                    color={item === pageIndex ? "indigo" : "gray"}
                    onClick={() => table.setPageIndex(item as number)}
                    style={{ fontWeight: item === pageIndex ? 700 : 400 }}
                  >
                    <Text size="xs">{(item as number) + 1}</Text>
                  </ActionIcon>
                )
              )}

            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <IconChevronRight size={14} />
            </ActionIcon>
          </Group>
        </Group>
      )}
    </Box>
  );
}
