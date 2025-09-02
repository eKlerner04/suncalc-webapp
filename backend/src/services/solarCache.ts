import { pb, SOLAR_COLLECTION, generateGridKey, SolarCell } from '../utils/pb';
import { generateSolarKey } from '../utils/grid';
import { pvgisService } from './pvgisService';
import { nasaService } from './nasaService';
import { PVGISResponse } from '../types/solar';
import { RecordModel } from 'pocketbase';
import { popularityTrackerService } from './popularity/popularityTracker';

interface SolarCellRecord extends SolarCell, RecordModel {}

class SolarCacheService {
  private static instance: SolarCacheService;

  private constructor() {}

  public static getInstance(): SolarCacheService {
    if (!SolarCacheService.instance) {
      SolarCacheService.instance = new SolarCacheService();
    }
    return SolarCacheService.instance;
  }

  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<{ data: PVGISResponse, source: string }> {
    const gridKey = generateGridKey(lat, lng);
    const solarKey = generateSolarKey(lat, lng, area, tilt, azimuth);
    console.log(` Cache-Check für ${solarKey} (lat=${lat}, lng=${lng}, area=${area}, tilt=${tilt}, azimuth=${azimuth})`);

    await popularityTrackerService.updatePopularityScore(gridKey, lat, lng);

    const cachedData = await this.findInDatabase(solarKey);
    if (cachedData && this.isDataFresh(cachedData)) {
      console.log(` Frische Daten aus Cache (${solarKey})`);
      await this.updateLastAccess(solarKey);
      return { data: cachedData.payload, source: 'local' };
    }

    console.log(` Keine frischen Daten im Cache (${solarKey}), rufe externe API auf`);
    const externalData = await this.fetchExternalData(lat, lng, area, tilt, azimuth);
    
    await this.saveToDatabase(solarKey, lat, lng, area, tilt, azimuth, externalData);
    
    return { data: externalData, source: externalData.source };
  }

