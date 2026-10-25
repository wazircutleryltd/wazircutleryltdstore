"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";
import { FaGift } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface QuickCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickCartSheet({ open, onOpenChange }: QuickCartSheetProps) {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const freeDeliveryThreshold = 200;
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0 bg-[#F9F9F6] border-l border-[#D6AF66]/20">
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-[#D6AF66]" />
            <SheetTitle className="text-xl font-semibold text-neutral-900 font-[family-name:var(--font-outfit)]">
              Your Cart ({totalItems})
            </SheetTitle>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="mt-3 pt-2">
            <div className="flex justify-between text-xs font-medium text-neutral-600 mb-1 font-[family-name:var(--font-cabin)]">
              {remainingForFreeDelivery > 0 ? (
                <span>
                  Add <span className="text-[#8C6D23] font-bold">${remainingForFreeDelivery.toFixed(2)}</span> more for <span className="font-semibold text-neutral-900">FREE delivery</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold inline-flex items-center gap-1.5">
                  <FaGift className="h-3.5 w-3.5 text-emerald-600" />
                  <span>You unlocked FREE delivery!</span>
                </span>
              )}
              <span>{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D6AF66] to-[#F27F0C]"
                initial={{ width: 0 }}
                animate={{ width: `${freeDeliveryProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-200/80">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#D6AF66]/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#D6AF66]" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1 font-[family-name:var(--font-outfit)]">
                Your cart is empty
              </h3>
              <p className="text-sm text-neutral-500 mb-6 max-w-xs font-[family-name:var(--font-cabin)]">
                Explore our handcrafted Damascus blades and Wazir Cutlery masterworks.
              </p>
              <button
                onClick={() => {
                  onOpenChange(false);
                  router.push("/product");
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium transition-all duration-200"
              >
                <span>Browse Masterworks</span>
                <ArrowRight className="w-4 h-4 text-[#D6AF66]" />
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pt-4 first:pt-0 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl bg-white border border-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={item.product.main_image || "/product.jpg"}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="text-sm font-semibold text-neutral-900 hover:text-[#8C6D23] line-clamp-1 font-[family-name:var(--font-outfit)]"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5">
                        ${Number(item.product.price).toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer with totals & action buttons */}
        {items.length > 0 && (
          <SheetFooter className="p-6 bg-white border-t border-neutral-200 flex-col sm:flex-col gap-3">
            <div className="space-y-1.5 w-full text-sm font-[family-name:var(--font-cabin)]">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-100 font-[family-name:var(--font-outfit)]">
                <span>Total</span>
                <span className="text-[#8C6D23]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
              <button
                onClick={handleViewCart}
                className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-sm font-medium transition-all duration-200"
              >
                View Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D6AF66] to-[#F27F0C] hover:opacity-95 text-white text-sm font-semibold shadow-md transition-all duration-200 flex items-center justify-center space-x-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
