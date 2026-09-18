import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  onClear?: () => void;
  id?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, onClear, value, id, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          value={value}
          className={`w-full rounded-xl bg-slate-900/80 border border-slate-800 focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 text-slate-100 placeholder:text-slate-500 text-sm py-2.5 transition-all outline-none backdrop-blur-md ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${onClear && value ? 'pr-10' : 'pr-3.5'} ${className}`}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
