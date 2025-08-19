
export interface PopularityScore {
  gridKey: string;
  accessCount: number;          
  lastAccessAt: string;        
  popularityScore: number;     
  isHot: boolean;               
  locationWeight: number;        
  recencyBonus: number;          
}

export interface HotLocation extends PopularityScore {
  id: string;                   
  latRounded: number;           
  lngRounded: number;           
  ttlDays: number;              
  expiresAt: string;           
  daysUntilExpiry: number;     
}

export interface PopularityConfig {
  hotLocationThreshold: number;  
  preFetchThreshold: number;     

  accessCountWeight: number;     
  recencyWeight: number;         
  locationTypeWeight: number;    
  

  scoreCalculationDays: number;  
  preFetchIntervalHours: number; 
}

export interface ScoreDecayConfig {
  decayIntervalHours: number;     
  halfLifeDays: number;           
  minScore: number;              
  decayPerDay: number;          
  scoreCalculationDays: number;  
  batchSize: number;             
}

export interface PreFetchResult {
  gridKey: string;
  success: boolean;
  source: string;               
  timestamp: string;
  error?: string;
}

export interface PopularityStats {
  totalLocations: number;
  hotLocations: number;
  averageScore: number;
  topLocations: HotLocation[];
  lastUpdated: string;
}

export interface ScoreDecayResult {
  success: boolean;
  processedCount: number;
  updatedCount: number;
  decayedCount: number;
  duration: number;
  message: string;
}

export interface ScoreDecayStatus {
  isRunning: boolean;
  config: ScoreDecayConfig;
  nextRun: string | null;
  lastRun?: string;
  totalProcessed?: number;
}
