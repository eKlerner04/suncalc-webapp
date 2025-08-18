import { pb, SOLAR_COLLECTION, waitForPocketBase } from '../utils/pb';

// TTL-Konfiguration
const TTL_DAYS = 90;           // Nach 90 Tagen werden Daten als abgelaufen betrachtet

/**
 * Einfache Background-Jobs mit setInterval
 * Nur Cleanup-Funktionalität
 */
export class SimpleBackgroundJobs {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    // Verzögerter Start, damit der Server erst vollständig läuft
    setTimeout(async () => {
      await this.waitForPocketBaseAndStart();
    }, 5000); // 5 Sekunden warten
  }

  /**
   * Wartet auf PocketBase und startet dann die Background-Jobs
   */
  private async waitForPocketBaseAndStart() {
    console.log('🔌 Warte auf PocketBase-Verbindung...');
    
    const isConnected = await waitForPocketBase(120000); // 2 Minuten warten
    
    if (isConnected) {
      this.startBackgroundJobs();
    } else {
      console.log('⚠️ PocketBase nicht verfügbar, versuche es später erneut...');
      // Versuche es in 30 Sekunden erneut
      setTimeout(() => this.waitForPocketBaseAndStart(), 30000);
    }
  }

  /**
   * Startet alle Background-Jobs
   */
  public startBackgroundJobs() {
    if (this.isRunning) {
      console.log('⚠️ Background-Jobs laufen bereits');
      return;
    }

    console.log('🚀 Starte einfache Background-Jobs...');

    // WICHTIG: Für Entwicklung kürzere Intervalle, für Produktion längere
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Entwicklung: Alle 15 Minuten (für Tests)
      this.cleanupInterval = setInterval(() => {
        this.cleanupOldData();
      }, 15 * 60 * 1000); // 15 Minuten

      console.log('✅ Einfache Background-Jobs gestartet (ENTWICKLUNG)');
      console.log('   - Cleanup alle 15 Minuten');
    } else {
      // Produktion: Normale Intervalle
      this.cleanupInterval = setInterval(() => {
        this.cleanupOldData();
      }, 24 * 60 * 60 * 1000); // 24 Stunden (täglich)

      console.log('✅ Einfache Background-Jobs gestartet (PRODUKTION)');
      console.log('   - Cleanup alle 24 Stunden (täglich)');
    }

    this.isRunning = true;
  }

  /**
   * Löscht alte, ungenutzte Daten
   */
  async cleanupOldData(): Promise<void> {
    if (!this.isRunning) return;
    
    console.log('🧹 Starte automatischen Cleanup alter Daten...');
    
    try {
      // PocketBase-Verbindung prüfen
      try {
        await pb.health.check();
        console.log('✅ PocketBase-Verbindung verfügbar');
      } catch (healthError) {
        console.log('⚠️ PocketBase nicht verfügbar, überspringe Cleanup');
        return;
      }
      
              // Verwende direkte HTTP-API für bessere Performance
        try {
          const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records`);
          const data = await response.json();
          
          // Wenn HTTP-API funktioniert, verwende diese Daten direkt
          if (data.items && data.items.length > 0) {
            const allRecords = data.items;
            const now = new Date();
            let deletedCount = 0;
            let errorCount = 0;

            console.log(`📊 Gefunden: ${allRecords.length} Datensätze zur Überprüfung`);
            
            // Verarbeite alle gefundenen Datensätze
            for (const record of allRecords) {
              if (!this.isRunning) break; // Stoppe bei Shutdown
              
              try {
                const ttlDays = record.ttlDays || TTL_DAYS; // Verwende Konstante
                const lastAccessAt = new Date(record.lastAccessAt);
                
                // WICHTIG: Cleanup löscht nach TTL_DAYS (90 Tage)
                const expiry = new Date(lastAccessAt.getTime() + TTL_DAYS * 24 * 60 * 60 * 1000);

                // Prüfe TTL für jeden Datensatz
                const isExpired = expiry < now;
                if (isExpired) {
                  console.log(`🔍 ${record.gridKey}: Abgelaufen (${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage über TTL)`);
                }

                if (expiry < now) {
                  console.log(`🎯 Datensatz ${record.gridKey} ist abgelaufen und wird gelöscht!`);
                  
                  // Retry-Logik für das Löschen über HTTP-API
                  let deleteSuccess = false;
                  let retryCount = 0;
                  const maxRetries = 3;

                  while (!deleteSuccess && retryCount < maxRetries && this.isRunning) {
                    try {
                      const deleteResponse = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records/${record.id}`, {
                        method: 'DELETE'
                      });
                      
                      if (deleteResponse.ok) {
                        console.log(`🗑️ Gelöscht: ${record.gridKey} (TTL: ${ttlDays} Tage, abgelaufen: ${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage)`);
                        deletedCount++;
                        deleteSuccess = true;
                      } else {
                        throw new Error(`HTTP ${deleteResponse.status}: ${deleteResponse.statusText}`);
                      }
                    } catch (deleteError) {
                      retryCount++;
                      if (retryCount >= maxRetries) {
                        console.error(`❌ Fehler beim Löschen von ${record.gridKey} nach ${maxRetries} Versuchen:`, deleteError);
                        errorCount++;
                      } else {
                        console.log(`⚠️ Löschversuch ${retryCount}/${maxRetries} für ${record.gridKey} fehlgeschlagen, versuche erneut...`);
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // Exponential backoff
                      }
                    }
                  }
                } else {
                  console.log(`✅ Datensatz ${record.gridKey} ist noch gültig (läuft in ${Math.round((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))} Tagen ab)`);
                }
              } catch (recordError) {
                console.error(`❌ Fehler beim Verarbeiten von ${record.gridKey}:`, recordError);
                errorCount++;
              }
            }

            console.log(`✅ Cleanup abgeschlossen: ${deletedCount} Datensätze gelöscht, ${errorCount} Fehler`);
            return;
          }
        } catch (httpError) {
          console.error('❌ HTTP-API Fehler:', httpError);
        }
        
        // Fallback: Verwende SOLAR_COLLECTION
        const allRecords = await pb.collection(SOLAR_COLLECTION).getFullList();
        const now = new Date();
        let deletedCount = 0;
        let errorCount = 0;

        console.log(`📊 Gefunden: ${allRecords.length} Datensätze zur Überprüfung`);
        
        if (allRecords.length === 0) {
          console.log('ℹ️ Keine Datensätze gefunden');
          return;
        }

      // Verarbeite alle gefundenen Datensätze
      for (const record of allRecords) {
        if (!this.isRunning) break; // Stoppe bei Shutdown
        
        try {
          const ttlDays = record.ttlDays || TTL_DAYS; // Verwende Konstante
          const lastAccessAt = new Date(record.lastAccessAt);
          
          // WICHTIG: Cleanup löscht nach TTL_DAYS (90 Tagen)
          const expiry = new Date(lastAccessAt.getTime() + TTL_DAYS * 24 * 60 * 60 * 1000);

          // Prüfe TTL für jeden Datensatz
          const isExpired = expiry < now;
          if (isExpired) {
            console.log(`🔍 ${record.gridKey}: Abgelaufen (${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage über TTL)`);
          }

          if (expiry < now) {
            console.log(`🎯 Datensatz ${record.gridKey} ist abgelaufen und wird gelöscht!`);
            
            // Retry-Logik für das Löschen
            let deleteSuccess = false;
            let retryCount = 0;
            const maxRetries = 3;

            while (!deleteSuccess && retryCount < maxRetries && this.isRunning) {
              try {
                await pb.collection(SOLAR_COLLECTION).delete(record.id);
                console.log(`🗑️ Gelöscht: ${record.gridKey} (TTL: ${ttlDays} Tage, abgelaufen: ${Math.round((now.getTime() - expiry.getTime()) / (24 * 60 * 60 * 1000))} Tage)`);
                deletedCount++;
                deleteSuccess = true;
              } catch (deleteError) {
                retryCount++;
                if (retryCount >= maxRetries) {
                  console.error(`❌ Fehler beim Löschen von ${record.gridKey} nach ${maxRetries} Versuchen:`, deleteError);
                  errorCount++;
                } else {
                  console.log(`⚠️ Löschversuch ${retryCount}/${maxRetries} für ${record.gridKey} fehlgeschlagen, versuche erneut...`);
                  await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000)); // Exponential backoff
                }
              }
            }
          } else {
            console.log(`✅ Datensatz ${record.gridKey} ist noch gültig (läuft in ${Math.round((expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))} Tagen ab)`);
          }
        } catch (recordError) {
          console.error(`❌ Fehler beim Verarbeiten von ${record.gridKey}:`, recordError);
          errorCount++;
        }
      }

      console.log(`✅ Cleanup abgeschlossen: ${deletedCount} Datensätze gelöscht, ${errorCount} Fehler`);
    } catch (error) {
      console.error('❌ Fehler beim Cleanup:', error);
    }
  }

  /**
   * Stoppt alle Background-Jobs
   */
  public stopBackgroundJobs() {
    console.log('🛑 Stoppe einfache Background-Jobs...');
    
    this.isRunning = false;
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    console.log('✅ Einfache Background-Jobs gestoppt');
  }

  /**
   * Startet alle Background-Jobs neu
   */
  public restartBackgroundJobs() {
    console.log('🔄 Starte Background-Jobs neu...');
    this.stopBackgroundJobs();
    setTimeout(() => {
      this.startBackgroundJobs();
    }, 1000);
  }

  /**
   * Gibt den Status der Background-Jobs zurück
   */
  public getStatus() {
    return {
      isRunning: this.isRunning,
      type: 'simple',
      intervals: {
        cleanup: this.cleanupInterval ? 'active' : 'inactive'
      }
    };
  }

  /**
   * Führt manuell einen Cleanup alter Daten durch
   */
  public async manualCleanup() {
    console.log('🧹 Starte manuellen Cleanup alter Daten...');
    await this.cleanupOldData();
  }
}

// Singleton-Instanz
export const simpleBackgroundJobs = new SimpleBackgroundJobs();
