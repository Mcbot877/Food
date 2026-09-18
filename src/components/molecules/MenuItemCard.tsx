import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Plus, Flame, Sparkles, Check } from 'lucide-react';
import { MenuItem } from '../../types';
import { ProgressiveImage } from '../atoms/ProgressiveImage';
import { Badge } from '../atoms/Badge';
import { RatingStars } from '../atoms/RatingStars';
import { PriceTag } from '../atoms/PriceTag';
import { useCart } from '../../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  id?: string;
}

export const MenuItemCard = memo(function MenuItemCard({ item, id }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);

    // Trigger immediate local anime-style micro-interaction
    setJustAdded(true);
    const particleId = Date.now();
    setFloatingParticles((prev) => [...prev, { id: particleId, x: 0, y: -20 }]);

    setTimeout(() => {
      setJustAdded(false);
    }, 900);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== particleId));
    }, 1200);
  };

  return (
    <motion.div
      id={id || `menu-card-${item.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4 transition-all duration-300 hover:border-[#FF5722]/40 hover:shadow-2xl hover:shadow-[#FF5722]/10 backdrop-blur-md gpu-layer overflow-hidden"
    >
      {/* Anime-like flying feedback particle on Add to Cart */}
      <AnimatePresence>
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -60, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="pointer-events-none absolute right-6 bottom-16 z-30 flex items-center gap-1 rounded-full bg-[#4CAF50] px-2.5 py-1 text-xs font-black text-white shadow-lg shadow-[#4CAF50]/40"
          >
            <Sparkles className="w-3 h-3" />
            <span>+1 Added</span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div>
        {/* Progressive Image Container with fixed ratio for 0 CLS */}
        <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] w-full">
          <ProgressiveImage
            src={item.image}
            alt={item.name}
            aspectRatio="dish"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            {item.isChefSpecial && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-[#FF5722] rounded-full shadow-md shadow-[#FF5722]/40 border border-white/20">
                <Sparkles className="w-3 h-3" />
                Chef's Pick
              </span>
            )}
            {item.isPopular && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-amber-500 rounded-full shadow-md shadow-amber-500/30">
                <Flame className="w-3 h-3 fill-white" />
                Popular
              </span>
            )}
          </div>

          {/* Prep Time pill */}
          <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>{item.prepTimeMinutes} min</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-3.5 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-[#FF5722] transition-colors leading-snug">
              {item.name}
            </h3>
            <RatingStars rating={item.rating} reviewsCount={item.reviewsCount} />
          </div>

          <p className="mt-1 text-xs text-[#4CAF50] font-medium tracking-tight">
            {item.tagline}
          </p>

          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Dietary tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {item.dietary.slice(0, 3).map((diet) => (
              <Badge key={diet} dietaryType={diet} size="sm" />
            ))}
          </div>

          {/* Micro Nutrition Strip */}
          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-lg bg-slate-950/50 p-2 border border-slate-800/80 text-center text-[11px]">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Cal</span>
              <span className="font-bold text-slate-200">{item.nutrition.calories}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Prot</span>
              <span className="font-bold text-cyan-400">{item.nutrition.protein}g</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Carb</span>
              <span className="font-bold text-amber-400">{item.nutrition.carbs}g</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Fat</span>
              <span className="font-bold text-rose-400">{item.nutrition.fat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Add Action */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <PriceTag price={item.price} originalPrice={item.originalPrice} size="md" />

        <motion.button
          id={`add-to-cart-${item.id}`}
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer select-none gpu-layer ${
            justAdded
              ? 'bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/30 border border-[#4CAF50]/40'
              : 'bg-gradient-to-r from-[#FF5722] to-[#F4511E] text-white shadow-md shadow-[#FF5722]/25 hover:shadow-lg hover:shadow-[#FF5722]/40 border border-[#FF5722]/30'
          }`}
          aria-label={`Add ${item.name} to cart`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Cart</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
});
