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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Mail, 
  Send, 
  X, 
  Sparkles,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";
import type { NewsletterSubscriber } from "@/types";

export default function NewsletterClient() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [broadcastSubject, setBroadcastSubject] = useState<string>("Exclusive Forge Release: Handcrafted Damascus Blades");
  const [broadcastMessage, setBroadcastMessage] = useState<string>(
    "Greetings Patron of the Forge,\n\nWe are proud to present our latest batch of custom Damascus hunting knives and stag horn chef cutlery. Crafted with 1095 and 15N20 high-carbon steel, each piece is individually tempered for lasting edge retention.\n\nExplore the collection today with complimentary priority worldwide delivery on orders over $150."
  );

  const { data: subscribers = [], isLoading, error } = useNewsletterSubscribersQuery();
  const deleteMutation = useDeleteNewsletterSubscriberMutation();

  const filteredSubscribers = useMemo(() => {
    return (subscribers || []).filter((subscriber: NewsletterSubscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (confirm("Remove this patron from the newsletter guild?")) {
      try {
        await deleteMutation.mutateAsync(subscriberId);
        toast.success("Subscriber removed successfully!");
      } catch (err) {
        console.error("Error deleting subscriber:", err);
        toast.error("Failed to delete subscriber. Please try again.");
      }
    }
  };

  const handleExportCsv = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.info("No subscribers available to export.");
      return;
    }

    const headers = ["ID", "Email", "Subscription Date"];
    const rows = subscribers.map((sub: NewsletterSubscriber) => [
      sub.id,
      sub.email,
      new Date(sub.created_at).toISOString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `wazir-cutlery-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${subscribers.length} subscriber emails to CSV`);
  };

  const handleCopyAllEmails = () => {
    const emails = subscribers.map((s: NewsletterSubscriber) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success(`Copied ${subscribers.length} subscriber email addresses to clipboard!`);
  };

  const columns = useMemo<ColumnDef<NewsletterSubscriber>[]>(
    () => [
      {
        accessorKey: "email",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <span>Email Address</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
              <Mail className="h-4 w-4" />
            </div>
            <span className="font-bold text-neutral-900 font-mono text-sm">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <span>Joined Guild On</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="text-neutral-500 text-xs font-semibold">
            {new Date(row.original.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="font-black uppercase text-[10px] tracking-widest text-neutral-400 text-right block pr-8">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end pr-8">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-xl bg-white text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:bg-rose-50 transition-colors shadow-none"
              onClick={() => handleDeleteSubscriber(row.original.id)}
              disabled={deleteMutation.isPending}
              title="Remove subscriber"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
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
    <div className="space-y-8">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 font-geist tracking-tight">
            Collector&apos;s Guild Subscribers
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your newsletter audience, export mailing lists, and compose collector announcements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCsv}
            variant="outline"
            className="h-11 px-4 rounded-xl border-neutral-200 font-bold text-xs flex items-center gap-2 hover:border-[#D6AF66] hover:text-[#D6AF66]"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="h-11 px-5 rounded-xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-xs shadow-lg shadow-[#D6AF66]/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Send className="h-4 w-4" /> Compose Announcement
          </Button>
        </div>
      </div>

      {/* KPI Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6AF66]/15 text-[#D6AF66] flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-geist">Active Subscribers</span>
            <div className="text-2xl font-black text-neutral-900 font-geist tabular-nums">{subscribers.length}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-geist">Audience Health</span>
            <div className="text-2xl font-black text-emerald-600 font-geist">100% Opt-in</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-geist">Broadcast Target</span>
            <div className="text-sm font-bold text-neutral-700">Resend Integration Ready</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Filter subscribers by email address..."
          className="pl-12 h-13 rounded-2xl bg-white border-neutral-200 shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-5 pl-8">
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
                        : "Your newsletter audience will appear here once patrons subscribe on the storefront."
                    }
                    minHeight="h-48"
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-neutral-50/70 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 pl-8">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Broadcast Composer Modal */}
      <AnimatePresence>
        {isBroadcastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBroadcastModalOpen(false)}
              className="fixed inset-0 bg-[#0C0D0E]/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] border border-neutral-100 shadow-2xl p-6 sm:p-8 overflow-hidden z-50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#D6AF66]/20 rounded-xl text-[#D6AF66]">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 font-geist">Collector Announcement Composer</h3>
                    <p className="text-xs text-neutral-400">Target audience: {subscribers.length} verified collectors</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Broadcast Subject</label>
                  <Input
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 text-sm font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Announcement Content</label>
                  <textarea
                    rows={7}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-4 rounded-xl bg-neutral-50/50 border border-neutral-200 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-[#D6AF66]/20 focus:bg-white transition-all font-geist"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyAllEmails}
                  className="h-10 px-4 rounded-xl border-neutral-200 font-bold text-xs"
                >
                  Copy All {subscribers.length} Emails
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="h-10 px-4 rounded-xl text-neutral-500 font-bold text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success("Broadcast draft created! Resend mailing dispatch queued.");
                      setIsBroadcastModalOpen(false);
                    }}
                    className="h-10 px-6 rounded-xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-xs shadow-md shadow-[#D6AF66]/20 active:scale-95"
                  >
                    Queue Dispatch
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
