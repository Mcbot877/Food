import { motion } from 'motion/react';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export function PriceTag({ price, originalPrice, size = 'md', className = '', id }: PriceTagProps) {
  const sizeClasses = {
    sm: {
      price: 'text-sm font-bold',
      original: 'text-xs',
      currency: 'text-xs',
    },
    md: {
      price: 'text-lg font-extrabold',
      original: 'text-sm',
      currency: 'text-sm',
    },
    lg: {
      price: 'text-2xl font-black',
      original: 'text-base',
      currency: 'text-base',
    },
  };

  const isDiscounted = originalPrice && originalPrice > price;

  return (
    <div id={id} className={`inline-flex items-baseline gap-1.5 font-sans ${className}`}>
      <span className={`text-[#FF5722] font-semibold ${sizeClasses[size].currency}`}>$</span>
      <motion.span
        key={price}
        initial={{ opacity: 0.8, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`text-white tracking-tight ${sizeClasses[size].price}`}
      >
        {price.toFixed(2)}
      </motion.span>
      {isDiscounted && (
        <span className={`text-slate-400 line-through font-normal ${sizeClasses[size].original}`}>
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}
