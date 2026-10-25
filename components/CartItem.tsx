'use client';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart, toggleItemSelection } = useCart();
  const { product, quantity, selected } = item;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const handleToggleSelection = () => {
    toggleItemSelection(item.id);
  };

  const subtotal = (product.price || 0) * quantity;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
      {/* Checkbox */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded cursor-pointer transition-colors border ${selected ? 'bg-main-primary-buttons border-main-primary-buttons' : 'bg-[#f9f9f6] border-borders'}`}
        onClick={handleToggleSelection}
      >
        <svg className={`w-4 h-4 text-white transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
        </svg>
      </div>

      {/* Product Card */}
      <div className="flex-1 w-full bg-white rounded-3xl border border-borders p-3 md:p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Product Image */}
          <div className="w-full md:w-32 h-40 md:h-32 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 overflow-hidden">
            <Image 
              src={product.main_image || '/product.jpg'}
              alt={product.name} 
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500" 
              width={200} 
              height={200} 
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 md:flex-1 line-clamp-1 md:line-clamp-none">
                {product.name}
              </h3>
              <div className="text-xl md:text-2xl font-bold text-[#D6AF66]">
                ${(product.price || 0).toFixed(2)}
              </div>
            </div>

            <p className="text-sm text-sub-texts-mute-lable leading-relaxed">
              {product.short_description || (product.description ? `${product.description.substring(0, 120)}...` : '')}
            </p>

            <p className="text-xs">
              <span className="text-[#616161]">Category:</span>
              <span className="text-sub-texts-mute-lable"> {product.categories?.name || 'N/A'}</span>
            </p>

            <p className="text-xs text-sub-texts-mute-lable">
              {product.delivery_date || 'Estimate delivery in 2-3 working days'}
            </p>

            <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-50 mt-2">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-3 py-1.5 shadow-sm border border-gray-100">
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 shadow-sm transition-all active:scale-90 hover:bg-gray-50"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <svg className="w-3 h-0.5 text-gray-600" viewBox="0 0 12 2" fill="currentColor">
                    <path d="M0 .5h12v1H0z" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  className="w-8 h-8 bg-[#D6AF66] rounded-lg flex items-center justify-center shadow-lg shadow-[#D6AF66]/20 transition-all active:scale-90 hover:bg-[#C19A5A]"
                  onClick={() => handleQuantityChange(1)}
                >
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M4.5 0h1v10h-1V0zM0 4.5h10v1H0v-1z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400 font-medium">Subtotal</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center">
                <button
                  className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-xl transition-all group active:scale-90"
                  onClick={handleRemove}
                  title="Remove item"
                >
                  <svg className="w-5 h-5 text-red-400 group-hover:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
