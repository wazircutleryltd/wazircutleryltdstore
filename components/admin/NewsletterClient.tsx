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
import {
  useNewsletterSubscribersQuery,
  useDeleteNewsletterSubscriberMutation,
} from "@/lib/query-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";
import type { NewsletterSubscriber } from "@/types";

export default function NewsletterClient() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: subscribers = [], isLoading, error } = useNewsletterSubscribersQuery();
  const deleteMutation = useDeleteNewsletterSubscriberMutation();

  const filteredSubscribers = useMemo(() => {
    return (subscribers || []).filter((subscriber: NewsletterSubscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await deleteMutation.mutateAsync(subscriberId);
        toast.success("Subscriber deleted successfully!");
      } catch (err) {
        console.error("Error deleting subscriber:", err);
        toast.error("Failed to delete subscriber. Please try again.");
      }
    }
  };

  const columns = useMemo<ColumnDef<NewsletterSubscriber>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Email</span>
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
          <span className="font-medium text-gray-900">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black transition-colors"
          >
            <span>Subscription Date</span>
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
      {
        id: "actions",
        header: () => <span className="font-bold text-gray-700">Actions</span>,
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-red-600 hover:text-red-700 border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors shadow-none"
            onClick={() => handleDeleteSubscriber(row.original.id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteMutation.isPending]
  );

  const table = useReactTable({
    data: filteredSubscribers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2C2C2C] mb-2">
            Newsletter Subscribers
          </h2>
          <p className="text-[#2C2C2C] opacity-80">
            Manage your newsletter audience and subscriber list.
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-600 bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200">
          Total Subscribers: {subscribers.length}
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#2C2C2C]">Subscriber Search</CardTitle>
          <CardDescription className="text-[#2C2C2C] opacity-80">
            Search for subscribers by email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-[#2C2C2C]">All Subscribers</CardTitle>
          <CardDescription className="text-[#2C2C2C] opacity-80">
            A sortable, real-time list of all newsletter subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <LoadingState message="Fetching subscribers..." minHeight="h-48" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <ErrorState message="Could not load subscribers." minHeight="h-48" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <NoDataState
                      message="No subscribers found"
                      description={
                        searchTerm
                          ? "No subscriber matches your search filter."
                          : "Your newsletter audience will appear here once users subscribe."
                      }
                      minHeight="h-48"
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
        </CardContent>
      </Card>
    </div>
  );
}
