import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import type { Spot } from '@shared/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface SpotCardProps {
  spot: Spot;
  onFavorite: (id: string) => void;
}
export const SpotCard = forwardRef<HTMLDivElement, SpotCardProps>(({ spot, onFavorite }, ref) => {
  const isHotSpring = spot.type === 'hotspring';
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="card-neo flex flex-col h-full group"
    >
      <div className="relative aspect-video border-b-4 border-black bg-muted overflow-hidden">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-black/20 font-bold">No Image</span>
          </div>
        )}
        <div
          className={cn(
            "absolute top-4 left-4 px-4 py-1.5 border-3 border-black rounded-full text-xs font-black uppercase tracking-widest shadow-neo",
            isHotSpring ? "bg-spring text-white" : "bg-spud text-black"
          )}
        >
          {isHotSpring ? '💦 Soak' : '🍟 Yummy'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">{spot.name}</h3>
        <p className="text-muted-foreground font-bold text-sm leading-relaxed flex-1">
          {spot.description}
        </p>
        <div className="flex items-center justify-between pt-4 mt-auto border-t-2 border-black/5">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black/70 bg-black/5 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            {spot.location === 'both' ? 'Boise & McCall' : spot.location.charAt(0).toUpperCase() + spot.location.slice(1)}
          </span>
          <Button
            onClick={() => onFavorite(spot.id)}
            variant="ghost"
            className="group/btn relative flex items-center gap-2 hover:bg-transparent active:scale-95 transition-transform"
          >
            <motion.div
              whileTap={{ scale: 1.6, rotate: -15 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-colors fill-transparent stroke-black stroke-[3px] group-hover/btn:fill-red-500 group-hover/btn:stroke-red-600",
                )}
              />
            </motion.div>
            <span className="font-black text-xl tabular-nums tracking-tighter">{spot.favoriteCount}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
});
SpotCard.displayName = 'SpotCard';