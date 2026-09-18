import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Truck, Sparkles, Tag, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from '../molecules/CartItemRow';
import { Button } from '../atoms/Button';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    discountAmount,
    deliveryFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeDeliveryThreshold,
    amountUntilFreeDelivery,
    freeDeliveryProgress,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay with GPU Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm gpu-layer"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-slate-950/95 border-l border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col gpu-layer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Your Order Bag</h3>
                  <p className="text-xs text-slate-400">
                    {items.length} unique {items.length === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
              </div>

              <button
                id="cart-drawer-close-btn"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Threshold Bar */}
            <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-4 h-4 text-[#4CAF50]" />
                  <span>
                    {amountUntilFreeDelivery > 0 ? (
                      <>
                        Add <span className="text-[#FF5722] font-bold">${amountUntilFreeDelivery.toFixed(2)}</span> for <span className="text-[#4CAF50] font-bold">FREE Delivery</span>
                      </>
                    ) : (
                      <span className="text-[#4CAF50] font-bold">Unlocked FREE Express Delivery! 🚀</span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  ${subtotal.toFixed(2)} / ${freeDeliveryThreshold.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeDeliveryProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#4CAF50]"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">Your bag is empty</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                    Explore our molecular gastronomy items or claim today's synchronized flash deals.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={closeCart}
                    className="mt-5 shadow-lg shadow-[#FF5722]/30"
                  >
                    Start Exploring
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((cartItem) => (
                    <CartItemRow key={cartItem.id} item={cartItem} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Bottom Checkout Section */}
            {items.length > 0 && (
              <div className="border-t border-white/10 bg-slate-950 p-5 space-y-4 shadow-2xl">
                {/* Coupon Code Input */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#4CAF50]/15 border border-[#4CAF50]/40 p-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-xs font-bold text-white font-mono">
                          {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon (e.g. TASTY20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 uppercase font-mono outline-none focus:border-[#FF5722]"
                      />
                      <Button variant="glass" size="sm" type="submit">
                        Apply
                      </Button>
                    </form>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#4CAF50] font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-[#4CAF50] font-bold">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="text-[#FF5722] font-black">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Button
                  id="cart-checkout-proceed-btn"
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    closeCart();
                    onProceedToCheckout();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full shadow-xl shadow-[#FF5722]/30"
                >
                  Proceed to Checkout (${total.toFixed(2)})
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
