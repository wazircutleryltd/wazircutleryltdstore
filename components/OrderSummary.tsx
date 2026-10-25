'use client';
import { useCart } from '../contexts/CartContext';
import { FaGift } from 'react-icons/fa6';

const OrderSummary = () => {
  const { 
    subtotal, 
    tax, 
    deliveryFee, 
    total, 
    selectedItemsCount,
    selectedItems 
  } = useCart();

  return (
    <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8">
      <h3 className="text-xl lg:text-2xl font-semibold text-black mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Items ({selectedItemsCount})</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${deliveryFee.toFixed(2)}`
            )}
          </span>
        </div>
        
        {deliveryFee === 0 ? (
          <div className="text-sm text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100 flex items-center gap-2">
            <FaGift className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>You&apos;ve qualified for free delivery!</span>
          </div>
        ) : (
          subtotal > 0 && (
            <div className="text-sm text-[#D6AF66] bg-amber-50 p-3 rounded-lg border border-amber-100 italic font-medium">
              Add worth <span className="font-bold underline">${(200 - subtotal).toFixed(2)}</span> more to get <span className="font-bold text-[#2C2C2C]">FREE</span> delivery!
            </div>
          )
        )}
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-black">Total</span>
          <span className="text-main-primary-buttons">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {selectedItemsCount === 0 && (
        <div className="text-center py-4 text-gray-500">
          No items selected for checkout
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
