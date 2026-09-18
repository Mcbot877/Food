import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface CategoryFilterPillProps {
  id: string;
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

export function CategoryFilterPill({
  id,
  name,
  count,
  isActive,
  onClick,
  icon,
}: CategoryFilterPillProps) {
  return (
    <button
      id={`cat-pill-${id}`}
      onClick={onClick}
      className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer select-none flex items-center gap-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] ${
        isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
      }`}
    >
      {/* Animated active backdrop pill */}
      {isActive && (
        <motion.div
          layoutId="activeCategoryIndicator"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7043] shadow-md shadow-[#FF5722]/30 border border-white/20"
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span>{name}</span>
        <span
          className={`px-1.5 py-0.5 text-[11px] rounded-md transition-colors ${
            isActive ? 'bg-black/20 text-white font-bold' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {count}
        </span>
      </span>
    </button>
  );
}
