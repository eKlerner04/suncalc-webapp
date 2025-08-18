import { pb, SOLAR_COLLECTION, generateGridKey, SolarCell } from '../utils/pb';
import { pvgisService } from './pvgisService';
import { nasaService } from './nasaService';
import { PVGISResponse } from '../types/solar';
import { RecordModel } from 'pocketbase';

// Erweitere das SolarCell Interface um RecordModel
interface SolarCellRecord extends SolarCell, RecordModel {}

// Cache-Service für Solar-Daten mit PocketBase
class SolarCacheService {
  private static instance: SolarCacheService;

  private constructor() {}

  public static getInstance(): SolarCacheService {
    if (!SolarCacheService.instance) {
      SolarCacheService.instance = new SolarCacheService();
    }
    return SolarCacheService.instance;
  }

  // Hauptfunktion: Solar-Daten abrufen (mit Caching)
  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<{ data: PVGISResponse, source: string }> {
    const gridKey = generateGridKey(lat, lng);
    console.log(`🔍 Cache-Check für ${gridKey} (lat=${lat}, lng=${lng})`);

    // Prüfe ob Daten im Cache sind und frisch
    const cachedData = await this.findInDatabase(gridKey);
    if (cachedData && this.isDataFresh(cachedData)) {
      console.log(`✅ Frische Daten aus Cache (${gridKey})`);
      await this.updateLastAccess(gridKey);
      return { data: cachedData.payload, source: 'local' };
    }

    // Keine frischen Daten im Cache: Hole neue Daten
    console.log(`🔄 Keine frischen Daten im Cache (${gridKey}), rufe externe API auf`);
    const externalData = await this.fetchExternalData(lat, lng, area, tilt, azimuth);
    
    // Neue Daten in der Datenbank speichern
    await this.saveToDatabase(gridKey, lat, lng, externalData);
    
    return { data: externalData, source: externalData.source };
  }

