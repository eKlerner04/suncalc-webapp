import { pb, SOLAR_COLLECTION, generateGridKey, SolarCell } from '../utils/pb';
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
    console.log(` Cache-Check für ${gridKey} (lat=${lat}, lng=${lng})`);

    await popularityTrackerService.updatePopularityScore(gridKey, lat, lng);

    const cachedData = await this.findInDatabase(gridKey);
    if (cachedData && this.isDataFresh(cachedData)) {
      console.log(` Frische Daten aus Cache (${gridKey})`);
      await this.updateLastAccess(gridKey);
      return { data: cachedData.payload, source: 'local' };
    }

    console.log(` Keine frischen Daten im Cache (${gridKey}), rufe externe API auf`);
    const externalData = await this.fetchExternalData(lat, lng, area, tilt, azimuth);
    
    await this.saveToDatabase(gridKey, lat, lng, externalData);
    
    return { data: externalData, source: externalData.source };
  }

  private async findInDatabase(gridKey: string): Promise<SolarCellRecord | null> {
    try {
      console.log(` Suche in DB nach gridKey: "${gridKey}"`);
      
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=gridKey%3D%22${gridKey}%22`);
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
          console.log(`Datensatz ${record.gridKey} hat keinen gültigen payload, behandle als Cache-Miss`);
          return null; 
        }
        
        console.log(` Gefundener Datensatz:`, {
          id: record.id,
          gridKey: record.gridKey,
          source: record.source,
          lastAccessAt: record.lastAccessAt,
          ttlDays: record.ttlDays,
          hasPayload: !!record.payload
        });
        return record;
      } else {
        console.log(` Kein Datensatz mit gridKey "${gridKey}" gefunden`);
        return null;
      }
    } catch (error) {
      console.error(` Fehler beim Suchen in DB für ${gridKey}:`, error);
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

  private async updateLastAccess(gridKey: string): Promise<void> {
    try {
      const record = await this.findInDatabase(gridKey);
      if (record) {
        await pb.collection(SOLAR_COLLECTION).update(record.id, {
          lastAccessAt: new Date().toISOString()
        });
        console.log(` lastAccessAt für ${gridKey} aktualisiert`);
      }
    } catch (error) {
      console.error(` Fehler beim Aktualisieren von lastAccessAt für ${gridKey}:`, error);
    }
  }

  private async fetchExternalData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse> {
    console.log(` Rufe externe Solar-API auf für lat=${lat}, lng=${lng}, area=${area}, tilt=${tilt}, azimuth=${azimuth}`);
    
    const pvgisData = await pvgisService.getSolarData(lat, lng, area, tilt, azimuth);
    if (pvgisData) {
      console.log(` PVGIS erfolgreich: ${pvgisData.annual_kWh} kWh`);
      return pvgisData;
    }
    
    console.log(` PVGIS fehlgeschlagen, versuche NASA POWER...`);
    const nasaData = await nasaService.getSolarData(lat, lng, area, tilt, azimuth);
    if (nasaData) {
      console.log(` NASA POWER erfolgreich: ${nasaData.annual_kWh} kWh`);
      return nasaData;
    }
    
    console.log(` Alle APIs fehlgeschlagen, verwende Fallback-Daten`);
    return this.generateFallbackData(lat, lng, area, tilt, azimuth);
  }

  private generateFallbackData(lat: number, lng: number, area: number, tilt: number, azimuth: number): PVGISResponse {
    const baseEfficiency = 0.15; 
    const latitudeFactor = Math.cos((Math.abs(lat) * Math.PI) / 180); 
    const tiltFactor = Math.cos((tilt - 35) * Math.PI / 180); 
    
    const annualRadiation = 1200 * latitudeFactor * tiltFactor; 
    const annual_kWh = Math.round(annualRadiation * area * baseEfficiency);
    
    console.log(` Fallback-Daten generiert: ${annual_kWh} kWh pro Jahr`);
    
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

  private async saveToDatabase(gridKey: string, lat: number, lng: number, payload: PVGISResponse): Promise<void> {
    try {
      const roundedCoords = this.roundCoordinates(lat, lng);
      
      const { score, isHot, locationWeight, recencyBonus } = await this.calculateInitialPopularityScore(lat, lng);
      
      const recordData = {
        gridKey,
        latRounded: roundedCoords.latRounded,
        lngRounded: roundedCoords.lngRounded,
        payload,
        source: payload.source,
        fetchedAt: new Date().toISOString(),
        lastAccessAt: new Date().toISOString(),
        ttlDays: 90,
       
        accessCount: 1,
        popularityScore: score,
        isHot,
        locationWeight,
        recencyBonus,
        // Neue Felder für bessere Performance
        radiation_data: payload.radiation || null,
        extended_metadata: {
          panel_efficiency: payload.metadata?.assumptions?.panel_efficiency,
          inverter_efficiency: payload.metadata?.assumptions?.inverter_efficiency,
          temperature_losses: payload.metadata?.assumptions?.temperature_losses,
          soiling_losses: payload.metadata?.assumptions?.soiling_losses,
          shading_losses: payload.metadata?.assumptions?.shading_losses,
          wiring_losses: payload.metadata?.assumptions?.wiring_losses,
          monthly_radiation: payload.metadata?.monthly_radiation
        },
        calculation_quality: this.determineCalculationQuality(payload),
        last_validation: new Date().toISOString()
      };
      
      console.log(' Versuche Datensatz zu speichern:', JSON.stringify(recordData, null, 2));
      
      await pb.collection(SOLAR_COLLECTION).create(recordData);
      
      console.log(` Neue Daten für ${gridKey} in DB gespeichert (${payload.source})`);
      console.log(` Popularitäts-Initialisierung: Score ${score}, isHot: ${isHot}`);
    } catch (error: any) {
      console.error(` Fehler beim Speichern in DB für ${gridKey}:`, error);
      console.error(' Fehler-Details:', error.response?.data);
      
      try {
        console.log('Versuche es mit vereinfachtem Datensatz...');
        const roundedCoords = this.roundCoordinates(lat, lng);
        const today = new Date().toISOString().split('T')[0];
        
        const simpleRecord = {
          gridKey,
          latRounded: roundedCoords.latRounded,
          lngRounded: roundedCoords.lngRounded,
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
        console.log(` Vereinfachter Datensatz für ${gridKey} gespeichert`);
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

  private determineCalculationQuality(payload: PVGISResponse): string {
    // Bestimme die Qualität basierend auf der Datenquelle und Verfügbarkeit der Strahlungswerte
    if (payload.source === 'pvgis' && payload.radiation?.dni && payload.radiation?.ghi && payload.radiation?.dif) {
      return 'high'; // PVGIS mit vollständigen Strahlungsdaten
    } else if (payload.source === 'nasa_power' && payload.radiation?.dni && payload.radiation?.ghi && payload.radiation?.dif) {
      return 'medium'; // NASA POWER mit vollständigen Strahlungsdaten
    } else if (payload.source === 'pvgis' || payload.source === 'nasa_power') {
      return 'medium'; // API-Daten aber ohne vollständige Strahlungswerte
    } else {
      return 'estimated'; // Fallback-Daten
    }
  }
}

export const solarCacheService = SolarCacheService.getInstance();
