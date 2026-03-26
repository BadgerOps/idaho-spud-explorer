import { DurableObject } from "cloudflare:workers";
import type { Spot } from '@shared/types';
import { MOCK_SPOTS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getSpots(): Promise<Spot[]> {
      const spots = await this.ctx.storage.get("idaho_spots");
      if (spots) {
        return spots as Spot[];
      }
      await this.ctx.storage.put("idaho_spots", MOCK_SPOTS);
      return MOCK_SPOTS;
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