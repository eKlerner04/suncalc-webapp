import { pb, SOLAR_COLLECTION } from '../utils/pb';

export class CleanupService {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private config = {
    cleanupIntervalHours: 6, // Alle 6 Stunden
    ttlDays: 90, // Nach 90 Tagen werden Daten als abgelaufen betrachtet
    batchSize: 100 // Anzahl Standorte pro Batch
  };

  /**
   * Startet den Cleanup-Service
   */
  async startCleanupService(): Promise<void> {
    if (this.isRunning) {
      console.log('[CLEANUP] Service läuft bereits');
      return;
    }

    console.log('[CLEANUP] Starte Cleanup-Service...');
    this.isRunning = true;

    // Sofort ersten Durchlauf starten (ohne Log)
    await this.runCleanup();

    // Dann alle 6 Stunden wiederholen
    this.intervalId = setInterval(async () => {
      await this.runCleanup();
    }, this.config.cleanupIntervalHours * 60 * 60 * 1000);

    console.log(`[CLEANUP] Service gestartet - läuft alle ${this.config.cleanupIntervalHours} Stunden`);
  }

  /**
   * Stoppt den Cleanup-Service
   */
  stopCleanupService(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('[CLEANUP] Stoppe Cleanup-Service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('[CLEANUP] Service gestoppt');
  }

  /**
   * Führt einen Cleanup-Durchlauf aus
   */
  private async runCleanup(): Promise<void> {
    try {
      const startTime = Date.now();

      // Alle Standorte über HTTP-API holen
      const apiUrl = `${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log('[CLEANUP] Keine Standorte gefunden');
        return;
      }

      const allRecords = data.items;
      const now = new Date();
      let deletedCount = 0;
      let errorCount = 0;

      console.log(`[CLEANUP] ${allRecords.length} Standorte zur Überprüfung gefunden`);

      // Verarbeite alle gefundenen Datensätze
      for (const record of allRecords) {
        if (!this.isRunning) break; // Stoppe bei Shutdown

        try {
          const ttlDays = record.ttlDays || this.config.ttlDays;
          const lastAccessAt = new Date(record.lastAccessAt);
          
          // Berechne Ablaufzeit
          const expiry = new Date(lastAccessAt.getTime() + ttlDays * 24 * 60 * 60 * 1000);
          const isExpired = expiry < now;

          if (isExpired) {
            console.log(`[CLEANUP] Standort ${record.gridKey} ist abgelaufen (${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage über TTL)`);
            
            // Lösche abgelaufenen Standort
            await pb.collection(SOLAR_COLLECTION).delete(record.id);
            console.log(`[CLEANUP] Gelöscht: ${record.gridKey} (TTL: ${ttlDays} Tage, abgelaufen: ${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage)`);
            deletedCount++;
          } else {
            const daysUntilExpiry = Math.round((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
            console.log(`[CLEANUP] Standort ${record.gridKey} ist noch gültig (läuft in ${daysUntilExpiry} Tagen ab)`);
          }
        } catch (recordError) {
          console.error(`[CLEANUP] Fehler beim Verarbeiten von ${record.gridKey}:`, recordError);
          errorCount++;
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[CLEANUP] Cleanup abgeschlossen in ${duration}ms: ${deletedCount} Standorte gelöscht, ${errorCount} Fehler`);

    } catch (error) {
      console.error('[CLEANUP] Fehler beim Cleanup:', error);
    }
  }

  /**
   * Führt manuell einen Cleanup durch
   */
  async manualCleanup(): Promise<{ success: boolean; message: string; deletedCount?: number }> {
    try {
      console.log('[CLEANUP] Starte manuellen Cleanup...');
      await this.runCleanup();
      return {
        success: true,
        message: 'Manueller Cleanup erfolgreich abgeschlossen'
      };
    } catch (error: any) {
      console.error('[CLEANUP] Fehler beim manuellen Cleanup:', error);
      return {
        success: false,
        message: `Fehler: ${error.message}`
      };
    }
  }

  /**
   * Gibt den aktuellen Status des Services zurück
   */
  getStatus(): { isRunning: boolean; config: any; nextRun: string | null } {
    let nextRun = null;
    if (this.intervalId) {
      const nextRunTime = Date.now() + (this.config.cleanupIntervalHours * 60 * 60 * 1000);
      nextRun = new Date(nextRunTime).toISOString();
    }

    return {
      isRunning: this.isRunning,
      config: this.config,
      nextRun
    };
  }
}

export const cleanupService = new CleanupService();
