import { backgroundJobController } from './backgroundJobController';
import { preFetchService } from './popularity/preFetchService';
import { hotLocationsService } from './popularity/hotLocationsService';
import { scoreDecayService } from './popularity/scoreDecayService';
import { cleanupService } from './cleanupService';

let isRunning = false;

export async function startBackgroundJobs(): Promise<void> {
  if (isRunning) {
    console.log('[BACKGROUND-JOBS] Background Jobs laufen bereits');
    return;
  }

  console.log('[BACKGROUND-JOBS] Starte erweiterte Background Jobs...');
  console.log('');

  try {
    // Starte alle Services
    await preFetchService.startPreFetchService();
    await scoreDecayService.startScoreDecayService();
    await cleanupService.startCleanupService();

    isRunning = true;

    console.log('');
    console.log('[BACKGROUND-JOBS] Alle Services erfolgreich gestartet!');
    console.log('');

  } catch (error) {
    console.error('[ERROR] Fehler beim Starten der Background Jobs:', error);
    throw error;
  }
}

export async function stopBackgroundJobs(): Promise<void> {
  if (!isRunning) {
    console.log('[BACKGROUND-JOBS] Background Jobs laufen nicht');
    return;
  }

  console.log('─────────────────────────────────────────────────────────────');
  console.log('[BACKGROUND-JOBS] Stoppe alle Background Jobs...');
  console.log('─────────────────────────────────────────────────────────────');

  try {
   
    await preFetchService.stopPreFetchService();
    await scoreDecayService.stopScoreDecayService();
    await cleanupService.stopCleanupService();

    isRunning = false;

    console.log('• Cache-Cleanup: Gestoppt');
    console.log('• Pre-Fetch: Gestoppt');
    console.log('• Score-Degradation: Gestoppt');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('[BACKGROUND-JOBS] Services gestoppt!');
    console.log('─────────────────────────────────────────────────────────────');

  } catch (error) {
    console.error('[ERROR] Fehler beim Stoppen der Background Jobs:', error);
  }
}

export function getStatus(): { isRunning: boolean; services: any } {
  return {
    isRunning,
    services: {
      preFetch: preFetchService.getStatus(),
      scoreDecay: scoreDecayService.getStatus(),
      cleanup: cleanupService.getStatus()
    }
  };
}
