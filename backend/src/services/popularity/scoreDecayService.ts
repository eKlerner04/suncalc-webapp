import { pb } from '../../utils/pb';
import { PopularityScore, ScoreDecayConfig } from '../../types/popularity';
import { SOLAR_COLLECTION } from '../../utils/pb';

export class ScoreDecayService {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private config: ScoreDecayConfig;

  constructor() {
    this.config = {
      decayIntervalHours: 24, 
      halfLifeDays: 30, 
      minScore: 10, 
      decayPerDay: 0.02, 
      scoreCalculationDays: 30, 
      batchSize: 100 
    };
  }

  /**
   * Startet den Score-Degradation-Service
   */
  async startScoreDecayService(): Promise<void> {
    if (this.isRunning) {
      console.log('[SCORE-DECAY] Service läuft bereits');
      return;
    }

    console.log('[SCORE-DECAY] Starte Score-Degradation-Service...');
    this.isRunning = true;

    // Sofort ersten Durchlauf starten (ohne Log)
    await this.runScoreDecay();

    // Dann alle 24 Stunden wiederholen
    this.intervalId = setInterval(async () => {
      await this.runScoreDecay();
    }, this.config.decayIntervalHours * 60 * 60 * 1000);

    console.log(`[SCORE-DECAY] Service gestartet - läuft alle ${this.config.decayIntervalHours} Stunden`);
  }

  /**
   * Stoppt den Score-Degradation-Service
   */
  stopScoreDecayService(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('[SCORE-DECAY] Stoppe Score-Degradation-Service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('[SCORE-DECAY] Service gestoppt');
  }

  /**
   * Führt einen Score-Degradation-Durchlauf aus
   */
  private async runScoreDecay(): Promise<void> {
    try {
      const startTime = Date.now();

      // Alle Standorte über HTTP-API holen
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?sort=-popularityScore`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log('[SCORE-DECAY] Keine Standorte gefunden');
        return;
      }

      const allRecords = data.items;
      const now = new Date();
      let processedCount = 0;
      let updatedCount = 0;
      let decayedCount = 0;

      console.log(`[SCORE-DECAY] ${allRecords.length} Standorte zur Verarbeitung gefunden`);

      // Batch-weise verarbeiten
      for (let i = 0; i < allRecords.length; i += this.config.batchSize) {
        const batch = allRecords.slice(i, i + this.config.batchSize);
        
        for (const record of batch) {
          try {
            const result = await this.processRecord(record);
            if (result.updated) {
              updatedCount++;
            }
            if (result.decayed) {
              decayedCount++;
            }
            processedCount++;
          } catch (error) {
            console.error(`[SCORE-DECAY] Fehler bei Standort ${record.gridKey}:`, error);
          }
        }

        // Kurze Pause zwischen Batches
        if (i + this.config.batchSize < allRecords.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[SCORE-DECAY] Durchlauf abgeschlossen in ${duration}ms`);
      console.log(`[SCORE-DECAY] Verarbeitet: ${processedCount}, Aktualisiert: ${updatedCount}, Score reduziert: ${decayedCount}`);

    } catch (error) {
      console.error('[SCORE-DECAY] Fehler beim Score-Degradation-Durchlauf:', error);
    }
  }

