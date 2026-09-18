import { DietaryType } from '../../types';
import { motion } from 'motion/react';

interface DietaryToggleProps {
  selectedDietary: DietaryType[];
  onToggle: (type: DietaryType) => void;
  onClearAll?: () => void;
}

const DIETARY_OPTIONS: { type: DietaryType; label: string; icon: string }[] = [
  { type: 'chef-special', label: "Chef's Special", icon: '⭐' },
  { type: 'high-protein', label: 'High-Protein', icon: '💪' },
  { type: 'vegan', label: 'Vegan', icon: '🌱' },
  { type: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { type: 'spicy', label: 'Spicy', icon: '🔥' },
];

export function DietaryToggle({ selectedDietary, onToggle, onClearAll }: DietaryToggleProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
        Dietary:
      </span>
      {DIETARY_OPTIONS.map((item) => {
        const isSelected = selectedDietary.includes(item.type);
        return (
          <motion.button
            key={item.type}
            id={`dietary-filter-${item.type}`}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(item.type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#4CAF50]/20 text-[#4CAF50] border-[#4CAF50]/50 shadow-sm shadow-[#4CAF50]/20 font-semibold'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        );
      })}

      {selectedDietary.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-[#FF5722] underline cursor-pointer ml-1"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
