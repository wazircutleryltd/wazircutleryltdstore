'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConditionalLayout from '@/components/ConditionalLayout';
import PaymentForm from '@/components/PaymentForm';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/contexts/CartContext';

const PaymentClient = () => {
    return (
        <ConditionalLayout>
            <PaymentContent />
        </ConditionalLayout>
    );
};

const PaymentContent = () => {
    const router = useRouter();
    const { selectedItems, selectedItemsCount, clearCart } = useCart();
    const [checkoutData, setCheckoutData] = useState<any>(null);

    useEffect(() => {
        // Get checkout data from sessionStorage
        const storedData = sessionStorage.getItem('checkout-data');
        if (storedData) {
            setCheckoutData(JSON.parse(storedData));
        } else {
            // Redirect to cart if no checkout data
            router.push('/cart');
        }
    }, [router]);

    useEffect(() => {
        // Redirect if no items selected
        if (selectedItemsCount === 0) {
            router.push('/cart');
        }
    }, [selectedItemsCount, router]);

    // Show loading while checking checkout data
    if (!checkoutData) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    const handlePaymentSuccess = async () => {
        try {
            // Generate unique order ID and UUID for database
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderUuid = crypto.randomUUID(); // Generate proper UUID for database
            
            // Prepare order data
            const orderData = {
                id: orderUuid, // Use UUID for database
                order_number: orderId, // Use custom format for order number
                user_id: null, // Anonymous order - no user authentication required
                status: 'pending',
                items: selectedItems.map((item: any) => ({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    product_image: item.product.main_image,
                    quantity: item.quantity,
                    price: item.product.price,
                    total: item.product.price * item.quantity
                })),
                subtotal: selectedItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
                shipping_cost: selectedItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) > 200 ? 0 : 15,
                tax: selectedItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) * 0.1,
                total: selectedItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) * 1.1 + (selectedItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) > 200 ? 0 : 15),
                shipping_address: {
                    full_name: checkoutData.customerInfo.fullName,
                    email: checkoutData.customerInfo.email,
                    phone: checkoutData.customerInfo.phone,
                    address: checkoutData.customerInfo.address,
                    city: checkoutData.customerInfo.city,
                    country: checkoutData.customerInfo.country,
                    postal_code: checkoutData.customerInfo.postalCode
                },
                payment_status: 'pending',
                payment_method: 'cod',
                payment_details: null,
                created_at: new Date().toISOString()
            };

            // Also save to database
            try {
                const dbResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });
                
                if (!dbResponse.ok) {
                    const errorText = await dbResponse.text();
                    console.error('Failed to save order to database:', errorText);
                    // Don't block the order process if database save fails
                } else {
                    console.log('Order saved to database successfully');
                }
            } catch (dbError) {
                console.error('Error saving order to database:', dbError);
                // Don't block the order process if database save fails
            }

            // Send emails (admin and customer notifications)
            try {
                const response = await fetch('/api/send-order-emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });
                
                const emailResult = await response.json();
                if (!emailResult.success) {
                    console.error('Failed to send order emails:', emailResult);
                }
            } catch (emailError) {
                console.error('Error sending order emails:', emailError);
                // Don't block the order process if emails fail
            }

            // Clear cart
            clearCart();

            // Clear checkout data
            sessionStorage.removeItem('checkout-data');

            // Store order data for thank you page
            sessionStorage.setItem('order-confirmation', JSON.stringify(orderData));

            // Redirect to thank you page
            console.log('Redirecting to thank you page...');
            router.push('/thank-you');
            
        } catch (error) {
            console.error('Error processing order:', error);
            alert('There was an error processing your order. Please try again.');
        }
    };

    return (
        <div>
            <main className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                {/* Page Header */}
                <header className="text-center mb-8 lg:mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-medium text-black">
                        Payment
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form Section */}
                    <div className="lg:col-span-2">
                        <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>

                {/* Back to Checkout Link */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="text-main-primary-buttons hover:underline cursor-pointer"
                    >
                        ← Back to Checkout
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PaymentClient;
