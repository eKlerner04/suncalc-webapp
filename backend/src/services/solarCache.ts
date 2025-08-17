import { pb, SOLAR_COLLECTION, generateGridKey, SolarCell } from '../utils/pb';

// Cache-Service für Solar-Daten mit PocketBase
export class SolarCacheService {
  private static instance: SolarCacheService;
  
  private constructor() {}
  
  public static getInstance(): SolarCacheService {
    if (!SolarCacheService.instance) {
      SolarCacheService.instance = new SolarCacheService();
    }
    return SolarCacheService.instance;
  }

  // Hauptfunktion: Solar-Daten abrufen (mit Caching)
  async getSolarData(lat: number, lng: number): Promise<{ data: any; source: string }> {
    const gridKey = generateGridKey(lat, lng);
    console.log(`🔍 Cache-Check für ${gridKey} (lat=${lat}, lng=${lng})`);
    
    try {
      // Fall A & B: Suche in der Datenbank
      const existingRecord = await this.findInDatabase(gridKey);
      
      if (existingRecord) {
        // Aktualisiere lastAccessAt
        await this.updateLastAccess(existingRecord.id);
        
        if (this.isDataFresh(existingRecord)) {
          // Fall A: Daten sind frisch
          console.log(`✅ Fall A: Frische Daten aus Cache (${gridKey})`);
          return { 
            data: existingRecord.payload, 
            source: 'local' 
          };
        } else {
          // Fall B: Daten sind veraltet, aber liefern sie sofort zurück
          console.log(`⚠️ Fall B: Veraltete Daten aus Cache (${gridKey}), starte Background-Refresh`);
          this.refreshDataInBackground(lat, lng, gridKey); // Hintergrund-Update
          return { 
            data: existingRecord.payload, 
            source: 'local_stale' 
          };
        }
      }
      
      // Fall C: Kein Treffer in der Datenbank
      console.log(`🔄 Fall C: Keine Daten im Cache (${gridKey}), rufe externe API auf`);
      const freshData = await this.fetchExternalData(lat, lng);
      await this.saveToDatabase(gridKey, lat, lng, freshData);
      
      return { 
        data: freshData, 
        source: 'external' 
      };
      
    } catch (error: any) {
      console.error(`❌ Fehler im Cache-Service für ${gridKey}:`, error);
      // Fallback: Direkter API-Aufruf ohne Caching
      const fallbackData = await this.fetchExternalData(lat, lng);
      return { 
        data: fallbackData, 
        source: 'fallback' 
      };
    }
  }

  // Suche nach existierenden Daten in der Datenbank
  private async findInDatabase(gridKey: string): Promise<SolarCell | null> {
    try {
      const records = await pb.collection(SOLAR_COLLECTION).getList(1, 1, {
        filter: `gridKey = "${gridKey}"`
      });
      
      return records.items.length > 0 ? records.items[0] as SolarCell : null;
    } catch (error: any) {
      console.log(`📝 Keine Daten in DB für ${gridKey}:`, error.message);
      return null;
    }
  }

  // Prüfe ob Daten noch frisch sind (TTL nicht überschritten)
  private isDataFresh(record: SolarCell): boolean {
    const fetchedAt = new Date(record.fetchedAt);
    const now = new Date();
    const ageInDays = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    return ageInDays < record.ttlDays;
  }

  // Aktualisiere lastAccessAt für einen Datensatz
  private async updateLastAccess(recordId: string): Promise<void> {
    try {
      await pb.collection(SOLAR_COLLECTION).update(recordId, {
        lastAccessAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren von lastAccessAt:', error);
    }
  }

  // Hintergrund-Update für veraltete Daten
  private async refreshDataInBackground(lat: number, lng: number, gridKey: string): Promise<void> {
    // Asynchron im Hintergrund ausführen
    setImmediate(async () => {
      try {
        console.log(`🔄 Background-Refresh für ${gridKey} gestartet`);
        const freshData = await this.fetchExternalData(lat, lng);
        await this.updateDatabaseRecord(gridKey, freshData);
        console.log(`✅ Background-Refresh für ${gridKey} abgeschlossen`);
      } catch (error: any) {
        console.error(`❌ Background-Refresh für ${gridKey} fehlgeschlagen:`, error);
      }
    });
  }

  // Externe API aufrufen (hier PVGIS oder andere Solar-APIs)
  private async fetchExternalData(lat: number, lng: number): Promise<any> {
    // TODO: Hier echte PVGIS-API oder andere Solar-API einbinden
    // Für jetzt: Mock-Daten
    console.log(`🌞 Rufe externe Solar-API auf für lat=${lat}, lng=${lng}`);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      annual_kWh: Math.round(Math.random() * 500 + 800), // 800-1300 kWh
      co2_saved: Math.round(Math.random() * 200 + 400), // 400-600 kg
      efficiency: Math.round(Math.random() * 20 + 80), // 80-100%
      timestamp: new Date().toISOString()
    };
  }

  // Neue Daten in der Datenbank speichern
  private async saveToDatabase(gridKey: string, lat: number, lng: number, payload: any): Promise<void> {
    try {
      const roundedCoords = this.roundCoordinates(lat, lng);
      
      // Datum als einfachen String formatieren (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      const recordData = {
        gridKey,
        latRounded: roundedCoords.latRounded,
        lngRounded: roundedCoords.lngRounded,
        payload,
        source: 'external',
        fetchedAt: today,
        lastAccessAt: today,
        ttlDays: 90
      };
      
      console.log('💾 Versuche Datensatz zu speichern:', JSON.stringify(recordData, null, 2));
      
      await pb.collection(SOLAR_COLLECTION).create(recordData);
      
      console.log(`✅ Neue Daten für ${gridKey} in DB gespeichert`);
    } catch (error: any) {
      console.error(`❌ Fehler beim Speichern in DB für ${gridKey}:`, error);
      console.error('❌ Fehler-Details:', error.response?.data);
      
      // Versuche es mit einem einfacheren Datensatz
      try {
        console.log('🔄 Versuche es mit vereinfachtem Datensatz...');
        const roundedCoords = this.roundCoordinates(lat, lng);
        const today = new Date().toISOString().split('T')[0];
        
        const simpleRecord = {
          gridKey,
          latRounded: roundedCoords.latRounded,
          lngRounded: roundedCoords.lngRounded,
          payload: JSON.stringify(payload), // Als String statt JSON
          source: 'external',
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

  // Existierenden Datensatz aktualisieren
  private async updateDatabaseRecord(gridKey: string, payload: any): Promise<void> {
    try {
      const record = await this.findInDatabase(gridKey);
      if (record) {
        await pb.collection(SOLAR_COLLECTION).update(record.id, {
          payload,
          source: 'external',
          fetchedAt: new Date().toISOString(),
          ttlDays: 90
        });
        console.log(`🔄 Datensatz für ${gridKey} aktualisiert`);
      }
    } catch (error: any) {
      console.error(`❌ Fehler beim Aktualisieren des Datensatzes für ${gridKey}:`, error);
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
