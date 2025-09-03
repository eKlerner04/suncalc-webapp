import PocketBase from 'pocketbase';

// PocketBase-Client mit robusteren Einstellungen initialisieren
export const pb = new PocketBase('http://127.0.0.1:8090');

// Timeout für alle Requests setzen (30 Sekunden)
pb.beforeSend = function (url, options) {
  options.timeout = 30000; // 30 Sekunden
  return { url, options };
};

// Retry-Logik für fehlgeschlagene Requests
pb.afterSend = function (response, data) {
  if (!response.ok && response.status !== 404) {
    console.log(`⚠️ PocketBase-Request fehlgeschlagen: ${response.status} ${response.statusText}`);
  }
  return { response, data };
};

// Collection-Name für Solar-Zellen
export const SOLAR_COLLECTION = 'solar_cells';

// Interface für Solar-Zellen
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

// Koordinaten auf 5km × 5km Rasterzellen runden (für gridKey)
export function roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {
  // Für 5km Grid: auf 0.045° runden (≈ 5km)
  // Da 1° ≈ 111km, 5km ≈ 0.045°
  const gridSize = 0.045;
  
  return {
    latRounded: Math.round(lat / gridSize) * gridSize,
    lngRounded: Math.round(lng / gridSize) * gridSize
  };
}

// Grid-Key aus gerundeten Koordinaten generieren
export function generateGridKey(lat: number, lng: number): string {
  const rounded = roundCoordinates(lat, lng);
  return `${rounded.latRounded.toFixed(4)}_${rounded.lngRounded.toFixed(4)}`;
}

// Hilfsfunktion um Grid-Größe zu berechnen
export function getGridSizeKm(lat: number, lng: number): { latKm: number, lngKm: number } {
  const rounded = roundCoordinates(lat, lng);
  const latRad = rounded.latRounded * Math.PI / 180;
  
  return {
    latKm: 5.0, // Konstante 5km
    lngKm: 5.0 / Math.cos(latRad) // Variiert je nach Breitengrad
  };
}

// Grid-Grenzen für ein bestimmten GridKey berechnen
export function getGridBounds(gridKey: string): {
  minLat: number, maxLat: number, minLng: number, maxLng: number
} {
  const [latStr, lngStr] = gridKey.split('_');
  const centerLat = parseFloat(latStr);
  const centerLng = parseFloat(lngStr);
  
  const gridSize = 0.045; // 5km Grid
  
  return {
    minLat: centerLat - gridSize / 2,
    maxLat: centerLat + gridSize / 2,
    minLng: centerLng - gridSize / 2,
    maxLng: centerLng + gridSize / 2
  };
}

/**
 * Testet die PocketBase-Verbindung
 */
export async function testPocketBaseConnection(): Promise<boolean> {
  try {
    await pb.health.check();
    return true;
  } catch (error) {
    console.error('❌ PocketBase-Verbindungstest fehlgeschlagen:', error);
    return false;
  }
}

/**
 * Wartet auf eine verfügbare PocketBase-Verbindung
 */
export async function waitForPocketBase(maxWaitTime: number = 60000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      await pb.health.check();
      console.log('✅ PocketBase-Verbindung verfügbar');
      return true;
    } catch (error) {
      const remainingTime = Math.round((maxWaitTime - (Date.now() - startTime)) / 1000);
      console.log(`⏳ Warte auf PocketBase... (noch ${remainingTime}s)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Sekunden warten
    }
  }
  
  console.error('❌ PocketBase-Verbindung nach maximaler Wartezeit nicht verfügbar');
  return false;
}
