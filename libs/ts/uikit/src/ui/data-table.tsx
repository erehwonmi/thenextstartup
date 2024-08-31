'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { useState } from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Pagination = { pageSize: number; pageIndex: number };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onPaginationChange?: OnChangeFn<PaginationState>;
  pagination?: Pagination;
  pageCount?: number;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

interface ColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
}

export const usePagination = (initialSize = 10) => {
  const [pagination, setPagination] = useState({
    pageSize: initialSize,
    pageIndex: 0,
  });

  const { pageSize, pageIndex } = pagination;

  return {
    onPaginationChange: setPagination,
    pagination,
    limit: pageSize,
    skip: pageSize * pageIndex,
  };
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onPaginationChange,
  pagination,
  pageCount,
  onRowSelectionChange,
  rowSelection = {},
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: onRowSelectionChange
      ? onRowSelectionChange
      : undefined,
    onPaginationChange,
    pageCount,
    state: {
      rowSelection,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <>
      <div className="rounded-md border flex justify-center flex-col">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as ColumnMeta;
                  return (
                    <TableHead
                      key={header.id}
                      className={meta?.headerClassName}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as ColumnMeta;
                    return (
                      <TableCell key={cell.id} className={meta?.cellClassName}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pageCount && pageCount > 0 && pagination && onPaginationChange && (
        <footer className="flex flex-row justify-center my-10 gap-5">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.toggleAllPageRowsSelected(false);
              table.previousPage();
            }}
          >
            <ChevronLeft />
          </Button>

          <p className="text-sm text-center py-2">{`Page ${
            table.getState().pagination.pageIndex + 1
          } of ${table.getPageCount()}`}</p>

          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => {
              table.toggleAllPageRowsSelected(false);
              table.nextPage();
            }}
          >
            <ChevronRight />
          </Button>
        </footer>
      )}
    </>
  );
}
