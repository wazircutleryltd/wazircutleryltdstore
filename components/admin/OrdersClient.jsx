'use client';
import { useState, useEffect } from 'react';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAllOrders, useUpdateOrderStatus } from '../../lib/supabase-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingState, ErrorState, NoDataState } from '../common/StateComponents';

const OrdersClient = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const { data: orders, isLoading: loading, error, totalPages, totalCount } = useAllOrders(page, pageSize);
    const [localOrders, setLocalOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { updateOrderStatus, isLoading: isUpdating } = useUpdateOrderStatus();

    useEffect(() => {
        if (orders) {
            setLocalOrders(orders);
        }
    }, [orders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        const updatedOrder = await updateOrderStatus(orderId, newStatus);
        if (updatedOrder) {
            setLocalOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'confirmed':
                return <Package className="w-4 h-4 text-blue-500" />;
            case 'processing':
                return <Package className="w-4 h-4 text-purple-500" />;
            case 'shipped':
                return <Truck className="w-4 h-4 text-indigo-500" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    if (loading) {
        return <LoadingState message="Fetching orders..." minHeight="h-[60vh]" />;
    }

    if (error) {
        return <ErrorState message="Could not load orders. Please check your connection." minHeight="h-[60vh]" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <div className="text-sm text-gray-500">
                    Total Orders: {totalCount}
                </div>
            </div>

            {localOrders.length === 0 ? (
                <NoDataState 
                    message="No orders yet" 
                    description="Orders will appear here once customers start placing them." 
                    minHeight="h-[40vh]" 
                />
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {localOrders.map((order) => (
                            <li key={order.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {getStatusIcon(order.status)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {order.order_number}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                <p>{order.shipping_address.full_name}</p>
                                                <p>${order.total.toFixed(2)}</p>
                                                <p>{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            disabled={isUpdating}
                                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D6AF66]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => viewOrderDetails(order)}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6AF66]"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            <AnimatePresence>
                {showModal && selectedOrder && (
                    <OrderDetailsModal 
                        order={selectedOrder} 
                        onClose={() => setShowModal(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const OrderDetailsModal = ({ order, onClose }) => {
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
            ></motion.div>
            <motion.div 
                key="order-modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative mx-auto p-6 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white overflow-hidden z-50 flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-y-auto pr-2 space-y-6">
                    {/* Order Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Order ID:</span>
                                <p className="font-medium">{order.order_number}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <p className="font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <p className="font-medium capitalize">{order.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                        <div className="text-sm space-y-1">
                            <p><span className="text-gray-500">Name:</span> {order.shipping_address.full_name}</p>
                            <p><span className="text-gray-500">Email:</span> {order.shipping_address.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {order.shipping_address.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="text-sm">
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.country}</p>
                            {order.shipping_address.postal_code && <p>{order.shipping_address.postal_code}</p>}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="font-medium">${item.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%):</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>{order.shipping_cost === 0 ? 'FREE' : `$${order.shipping_cost.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                                <span>Total:</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#D6AF66] text-white font-medium rounded-lg hover:bg-[#C19A5A] focus:outline-none focus:ring-4 focus:ring-[#D6AF66]/20 transition-all active:scale-95 shadow-lg shadow-[#D6AF66]/20"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OrdersClient;
