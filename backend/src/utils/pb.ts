import PocketBase from 'pocketbase';

// PocketBase-Client initialisieren
export const pb = new PocketBase('http://127.0.0.1:8090');

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
