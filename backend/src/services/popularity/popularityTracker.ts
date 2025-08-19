import { pb, SOLAR_COLLECTION, generateGridKey } from '../../utils/pb';
import { PopularityScore, PopularityConfig, HotLocation } from '../../types/popularity';

const DEFAULT_CONFIG: PopularityConfig = {
  hotLocationThreshold: 100,     
  preFetchThreshold: 7,          
  accessCountWeight: 2.0,        
  recencyWeight: 1.5,             
  locationTypeWeight: 1.2,        
  
  scoreCalculationDays: 30,       
  preFetchIntervalHours: 6       
};


export class PopularityTrackerService {
  private static instance: PopularityTrackerService;
  private config: PopularityConfig;

  private constructor() {
    this.config = DEFAULT_CONFIG;
  }

  public static getInstance(): PopularityTrackerService {
    if (!PopularityTrackerService.instance) {
      PopularityTrackerService.instance = new PopularityTrackerService();
    }
    return PopularityTrackerService.instance;
  }


  async updatePopularityScore(gridKey: string, lat: number, lng: number): Promise<void> {
    try {
     
      const existingRecord = await this.findRecordByGridKey(gridKey);
      
      if (existingRecord) {
        await this.updateExistingRecord(existingRecord);
      } else {
      
        return;
      }
    } catch (error) {
      console.error(`[ERROR] Fehler beim Aktualisieren des Popularitäts-Scores für ${gridKey}:`, error);
    }
  }

  private calculatePopularityScore(
    accessCount: number, 
    lastAccessAt: string, 
    lat: number
  ): { score: number; isHot: boolean; locationWeight: number; recencyBonus: number } {
    
    const locationWeight = this.calculateLocationWeight(lat);
    
    const recencyBonus = this.calculateRecencyBonus(lastAccessAt);
    
    const score = Math.round(
      (accessCount * this.config.accessCountWeight) +
      (recencyBonus * this.config.recencyWeight) +
      (locationWeight * this.config.locationTypeWeight)
    );
    
    const isHot = score >= this.config.hotLocationThreshold;
    
    return { score, isHot, locationWeight, recencyBonus };
  }



  private calculateLocationWeight(lat: number): number {

    const absLat = Math.abs(lat);
    
    if (absLat < 30) return 1.5;     
    if (absLat < 45) return 1.3;      
    if (absLat < 60) return 1.1;      
    return 1.0;                        
  }

  private calculateRecencyBonus(lastAccessAt: string): number {
    const lastAccess = new Date(lastAccessAt);
    const now = new Date();
    const hoursSinceLastAccess = (now.getTime() - lastAccess.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastAccess < 1) return 2.0;     
    if (hoursSinceLastAccess < 6) return 1.5;     
    if (hoursSinceLastAccess < 24) return 1.2;     
    if (hoursSinceLastAccess < 168) return 1.0;    
    return 0.5;                                     
  }

  private async findRecordByGridKey(gridKey: string): Promise<any> {
    try {
      const response = await fetch(`${pb.baseUrl}/api/collections/${SOLAR_COLLECTION}/records?filter=gridKey%3D%22${gridKey}%22`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0]; 
      }
      return null;
    } catch (error) {
      console.error(`Fehler beim Suchen nach ${gridKey}:`, error);
      return null;
    }
  }


  private async updateExistingRecord(record: any): Promise<void> {
    try {
      const now = new Date().toISOString();
      const lastAccessAt = record.lastAccessAt;
      
      const accessCount = (record.accessCount || 0) + 1;
      
      const { score, isHot, locationWeight, recencyBonus } = this.calculatePopularityScore(
        accessCount, 
        lastAccessAt, 
        record.latRounded
      );
      
      await pb.collection(SOLAR_COLLECTION).update(record.id, {
        accessCount,
        lastAccessAt: now,
        popularityScore: score,
        isHot,
        locationWeight,
        recencyBonus
      });
      
      console.log(`${record.gridKey}: Score ${score} (${isHot ? 'HEISS' : 'normal'})`);
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Datensatzes:`, error);
    }
  }


  getConfig(): PopularityConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<PopularityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Popularitäts-Konfiguration aktualisiert:', this.config);
  }
}

export const popularityTrackerService = PopularityTrackerService.getInstance();
