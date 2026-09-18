import { useState, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Utensils, Sparkles } from 'lucide-react';
import { MenuItem, DietaryType, SortOption } from '../../types';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';
import { CategoryFilterPill } from '../molecules/CategoryFilterPill';
import { DietaryToggle } from '../molecules/DietaryToggle';
import { MenuItemCard } from '../molecules/MenuItemCard';
import { Input } from '../atoms/Input';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface MenuCategoryDef {
  id: string;
  name: string;
  icon: string;
}

const CATEGORIES: MenuCategoryDef[] = [
  { id: 'all', name: 'All Gastronomy', icon: '✨' },
  { id: 'burgers', name: 'Gourmet Burgers', icon: '🍔' },
  { id: 'bowls', name: 'Macro Bowls', icon: '🥗' },
  { id: 'pizza', name: 'Artisanal Pizza', icon: '🍕' },
  { id: 'salads', name: 'Green Superfood', icon: '🥑' },
  { id: 'juices', name: 'Cold-Pressed', icon: '🧃' },
  { id: 'desserts', name: 'Sweet Lab', icon: '🍫' },
];

export const MenuSection = forwardRef<HTMLElement, { searchQuery?: string; onSearchChange?: (val: string) => void }>(
  function MenuSection(props, _ref) {
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.05 });
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>([]);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>('popular');

    const effectiveSearch = props.searchQuery !== undefined ? props.searchQuery : localSearch;

    const handleDietaryToggle = (type: DietaryType) => {
      setSelectedDietary((prev) =>
        prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type]
      );
    };

    const handleClearDietary = () => {
      setSelectedDietary([]);
    };

    // Filter & sort dishes
    const filteredItems = useMemo(() => {
      let items = [...INITIAL_MENU_ITEMS];

      // Category filter
      if (activeCategory !== 'all') {
        items = items.filter((item) => item.category === activeCategory);
      }

      // Dietary filter
      if (selectedDietary.length > 0) {
        items = items.filter((item) =>
          selectedDietary.every((diet) => item.dietary.includes(diet))
        );
      }

      // Search query filter
      if (effectiveSearch.trim()) {
        const query = effectiveSearch.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.tagline.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
      }

      // Sort
      items.sort((a, b) => {
        if (sortOption === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortOption === 'rating') return b.rating - a.rating;
        if (sortOption === 'prepTime') return a.prepTimeMinutes - b.prepTimeMinutes;
        if (sortOption === 'priceAsc') return a.price - b.price;
        if (sortOption === 'priceDesc') return b.price - a.price;
        return 0;
      });

      return items;
    }, [activeCategory, selectedDietary, effectiveSearch, sortOption]);

    // Counts by category
    const categoryCounts = useMemo(() => {
      const counts: Record<string, number> = { all: INITIAL_MENU_ITEMS.length };
      INITIAL_MENU_ITEMS.forEach((item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      return counts;
    }, []);

    return (
      <section
        ref={sectionRef}
        id="menu-section"
        className="relative py-20 bg-slate-950 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4CAF50]/15 px-3.5 py-1 text-xs font-bold text-[#4CAF50] border border-[#4CAF50]/30 mb-3">
              <Utensils className="w-3.5 h-3.5" />
              <span>CHEF-DESIGNED MENU</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              Culinary Chemistry on Demand
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Filtered by macro nutrients, chef craft, and dietary criteria. Freshly prepared to order.
            </p>
          </div>

          {/* Category Filter Pills (Horizontal scrollable with smooth spring indicator) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none justify-start lg:justify-center border-b border-slate-900 mb-8">
            {CATEGORIES.map((cat) => (
              <CategoryFilterPill
                key={cat.id}
                id={cat.id}
                name={cat.name}
                count={categoryCounts[cat.id] || 0}
                isActive={activeCategory === cat.id}
                icon={<span>{cat.icon}</span>}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>

          {/* Controls Bar: Search, Dietary Filters, and Sorting */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            {/* Search Input */}
            <div className="w-full lg:max-w-xs">
              <Input
                id="menu-search-input"
                placeholder="Search ingredients, dishes, prep..."
                leftIcon={<Search className="w-4 h-4" />}
                value={effectiveSearch}
                onChange={(e) => {
                  if (props.onSearchChange) {
                    props.onSearchChange(e.target.value);
                  } else {
                    setLocalSearch(e.target.value);
                  }
                }}
                onClear={() => {
                  if (props.onSearchChange) {
                    props.onSearchChange('');
                  } else {
                    setLocalSearch('');
                  }
                }}
              />
            </div>

            {/* Dietary Tags */}
            <div className="flex-1 lg:px-4">
              <DietaryToggle
                selectedDietary={selectedDietary}
                onToggle={handleDietaryToggle}
                onClearAll={handleClearDietary}
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">Sort:</span>
              <select
                id="menu-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-[#FF5722] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated (★)</option>
                <option value="prepTime">Fastest Prep Time</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Responsive CSS Grid System using auto-fit / auto-fill */}
          <div
            id="menu-grid"
            className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-6 min-h-[380px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-white/10 bg-slate-900/40 mt-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No dishes match your filter</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Try clearing active dietary tags or searching for a different gourmet ingredient.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedDietary([]);
                  if (props.onSearchChange) props.onSearchChange('');
                  setLocalSearch('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#FF5722] text-xs font-bold text-white shadow-md shadow-[#FF5722]/30 cursor-pointer"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    );
  }
);
