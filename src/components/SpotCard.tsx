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
  const locationLabel = spot.location === 'both'
    ? 'Boise & McCall'
    : spot.location.charAt(0).toUpperCase() + spot.location.slice(1);
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      className="card-neo flex flex-col h-full group select-none"
    >
      <div className="relative aspect-video border-b-4 border-black bg-black/5 overflow-hidden">
        {spot.imageUrl ? (
          <img
            src={spot.imageUrl}
            alt={`${spot.name} in ${locationLabel}, Idaho`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/5">
            <span className="text-black/10 font-black uppercase text-xl tracking-tighter">No Image</span>
          </div>
        )}
        <div
          className={cn(
            "absolute top-4 left-4 px-4 py-1.5 border-3 border-black rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-neo z-10 transition-transform group-hover:scale-110",
            isHotSpring ? "bg-spring text-white" : "bg-spud text-black"
          )}
        >
          {isHotSpring ? '💦 Soak' : '🍟 Yummy'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 gap-4">
        <h3 className="text-2xl font-black leading-tight uppercase tracking-tight group-hover:text-pine transition-colors">
          {spot.name}
        </h3>
        <p className="text-black/60 font-bold text-sm leading-relaxed flex-1">
          {spot.description}
        </p>
        <div className="flex items-center justify-between pt-5 mt-auto border-t-4 border-black/5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black/80 bg-black/5 px-3 py-2 rounded-full border-2 border-transparent group-hover:border-black/5 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-pine" />
            {locationLabel}
          </span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(spot.id);
            }}
            variant="ghost"
            className="group/btn relative flex items-center gap-2 hover:bg-transparent active:scale-90 transition-transform p-0 h-auto"
          >
            <motion.div
              whileTap={{ scale: 1.8, rotate: -15 }}
              transition={{ type: "spring", stiffness: 600, damping: 10 }}
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-all fill-transparent stroke-black stroke-[3px] group-hover/btn:fill-red-500 group-hover/btn:stroke-red-600 group-hover/btn:drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]",
                )}
              />
            </motion.div>
            <span className="font-black text-2xl tabular-nums tracking-tighter drop-shadow-sm">
              {spot.favoriteCount}
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
});
SpotCard.displayName = 'SpotCard';