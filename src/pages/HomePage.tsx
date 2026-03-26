import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Mascot } from '@/components/Mascot';
import { SpotCard } from '@/components/SpotCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { Search, RefreshCw, Filter } from 'lucide-react';
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
        if (isRefresh) toast.success('Spuds synchronized!', { icon: '🥔' });
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
    setSpots(prev => prev.map(s =>
      s.id === id ? { ...s, favoriteCount: s.favoriteCount + 1 } : s
    ));
    try {
      const res = await fetch(`/api/spots/${id}/favorite`, { method: 'POST' });
      const json = await res.json() as ApiResponse<Spot>;
      if (!json.success) throw new Error('Failed');
    } catch (err) {
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
    <div className="min-h-screen bg-cream selection:bg-spud/40">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        <Mascot className="w-40 h-40 md:w-56 md:h-56 mb-10" />
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          Idaho <span className="text-pine">Spud</span> <br className="md:hidden" /> <span className="text-spring">Explorer</span>
        </h1>
        <p className="text-2xl md:text-3xl font-black max-w-3xl mx-auto text-black/60 leading-tight uppercase tracking-tight">
          Find the best fries and the hottest soaks in the Gem State. <span className="text-pine">No fluff, just spuds.</span>
        </p>
      </section>
      {/* Discovery Toolbelt */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card-neo p-8 md:p-10 flex flex-col gap-10">
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-black/40 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Search for spuds or soaks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border-4 border-black rounded-full font-black text-lg shadow-neo focus:outline-none focus:border-spud focus:shadow-neo-lg transition-all placeholder:text-black/15"
              />
            </div>
            <button
              onClick={() => fetchSpots(true)}
              disabled={refreshing}
              className="btn-neo bg-spring text-white disabled:opacity-50 px-8"
              aria-label="Refresh spots"
            >
              <RefreshCw className={cn("w-7 h-7 mr-2", refreshing && "animate-spin")} />
              <span className="uppercase text-sm tracking-widest">Sync</span>
            </button>
          </div>
          {/* Detailed Filters */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
            <div className="flex flex-col gap-4 w-full lg:w-auto items-center lg:items-start">
              <label className="text-sm font-black uppercase tracking-[0.2em] text-black/30 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Destination
              </label>
              <div className="flex flex-wrap justify-center gap-3">
                {['all', 'boise', 'mccall'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilterLocation(loc as any)}
                    className={cn(
                      "px-8 py-3 rounded-full border-4 border-black font-black uppercase text-sm transition-all duration-100",
                      filterLocation === loc 
                        ? "bg-spud shadow-neo-lg translate-y-[-4px]" 
                        : "bg-white hover:bg-cream active:translate-y-1 active:shadow-none"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-1 h-16 bg-black/10 hidden lg:block rounded-full" />
            <div className="flex flex-col gap-4 w-full lg:w-auto items-center lg:items-start">
              <label className="text-sm font-black uppercase tracking-[0.2em] text-black/30 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Activity Type
              </label>
              <div className="flex flex-wrap justify-center gap-3">
                {['all', 'food', 'hotspring'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={cn(
                      "px-8 py-3 rounded-full border-4 border-black font-black uppercase text-sm transition-all duration-100",
                      filterType === type 
                        ? (type === 'hotspring' ? "bg-spring text-white" : "bg-spud") + " shadow-neo-lg translate-y-[-4px]" 
                        : "bg-white hover:bg-cream active:translate-y-1 active:shadow-none"
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
      {/* Result Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 animate-pulse">
            <Mascot className="w-24 h-24 mb-6 opacity-20 grayscale" />
            <div className="h-10 w-64 bg-black/10 rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full text-center py-32 card-neo bg-white/50 border-dashed"
                >
                  <p className="text-4xl font-black uppercase text-black/10 tracking-tighter">
                    Empty sack! No spuds found.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
      <footer className="py-20 border-t-8 border-black bg-white text-center">
        <Mascot className="w-16 h-16 mb-4 opacity-30" />
        <p className="font-black uppercase text-lg tracking-[0.3em] text-black">
          Idaho Spud Explorer
        </p>
        <p className="text-black/40 font-bold uppercase text-xs mt-2">
          Hand-picked with love & grease • 2024
        </p>
      </footer>
      <Toaster position="bottom-right" richColors toastOptions={{
        style: { border: '4px solid black', borderRadius: '1rem', fontWeight: '900', textTransform: 'uppercase' }
      }} />
    </div>
  );
}