  // Daten in der Datenbank suchen
  private async findInDatabase(gridKey: string): Promise<SolarCellRecord | null> {
    try {
      console.log(`🔍 Suche in DB nach gridKey: "${gridKey}"`);
      
      // Verwende direkte HTTP-API statt PocketBase-Client
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=gridKey%3D%22${gridKey}%22`);
      const data = await response.json();
      
      console.log(`🔍 HTTP-API Suche Ergebnis: ${data.totalItems} Datensätze gefunden`);
      
      if (data.items && data.items.length > 0) {
        // Nehme den ältesten Datensatz (mit dem frühesten lastAccessAt)
        const oldestRecord = data.items.reduce((oldest: any, current: any) => {
          const oldestDate = new Date(oldest.lastAccessAt);
          const currentDate = new Date(current.lastAccessAt);
          return oldestDate < currentDate ? oldest : current;
        });
        
        const record = oldestRecord as SolarCellRecord;
        console.log(`🔍 Gefundener Datensatz:`, {
          id: record.id,
          gridKey: record.gridKey,
          source: record.source,
          lastAccessAt: record.lastAccessAt,
          ttlDays: record.ttlDays
        });
        return record;
      } else {
        console.log(`🔍 Kein Datensatz mit gridKey "${gridKey}" gefunden`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Fehler beim Suchen in DB für ${gridKey}:`, error);
      return null;
    }
  }

  // Prüfen ob Daten noch frisch sind (TTL nicht überschritten)
  private isDataFresh(data: SolarCellRecord): boolean {
    const ttlDays = data.ttlDays || 90;
    const lastAccessAt = new Date(data.lastAccessAt);
    const now = new Date();
    const expiry = new Date(lastAccessAt.getTime() + ttlDays * 24 * 60 * 60 * 1000);
    
    const isFresh = expiry > now;
    console.log(`🔍 TTL-Check für ${data.gridKey}:`);
    console.log(`   - TTL: ${ttlDays} Tage`);
    console.log(`   - LastAccess: ${lastAccessAt.toISOString()}`);
    console.log(`   - Expiry: ${expiry.toISOString()}`);
    console.log(`   - Jetzt: ${now.toISOString()}`);
    console.log(`   - Frisch: ${isFresh ? 'JA' : 'NEIN'}`);
    
    return isFresh;
  }

  // lastAccessAt aktualisieren
  private async updateLastAccess(gridKey: string): Promise<void> {
    try {
      const record = await this.findInDatabase(gridKey);
      if (record) {
        await pb.collection(SOLAR_COLLECTION).update(record.id, {
          lastAccessAt: new Date().toISOString()
        });
        console.log(`✅ lastAccessAt für ${gridKey} aktualisiert`);
      }
    } catch (error) {
      console.error(`❌ Fehler beim Aktualisieren von lastAccessAt für ${gridKey}:`, error);
    }
  }

  // Externe API aufrufen (PVGIS, NASA POWER, oder Fallback)
  private async fetchExternalData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse> {
    console.log(`🌞 Rufe externe Solar-API auf für lat=${lat}, lng=${lng}, area=${area}, tilt=${tilt}, azimuth=${azimuth}`);
    
    // Versuche zuerst PVGIS
    const pvgisData = await pvgisService.getSolarData(lat, lng, area, tilt, azimuth);
    if (pvgisData) {
      console.log(`✅ PVGIS erfolgreich: ${pvgisData.annual_kWh} kWh`);
      return pvgisData;
    }
    
    // Fallback: NASA POWER
    console.log(`🔄 PVGIS fehlgeschlagen, versuche NASA POWER...`);
    const nasaData = await nasaService.getSolarData(lat, lng, area, tilt, azimuth);
    if (nasaData) {
      console.log(`✅ NASA POWER erfolgreich: ${nasaData.annual_kWh} kWh`);
      return nasaData;
    }
    
    // Letzter Fallback: Lokale Berechnung
    console.log(`⚠️ Alle APIs fehlgeschlagen, verwende Fallback-Daten`);
    return this.generateFallbackData(lat, lng, area, tilt, azimuth);
  }

  // Lokale Fallback-Daten generieren
  private generateFallbackData(lat: number, lng: number, area: number, tilt: number, azimuth: number): PVGISResponse {
    // Vereinfachte lokale Berechnung basierend auf Breitengrad
    const baseEfficiency = 0.15; // 15% Basis-Effizienz
    const latitudeFactor = Math.cos((Math.abs(lat) * Math.PI) / 180); // Breitengrad-Faktor
    const tiltFactor = Math.cos((tilt - 35) * Math.PI / 180); // Neigungs-Faktor (35° optimal)
    
    // Jährliche Strahlung in kWh/m² (vereinfacht)
    const annualRadiation = 1200 * latitudeFactor * tiltFactor; // 1200 kWh/m² Basis
    const annual_kWh = Math.round(annualRadiation * area * baseEfficiency);
    
    console.log(`✅ Fallback-Daten generiert: ${annual_kWh} kWh pro Jahr`);
    
    return {
      annual_kWh: annual_kWh,
      co2_saved: Math.round(annual_kWh * 0.5),
      efficiency: Math.round(baseEfficiency * 100),
      timestamp: new Date().toISOString(),
      source: 'fallback',
      metadata: {
        calculation_date: new Date().toISOString(),
        assumptions: {
          losses_percent: 25,
          m2_per_kwp: 6.5,
          co2_factor: 0.5
        }
      }
    };
  }

  // Neue Daten in der Datenbank speichern
  private async saveToDatabase(gridKey: string, lat: number, lng: number, payload: PVGISResponse): Promise<void> {
    try {
      const roundedCoords = this.roundCoordinates(lat, lng);
      
      const recordData = {
        gridKey,
        latRounded: roundedCoords.latRounded,
        lngRounded: roundedCoords.lngRounded,
        payload,
        source: payload.source,
        fetchedAt: new Date().toISOString(),
        lastAccessAt: new Date().toISOString(),
        ttlDays: 90
      };
      
      console.log('💾 Versuche Datensatz zu speichern:', JSON.stringify(recordData, null, 2));
      
      await pb.collection(SOLAR_COLLECTION).create(recordData);
      
      console.log(`✅ Neue Daten für ${gridKey} in DB gespeichert (${payload.source})`);
    } catch (error: any) {
      console.error(`❌ Fehler beim Speichern in DB für ${gridKey}:`, error);
      console.error('❌ Fehler-Details:', error.response?.data);
      
      // Versuche es mit einem vereinfachten Datensatz
      try {
        console.log('🔄 Versuche es mit vereinfachtem Datensatz...');
        const roundedCoords = this.roundCoordinates(lat, lng);
        const today = new Date().toISOString().split('T')[0];
        
        const simpleRecord = {
          gridKey,
          latRounded: roundedCoords.latRounded,
          lngRounded: roundedCoords.lngRounded,
          payload: JSON.stringify(payload), // Als String statt JSON
          source: payload.source,
          fetchedAt: today,
          lastAccessAt: today,
          ttlDays: 90
        };
        
        await pb.collection(SOLAR_COLLECTION).create(simpleRecord);
        console.log(`✅ Vereinfachter Datensatz für ${gridKey} gespeichert`);
      } catch (simpleError: any) {
        console.error(`❌ Auch vereinfachter Datensatz fehlgeschlagen:`, simpleError.response?.data);
      }
    }
  }

  // Hilfsfunktion zum Runden der Koordinaten
  private roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {
    return {
      latRounded: Math.round(lat * 100) / 100,
      lngRounded: Math.round(lng * 100) / 100
    };
  }
}

// Singleton-Instanz exportieren
export const solarCacheService = SolarCacheService.getInstance();
