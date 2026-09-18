import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export type ButtonProps = BaseButtonProps & 
  Omit<HTMLMotionProps<'button'>, keyof BaseButtonProps> & 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF5722] hover:bg-[#F4511E] text-white shadow-lg shadow-[#FF5722]/25 hover:shadow-[#FF5722]/40 border border-[#FF5722]/30',
  secondary:
    'bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-lg shadow-[#4CAF50]/25 hover:shadow-[#4CAF50]/40 border border-[#4CAF50]/30',
  glass:
    'glass-panel-light hover:bg-slate-800/80 text-white border-white/15 hover:border-white/30 backdrop-blur-md',
  outline:
    'border border-slate-700 hover:border-slate-500 bg-transparent text-slate-200 hover:bg-slate-800/50',
  ghost:
    'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
  danger:
    'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 border border-rose-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  icon: 'p-2.5 rounded-xl aspect-square flex items-center justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      id,
      disabled,
      ...motionProps
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        id={id}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.025 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={`inline-flex items-center justify-center font-sans tracking-tight transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none gpu-layer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...(motionProps as any)}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-xs">Processing...</span>
          </div>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
