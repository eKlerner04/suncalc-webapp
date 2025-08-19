import { pb, SOLAR_COLLECTION } from '../../utils/pb';
import { hotLocationsService } from './hotLocationsService';
import { pvgisService } from '../pvgisService';
import { nasaService } from '../nasaService';
import { HotLocation, PreFetchResult } from '../../types/popularity';


export class PreFetchService {
  private static instance: PreFetchService;
  private isRunning: boolean = false;
  private preFetchInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): PreFetchService {
    if (!PreFetchService.instance) {
      PreFetchService.instance = new PreFetchService();
    }
    return PreFetchService.instance;
  }

  
  async startPreFetchService(): Promise<void> {
    if (this.isRunning) {
      console.log('[PRE-FETCH] Service läuft bereits');
      return;
    }

    console.log('[PRE-FETCH] Starte Pre-Fetch-Service...');
    this.isRunning = true;

    await this.runPreFetch();

    this.preFetchInterval = setInterval(async () => {
      await this.runPreFetch();
    }, 6 * 60 * 60 * 1000); 

    console.log(`[PRE-FETCH] Service gestartet - läuft alle 6 Stunden`);
  }


  stopPreFetchService(): void {
    if (!this.isRunning) return;

    console.log('[STOP] Stoppe Pre-Fetch Service...');
    
    if (this.preFetchInterval) {
      clearInterval(this.preFetchInterval);
      this.preFetchInterval = null;
    }

    this.isRunning = false;
    console.log('[STATUS] Pre-Fetch Service gestoppt');
  }

  
  async runPreFetch(): Promise<void> {
    if (!this.isRunning) return;
    
    try {
      const hotLocations = await hotLocationsService.getHotLocations();
      
      if (!hotLocations || hotLocations.length === 0) {
        return;
      }

      console.log(`[INFO] ${hotLocations.length} "heiße" Standorte für Pre-Fetch gefunden`);

      const results: PreFetchResult[] = [];
      
      for (const location of hotLocations) {
        if (!this.isRunning) break;
        
        try {
          console.log(`Pre-Fetch für ${location.gridKey} (Score: ${location.popularityScore})...`);
          
          const result = await this.preFetchLocation(location);
          results.push(result);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Fehler beim Pre-Fetch für ${location.gridKey}:`, error);
          results.push({
            gridKey: location.gridKey,
            success: false,
            source: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
          });
        }
      }

      this.showPreFetchSummary(results);
      
    } catch (error) {
      console.error('❌ Fehler beim Pre-Fetch-Durchlauf:', error);
    }
  }

 
  private async preFetchLocation(location: HotLocation): Promise<PreFetchResult> {
    try {
      const startTime = Date.now();
      
      console.log(`     Versuche PVGIS für ${location.gridKey}...`);
      const pvgisData = await pvgisService.getSolarData(
        location.latRounded, 
        location.lngRounded, 
        15, 
        30, 
        180 
      );

      if (pvgisData) {
        await this.updateCacheWithNewData(location.gridKey, pvgisData);
        
        const duration = Date.now() - startTime;
        console.log(`     PVGIS erfolgreich für ${location.gridKey} (${duration}ms)`);
        
        return {
          gridKey: location.gridKey,
          success: true,
          source: 'pvgis',
          timestamp: new Date().toISOString()
        };
      }

      console.log(`     PVGIS fehlgeschlagen, versuche NASA POWER für ${location.gridKey}...`);
      const nasaData = await nasaService.getSolarData(
        location.latRounded, 
        location.lngRounded, 
        15, 
        30, 
        180
      );

      if (nasaData) {
        await this.updateCacheWithNewData(location.gridKey, nasaData);
        
        const duration = Date.now() - startTime;
        console.log(`     NASA POWER erfolgreich für ${location.gridKey} (${duration}ms)`);
        
        return {
          gridKey: location.gridKey,
          success: true,
          source: 'nasa',
          timestamp: new Date().toISOString()
        };
      }

      console.log(`     Alle APIs fehlgeschlagen, verwende Fallback für ${location.gridKey}...`);
      const fallbackData = this.generateFallbackData(location);
      await this.updateCacheWithNewData(location.gridKey, fallbackData);
      
      const duration = Date.now() - startTime;
      console.log(`     Fallback erfolgreich für ${location.gridKey} (${duration}ms)`);
      
      return {
        gridKey: location.gridKey,
        success: true,
        source: 'fallback',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`     Pre-Fetch fehlgeschlagen für ${location.gridKey}:`, error);
      
      return {
        gridKey: location.gridKey,
        success: false,
        source: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      };
    }
  }

  private async updateCacheWithNewData(gridKey: string, newData: any): Promise<void> {
    try {
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=gridKey%3D%22${gridKey}%22`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log(`     Kein Datensatz für ${gridKey} gefunden`);
        return;
      }

      const record = data.items[0];
      const now = new Date().toISOString();
      
      await pb.collection(SOLAR_COLLECTION).update(record.id, {
        payload: newData,
        source: newData.source || 'prefetch',
        fetchedAt: now,
        lastAccessAt: now,
      });

      console.log(`     Cache für ${gridKey} mit neuen Daten aktualisiert`);
      
    } catch (error) {
      console.error(`     Fehler beim Aktualisieren des Caches für ${gridKey}:`, error);
    }
  }

 
  private generateFallbackData(location: HotLocation): any {
    const baseEfficiency = 0.15; 
    const latitudeFactor = Math.cos((Math.abs(location.latRounded) * Math.PI) / 180);
    const area = 15; 
    
    const annualRadiation = 1200 * latitudeFactor; 
    const annual_kWh = Math.round(annualRadiation * area * baseEfficiency);
    
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

 
  private showPreFetchSummary(results: PreFetchResult[]): void {
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(' Pre-Fetch Zusammenfassung:');
    console.log(`    Erfolgreich: ${successful}`);
    console.log(`    Fehlgeschlagen: ${failed}`);
    console.log(`    Gesamt: ${results.length}`);
    
    if (successful > 0) {
      const pvgisCount = results.filter(r => r.success && r.source === 'pvgis').length;
      const nasaCount = results.filter(r => r.success && r.source === 'nasa').length;
      const fallbackCount = results.filter(r => r.success && r.source === 'fallback').length;
      
      console.log(`    PVGIS: ${pvgisCount}`);
      console.log(`    NASA: ${nasaCount}`);
      console.log(`    Fallback: ${fallbackCount}`);
    }
    
    if (failed > 0) {
      console.log('    Fehlgeschlagene Standorte:');
      results.filter(r => !r.success).forEach(result => {
        console.log(`      - ${result.gridKey}: ${result.error}`);
      });
    }
  }

  /**
   * Führt manuell einen Pre-Fetch für einen spezifischen Standort durch
   */
  async manualPreFetch(gridKey: string): Promise<PreFetchResult | null> {
    try {
      console.log(` Manueller Pre-Fetch für ${gridKey}...`);
      
      // Finde den Standort
      const hotLocations = await hotLocationsService.getHotLocations();
      const location = hotLocations.find(loc => loc.gridKey === gridKey);
      
      if (!location) {
        console.log(` Standort ${gridKey} nicht als "heiß" markiert`);
        return null;
      }
      
      // Führe Pre-Fetch durch
      const result = await this.preFetchLocation(location);
      console.log(` Manueller Pre-Fetch für ${gridKey} abgeschlossen`);
      
      return result;
      
    } catch (error) {
      console.error(` Fehler beim manuellen Pre-Fetch für ${gridKey}:`, error);
      return null;
    }
  }



  getStatus(): { isRunning: boolean; lastRun?: string } {
    return {
      isRunning: this.isRunning,
      lastRun: this.isRunning ? 'Aktiv' : 'Gestoppt'
    };
  }
}

export const preFetchService = PreFetchService.getInstance();
