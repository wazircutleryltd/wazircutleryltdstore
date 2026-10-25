'use client';
import CartItem from './CartItem';
import { useCart } from '../contexts/CartContext';

const CartList = () => {
  const { items } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="space-y-8 lg:space-y-16 mb-8 lg:mb-16">
      {/* Today Section */}
      <section className="space-y-6">
        {!isEmpty && (
          <div className="flex items-center gap-4 lg:gap-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-normal text-black">Cart Items</h2>
          </div>
        )}
        
        <CartItemList />
      </section>
    </div>
  );
};

const CartItemList = () => {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-500 text-2xl mb-4">Your cart is empty</div>
        <p className="text-gray-400 text-2xl">Add some products to get started!</p>
      </div>
    );
  }

  // Group items by date added (for now, just show all items under "Today")
  const todayItems = items;

  return (
    <div className="space-y-6">
      {todayItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartList;
