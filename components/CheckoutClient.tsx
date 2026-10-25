'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ConditionalLayout from '@/components/ConditionalLayout';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/contexts/CartContext';

const CheckoutClient = () => {
    return (
        <ConditionalLayout>
            <CheckoutContent />
        </ConditionalLayout>
    );
};

const CheckoutContent = () => {
    const router = useRouter();
    const { selectedItems, selectedItemsCount } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if no items selected
    useEffect(() => {
        if (selectedItemsCount === 0) {
            router.push('/cart');
        }
    }, [selectedItemsCount, router]);

    if (selectedItemsCount === 0) {
        return null;
    }

    const handleFormSubmit = async (formData: any) => {
        setIsSubmitting(true);
        
        // Store checkout data in sessionStorage for payment page
        const checkoutData = {
            customerInfo: formData,
            items: selectedItems,
            timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData));
        
        // Navigate to payment page
        router.push('/payment');
        setIsSubmitting(false);
    };

    return (
        <div>
            <main className="container mx-auto px-4 py-8 lg:py-16">
                {/* Page Header */}
                <header className="text-center mb-8 lg:mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-medium text-black">
                        Checkout
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form Section */}
                    <div className="lg:col-span-2">
                        <CheckoutForm onSubmit={handleFormSubmit} />
                        
                        {/* Proceed to Payment Button */}
                        <div className="space-x-8 mt-8">
                            <button
                                onClick={() => {
                                    const form = document.querySelector('form');
                                    if (form) {
                                        form.requestSubmit();
                                    }
                                }}
                                disabled={isSubmitting}
                                className="w-full lg:w-auto inline-flex h-12 lg:h-13 items-center justify-center gap-2.5 px-6 lg:px-8 py-3 bg-main-primary-buttons rounded-xl hover:bg-opacity-90 transition-colors text-white font-normal text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                            <button
                                onClick={() => router.push('/cart')}
                                className="text-main-primary-buttons hover:underline cursor-pointer mt-4"
                            >
                                ← Back to Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>

                {/* Back to Cart Link */}
                {/*<div className="text-center mt-8">*/}
                {/*    <button*/}
                {/*        onClick={() => router.push('/cart')}*/}
                {/*        className="text-main-primary-buttons hover:underline cursor-pointer"*/}
                {/*    >*/}
                {/*        ← Back to Cart*/}
                {/*    </button>*/}
                {/*</div>*/}
            </main>
        </div>
    );
};

export default CheckoutClient;
