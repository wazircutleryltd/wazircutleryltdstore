'use client';
import { useState } from 'react';
import { useCreateOrder } from '../lib/hooks';
import { sendOrderNotification } from '../lib/email-service';
import { useUser } from '@clerk/nextjs';
import type { Product, Order } from '@/types';

interface OrderFormProps {
    product: Product;
    onOrderSuccess?: (order?: Order | any) => void;
}

export default function OrderForm({ 
    product, 
    onOrderSuccess 
}: OrderFormProps) {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        quantity: 1,
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    
    const { createOrder } = useCreateOrder();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Generate order number
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Calculate totals
            const subtotal = product.price * formData.quantity;
            const shippingCost = 10; // Fixed shipping cost
            const tax = subtotal * 0.1; // 10% tax
            const total = subtotal + shippingCost + tax;

            // Create order data
            const orderData = {
                user_id: user?.id || 'guest', // You might need to handle guest users differently
                order_number: orderNumber,
                status: 'pending',
                items: [{
                    product_id: product.id,
                    quantity: formData.quantity,
                    price: product.price,
                    total: subtotal
                }],
                subtotal,
                shipping_cost: shippingCost,
                tax,
                total,
                shipping_address: {
                    full_name: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                    postal_code: formData.postalCode,
                    phone: formData.phone
                },
                payment_status: 'pending',
                payment_method: 'cash_on_delivery',
                notes: formData.notes,
                estimated_delivery: '2-3 working days'
            };

            const result = await createOrder(orderData);
            
            // Send email notification
            await sendOrderNotification(result);
            
            setSubmitStatus('success');
            if (onOrderSuccess) {
                onOrderSuccess();
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#0E0E0E] mb-2">Order Placed Successfully!</h2>
                <p className="text-[#2C2C2C] mb-6">
                    Your order has been submitted and you will receive a confirmation email shortly.
                </p>
                <button
                    onClick={() => setSubmitStatus(null)}
                    className="bg-[#F27F0C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C49F5A] transition-colors duration-200"
                >
                    Place Another Order
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0E0E0E] mb-6">Place Your Order</h2>
            
            {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    There was an error placing your order. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600">Price: ${product.price}</p>
                </div>

                {/* Quantity */}
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                        required
                    />
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                        required
                    />
                </div>

                {/* Shipping Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent"
                        placeholder="Any special instructions or notes..."
                    />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${(product.price * formData.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>$10.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (10%):</span>
                            <span>${(product.price * formData.quantity * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${(product.price * formData.quantity * 1.1 + 10).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F27F0C] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#C49F5A] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}
