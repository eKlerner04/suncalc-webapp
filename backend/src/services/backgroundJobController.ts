import { startBackgroundJobs, stopBackgroundJobs, getStatus } from './backgroundJobs';
import { cleanupService } from './cleanupService';

export class BackgroundJobController {
  private currentMode: 'simple' | 'bullmq' = 'simple';
  private isRunning: boolean = false;

  constructor() {
    // Starte automatisch im simple-Modus 
    this.currentMode = 'simple';
    this.startSimpleMode();
  }

  /**
   * Startet den Simple-Modus 
   */
  public startSimpleMode(): void {
    console.log('[BACKGROUND] Starte erweiterte Background-Jobs...');
    startBackgroundJobs();
    console.log('[BACKGROUND] Erweiterte Background-Jobs gestartet');
    console.log('');
  }

  /**
   * Stoppt alle Background-Jobs
   */
  public stopAllJobs(): void {
    console.log('[BACKGROUND] Stoppe alle Background-Jobs...');
    stopBackgroundJobs();
    console.log('[BACKGROUND] Alle Background-Jobs gestoppt');
  }

  
  public switchToBullMQ() {
    console.log('[MODE] Wechsle zu BullMQ-Modus...');
    console.log('[WARNING] BullMQ-Modus ist derzeit nicht verfügbar');
    console.log('[INFO] Bleibe im einfachen Modus (einfach und zuverlässig)');
    
    this.currentMode = 'simple';
    console.log('[MODE] Bleibe im einfachen Modus');
  }

 
  public async switchToSimple() {
    console.log('[MODE] Wechsle zu einfachem Modus...');
    await this.startSimpleMode();
    console.log('[MODE] Erfolgreich zu einfachem Modus gewechselt');
  }

  
  public async manualCleanup() {
    console.log('[CLEANUP] Starte manuellen Cleanup...');
    
    try {
      const status = this.getStatus();
      console.log('[CLEANUP] Background Jobs Status:', status);
      
      // Rufe den echten Cleanup-Service auf
      const result = await cleanupService.manualCleanup();
      console.log('[CLEANUP] Manueller Cleanup abgeschlossen');
      
      return result;
    } catch (error) {
      console.error('[ERROR] Fehler beim Cleanup:', error);
      throw error;
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      currentMode: this.currentMode,
      modes: {
        simple: {
          name: 'Erweiterte Background-Jobs',
          description: 'Einfach und zuverlässig - mit Score-Degradation und Pre-Fetch!',
          features: [
            'Cache-Cleanup (über BackgroundJobController)', 
            'Pre-Fetch alle 6 Stunden', 
            'Score-Degradation alle 24 Stunden',
            'Keine externen Dependencies', 
            'Einfach zu verstehen'
          ]
        },
        bullmq: {
          name: 'BullMQ Background-Jobs',
          description: 'Professionell und robust - derzeit nicht verfügbar',
          features: ['Nicht verfügbar', 'Verwende erweiterte Jobs']
        }
      },
      currentStatus: getStatus()
    };
  }
}

export const backgroundJobController = new BackgroundJobController();
