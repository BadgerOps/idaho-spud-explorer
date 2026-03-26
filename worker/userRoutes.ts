import { Hono } from "hono";
import { Env } from './core-utils';
import type { Spot, ApiResponse } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/spots', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getSpots();
        return c.json({ success: true, data } satisfies ApiResponse<Spot[]>);
    });
    app.post('/api/spots/:id/favorite', async (c) => {
        const id = c.req.param('id');
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        try {
            const data = await stub.incrementFavorite(id);
            return c.json({ success: true, data } satisfies ApiResponse<Spot>);
        } catch (e) {
            return c.json({ success: false, error: 'Spot not found' }, 404);
        }
    });
    // Legacy demo routes for compatibility
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'Idaho Spud Explorer' }}));
}