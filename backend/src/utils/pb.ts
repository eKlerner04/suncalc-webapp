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
  created: string;
  updated: string;
}

// Koordinaten auf Rasterzellen runden (für gridKey)
export function roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {
  return {
    latRounded: Math.round(lat * 100) / 100,
    lngRounded: Math.round(lng * 100) / 100
  };
}

// Grid-Key aus gerundeten Koordinaten generieren
export function generateGridKey(lat: number, lng: number): string {
  const rounded = roundCoordinates(lat, lng);
  return `${rounded.latRounded}_${rounded.lngRounded}`;
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
