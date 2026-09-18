import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'dish' | 'hero';
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  id?: string;
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  dish: 'aspect-[4/3]',
  hero: 'aspect-[16/10] sm:aspect-[16/9]',
};

export function ProgressiveImage({
  src,
  alt,
  aspectRatio = 'dish',
  className = '',
  imgClassName = '',
  priority = false,
  id,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      id={id}
      className={`relative overflow-hidden bg-slate-900 ${aspectRatios[aspectRatio]} ${className}`}
      style={{ contain: 'layout paint' }} // Performance optimization: CSS containment
    >
      {/* Animated Shimmer / Placeholder to guarantee zero layout shift (CLS = 0) */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback if image load fails */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-2">
          <UtensilsCrossed className="w-8 h-8 opacity-40" />
          <span className="text-xs font-medium">Culinary Preview</span>
        </div>
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full h-full object-cover object-center gpu-layer ${imgClassName}`}
        />
      )}
    </div>
  );
}
