import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Mascot } from '@/components/Mascot';
import { SpotCard } from '@/components/SpotCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { Search, Filter, Sparkles, Plus, XCircle, ArrowDown } from 'lucide-react';
import type { Spot, ApiResponse, SpotLocation, SpotType } from '@shared/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<SpotLocation | 'all'>('all');
  const [filterType, setFilterType] = useState<SpotType | 'all'>('all');
  const fetchSpots = useCallback(async () => {
    try {
      const res = await fetch('/api/spots');
      const json = await res.json() as ApiResponse<Spot[]>;
      if (json.success && json.data) {
        setSpots(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch');
      }
    } catch (err) {
      console.error('Failed to fetch spots', err);
      toast.error('Could not load spuds!');
    } finally {
      setLoading(false);
    }
  }, []);
  const handleDiscover = async () => {
    if (discovering) return;
    setDiscovering(true);
    const toastId = toast.loading('Peeling back new discoveries...');
    try {
      const res = await fetch('/api/spots/discover', { method: 'POST' });
      const json = await res.json() as ApiResponse<Spot[]>;
      if (json.success && json.data) {
        if (json.data.length === 0) {
          toast.info('No more spuds to find!', { icon: '🥔', id: toastId });
        } else {
          setSpots(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const uniqueNewSpots = json.data!.filter(s => !existingIds.has(s.id));
            return [...prev, ...uniqueNewSpots];
          });
          toast.success(`Found ${json.data.length} new spots!`, { icon: '✨', id: toastId });
        }
      }
    } catch (err) {
      toast.error('Discovery failed. The spuds are hiding.', { id: toastId });
    } finally {
      setDiscovering(false);
    }
  };
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
  const clearFilters = () => {
    setSearchQuery('');
    setFilterLocation('all');
    setFilterType('all');
    toast.info('Filters cleared!');
  };
  const filteredSpots = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return spots.filter(spot => {
      const locMatch = filterLocation === 'all' || spot.location === filterLocation || spot.location === 'both';
      const typeMatch = filterType === 'all' || spot.type === filterType;
      const locationDisplay = spot.location === 'both' ? 'boise mccall idaho' : `${spot.location} idaho`;
      const typeDisplay = spot.type === 'hotspring' ? 'hot spring soak water' : 'food restaurant yum';
      const searchContent = `${spot.name} ${spot.description} ${locationDisplay} ${typeDisplay}`.toLowerCase();
      const searchMatch = query === '' || query.split(' ').every(q => searchContent.includes(q));
      return locMatch && typeMatch && searchMatch;
    });
  }, [spots, filterLocation, filterType, searchQuery]);
  const isFiltered = searchQuery !== '' || filterLocation !== 'all' || filterType !== 'all';
  const showDiscoveryButton = !isFiltered && !loading;
  return (
    <div className="min-h-screen bg-cream selection:bg-spud/40 overflow-x-hidden">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 lg:py-32 text-center overflow-hidden">
        <Mascot className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 mb-8 md:mb-10" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] leading-[0.9]"
        >
          Idaho <span className="text-pine">Spud</span> <br className="sm:hidden" /> <span className="text-spring">Explorer</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl md:text-3xl font-black max-w-3xl mx-auto text-black/70 leading-tight uppercase tracking-tight px-4"
        >
          Find the best fries and the hottest soaks in the Gem State. <span className="text-pine">No fluff, just spuds.</span>
        </motion.p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 hidden md:flex justify-center text-black/20"
        >
          <ArrowDown className="w-10 h-10" />
        </motion.div>
      </section>
      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-neo p-6 sm:p-8 md:p-10 flex flex-col gap-8 md:gap-10"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-black/40 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Try 'burger', 'soak'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 md:py-5 bg-white border-4 border-black rounded-full font-black text-base md:text-lg shadow-neo focus:outline-none focus:border-spud focus:shadow-neo-lg transition-all placeholder:text-black/20"
              />
            </div>
            <button
              onClick={handleDiscover}
              disabled={discovering}
              className="btn-neo bg-spring text-white disabled:opacity-50 px-8 py-4 md:py-0"
            >
              <Sparkles className={cn("w-6 h-6 md:w-7 md:h-7 mr-2", discovering && "animate-spin")} />
              <span className="uppercase text-xs md:text-sm tracking-widest font-black">{discovering ? 'Finding...' : 'Discover'}</span>
            </button>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            <div className="flex flex-col gap-3 w-full lg:w-auto items-center lg:items-start">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Destination
              </label>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['all', 'boise', 'mccall'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilterLocation(loc as any)}
                    className={cn(
                      "px-6 md:px-8 py-2 md:py-3 rounded-full border-4 border-black font-black uppercase text-xs md:text-sm transition-all duration-100",
                      filterLocation === loc
                        ? "bg-spud shadow-neo translate-y-[-2px]"
                        : "bg-white hover:bg-cream active:translate-y-1 active:shadow-none"
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-1 h-12 bg-black/10 hidden lg:block rounded-full" />
            <div className="flex flex-col gap-3 w-full lg:w-auto items-center lg:items-start">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Activity Type
              </label>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['all', 'food', 'hotspring'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={cn(
                      "px-6 md:px-8 py-2 md:py-3 rounded-full border-4 border-black font-black uppercase text-xs md:text-sm transition-all duration-100",
                      filterType === type
                        ? (type === 'hotspring' ? "bg-spring text-white" : "bg-spud") + " shadow-neo translate-y-[-2px]"
                        : "bg-white hover:bg-cream active:translate-y-1 active:shadow-none"
                    )}
                  >
                    {type === 'hotspring' ? 'Hot Springs' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 animate-pulse">
            <Mascot className="w-24 h-24 mb-6 opacity-20 grayscale" />
            <div className="h-10 w-64 bg-black/10 rounded-full" />
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="col-span-full text-center py-20 md:py-32 card-neo bg-white/40 border-dashed border-black/20 flex flex-col items-center gap-6 shadow-none"
                  >
                    <div>
                      <XCircle className="w-16 h-16 md:w-20 md:h-20 mx-auto text-black/10 mb-4" />
                      <p className="text-2xl md:text-4xl font-black uppercase text-black/20 tracking-tighter">
                        Empty sack! No spuds found.
                      </p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="btn-neo bg-black text-white hover:bg-black/90"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {showDiscoveryButton && (
               <div className="flex justify-center pt-8">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    onClick={handleDiscover}
                    disabled={discovering}
                    className="btn-neo bg-white text-black text-xl md:text-2xl px-10 md:px-14 py-5 md:py-7 gap-4 hover:bg-spud group shadow-neo-lg"
                  >
                    <Plus className={cn("w-7 h-7 md:w-8 md:h-8 transition-transform", discovering ? "animate-spin" : "group-hover:rotate-90")} />
                    <span className="uppercase tracking-widest font-black">Dig for More</span>
                  </motion.button>
               </div>
            )}
          </div>
        )}
      </section>
      {/* Footer */}
      <footer className="py-16 md:py-24 border-t-8 border-black bg-white text-center">
        <Mascot className="w-16 h-16 mb-4 opacity-40 grayscale" />
        <p className="font-black uppercase text-base md:text-lg tracking-[0.3em] text-black">
          Idaho Spud Explorer
        </p>
        <p className="text-black/50 font-bold uppercase text-[10px] md:text-xs mt-3 tracking-widest">
          Hand-picked with love & grease • 2024
        </p>
      </footer>
      <Toaster position="bottom-right" richColors toastOptions={{
        style: { border: '4px solid black', borderRadius: '1.5rem', fontWeight: '900', textTransform: 'uppercase', padding: '1.25rem' }
      }} />
    </div>
  );
}