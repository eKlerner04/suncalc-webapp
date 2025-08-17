import { Router } from 'express';
import { z } from 'zod';
import { gridKey } from '../utils/grid';
import { computeCo2 } from '../utils/co2';
import { getSolarFromCacheOrSource } from '../services/solarCache';

const router = Router();

const querySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  area: z.coerce.number().default(10),
  tilt: z.coerce.number().default(30),
  azimuth: z.coerce.number().default(180),
});

router.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { lat, lng, area, tilt, azimuth } = parsed.data;
  const key = gridKey(lat, lng);
  const cache = await getSolarFromCacheOrSource({ lat, lng, key });

  const annual_kWh = 1000;
  const co2 = computeCo2(annual_kWh);

  res.json({ inputs: { lat, lng, area, tilt, azimuth }, yield: { annual_kWh }, co2, cache });
});

export default router;
