import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

pb.beforeSend = function (url, options) {
  options.timeout = 30000; // 30 Sekunden
  return { url, options };
};

pb.afterSend = function (response, data) {
  if (!response.ok && response.status !== 404) {
    console.log(`⚠️ PocketBase-Request fehlgeschlagen: ${response.status} ${response.statusText}`);
  }
  return { response, data };
};


export const SOLAR_COLLECTION = 'solar_cells';


export interface SolarCell {
  id: string;
  gridKey: string;
  latRounded: number;
  lngRounded: number;
  payload: any;
  source: string;
  fetchedAt: string;
  lastAccessAt: string;
  ttlDays: number;
  accessCount: number;
  popularityScore: number;
  isHot: boolean;
  locationWeight: number;
  recencyBonus: number;
  lastDecayAt?: string;
  decayCount?: number;
  solarKey: string;
  azimuth: number;
  tilt: number;
  area: number;
  created: string;
  updated: string;
}


export function roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {

  const gridSize = 0.045;
  
  return {
    latRounded: Math.round(lat / gridSize) * gridSize,
    lngRounded: Math.round(lng / gridSize) * gridSize
  };
}


export function generateGridKey(lat: number, lng: number): string {
  const rounded = roundCoordinates(lat, lng);
  return `${rounded.latRounded.toFixed(4)}_${rounded.lngRounded.toFixed(4)}`;
}


export function getGridSizeKm(lat: number, lng: number): { latKm: number, lngKm: number } {
  const rounded = roundCoordinates(lat, lng);
  const latRad = rounded.latRounded * Math.PI / 180;
  
  return {
    latKm: 5.0, 
    lngKm: 5.0 / Math.cos(latRad) // Variiert je nach Breitengrad
  };
}


export function getGridBounds(gridKey: string): {
  minLat: number, maxLat: number, minLng: number, maxLng: number
} {
  const [latStr, lngStr] = gridKey.split('_');
  const centerLat = parseFloat(latStr);
  const centerLng = parseFloat(lngStr);
  
  const gridSize = 0.045; 
  
  return {
    minLat: centerLat - gridSize / 2,
    maxLat: centerLat + gridSize / 2,
    minLng: centerLng - gridSize / 2,
    maxLng: centerLng + gridSize / 2
  };
}


export async function testPocketBaseConnection(): Promise<boolean> {
  try {
    await pb.health.check();
    return true;
  } catch (error) {
    console.error('PocketBase-Verbindungstest fehlgeschlagen:', error);
    return false;
  }
}


export async function waitForPocketBase(maxWaitTime: number = 60000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      await pb.health.check();
      console.log('PocketBase-Verbindung verfügbar');
      return true;
    } catch (error) {
      const remainingTime = Math.round((maxWaitTime - (Date.now() - startTime)) / 1000);
      console.log(`Warte auf PocketBase... (noch ${remainingTime}s)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden warten
    }
  }
  
  console.error('PocketBase-Verbindung nach maximaler Wartezeit nicht verfügbar');
  return false;
}
