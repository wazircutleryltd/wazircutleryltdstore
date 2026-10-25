"use client";

import { useState, useMemo } from "react";
import { 
  Eye, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Phone, 
  MessageSquare, 
  Search, 
  Building2, 
  MapPin, 
  Package, 
  ExternalLink,
  Filter
} from "lucide-react";
import { useContactSubmissionsQuery, useUpdateContactSubmissionStatusMutation } from "@/lib/query-hooks";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";

interface ContactSubmissionItem {
  id: string;
  created_at: string;
  status: string;
  message?: string;
  full_name?: string;
  name?: string;
  email: string;
  phone_number?: string;
  whatsapp_number?: string;
  company_name?: string;
  country?: string;
  city?: string;
  product_quantity?: number | string;
  shipment_address?: string;
  emergency_contact?: string;
  [key: string]: any;
}

export default function ContactSubmissionsClient() {
  const { data: submissions = [], isLoading: loading, error } = useContactSubmissionsQuery();
  const updateStatusMutation = useUpdateContactSubmissionStatusMutation();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmissionItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleUpdateStatus = async (submissionId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ submissionId, status: newStatus });
      toast.success(`Inquiry marked as ${newStatus.replace("_", " ")}`);
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Failed to update submission status:", err);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const filteredSubmissions = useMemo(() => {
    return (submissions || []).filter((sub: ContactSubmissionItem) => {
      const name = (sub.full_name || sub.name || "").toLowerCase();
      const email = (sub.email || "").toLowerCase();
      const country = (sub.country || "").toLowerCase();
      const message = (sub.message || "").toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                            email.includes(searchTerm.toLowerCase()) ||
                            country.includes(searchTerm.toLowerCase()) ||
                            message.includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const viewSubmissionDetails = (submission: ContactSubmissionItem) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    if (submission.status === "new") {
      handleUpdateStatus(submission.id, "in_progress");
    }
  };

  if (loading) {
    return <LoadingState message="Summoning inquiries from the forge archives..." minHeight="h-[60vh]" />;
  }

  if (error) {
    return <ErrorState message="Could not connect to contact submissions database." minHeight="h-[60vh]" />;
  }

  return (
    <div className="space-y-8">
      {/* Header and Counters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 font-geist tracking-tight">
            Patron Inquiries & Commissions
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review custom commission briefs, wholesale requests, and customer messages.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700">
          <span>Total Records:</span>
          <span className="font-mono text-[#D6AF66]">{submissions.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        {/* Search */}
        <div className="md:col-span-7 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patron name, email, country, or message keyword..."
            className="pl-11 h-12 rounded-xl bg-neutral-50/50 border-neutral-200 text-sm"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="md:col-span-5 flex items-center justify-end gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "New" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Resolved" },
            { id: "cancelled", label: "Archived" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#D6AF66] text-neutral-950 shadow-md shadow-[#D6AF66]/20 font-black"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List / Table View */}
      {filteredSubmissions.length === 0 ? (
        <NoDataState 
          message="No inquiries found" 
          description="Try refining your search keyword or selecting a different status filter." 
          minHeight="h-[40vh]" 
        />
      ) : (
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {filteredSubmissions.map((sub: ContactSubmissionItem) => {
              const patronName = sub.full_name || sub.name || "Patron";
              const whatsappNumber = sub.whatsapp_number || sub.phone_number;
              const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, "") : "";

              return (
                <div key={sub.id} className="p-6 hover:bg-neutral-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-neutral-900 font-geist text-base">{patronName}</span>
                      <span className="text-xs text-neutral-400 font-mono">{sub.email}</span>
                      {sub.country && (
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold">
                          {sub.country}{sub.city ? `, ${sub.city}` : ""}
                        </span>
                      )}
                      {sub.company_name && (
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {sub.company_name}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                      {sub.message || "No message content provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(sub.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </span>
                      {sub.product_quantity && (
                        <span className="flex items-center gap-1 font-semibold text-neutral-700">
                          <Package className="h-3.5 w-3.5 text-[#D6AF66]" />
                          Qty: {sub.product_quantity} units
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Status Pill Selector */}
                    <select
                      value={sub.status}
                      onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                      className={`h-9 px-3 text-xs font-bold rounded-xl border border-neutral-200 outline-none cursor-pointer ${
                        sub.status === "new"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : sub.status === "in_progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : sub.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Resolved</option>
                      <option value="cancelled">Archived</option>
                    </select>

                    {/* WhatsApp Quick Link if available */}
                    {cleanWaNumber && (
                      <a
                        href={`https://wa.me/${cleanWaNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-all shadow-2xs"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    )}

                    {/* Email Link */}
                    <a
                      href={`mailto:${sub.email}?subject=Wazir%20Cutlery%20Commission%20Inquiry`}
                      className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-all shadow-2xs"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>

                    {/* View Details Button */}
                    <Button
                      onClick={() => viewSubmissionDetails(sub)}
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-neutral-200 font-bold text-xs hover:border-[#D6AF66] hover:text-[#D6AF66]"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {showModal && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[#0C0D0E]/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] border border-neutral-100 shadow-2xl p-6 sm:p-8 overflow-hidden z-50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-neutral-900 font-geist">Patron Inquiry Brief</h3>
                  <p className="text-xs text-neutral-400">
                    Submitted on {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Status and Patron info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Patron Name:</span>
                  <p className="font-bold text-neutral-900 text-sm">{selectedSubmission.full_name || selectedSubmission.name || "Patron"}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Email Address:</span>
                  <p className="font-bold text-neutral-900 text-sm font-mono">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone_number && (
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Phone Number:</span>
                    <p className="font-bold text-neutral-900 font-mono">{selectedSubmission.phone_number}</p>
                  </div>
                )}
                {selectedSubmission.whatsapp_number && (
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">WhatsApp:</span>
                    <p className="font-bold text-emerald-600 font-mono font-bold">{selectedSubmission.whatsapp_number}</p>
                  </div>
                )}
                {selectedSubmission.country && (
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Location:</span>
                    <p className="font-bold text-neutral-900">{selectedSubmission.country}{selectedSubmission.city ? `, ${selectedSubmission.city}` : ""}</p>
                  </div>
                )}
                {selectedSubmission.product_quantity && (
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-1">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Requested Quantity:</span>
                    <p className="font-bold text-[#D6AF66] text-sm">{selectedSubmission.product_quantity} units</p>
                  </div>
                )}
              </div>

              {/* Shipment Address if present */}
              {selectedSubmission.shipment_address && (
                <div className="p-4 bg-neutral-50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">Shipment Address:</span>
                  <p className="text-neutral-700">{selectedSubmission.shipment_address}</p>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <span className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Commission Message / Specifications:</span>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400">Update Status:</span>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => handleUpdateStatus(selectedSubmission.id, e.target.value)}
                    className="h-9 px-3 text-xs font-bold rounded-xl border border-neutral-200 outline-none"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Resolved</option>
                    <option value="cancelled">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedSubmission.whatsapp_number && (
                    <a
                      href={`https://wa.me/${selectedSubmission.whatsapp_number.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Patron
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Wazir%20Cutlery%20Inquiry%20Response`}
                    className="h-10 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Mail className="h-3.5 w-3.5" /> Send Email
                  </a>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="h-10 px-4 rounded-xl border-neutral-200 font-bold text-xs"
                  >
                    Close
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