import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { MenuItem, CartItem, Coupon, ActiveOrder } from '../types';
import { VALID_COUPONS } from '../data/mockData';
import { useToast } from './ToastContext';

interface CartContextValue {
  items: CartItem[];
  totalItemCount: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  isOpen: boolean;
  cartBounceKey: number;
  freeDeliveryThreshold: number;
  amountUntilFreeDelivery: number;
  freeDeliveryProgress: number;
  activeOrder: ActiveOrder | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (menuItem: MenuItem, options?: { quantity?: number; specialInstructions?: string; customPrice?: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (deliveryAddress: string, contactNumber: string) => ActiveOrder;
  clearActiveOrder: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 40.0;
const BASE_DELIVERY_FEE = 3.99;
const TAX_RATE = 0.0825; // 8.25%

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [cartBounceKey, setCartBounceKey] = useState(0);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  const { showToast } = useToast();

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minSubtotal) return 0;
    return (subtotal * appliedCoupon.discountPercent) / 100;
  }, [subtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
  }, [subtotal]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    return taxableAmount * TAX_RATE;
  }, [subtotal, discountAmount]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discountAmount) + deliveryFee + tax;
  }, [subtotal, discountAmount, deliveryFee, tax]);

  const amountUntilFreeDelivery = useMemo(() => {
    return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  }, [subtotal]);

  const freeDeliveryProgress = useMemo(() => {
    return Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  }, [subtotal]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (
      menuItem: MenuItem,
      options: { quantity?: number; specialInstructions?: string; customPrice?: number } = {}
    ) => {
      const qty = options.quantity || 1;
      const unitPrice = options.customPrice ?? menuItem.price;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.menuItem.id === menuItem.id && item.specialInstructions === options.specialInstructions
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
          return updated;
        }

        const newCartItem: CartItem = {
          id: `cart-${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity: qty,
          unitPrice,
          specialInstructions: options.specialInstructions,
        };
        return [...prevItems, newCartItem];
      });

      // Trigger GPU micro-interaction bounce key
      setCartBounceKey((prev) => prev + 1);

      showToast(
        `Added to Cart`,
        `${menuItem.name} (${qty}x) is now in your order bag.`,
        'success'
      );
    },
    [showToast]
  );

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== itemId);
      }
      return prev.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    });
  }, []);

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => {
        const target = prev.find((i) => i.id === itemId);
        if (target) {
          showToast('Item Removed', `${target.menuItem.name} was removed from your bag.`, 'info');
        }
        return prev.filter((item) => item.id !== itemId);
      });
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const normalized = code.trim().toUpperCase();
      const found = VALID_COUPONS.find((c) => c.code === normalized);

      if (!found) {
        showToast('Invalid Promo Code', `Coupon code "${code}" is not recognized.`, 'error');
        return false;
      }

      if (subtotal < found.minSubtotal) {
        showToast(
          'Minimum Subtotal Not Met',
          `Add $${(found.minSubtotal - subtotal).toFixed(2)} more to use "${found.code}".`,
          'info'
        );
        return false;
      }

      setAppliedCoupon(found);
      showToast(
        'Promo Applied!',
        `Enjoy ${found.discountPercent}% off with ${found.code}!`,
        'deal'
      );
      return true;
    },
    [subtotal, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Promo Removed', 'The coupon code has been removed.', 'info');
  }, [showToast]);

  const placeOrder = useCallback(
    (deliveryAddress: string, contactNumber: string): ActiveOrder => {
      const newOrder: ActiveOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: Date.now(),
        items: [...items],
        subtotal,
        discount: discountAmount,
        deliveryFee,
        tax,
        total,
        status: 'confirmed',
        estimatedDeliveryTimeMinutes: 25,
        deliveryAddress,
        contactNumber,
      };

      setActiveOrder(newOrder);
      setItems([]);
      setAppliedCoupon(null);
      closeCart();

      showToast(
        'Order Dispatched to Kitchen!',
        `Order #${newOrder.id} confirmed. Track live preparation.`,
        'success'
      );

      return newOrder;
    },
    [items, subtotal, discountAmount, deliveryFee, tax, total, closeCart, showToast]
  );

  const clearActiveOrder = useCallback(() => {
    setActiveOrder(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        discountAmount,
        deliveryFee,
        tax,
        total,
        appliedCoupon,
        isOpen,
        cartBounceKey,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountUntilFreeDelivery,
        freeDeliveryProgress,
        activeOrder,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        clearActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
