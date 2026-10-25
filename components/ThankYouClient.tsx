'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ConditionalLayout from '@/components/ConditionalLayout';
import { useCart } from '@/contexts/CartContext';

const ThankYouClient = () => {
    return (
        <ConditionalLayout>
            <ThankYouContent />
        </ConditionalLayout>
    );
};

const ThankYouContent = () => {
    const router = useRouter();
    const { clearCart } = useCart();
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        const storedOrderData = sessionStorage.getItem('order-confirmation');
        if (storedOrderData) {
            try {
                setOrderData(JSON.parse(storedOrderData));
                clearCart();
                sessionStorage.removeItem('checkout-data');
            } catch (e) {
                console.error('Failed to parse order confirmation:', e);
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, [router, clearCart]);

    if (!orderData) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    const handleContinueShopping = () => {
        router.push('/');
    };

    return (
        <div>
            <main className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-medium text-black mb-4">
                        Thank You for Your Order!
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your order has been successfully placed. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Order Information */}
                    <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8">
                        <h2 className="text-xl lg:text-2xl font-semibold text-black mb-6">Order Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Order ID:</span>
                                <p className="text-lg font-semibold text-black">{orderData.order_number}</p>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-500">Order Date:</span>
                                <p className="text-lg text-black">
                                    {new Date(orderData.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                                <p className="text-lg text-black capitalize">
                                    {orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                                </p>
                            </div>
                            
                            <div>
                                <span className="text-sm font-medium text-gray-500">Order Status:</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 ml-2">
                                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8">
                        <h2 className="text-xl lg:text-2xl font-semibold text-black mb-6">Shipping Address</h2>
                        
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-black">{orderData.shipping_address.full_name}</p>
                            <p className="text-gray-600">{orderData.shipping_address.address}</p>
                            <p className="text-gray-600">
                                {orderData.shipping_address.city}, {orderData.shipping_address.country}
                                {orderData.shipping_address.postal_code && ` ${orderData.shipping_address.postal_code}`}
                            </p>
                            <p className="text-gray-600">Phone: {orderData.shipping_address.phone}</p>
                            <p className="text-gray-600">Email: {orderData.shipping_address.email}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8 mb-12">
                    <h2 className="text-xl lg:text-2xl font-semibold text-black mb-6">Order Items</h2>
                    
                    <div className="space-y-4">
                        {orderData.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                                    <Image 
                                        src={item.product_image || '/product.jpg'} 
                                        alt={item.product_name} 
                                        width={64} 
                                        height={64} 
                                        className="w-full h-full object-cover rounded-lg" 
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="font-medium text-black">{item.product_name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                
                                <div className="text-right">
                                    <p className="font-semibold text-black">${(item.total).toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8 mb-12">
                    <h2 className="text-xl lg:text-2xl font-semibold text-black mb-6">Order Summary</h2>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tax (10%):</span>
                            <span className="font-medium">${orderData.tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">
                                {orderData.shipping_cost === 0 ? (
                                    <span className="text-green-600">FREE</span>
                                ) : (
                                    `$${orderData.shipping_cost.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        
                        <hr className="border-gray-200" />
                        
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-black">Total:</span>
                            <span className="text-main-primary-buttons">${orderData.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-3xl p-6 lg:p-8 mb-12">
                    <h2 className="text-xl lg:text-2xl font-semibold text-blue-900 mb-4">What&apos;s Next?</h2>
                    
                    <div className="space-y-3 text-blue-800">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-bold text-blue-800">1</span>
                            </div>
                            <p>We&apos;ll send you an order confirmation email with all the details.</p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-bold text-blue-800">2</span>
                            </div>
                            <p>Your order will be processed and prepared for shipment.</p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-bold text-blue-800">3</span>
                            </div>
                            <p>You&apos;ll receive tracking information once your order ships.</p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-sm font-bold text-blue-800">4</span>
                            </div>
                            <p>Your order will be delivered to your specified address.</p>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="text-center">
                    <button
                        onClick={handleContinueShopping}
                        className="inline-flex h-12 lg:h-13 items-center justify-center gap-2.5 px-6 lg:px-8 py-3 bg-main-primary-buttons rounded-xl hover:bg-opacity-90 transition-colors text-white font-normal text-lg cursor-pointer"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ThankYouClient;