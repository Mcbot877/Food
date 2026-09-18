import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export function RatingStars({
  rating,
  reviewsCount,
  showCount = true,
  size = 'sm',
  className = '',
  id,
}: RatingStarsProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div id={id} className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex items-center text-amber-400">
        <Star className={`${starSize} fill-amber-400 text-amber-400`} />
      </div>
      <span className={`font-bold text-slate-100 ${textSize}`}>{rating.toFixed(1)}</span>
      {showCount && reviewsCount !== undefined && (
        <span className={`text-slate-400 ${textSize}`}>({reviewsCount})</span>
      )}
    </div>
  );
}
