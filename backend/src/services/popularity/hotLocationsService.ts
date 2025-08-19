import { pb, SOLAR_COLLECTION } from '../../utils/pb';
import { HotLocation, PopularityStats } from '../../types/popularity';

export class HotLocationsService {
  private static instance: HotLocationsService;

  private constructor() {}

  public static getInstance(): HotLocationsService {
    if (!HotLocationsService.instance) {
      HotLocationsService.instance = new HotLocationsService();
    }
    return HotLocationsService.instance;
  }


  async getHotLocations(): Promise<HotLocation[]> {
    try {
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=isHot%3Dtrue`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }

      const now = new Date();
      const hotLocations: HotLocation[] = data.items.map((record: any) => {
        const ttlDays = record.ttlDays || 90;
        const lastAccessAt = new Date(record.lastAccessAt);
        const expiryDate = new Date(lastAccessAt.getTime() + ttlDays * 24 * 60 * 60 * 1000);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        return {
          id: record.id,
          gridKey: record.gridKey,
          latRounded: record.latRounded,
          lngRounded: record.lngRounded,
          accessCount: record.accessCount || 0,
          lastAccessAt: record.lastAccessAt,
          popularityScore: record.popularityScore || 0,
          isHot: record.isHot || false,
          locationWeight: record.locationWeight || 1.0,
          recencyBonus: record.recencyBonus || 1.0,
          ttlDays,
          expiresAt: expiryDate.toISOString(),
          daysUntilExpiry: Math.max(0, daysUntilExpiry)
        };
      }).filter(Boolean); 

      hotLocations.sort((a, b) => b.popularityScore - a.popularityScore);

      return hotLocations;
    } catch (error) {
      console.error('❌ Fehler beim Holen der "heißen" Standorte:', error);
      return [];
    }
  }

  async getTopLocations(limit: number = 10): Promise<HotLocation[]> {
    try {
      const allHotLocations = await this.getHotLocations();
      return allHotLocations.slice(0, limit);
    } catch (error) {
      console.error(`❌ Fehler beim Holen der Top-${limit} Standorte:`, error);
      return [];
    }
  }

  isExpiringSoon(location: HotLocation, thresholdDays: number = 7): boolean {
    return location.daysUntilExpiry <= thresholdDays;
  }


  async getLocationsNeedingPreFetch(thresholdDays: number = 7): Promise<HotLocation[]> {
    try {
      const hotLocations = await this.getHotLocations();
      
      const locationsNeedingPreFetch = hotLocations.filter(location => 
        this.isExpiringSoon(location, thresholdDays)
      );

      if (locationsNeedingPreFetch.length > 0) {
        console.log(`🚨 ${locationsNeedingPreFetch.length} Standorte benötigen Pre-Fetch (laufen in ≤${thresholdDays} Tagen ab)`);
        locationsNeedingPreFetch.forEach(location => {
          console.log(`   ⚠️ ${location.gridKey}: Läuft in ${location.daysUntilExpiry} Tagen ab (Score: ${location.popularityScore})`);
        });
      } else {
        console.log(`Alle "heißen" Standorte sind noch frisch genug (≥${thresholdDays} Tage)`);
      }

      return locationsNeedingPreFetch;
    } catch (error) {
      console.error('Fehler beim Prüfen der Pre-Fetch-Bedürfnisse:', error);
      return [];
    }
  }


  async getPopularityStats(): Promise<PopularityStats> {
    try {
      console.log(' Hole Popularitäts-Statistiken...');
      
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          totalLocations: 0,
          hotLocations: 0,
          averageScore: 0,
          topLocations: [],
          lastUpdated: new Date().toISOString()
        };
      }

      const allLocations = data.items;
      const hotLocations = allLocations.filter((loc: any) => loc.isHot === true);
      
      const totalScore = allLocations.reduce((sum: number, loc: any) => 
        sum + (loc.popularityScore || 0), 0
      );
      const averageScore = allLocations.length > 0 ? Math.round(totalScore / allLocations.length) : 0;

      const topLocations = await this.getTopLocations(10);

      const stats: PopularityStats = {
        totalLocations: allLocations.length,
        hotLocations: hotLocations.length,
        averageScore,
        topLocations,
        lastUpdated: new Date().toISOString()
      };

      console.log('Popularitäts-Statistiken:', {
        total: stats.totalLocations,
        hot: stats.hotLocations,
        averageScore: stats.averageScore,
        topLocation: stats.topLocations[0]?.gridKey || 'Keine'
      });

      return stats;
    } catch (error) {
      console.error('Fehler beim Holen der Popularitäts-Statistiken:', error);
      return {
        totalLocations: 0,
        hotLocations: 0,
        averageScore: 0,
        topLocations: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }


  async updateHotStatus(gridKey: string, isHot: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=gridKey%3D%22${gridKey}%22`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log(`⚠️ Standort ${gridKey} nicht gefunden`);
        return false;
      }

      const record = data.items[0];
      
      await pb.collection(SOLAR_COLLECTION).update(record.id, {
        isHot
      });

      console.log(`${gridKey} als ${isHot ? 'HEISS' : 'normal'} markiert`);
      return true;
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Hot-Status für ${gridKey}:`, error);
      return false;
    }
  }


  async cleanupLowPopularityLocations(minScore: number = 10): Promise<number> {
    try {
      console.log(`Bereinige Standorte mit Score < ${minScore}...`);
      
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=popularityScore%3C${minScore}`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log('ℹKeine Standorte mit niedrigem Score gefunden');
        return 0;
      }

      let deletedCount = 0;
      const lowScoreLocations = data.items;

      for (const location of lowScoreLocations) {
        try {
          await pb.collection(SOLAR_COLLECTION).delete(location.id);
          deletedCount++;
          console.log(`Gelöscht: ${location.gridKey} (Score: ${location.popularityScore})`);
        } catch (deleteError) {
          console.error(`Fehler beim Löschen von ${location.gridKey}:`, deleteError);
        }
      }

      console.log(`Bereinigung abgeschlossen: ${deletedCount} Standorte gelöscht`);
      return deletedCount;
    } catch (error) {
      console.error('Fehler bei der Bereinigung:', error);
      return 0;
    }
  }
}

export const hotLocationsService = HotLocationsService.getInstance();
