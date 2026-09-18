import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star, Flame } from 'lucide-react';
import { ProgressiveImage } from '../atoms/ProgressiveImage';
import { Button } from '../atoms/Button';
import { useCart } from '../../context/CartContext';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onViewDeals: () => void;
}

export function HeroSection({ onExploreMenu, onViewDeals }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { addItem } = useCart();
  const featuredDish = INITIAL_MENU_ITEMS[0]; // Truffle Wagyu Smash

  // Framer Motion GPU Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const floatingCardY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const floatingCardY2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center justify-center border-b border-white/10"
    >
      {/* Background Animated Neon Glow Meshes - strictly GPU accelerated */}
      <motion.div
        style={{ scale: orbScale }}
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#FF5722]/15 blur-3xl gpu-layer"
      />
      <motion.div
        style={{ scale: orbScale }}
        className="pointer-events-none absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#4CAF50]/15 blur-3xl gpu-layer"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Architectural Copy & Actions */}
          <motion.div
            style={{ y: heroTextY }}
            className="lg:col-span-7 flex flex-col items-start gpu-layer"
          >
            {/* Supercharged Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5722]/15 via-amber-500/10 to-[#4CAF50]/15 px-3.5 py-1.5 border border-[#FF5722]/30 backdrop-blur-md mb-6 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#4CAF50] animate-ping" />
              <span className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                Next-Gen Food-Tech Kitchen
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-extrabold text-[#FF5722] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#FF5722]" /> 18 Min Express
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]"
            >
              Precision Taste. <br />
              <span className="bg-gradient-to-r from-[#FF5722] via-orange-400 to-[#4CAF50] bg-clip-text text-transparent">
                Molecular Speed.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl"
            >
              Curated by Michelin-trained chefs and backed by temperature-locked delivery pods.
              Farm-to-fork ingredients engineered for optimal macro-density and uncompromising flavor.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Button
                id="hero-explore-menu-btn"
                variant="primary"
                size="lg"
                onClick={onExploreMenu}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-xl shadow-[#FF5722]/30"
              >
                Explore Gastronomy Menu
              </Button>

              <Button
                id="hero-view-deals-btn"
                variant="glass"
                size="lg"
                onClick={onViewDeals}
                leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}
                className="w-full sm:w-auto"
              >
                View Flash Deals
              </Button>
            </motion.div>

            {/* Trust Metric Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 grid grid-cols-3 gap-3 w-full max-w-md pt-6 border-t border-slate-800/80"
            >
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black text-white">4.96 ★</span>
                <span className="text-xs text-slate-400 font-medium">12k+ Foodie Reviews</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black text-[#4CAF50]">18 min</span>
                <span className="text-xs text-slate-400 font-medium">Average Hot Delivery</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black text-[#FF5722]">100%</span>
                <span className="text-xs text-slate-400 font-medium">Clean Certified Organic</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Parallax Hero Showcase with Progressive Image Loading */}
          <div className="lg:col-span-5 relative">
            <motion.div
              style={{ y: heroImageY }}
              className="relative mx-auto max-w-md lg:max-w-none gpu-layer"
            >
              {/* Outer Glowing Glass Frame with fixed aspect ratio to prevent CLS */}
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-2xl backdrop-blur-2xl">
                {/* Hero Dish Progressive Image */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-slate-950">
                  <ProgressiveImage
                    src={featuredDish.image}
                    alt={featuredDish.name}
                    aspectRatio="dish"
                    priority={true}
                    imgClassName="scale-105 hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Overlay badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/15 shadow-lg">
                    <Flame className="w-3.5 h-3.5 fill-[#FF5722] text-[#FF5722]" />
                    <span>Today's Culinary Masterpiece</span>
                  </div>

                  {/* Bottom Dish details inside frame */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white leading-tight">
                        {featuredDish.name}
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium">
                        45-Day Dry Aged • Black Winter Truffle
                      </p>
                    </div>
                    <button
                      id="hero-quick-add-btn"
                      onClick={() => addItem(featuredDish)}
                      className="flex items-center gap-1 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] px-3 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-[#FF5722]/40 transition-all cursor-pointer active:scale-95"
                    >
                      <span>+ ${featuredDish.price.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Anime-Style Micro Badge 1: Top Right */}
              <motion.div
                style={{ y: floatingCardY1 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -top-6 -right-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-slate-900/90 border border-white/20 p-3 shadow-2xl backdrop-blur-xl gpu-layer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/40">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-white">Direct Farm Sourcing</span>
                  <span className="block text-[10px] text-emerald-400">Zero Synthetic Additives</span>
                </div>
              </motion.div>

              {/* Floating Anime-Style Micro Badge 2: Bottom Left */}
              <motion.div
                style={{ y: floatingCardY2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-2.5 rounded-2xl bg-slate-900/90 border border-white/20 p-3 shadow-2xl backdrop-blur-xl gpu-layer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-white">4.96 Michelin Standard</span>
                  <span className="block text-[10px] text-amber-300">Verified Food Critic Rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