  private async findInDatabase(solarKey: string): Promise<SolarCellRecord | null> {
    try {
      console.log(` Suche in DB nach solarKey: "${solarKey}"`);
      
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=solarKey%3D%22${solarKey}%22`);
      const data = await response.json();
      
      console.log(` HTTP-API Suche Ergebnis: ${data.totalItems} Datensätze gefunden`);
      
      if (data.items && data.items.length > 0) {
        const oldestRecord = data.items.reduce((oldest: any, current: any) => {
          const oldestDate = new Date(oldest.lastAccessAt);
          const currentDate = new Date(current.lastAccessAt);
          return oldestDate < currentDate ? oldest : current;
        });
        
        const record = oldestRecord as SolarCellRecord;
        
        if (!record.payload || record.payload === '' || record.payload === null) {
          console.log(`Datensatz ${record.solarKey} hat keinen gültigen payload, behandle als Cache-Miss`);
          return null; 
        }
        
        console.log(` Gefundener Datensatz:`, {
          id: record.id,
          solarKey: record.solarKey,
          source: record.source,
          lastAccessAt: record.lastAccessAt,
          ttlDays: record.ttlDays,
          hasPayload: !!record.payload
        });
        return record;
      } else {
        console.log(` Kein Datensatz mit solarKey "${solarKey}" gefunden`);
        return null;
      }
    } catch (error) {
      console.error(` Fehler beim Suchen in DB für ${solarKey}:`, error);
      return null;
    }
  }

  private isDataFresh(data: SolarCellRecord): boolean {
    if (!data.payload || data.payload === '' || data.payload === null) {
      console.log(` TTL-Check übersprungen: ${data.gridKey} hat keinen gültigen payload`);
      return false; 
    }
    
    const ttlDays = data.ttlDays || 90;
    const lastAccessAt = new Date(data.lastAccessAt);
    const now = new Date();
    const expiry = new Date(lastAccessAt.getTime() + ttlDays * 24 * 60 * 60 * 1000);
    
    const isFresh = expiry > now;
    console.log(`   TTL-Check für ${data.gridKey}:`);
    console.log(`   - TTL: ${ttlDays} Tage`);
    console.log(`   - LastAccess: ${lastAccessAt.toISOString()}`);
    console.log(`   - Expiry: ${expiry.toISOString()}`);
    console.log(`   - Jetzt: ${now.toISOString()}`);
    console.log(`   - Frisch: ${isFresh ? 'JA' : 'NEIN'}`);
    
    return isFresh;
  }

  private async updateLastAccess(solarKey: string): Promise<void> {
    try {
      const record = await this.findInDatabase(solarKey);
      if (record) {
        const newAccessCount = (record.accessCount || 0) + 1;
        await pb.collection(SOLAR_COLLECTION).update(record.id, {
          lastAccessAt: new Date().toISOString(),
          accessCount: newAccessCount
        });
        console.log(` lastAccessAt und accessCount für ${solarKey} aktualisiert (${newAccessCount})`);
      }
    } catch (error) {
      console.error(` Fehler beim Aktualisieren von lastAccessAt und accessCount für ${solarKey}:`, error);
    }
  }

  private async fetchExternalData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse> {
    console.log(` Rufe externe Solar-API auf für lat=${lat}, lng=${lng}, area=${area}, tilt=${tilt}, azimuth=${azimuth}`);
    
    // Prüfe ob bereits Daten für diesen Standort existieren (um API-Konsistenz zu gewährleisten)
    const existingData = await this.findExistingDataForLocation(lat, lng);
    if (existingData) {
      console.log(` Bestehende API-Quelle für Standort gefunden: ${existingData.source}`);
      
      // Verwende die gleiche API wie bei bestehenden Daten - KEIN FALLBACK!
      if (existingData.source === 'pvgis') {
        console.log(` Verwende PVGIS (konsistent mit bestehenden Daten)...`);
        const pvgisData = await pvgisService.getSolarData(lat, lng, area, tilt, azimuth);
        if (pvgisData) {
          console.log(` PVGIS erfolgreich: ${pvgisData.annual_kWh} kWh`);
          return pvgisData;
        }
        console.log(` PVGIS fehlgeschlagen, verwende Fallback-Daten (kein API-Wechsel!)`);
        return this.generateFallbackData(lat, lng, area, tilt, azimuth, 'pvgis');
      } else if (existingData.source === 'nasa_power') {
        console.log(` Verwende NASA POWER (konsistent mit bestehenden Daten)...`);
        const nasaData = await nasaService.getSolarData(lat, lng, area, tilt, azimuth);
        if (nasaData) {
          console.log(` NASA POWER erfolgreich: ${nasaData.annual_kWh} kWh`);
          return nasaData;
        }
        console.log(` NASA POWER fehlgeschlagen, verwende Fallback-Daten (kein API-Wechsel!)`);
        return this.generateFallbackData(lat, lng, area, tilt, azimuth, 'nasa_power');
      }
    }
    
    // Keine bestehenden Daten - verwende Standard-Logik
    const isInPVGISRegion = this.isInPVGISRegion(lat, lng);
    console.log(` Standort in PVGIS-Region: ${isInPVGISRegion} (lat=${lat}, lng=${lng})`);
    
    if (isInPVGISRegion) {
      console.log(` Versuche PVGIS für Europa/Afrika...`);
      const pvgisData = await pvgisService.getSolarData(lat, lng, area, tilt, azimuth);
      if (pvgisData) {
        console.log(` PVGIS erfolgreich: ${pvgisData.annual_kWh} kWh`);
        return pvgisData;
      }
      console.log(` PVGIS fehlgeschlagen, versuche NASA POWER als Fallback...`);
    } else {
      console.log(` Standort außerhalb Europa/Afrika, verwende direkt NASA POWER...`);
    }
    
    const nasaData = await nasaService.getSolarData(lat, lng, area, tilt, azimuth);
    if (nasaData) {
      console.log(` NASA POWER erfolgreich: ${nasaData.annual_kWh} kWh`);
      return nasaData;
    }
    
    console.log(` Alle APIs fehlgeschlagen, verwende Fallback-Daten`);
    return this.generateFallbackData(lat, lng, area, tilt, azimuth);
  }

  private generateFallbackData(lat: number, lng: number, area: number, tilt: number, azimuth: number, preferredSource?: string): PVGISResponse {
    const baseEfficiency = 0.15; 
    const latitudeFactor = Math.cos((Math.abs(lat) * Math.PI) / 180); 
    const tiltFactor = Math.cos((tilt - 35) * Math.PI / 180); 
    
    const annualRadiation = 1200 * latitudeFactor * tiltFactor; 
    const annual_kWh = Math.round(annualRadiation * area * baseEfficiency);
    
    // Verwende die bevorzugte API-Quelle für Fallback-Daten
    const source = (preferredSource as 'pvgis' | 'nasa_power' | 'fallback') || 'fallback';
    
    console.log(` Fallback-Daten generiert: ${annual_kWh} kWh pro Jahr (Quelle: ${source})`);
    
    return {
      annual_kWh: annual_kWh,
      co2_saved: Math.round(annual_kWh * 0.5),
      efficiency: Math.round(baseEfficiency * 100),
      timestamp: new Date().toISOString(),
      source: source,
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

  private async saveToDatabase(solarKey: string, lat: number, lng: number, area: number, tilt: number, azimuth: number, payload: PVGISResponse): Promise<void> {
    try {
      const roundedCoords = this.roundCoordinates(lat, lng);
      
      const { score, isHot, locationWeight, recencyBonus } = await this.calculateInitialPopularityScore(lat, lng);
      
      const recordData = {
        gridKey: generateGridKey(lat, lng),
        solarKey: solarKey,
        latRounded: roundedCoords.latRounded,
        lngRounded: roundedCoords.lngRounded,
        area: area,
        tilt: tilt,
        azimuth: azimuth,
        payload,
        source: payload.source,
        fetchedAt: new Date().toISOString(),
        lastAccessAt: new Date().toISOString(),
        ttlDays: 90,
       
        accessCount: 1,
        popularityScore: score,
        isHot,
        locationWeight,
        recencyBonus
      };
      
      console.log(' Versuche Datensatz zu speichern:', JSON.stringify(recordData, null, 2));
      
      await pb.collection(SOLAR_COLLECTION).create(recordData);
      
      console.log(` Neue Daten für ${solarKey} in DB gespeichert (${payload.source})`);
      console.log(` Popularitäts-Initialisierung: Score ${score}, isHot: ${isHot}`);
    } catch (error: any) {
      console.error(` Fehler beim Speichern in DB für ${solarKey}:`, error);
      console.error(' Fehler-Details:', error.response?.data);
      
      try {
        console.log('Versuche es mit vereinfachtem Datensatz...');
        const roundedCoords = this.roundCoordinates(lat, lng);
        const today = new Date().toISOString().split('T')[0];
        
        const simpleRecord = {
          gridKey: solarKey,
          solarKey: solarKey,
          latRounded: roundedCoords.latRounded,
          lngRounded: roundedCoords.lngRounded,
          area: area,
          tilt: tilt,
          azimuth: azimuth,
          payload: JSON.stringify(payload), 
          source: payload.source,
          fetchedAt: today,
          lastAccessAt: today,
          ttlDays: 90,
          accessCount: 1,
          popularityScore: 0,
          isHot: false,
          locationWeight: 1.0,
          recencyBonus: 1.0
        };
        
        await pb.collection(SOLAR_COLLECTION).create(simpleRecord);
        console.log(` Vereinfachter Datensatz für ${solarKey} gespeichert`);
      } catch (simpleError: any) {
        console.error(` Auch vereinfachter Datensatz fehlgeschlagen:`, simpleError.response?.data);
      }
    }
  }

  private roundCoordinates(lat: number, lng: number): { latRounded: number, lngRounded: number } {
    return {
      latRounded: Math.round(lat * 100) / 100,
      lngRounded: Math.round(lng * 100) / 100
    };
  }

  private async calculateInitialPopularityScore(lat: number, lng: number): Promise<{
    score: number;
    isHot: boolean;
    locationWeight: number;
    recencyBonus: number;
  }> {
    const locationWeight = this.calculateLocationWeight(lat);
    const recencyBonus = 2.0;
    const accessCount = 1; 
    
    const score = Math.round(
      (accessCount * 2.0) + 
      (recencyBonus * 1.5) + 
      (locationWeight * 1.2) 
    );
    
    const isHot = score >= 100;
    
    return { score, isHot, locationWeight, recencyBonus };
  }

  private calculateLocationWeight(lat: number): number {
 
    const absLat = Math.abs(lat);
    
    if (absLat < 30) return 1.5;     
    if (absLat < 45) return 1.3;      
    if (absLat < 60) return 1.1;      
    return 1.0;                       
  }

  private async findExistingDataForLocation(lat: number, lng: number): Promise<{ source: string } | null> {
    try {
      const roundedCoords = this.roundCoordinates(lat, lng);
      const gridKey = generateGridKey(lat, lng);
      
      console.log(` Suche nach bestehenden Daten für Standort: ${gridKey}`);
      
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=latRounded%3D${roundedCoords.latRounded}%20%26%26%20lngRounded%3D${roundedCoords.lngRounded}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Finde den neuesten Datensatz für diesen Standort
        const newestRecord = data.items.reduce((newest: any, current: any) => {
          const newestDate = new Date(newest.fetchedAt);
          const currentDate = new Date(current.fetchedAt);
          return newestDate > currentDate ? newest : current;
        });
        
        console.log(` Bestehende API-Quelle gefunden: ${newestRecord.source} (${newestRecord.fetchedAt})`);
        return { source: newestRecord.source };
      }
      
      console.log(` Keine bestehenden Daten für Standort ${gridKey} gefunden`);
      return null;
    } catch (error) {
      console.error(` Fehler beim Suchen nach bestehenden Daten für Standort:`, error);
      return null;
    }
  }

  private isInPVGISRegion(lat: number, lng: number): boolean {
    // PVGIS deckt Europa und Afrika ab
    // Europa: 35°N bis 71°N, -25°W bis 45°E
    // Afrika: 35°S bis 37°N, -18°W bis 55°E
    
    const isInEurope = lat >= 35 && lat <= 71 && lng >= -25 && lng <= 45;
    const isInAfrica = lat >= -35 && lat <= 37 && lng >= -18 && lng <= 55;
    
    return isInEurope || isInAfrica;
  }
}

export const solarCacheService = SolarCacheService.getInstance();