  /**
   * Holt alle Popularity-Records aus der Datenbank
   */
  private async getAllPopularityRecords(): Promise<any[]> {
    try {
      console.log('[SCORE-DECAY] Versuche Standorte über HTTP-API zu laden...');
      
      // Verwende die GLEICHE Methode wie der Pre-Fetch-Service!
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?sort=-popularityScore`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log('[SCORE-DECAY] Keine Standorte über HTTP-API gefunden');
        return [];
      }
      
      console.log(`[SCORE-DECAY] Debug: ${data.items.length} Standorte über HTTP-API geladen`);
      
      // Debug: Zeige alle Standorte
      data.items.forEach((record: any, index: number) => {
        console.log(`[SCORE-DECAY] Debug Standort ${index}:`, {
          gridKey: record.gridKey,
          popularityScore: record.popularityScore,
          popularityScoreType: typeof record.popularityScore,
          lastAccessAt: record.lastAccessAt,
          lastAccessAtType: typeof record.lastAccessAt,
          hasPopularityScore: !!record.popularityScore,
          hasLastAccessAt: !!record.lastAccessAt
        });
      });
      
      // Filtere im Code nach Standorten mit gültigem Score
      const validRecords = data.items.filter((record: any) => {
        const isValid = record.popularityScore && 
                       record.popularityScore > 0 && 
                       record.lastAccessAt;
        
        if (!isValid) {
          console.log(`[SCORE-DECAY] Debug: Standort ${record.gridKey} wird gefiltert:`, {
            popularityScore: record.popularityScore,
            popularityScoreValid: !!(record.popularityScore && record.popularityScore > 0),
            lastAccessAtValid: !!record.lastAccessAt
          });
        }
        
        return isValid;
      });
      
      console.log(`[SCORE-DECAY] ${data.items.length} Standorte gefunden, ${validRecords.length} mit gültigem Score`);
      
      return validRecords;
    } catch (error) {
      console.error('[SCORE-DECAY] Fehler beim Holen der Popularity-Records:', error);
      return [];
    }
  }

  /**
   * Verarbeitet einen einzelnen Record für Score-Degradation
   */
  private async processRecord(record: any): Promise<{ updated: boolean; decayed: boolean }> {
    const oldScore = record.popularityScore;
    const newScore = this.calculateDecayedScore(record);
    
    // Nur aktualisieren wenn Score sich geändert hat
    if (Math.abs(newScore - oldScore) < 0.1) {
      return { updated: false, decayed: false };
    }

    // Score aktualisieren
    await this.updateRecordScore(record.id, newScore);
    
    // isHot-Status aktualisieren (konsistent mit Popularity-System)
    // Ein Standort ist "heiß" wenn Score >= 50 (wie im Popularity-System)
    const isHot = newScore >= 50;
    await this.updateHotStatus(record.id, isHot);

    const decayed = newScore < oldScore;
    return { updated: true, decayed };
  }

  /**
   * Berechnet den neuen, reduzierten Score basierend auf Inaktivität
   */
  private calculateDecayedScore(record: any): number {
    const lastAccess = new Date(record.lastAccessAt);
    const now = new Date();
    const daysSinceLastAccess = Math.floor((now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60 * 24));

    // Exponentieller Verfall basierend auf Inaktivität
    const decayFactor = Math.pow(1 - this.config.decayPerDay, daysSinceLastAccess);
    let newScore = record.popularityScore * decayFactor;

    // Mindest-Score nicht unterschreiten
    newScore = Math.max(this.config.minScore, newScore);

    // Score auf 2 Dezimalstellen runden
    return Math.round(newScore * 100) / 100;
  }

  /**
   * Aktualisiert den Score eines Records in der Datenbank
   */
  private async updateRecordScore(recordId: string, newScore: number): Promise<void> {
    try {
      await pb.collection('solar_cells').update(recordId, {
        popularityScore: newScore
      });
    } catch (error) {
      console.error(`[SCORE-DECAY] Fehler beim Aktualisieren des Scores für ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Aktualisiert den isHot-Status eines Records
   */
  private async updateHotStatus(recordId: string, isHot: boolean): Promise<void> {
    try {
      await pb.collection('solar_cells').update(recordId, {
        isHot: isHot
      });
    } catch (error) {
      console.error(`[SCORE-DECAY] Fehler beim Aktualisieren des isHot-Status für ${recordId}:`, error);
      throw error;
    }
  }

  /**
   * Manueller Score-Degradation-Durchlauf
   */
  async manualScoreDecay(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[SCORE-DECAY] Manueller Score-Degradation-Durchlauf gestartet...');
      await this.runScoreDecay();
      return {
        success: true,
        message: 'Score-Degradation erfolgreich abgeschlossen'
      };
    } catch (error: any) {
      console.error('[SCORE-DECAY] Fehler beim manuellen Score-Degradation:', error);
      return {
        success: false,
        message: `Fehler: ${error.message}`
      };
    }
  }

  /**
   * Gibt den aktuellen Status des Services zurück
   */
  getStatus(): { isRunning: boolean; config: ScoreDecayConfig; nextRun: string | null } {
    let nextRun = null;
    if (this.intervalId) {
      const nextRunTime = Date.now() + (this.config.decayIntervalHours * 60 * 60 * 1000);
      nextRun = new Date(nextRunTime).toISOString();
    }

    return {
      isRunning: this.isRunning,
      config: this.config,
      nextRun
    };
  }

  /**
   * Aktualisiert die Konfiguration
   */
  updateConfig(newConfig: Partial<ScoreDecayConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[SCORE-DECAY] Konfiguration aktualisiert:', this.config);
  }
}

export const scoreDecayService = new ScoreDecayService();
