'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConditionalLayout from '@/components/ConditionalLayout';
import CartList from '@/components/CartList';
import OrderSummary from '@/components/OrderSummary';
import { useCart } from '@/contexts/CartContext';

const CartClient = () => {
    return (
        <ConditionalLayout>
            <CartContent />
        </ConditionalLayout>
    );
};

const CartContent = () => {
    const router = useRouter();
    const { selectedItemsCount, items } = useCart();

    const proceedToCheckout = () => {
        if (selectedItemsCount === 0) {
            alert('Please select at least one item to proceed to checkout');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div>
            <main className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                {/* Page Header */}
                <header className="text-center mb-8 lg:mb-16">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-medium text-black">
                        Cart
                    </h1>
                </header>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2">
                            <CartList />
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <CartList />
                    </div>
                )}

                {/* Checkout Button */}
                {items.length > 0 && (
                    <div className="flex justify-center lg:justify-end mt-8 mb-8 lg:mb-16">
                        <button
                            className="inline-flex h-12 lg:h-13 items-center justify-center gap-2.5 px-6 lg:px-8 py-3 bg-main-primary-buttons rounded-xl hover:bg-opacity-90 transition-colors text-white font-normal text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={proceedToCheckout}
                            disabled={selectedItemsCount === 0}
                        >
                            Proceed to Checkout ({selectedItemsCount} {selectedItemsCount === 1 ? 'item' : 'items'})
                        </button>
                    </div>
                )}

            </main>
            <style jsx>{`
                body {
                    font-family: 'Outfit', sans-serif;
                }

                .checkbox-checked .checkbox-unchecked {
                    background-color: rgba(242, 127, 12, 1) !important;
                    border-color: rgba(242, 127, 12, 1) !important;
                }

                .checkbox-checked .checkbox-unchecked svg {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default CartClient;
