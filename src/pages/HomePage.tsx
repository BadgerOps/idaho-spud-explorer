import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Mascot } from '@/components/Mascot';
import { SpotCard } from '@/components/SpotCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { Search, RefreshCw } from 'lucide-react';
import type { Spot, ApiResponse, SpotLocation, SpotType } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<SpotLocation | 'all'>('all');
  const [filterType, setFilterType] = useState<SpotType | 'all'>('all');
  const fetchSpots = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/spots');
      const json = await res.json() as ApiResponse<Spot[]>;
      if (json.success && json.data) {
        setSpots(json.data);
        if (isRefresh) toast.success('Spuds synchronized!');
      } else {
        throw new Error(json.error || 'Failed to fetch');
      }
    } catch (err) {
      console.error('Failed to fetch spots', err);
      toast.error('Could not load spuds!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);
  const handleFavorite = async (id: string) => {
    // Optimistic UI
    setSpots(prev => prev.map(s =>
      s.id === id ? { ...s, favoriteCount: s.favoriteCount + 1 } : s
    ));
    try {
      const res = await fetch(`/api/spots/${id}/favorite`, { method: 'POST' });
      const json = await res.json() as ApiResponse<Spot>;
      if (!json.success) {
        throw new Error('Failed to favorite');
      }
    } catch (err) {
      // Rollback
      setSpots(prev => prev.map(s =>
        s.id === id ? { ...s, favoriteCount: s.favoriteCount - 1 } : s
      ));
      toast.error('Spud power failure! Try again.');
    }
  };
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const locMatch = filterLocation === 'all' || spot.location === filterLocation || spot.location === 'both';
      const typeMatch = filterType === 'all' || spot.type === filterType;
      const searchMatch = searchQuery.trim() === '' || 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      return locMatch && typeMatch && searchMatch;
    });
  }, [spots, filterLocation, filterType, searchQuery]);
  return (
    <div className="min-h-screen bg-cream selection:bg-spud/30">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <Mascot className="w-32 h-32 md:w-48 md:h-48 mb-8" />
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          Idaho <span className="text-pine">Spud</span> <span className="text-spring">Explorer</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          Find the best fries and the hottest soaks in the Gem State. No fluff, just spuds.
        </p>
      </section>
      {/* Discovery Refinement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="card-neo p-6 md:p-8 flex flex-col gap-8">
          {/* Search & Refresh Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black rounded-full font-bold shadow-neo focus:outline-none focus:shadow-neo-lg transition-all placeholder:text-black/20"
              />
            </div>
            <button
              onClick={() => fetchSpots(true)}
              disabled={refreshing}
              className="btn-neo bg-spring text-white disabled:opacity-50 min-w-[60px]"
              aria-label="Refresh spots"
            >
              <RefreshCw className={cn("w-6 h-6", refreshing && "animate-spin")} />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label className="text-xs font-black uppercase tracking-widest text-black/40">Where to?</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'boise', 'mccall'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilterLocation(loc as any)}
                    className={cn(
                      "px-6 py-2 rounded-full border-4 border-black font-black uppercase text-sm transition-all",
                      filterLocation === loc ? "bg-spud shadow-neo translate-y-[-2px]" : "bg-white hover:bg-cream"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-12 bg-black/10 hidden md:block" />
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <label className="text-xs font-black uppercase tracking-widest text-black/40">Interests</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'food', 'hotspring'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={cn(
                      "px-6 py-2 rounded-full border-4 border-black font-black uppercase text-sm transition-all",
                      filterType === type ? "bg-spring shadow-neo translate-y-[-2px]" : "bg-white hover:bg-cream"
                    )}
                  >
                    {type === 'hotspring' ? 'Hot Springs' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-20 h-20 bg-black/5 rounded-full mb-4" />
            <div className="h-8 w-48 bg-black/5 rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onFavorite={handleFavorite}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <p className="text-3xl font-black uppercase text-black/20">No spuds found here!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
      <footer className="py-12 border-t-4 border-black bg-white text-center">
        <p className="font-black uppercase text-sm tracking-widest">
          Made with 🥔 in Idaho
        </p>
      </footer>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}