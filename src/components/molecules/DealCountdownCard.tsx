import { memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Timer, Flame, Check, Tag } from 'lucide-react';
import { DealItem } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import { ProgressiveImage } from '../atoms/ProgressiveImage';
import { PriceTag } from '../atoms/PriceTag';
import { useCart } from '../../context/CartContext';

interface DealCountdownCardProps {
  deal: DealItem;
  id?: string;
}

export const DealCountdownCard = memo(function DealCountdownCard({ deal, id }: DealCountdownCardProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown(deal.expiresAt);
  const { addItem, applyCoupon, appliedCoupon } = useCart();

  const isCouponApplied = appliedCoupon?.code === deal.code;
  const percentClaimed = Math.round((deal.claimedSlots / deal.totalSlots) * 100);

  const handleClaimDeal = () => {
    // Add the specific deal item to cart at promotional deal price
    addItem(deal.menuItem, {
      customPrice: deal.dealPrice,
      specialInstructions: `Flash Deal: ${deal.title} (${deal.discountPercentage}% OFF)`,
    });
  };

  return (
    <motion.div
      id={id || `deal-card-${deal.id}`}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4.5 shadow-2xl backdrop-blur-xl gpu-layer"
    >
      {/* Anime-like vibrant neon accent glow at top edge */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722] via-amber-400 to-[#4CAF50]" />

      <div>
        {/* Deal Header with synchronized countdown timer */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] text-xs font-black tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 fill-[#FF5722]" />
            {deal.discountPercentage}% OFF FLASH DEAL
          </span>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/80 px-2.5 py-1 border border-white/10 text-xs font-mono">
            <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <div className="flex items-center gap-1 font-bold text-slate-100">
              <span className="px-1 py-0.5 rounded bg-slate-800 text-amber-300">{hours}</span>
              <span>:</span>
              <span className="px-1 py-0.5 rounded bg-slate-800 text-amber-300">{minutes}</span>
              <span>:</span>
              <span className="px-1 py-0.5 rounded bg-slate-800 text-[#FF5722]">{seconds}</span>
            </div>
          </div>
        </div>

        {/* Dish Image with Progressive Loading */}
        <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[16/10] w-full">
          <ProgressiveImage
            src={deal.menuItem.image}
            alt={deal.title}
            aspectRatio="dish"
            imgClassName="transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/20">
            Save ${(deal.menuItem.price - deal.dealPrice).toFixed(2)}
          </div>
        </div>

        {/* Deal Information */}
        <div className="mt-3.5">
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
            {deal.title}
          </h3>
          <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {deal.description}
          </p>

          {/* Flash Slots Claimed Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3 h-3" />
                {deal.claimedSlots} of {deal.totalSlots} claimed
              </span>
              <span>{percentClaimed}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentClaimed}%` }}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-2">
        <div>
          <PriceTag price={deal.dealPrice} originalPrice={deal.menuItem.price} size="lg" />
          <span className="block text-[10px] text-slate-500 mt-0.5">Flash Promo Price</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            id={`claim-deal-btn-${deal.id}`}
            onClick={handleClaimDeal}
            disabled={isExpired}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#F4511E] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF5722]/30 hover:shadow-[#FF5722]/50 border border-white/20 transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Claim & Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
