'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useAllOrdersQuery, useUpdateOrderStatusMutation } from '@/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { LoadingState, ErrorState, NoDataState } from '../common/StateComponents';
import type { Order } from '@/types';

const OrdersClient = () => {
  const [page, setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const pageSize = 10;

  const { data, isLoading: loading, error } = useAllOrdersQuery(page, pageSize, statusFilter);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const orders: Order[] = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleUpdateStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error('Failed to update status. Please try again.');
    }
  }, [updateStatusMutation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'confirmed':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-purple-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'order',
        accessorKey: 'order_number',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
          >
            Order #
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <div className="font-bold text-[#2C2C2C] font-geist tracking-tight">
                  {order.order_number}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'customer',
        header: () => (
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">
            Customer
          </span>
        ),
        cell: ({ row }) => {
          const order = row.original;
          const name = order.shipping_address?.full_name || 'Guest Patron';
          const email = order.shipping_address?.email || '—';
          return (
            <div>
              <div className="font-semibold text-gray-800 text-sm">{name}</div>
              <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{email}</div>
            </div>
          );
        },
      },
      {
        id: 'total',
        accessorKey: 'total',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
          >
            Total
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <div className="font-bold text-[#2C2C2C] tabular-nums font-geist">
            ${parseFloat(String(getValue() || 0)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => (
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">
            Status
          </span>
        ),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <select
              value={order.status}
              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
              disabled={updateStatusMutation.isPending}
              className={`text-xs font-bold border rounded-xl px-2.5 py-1.5 outline-none transition-all cursor-pointer ${getStatusColor(
                order.status
              )}`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          );
        },
      },
      {
        id: 'actions',
        header: () => (
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right block pr-6">
            Actions
          </span>
        ),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <div className="flex justify-end pr-6">
              <button
                onClick={() => viewOrderDetails(order)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl shadow-sm text-xs font-semibold text-gray-600 hover:text-[#D6AF66] hover:border-[#D6AF66]/30 transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect
              </button>
            </div>
          );
        },
      },
    ],
    [updateStatusMutation.isPending, handleUpdateStatus]
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2C2C2C] font-geist mb-1">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            Monitor acquisitions, fulfillment lifecycle, and customer deliveries.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#D6AF66] focus:ring-2 focus:ring-[#D6AF66]/20 transition-all shadow-sm"
          >
            <option value="all">All Lifecycles</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-5 pl-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <LoadingState message="Summoning acquisition records..." minHeight="h-48" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <ErrorState message="Could not retrieve transactions." minHeight="h-48" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <NoDataState
                    message="No orders located"
                    description="Incoming transactions will appear here once finalized by patrons."
                    minHeight="h-48"
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 pl-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <span className="text-xs font-bold text-gray-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D6AF66] transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D6AF66] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  return (
    <motion.div
      key="order-modal-container"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        key="order-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
      />
      <motion.div
        key="order-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative mx-auto p-6 border border-gray-100 w-full max-w-2xl shadow-2xl rounded-3xl bg-white overflow-hidden z-50 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 font-geist">Order Chronicle</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order.order_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-5">
          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
              Order Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Order ID:</span>
                <p className="font-bold text-gray-800">{order.order_number}</p>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <p className="font-bold text-gray-800">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Payment Method:</span>
                <p className="font-bold text-gray-800 capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <p className="font-bold text-gray-800 capitalize">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
              Customer Information
            </h4>
            <div className="text-xs space-y-1">
              <p>
                <span className="text-gray-400">Name:</span>{' '}
                <span className="font-bold text-gray-800">{order.shipping_address?.full_name}</span>
              </p>
              <p>
                <span className="text-gray-400">Email:</span>{' '}
                <span className="font-bold text-gray-800">{order.shipping_address?.email}</span>
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{' '}
                <span className="font-bold text-gray-800">{order.shipping_address?.phone}</span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
              Shipping Address
            </h4>
            <div className="text-xs font-semibold text-gray-800">
              <p>{order.shipping_address?.address}</p>
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.country}
              </p>
              {order.shipping_address?.postal_code && <p>{order.shipping_address?.postal_code}</p>}
            </div>
          </div>

          {/* Artifacts Purchased */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
              Artifacts Purchased
            </h4>
            <div className="space-y-2">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800">{item.product_name}</p>
                    <p className="text-gray-400">
                      Qty: {item.quantity} × ${parseFloat(String(item.price || 0)).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-[#D6AF66]">${parseFloat(String(item.total || 0)).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
              Financial Summary
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${parseFloat(String(order.subtotal || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%):</span>
                <span className="font-semibold">${parseFloat(String(order.tax || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-semibold">
                  {order.shipping_cost === 0 ? 'FREE' : `$${parseFloat(String(order.shipping_cost || 0)).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-200/60 pt-2 mt-1">
                <span>Total:</span>
                <span className="text-[#D6AF66]">${parseFloat(String(order.total || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#D6AF66] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C19A5A] transition-all active:scale-95 shadow-md shadow-[#D6AF66]/20"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrdersClient;
