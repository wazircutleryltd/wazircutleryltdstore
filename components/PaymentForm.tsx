'use client';
import { useState } from 'react';

interface PaymentFormProps {
  onPaymentSuccess: () => void;
}

const PaymentForm = ({ onPaymentSuccess }: PaymentFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            onPaymentSuccess();
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-semibold text-black mb-6">Payment Method</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="cod"
                            checked={true}
                            readOnly
                            className="w-4 h-4 text-main-primary-buttons"
                        />
                        <label htmlFor="cod" className="text-lg font-medium text-gray-900">
                            Cash on Delivery (COD)
                        </label>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Cash on Delivery</h4>
                    <p className="text-blue-700">
                        You can pay with cash when your order is delivered. Please have the exact amount ready.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full inline-flex h-12 lg:h-13 items-center justify-center gap-2.5 px-6 lg:px-8 py-3 bg-main-primary-buttons rounded-xl hover:bg-opacity-90 transition-colors text-white font-normal text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing Payment...
                        </>
                    ) : (
                        'Complete Order (COD)'
                    )}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
