import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  ChefHat,
  Bike,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { OrderStatus } from '../../types';
import { Button } from '../atoms/Button';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: typeof CheckCircle2; desc: string }[] = [
  {
    status: 'confirmed',
    label: 'Order Verified',
    icon: CheckCircle2,
    desc: 'Payment authorized & dispatched to station',
  },
  {
    status: 'cooking',
    label: 'Culinary Cooking',
    icon: ChefHat,
    desc: 'Sous-vide & charcoal searing in progress',
  },
  {
    status: 'delivering',
    label: 'Express Courier En Route',
    icon: Bike,
    desc: 'Climate-sealed heated delivery pod',
  },
  {
    status: 'delivered',
    label: 'Delivered Fresh',
    icon: Sparkles,
    desc: 'Arrived at your doorstep! Bon appétit!',
  },
];

export function OrderCheckoutModal({ isOpen, onClose }: OrderCheckoutModalProps) {
  const { total, items, placeOrder, activeOrder, clearActiveOrder } = useCart();
  const [address, setAddress] = useState('742 Evergreen Terrace, Suite 4B');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger confetti when order is placed or delivered
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5722', '#4CAF50', '#FFC107', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(address, phone);
      setIsSubmitting(false);
      setCurrentStepIndex(0);
      triggerCelebration();
    }, 600);
  };

  // Simulate progress when activeOrder is present
  useEffect(() => {
    if (!activeOrder) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ORDER_STEPS.length - 1) {
          const next = prev + 1;
          if (next === ORDER_STEPS.length - 1) {
            triggerCelebration();
          }
          return next;
        }
        return prev;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [activeOrder]);

  if (!isOpen) return null;

  return (
    <div id="checkout-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md gpu-layer"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl gpu-layer text-slate-100 z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {activeOrder ? 'Live Gastronomy Tracking' : 'Secure Food-Tech Checkout'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeOrder ? `Order #${activeOrder.id}` : 'End-to-end encrypted dispatch'}
              </p>
            </div>
          </div>
          <button
            id="checkout-modal-close-btn"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {activeOrder ? (
            /* Live Order Tracking View */
            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-900/90 border border-white/10 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Estimated Delivery</span>
                  <span className="flex items-center gap-1 text-[#4CAF50] font-bold">
                    <Clock className="w-3.5 h-3.5" /> 18-24 mins
                  </span>
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  {ORDER_STEPS[currentStepIndex].label}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {ORDER_STEPS[currentStepIndex].desc}
                </p>

                {/* Progress bar */}
                <div className="mt-4 w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    animate={{
                      width: `${((currentStepIndex + 1) / ORDER_STEPS.length) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#4CAF50]"
                  />
                </div>
              </div>

              {/* Steps Stepper */}
              <div className="space-y-3">
                {ORDER_STEPS.map((step, idx) => {
                  const isPast = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`flex items-start gap-3.5 rounded-xl p-3 transition-colors ${
                        isCurrent
                          ? 'bg-[#FF5722]/10 border border-[#FF5722]/30'
                          : isPast
                          ? 'bg-slate-900/60 border border-white/5 opacity-80'
                          : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold ${
                          isPast
                            ? 'bg-[#4CAF50] text-white'
                            : isCurrent
                            ? 'bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{step.label}</h5>
                          {isPast && (
                            <span className="text-[10px] font-bold text-[#4CAF50]">Completed</span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-[#FF5722] animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order items recap */}
              <div className="rounded-xl bg-slate-900/50 p-3 border border-slate-800 text-xs">
                <span className="block font-bold text-slate-300 mb-2">Order Summary:</span>
                <div className="space-y-1 text-slate-400">
                  {activeOrder.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span>
                        {i.quantity}x {i.menuItem.name}
                      </span>
                      <span className="text-slate-200">
                        ${(i.unitPrice * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                    <span>Total Paid</span>
                    <span className="text-[#FF5722]">${activeOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Reset or order again */}
              <div className="flex gap-2">
                <Button
                  variant="glass"
                  size="md"
                  onClick={() => {
                    clearActiveOrder();
                    onClose();
                  }}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  className="w-full"
                >
                  Place Another Order
                </Button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Delivery Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-10 pr-3 text-xs text-white outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Number (For Courier Pod)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-10 pr-3 text-xs text-white outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="rounded-xl bg-slate-900/90 border border-white/10 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4CAF50]/20 text-[#4CAF50]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">Instant One-Click Pay</span>
                    <span className="block text-[11px] text-slate-400">Zero surcharge applied</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#4CAF50]">READY</span>
              </div>

              {/* Order total review */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Total for {items.length} dishes
                </span>
                <span className="text-lg font-black text-[#FF5722]">${total.toFixed(2)}</span>
              </div>

              <Button
                id="checkout-submit-btn"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full shadow-xl shadow-[#FF5722]/30"
              >
                Confirm & Dispatch (${total.toFixed(2)})
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
