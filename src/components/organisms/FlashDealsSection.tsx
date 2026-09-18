import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Zap, Timer, Sparkles } from 'lucide-react';
import { ACTIVE_FLASH_DEALS, DEAL_EXPIRATION_TIMESTAMP } from '../../data/mockData';
import { DealCountdownCard } from '../molecules/DealCountdownCard';
import { useCountdown } from '../../hooks/useCountdown';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function FlashDealsSection() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const globalCountdown = useCountdown(DEAL_EXPIRATION_TIMESTAMP);

  const deals = useMemo(() => ACTIVE_FLASH_DEALS, []);

  return (
    <section
      ref={sectionRef}
      id="flash-deals-section"
      className="relative py-20 border-b border-white/10 bg-slate-950/60 overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-[#FF5722]/10 blur-3xl gpu-layer" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722]" />
              <span>LIMITED GOURMET DROP</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
              Synchronized Flash Drops
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-lg">
              Chef-crafted signature batches released at promotional pricing until the synchronized countdown hits zero.
            </p>
          </div>

          {/* Master Synchronized Timer Bar */}
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/90 border border-white/15 p-3.5 backdrop-blur-xl shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5722]/20 text-[#FF5722]">
              <Timer className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Batch Closes In
              </span>
              <div className="flex items-center gap-1.5 font-mono text-lg font-black text-white tracking-wider">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {globalCountdown.hours}h
                </span>
                <span className="text-slate-500">:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {globalCountdown.minutes}m
                </span>
                <span className="text-slate-500">:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[#FF5722] border border-slate-700">
                  {globalCountdown.seconds}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid with auto-fit / auto-fill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut', staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {deals.map((deal) => (
            <DealCountdownCard key={deal.id} deal={deal} />
          ))}
        </motion.div>

        {/* Promo Code Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4CAF50]/20 text-[#4CAF50]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">First order discount active</p>
              <p className="text-xs text-slate-400">Use promo code <span className="font-mono font-bold text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">TASTY20</span> at checkout for 20% OFF</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#4CAF50] bg-[#4CAF50]/15 border border-[#4CAF50]/30 px-3 py-1.5 rounded-full whitespace-nowrap">
            Auto-eligible on orders &gt; $25
          </span>
        </motion.div>
      </div>
    </section>
  );
}
