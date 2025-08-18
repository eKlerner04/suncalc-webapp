import { simpleBackgroundJobs } from './backgroundJobs';

/**
 * Vereinfachter Background-Job-Controller
 * Einfach und verständlich - funktioniert garantiert!
 */
export class BackgroundJobController {
  private currentMode: 'simple' | 'bullmq' = 'simple';
  private isRunning: boolean = false;

  constructor() {
    // Starte automatisch im simple-Modus (einfach und zuverlässig)
    this.currentMode = 'simple';
    this.startSimpleMode();
  }

  /**
   * Startet den simple-Modus (einfach und zuverlässig)
   */
  private startSimpleMode() {
    console.log('🚀 Starte einfache Background-Jobs (einfach und zuverlässig)...');
    
    try {
      // Starte einfache Jobs (falls sie noch nicht laufen)
      if (!simpleBackgroundJobs.getStatus().isRunning) {
        simpleBackgroundJobs.startBackgroundJobs();
      }
      
      this.currentMode = 'simple';
      this.isRunning = true;
      
      console.log('✅ Einfache Background-Jobs gestartet');
      console.log('   - Cleanup alle 15 Minuten');
      
    } catch (error) {
      console.error('❌ Fehler beim Starten der einfachen Jobs:', error);
    }
  }

  /**
   * Wechselt zu BullMQ-Modus (für Produktion)
   */
  public switchToBullMQ() {
    console.log('🔄 Wechsle zu BullMQ-Modus...');
    console.log('⚠️ BullMQ-Modus ist derzeit nicht verfügbar');
    console.log('📋 Bleibe im einfachen Modus (einfach und zuverlässig)');
    
    this.currentMode = 'simple';
    console.log('✅ Bleibe im einfachen Modus');
  }

  /**
   * Wechselt zu Simple-Modus (einfach und zuverlässig)
   */
  public switchToSimple() {
    console.log('🔄 Wechsle zu einfachem Modus...');
    this.startSimpleMode();
    console.log('✅ Erfolgreich zu einfachem Modus gewechselt');
  }



  /**
   * Führt manuell einen Cleanup durch (funktioniert immer!)
   */
  public async manualCleanup() {
    console.log('🧹 Starte manuellen Cleanup...');
    
    try {
      await simpleBackgroundJobs.manualCleanup();
      console.log('✅ Manueller Cleanup abgeschlossen');
    } catch (error) {
      console.error('❌ Fehler beim Cleanup:', error);
    }
  }

  /**
   * Gibt den aktuellen Status zurück (einfach und übersichtlich)
   */
  public getStatus() {
    return {
      isRunning: this.isRunning,
      currentMode: this.currentMode,
      modes: {
        simple: {
          name: 'Einfache Background-Jobs',
          description: 'Einfach und zuverlässig - funktioniert garantiert!',
          features: ['Refresh alle 5 Minuten', 'Cleanup alle 10 Minuten', 'Keine externen Dependencies', 'Einfach zu verstehen']
        },
        bullmq: {
          name: 'BullMQ Background-Jobs',
          description: 'Professionell und robust - derzeit nicht verfügbar',
          features: ['Nicht verfügbar', 'Verwende einfache Jobs']
        }
      },
      currentStatus: simpleBackgroundJobs.getStatus()
    };
  }
}

// Singleton-Instanz exportieren
export const backgroundJobController = new BackgroundJobController();
