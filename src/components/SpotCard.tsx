import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Spot } from '@shared/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface SpotCardProps {
  spot: Spot;
  onFavorite: (id: string) => void;
}
export const SpotCard = forwardRef<HTMLDivElement, SpotCardProps>(({ spot, onFavorite }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="card-neo flex flex-col h-full"
    >
      <div className="relative aspect-video border-b-4 border-black bg-muted overflow-hidden">
        {spot.imageUrl ? (
          <img 
            src={spot.imageUrl} 
            alt={spot.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-black/20 font-bold">No Image</span>
          </div>
        )}
        <div 
          className="absolute top-4 left-4 px-3 py-1 border-2 border-black rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: spot.color }}
        >
          {spot.type === 'food' ? '🍟 Yummy' : '💦 Soak'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="text-2xl font-black leading-tight uppercase">{spot.name}</h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed flex-1">
          {spot.description}
        </p>
        <div className="flex items-center justify-between pt-4 mt-auto">
          <span className="text-xs font-black uppercase text-black/60 bg-black/5 px-2 py-1 rounded-md">
            📍 {spot.location}
          </span>
          <Button
            onClick={() => onFavorite(spot.id)}
            variant="ghost"
            className="group relative flex items-center gap-2 hover:bg-transparent"
          >
            <motion.div
              whileTap={{ scale: 1.5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart 
                className={cn(
                  "w-6 h-6 transition-colors fill-transparent stroke-black stroke-[3px] group-hover:fill-red-400 group-hover:stroke-red-600",
                )} 
              />
            </motion.div>
            <span className="font-black text-lg tabular-nums">{spot.favoriteCount}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

SpotCard.displayName = 'SpotCard';