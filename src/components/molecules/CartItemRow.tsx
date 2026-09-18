import { memo } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { ProgressiveImage } from '../atoms/ProgressiveImage';

interface CartItemRowProps {
  item: CartItem;
  id?: string;
}

export const CartItemRow = memo(function CartItemRow({ item, id }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  return (
    <motion.div
      id={id || `cart-item-${item.id}`}
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-slate-900/80 p-3 backdrop-blur-md"
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-white/10">
        <ProgressiveImage
          src={item.menuItem.image}
          alt={item.menuItem.name}
          aspectRatio="square"
          className="h-full w-full"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-white truncate">{item.menuItem.name}</h4>
          <span className="text-sm font-black text-[#FF5722] shrink-0">
            ${(item.unitPrice * item.quantity).toFixed(2)}
          </span>
        </div>

        {item.specialInstructions && (
          <p className="text-[11px] text-amber-400/90 truncate font-medium mt-0.5">
            {item.specialInstructions}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            ${item.unitPrice.toFixed(2)} each
          </span>

          {/* Stepper Quantity Controls */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-950 p-0.5 border border-slate-800">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={handleDecrement}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3 w-3 text-rose-400" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </motion.button>

            <span className="w-6 text-center text-xs font-bold text-white select-none">
              {item.quantity}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={handleIncrement}
              className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
