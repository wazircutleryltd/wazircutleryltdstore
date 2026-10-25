"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useAllUsersQuery } from "@/lib/query-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Mail, Phone, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";
import type { Customer } from "@/types";

export default function CustomersClient() {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const pageSize = 10;

  const { data, isLoading, error } = useAllUsersQuery(page, pageSize, searchTerm);

  const customersList = (data?.users || []) as (Customer & Record<string, any>)[];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;

  const columns = useMemo<ColumnDef<Customer & Record<string, any>>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Customer</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const customer = row.original;
          const displayName = customer.full_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Anonymous User";
          const identifier = customer.clerk_id || customer.id || "";
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                <div className="text-xs text-muted-foreground uppercase font-mono">
                  {identifier.substring(0, 8)}...
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Contact</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="space-y-1">
              <div className="flex items-center text-sm font-medium text-gray-900">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1.5 text-gray-400" />
                  {customer.phone}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "orders_count",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Orders</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-gray-800">{row.original.orders_count || 0}</span>
        ),
      },
      {
        accessorKey: "total_spent",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Total Spent</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-emerald-600 font-mono">
            ${(row.original.total_spent || 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "is_active",
        header: () => <span className="font-bold text-gray-700">Status</span>,
        cell: ({ row }) => {
          const isActive = row.original.is_active !== false;
          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : ""}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Joined</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-gray-600 text-sm">
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: customersList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  if (error) {
    return (
      <ErrorState
        message="Could not load customer data. Please check your admin permissions."
        minHeight="h-[60vh]"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer database and view customer accounts.
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200">
          Total Customers: {totalCount}
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Customer Search</CardTitle>
          <CardDescription>
            Search customers by name, email, or user identifier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/75">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <LoadingState minHeight="h-64" message="Fetching customers..." />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <NoDataState
                      message="No customers found"
                      description={
                        searchTerm
                          ? "No customer matches your search filter."
                          : "Your customer base will grow as people register."
                      }
                      minHeight="h-64"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/75 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between bg-gray-50/50">
              <div className="text-sm text-gray-700">
                Showing page <span className="font-semibold text-gray-900">{page}</span> of{" "}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="disabled:opacity-50"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
