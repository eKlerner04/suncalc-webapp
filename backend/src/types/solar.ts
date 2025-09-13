export interface PVGISResponse {
  annual_kWh: number;
  co2_saved: number;
  efficiency: number;
  timestamp: string;
  source: 'pvgis' | 'fallback' | 'local' | 'local_stale';
  metadata?: {
    pvgis_url?: string;
    pvgis_database?: string; 
    calculation_date: string;
    monthly_data?: number[]; 
    assumptions: {
      losses_percent: number;
      m2_per_kwp?: number; 
      kw_per_m2?: number; 
      p_stc_kwp?: number; 
      co2_factor: number;
      kwp?: number; 
      annual_radiation?: string;
      
      base_radiation?: number;
      latitude_factor?: number;
      tilt_factor?: number;
      azimuth_factor?: number;
    };
  };
}
