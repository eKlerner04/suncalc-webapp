import PocketBase, { RecordModel } from 'pocketbase';

// PocketBase-Client für lokale Datenbank
export const pb = new PocketBase('http://127.0.0.1:8090');

// Collection-Name für Solar-Zellen
export const SOLAR_COLLECTION = 'solar_cells';

// Typen für die Solar-Zellen (kompatibel mit PocketBase)
export interface SolarCell extends RecordModel {
  gridKey: string;
  latRounded: number;
  lngRounded: number;
  payload: any; // API-Daten von PVGIS oder anderen Quellen
  source: 'local' | 'local_stale' | 'external' | 'fallback';
  fetchedAt: string; // ISO-Datum
  lastAccessAt: string; // ISO-Datum
  ttlDays: number; // Standard: 90 Tage
}

// Hilfsfunktion zum Runden der Koordinaten (für Grid-Key)
export function roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {
  // Runde auf 2 Dezimalstellen (ca. 1km Raster)
  return {
    latRounded: Math.round(lat * 100) / 100,
    lngRounded: Math.round(lng * 100) / 100
  };
}

// Hilfsfunktion zum Generieren des Grid-Keys
export function generateGridKey(lat: number, lng: number): string {
  const { latRounded, lngRounded } = roundCoordinates(lat, lng);
  return `${latRounded.toFixed(2)}_${lngRounded.toFixed(2)}`;
}
