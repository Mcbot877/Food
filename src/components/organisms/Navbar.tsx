import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, Search, MapPin, ChefHat, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onSearchClick?: () => void;
  onDealsClick?: () => void;
  onMenuClick?: () => void;
}

export function Navbar({ onSearchClick, onDealsClick, onMenuClick }: NavbarProps) {
  const { totalItemCount, openCart, cartBounceKey } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40 py-3'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo with Anime-like Sparkle Emblem */}
        <a
          href="#"
          id="navbar-brand-logo"
          className="flex items-center gap-2.5 group cursor-pointer select-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5722] via-[#F4511E] to-amber-500 shadow-lg shadow-[#FF5722]/30 border border-white/25 group-hover:scale-105 transition-transform duration-300">
            <ChefHat className="h-5 w-5 text-white" />
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4CAF50] ring-2 ring-slate-950"
            >
              <Sparkles className="h-2 w-2 text-white" />
            </motion.span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-extrabold tracking-tight text-white group-hover:text-[#FF5722] transition-colors">
                Aura<span className="text-[#FF5722]">Bite</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/40">
                TECH-KITCHEN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Molecular Gastronomy & Express Speed
            </p>
          </div>
        </a>

        {/* Quick Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          <button
            onClick={onMenuClick}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors cursor-pointer"
          >
            Culinary Menu
          </button>
          <button
            onClick={onDealsClick}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-500/15 rounded-full transition-colors cursor-pointer"
          >
            <Zap className="w-3 h-3 text-[#FF5722]" />
            Flash Deals
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2">
            <MapPin className="w-3 h-3 text-[#4CAF50]" />
            <span className="text-slate-200 font-semibold">Downtown Lab</span>
            <span className="text-emerald-400">• Open</span>
          </div>
        </nav>

        {/* Actions: Search Trigger & Dynamic Cart Button */}
        <div className="flex items-center gap-2.5">
          {onSearchClick && (
            <button
              id="navbar-search-btn"
              onClick={onSearchClick}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Search dishes"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Cart Trigger with Anime-like Spring Bounce Badge */}
          <motion.button
            id="navbar-cart-btn"
            onClick={openCart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="relative flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900/90 px-3.5 py-2 text-slate-100 border border-white/15 hover:border-[#FF5722]/50 shadow-lg shadow-black/30 backdrop-blur-md cursor-pointer transition-colors"
            aria-label={`Open shopping cart with ${totalItemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#FF5722]" />
              {/* Bouncing count badge */}
              <AnimatePresence>
                {totalItemCount > 0 && (
                  <motion.span
                    key={cartBounceKey}
                    initial={{ scale: 0.4, rotate: -20 }}
                    animate={{ scale: [1.3, 0.95, 1.1, 1], rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                    className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4CAF50] text-[10px] font-black text-white shadow-md shadow-[#4CAF50]/40 border border-slate-950"
                  >
                    {totalItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="hidden sm:inline text-xs font-bold tracking-tight">Order Bag</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
