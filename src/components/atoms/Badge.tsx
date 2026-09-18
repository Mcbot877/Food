import { ReactNode } from 'react';
import { DietaryType } from '../../types';

interface BadgeProps {
  children?: ReactNode;
  variant?: 'orange' | 'green' | 'slate' | 'deal' | 'dietary';
  dietaryType?: DietaryType;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

const dietaryLabels: Record<DietaryType, { label: string; color: string; border: string }> = {
  vegan: {
    label: 'Vegan 🌱',
    color: 'text-emerald-400 bg-emerald-950/60',
    border: 'border-emerald-500/30',
  },
  'gluten-free': {
    label: 'Gluten-Free 🌾',
    color: 'text-amber-400 bg-amber-950/60',
    border: 'border-amber-500/30',
  },
  'high-protein': {
    label: 'High-Protein 💪',
    color: 'text-cyan-400 bg-cyan-950/60',
    border: 'border-cyan-500/30',
  },
  'chef-special': {
    label: "Chef's Special ⭐",
    color: 'text-[#FF5722] bg-[#FF5722]/15',
    border: 'border-[#FF5722]/40',
  },
  spicy: {
    label: 'Spicy 🔥',
    color: 'text-rose-400 bg-rose-950/60',
    border: 'border-rose-500/30',
  },
  keto: {
    label: 'Keto-Friendly 🥑',
    color: 'text-lime-400 bg-lime-950/60',
    border: 'border-lime-500/30',
  },
};

export function Badge({
  children,
  variant = 'slate',
  dietaryType,
  size = 'sm',
  className = '',
  id,
}: BadgeProps) {
  if (dietaryType) {
    const config = dietaryLabels[dietaryType];
    return (
      <span
        id={id}
        className={`inline-flex items-center font-medium border rounded-full whitespace-nowrap select-none ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        } ${config.color} ${config.border} ${className}`}
      >
        {children || config.label}
      </span>
    );
  }

  const variantStyles = {
    orange: 'text-[#FF5722] bg-[#FF5722]/15 border-[#FF5722]/35',
    green: 'text-[#4CAF50] bg-[#4CAF50]/15 border-[#4CAF50]/35',
    deal: 'text-white bg-gradient-to-r from-[#FF5722] to-amber-500 border-amber-400/40 font-bold shadow-sm shadow-[#FF5722]/30',
    slate: 'text-slate-300 bg-slate-800/80 border-slate-700/60',
    dietary: 'text-slate-200 bg-slate-800/60 border-slate-700/40',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center font-medium border rounded-full whitespace-nowrap select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
