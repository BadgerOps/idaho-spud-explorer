import { DurableObject } from "cloudflare:workers";
import type { Spot } from '@shared/types';
import { MOCK_SPOTS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getSpots(): Promise<Spot[]> {
      const spots = await this.ctx.storage.get("idaho_spots");
      if (spots) {
        return spots as Spot[];
      }
      // Initialize with only the first 6 items for discovery pool mechanics
      const initialSpots = MOCK_SPOTS.slice(0, 6);
      await this.ctx.storage.put("idaho_spots", initialSpots);
      return initialSpots;
    }
    async discoverNewSpots(): Promise<Spot[]> {
      const currentSpots = await this.getSpots();
      const currentIds = new Set(currentSpots.map(s => s.id));
      // Filter MOCK_SPOTS for ones we don't have yet
      const pool = MOCK_SPOTS.filter(s => !currentIds.has(s.id));
      if (pool.length === 0) return [];
      // Pick 3-5 random candidates
      const countToPick = Math.min(pool.length, Math.floor(Math.random() * 3) + 3);
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countToPick);
      const updatedSpots = [...currentSpots, ...selected];
      await this.ctx.storage.put("idaho_spots", updatedSpots);
      return selected;
    }
    async incrementFavorite(id: string): Promise<Spot> {
      const spots = await this.getSpots();
      const spotIndex = spots.findIndex(s => s.id === id);
      if (spotIndex === -1) {
        throw new Error("Spot not found");
      }
      const updatedSpot = {
        ...spots[spotIndex],
        favoriteCount: spots[spotIndex].favoriteCount + 1
      };
      const newSpots = [...spots];
      newSpots[spotIndex] = updatedSpot;
      await this.ctx.storage.put("idaho_spots", newSpots);
      return updatedSpot;
    }
    // Keep boilerplate methods for template compatibility
    async getCounterValue(): Promise<number> {
      return (await this.ctx.storage.get("counter_value")) || 0;
    }
    async increment(): Promise<number> {
      let v: number = (await this.ctx.storage.get("counter_value")) || 0;
      v++;
      await this.ctx.storage.put("counter_value", v);
      return v;
    }
}