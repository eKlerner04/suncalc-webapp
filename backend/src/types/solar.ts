// Solar-Daten Interface für alle API-Responses
export interface PVGISResponse {
  annual_kWh: number;
  co2_saved: number;
  efficiency: number;
  timestamp: string;
  source: 'pvgis' | 'nasa_power' | 'fallback' | 'local' | 'local_stale';
  metadata?: {
    pvgis_url?: string;
    pvgis_database?: string; // Welche PVGIS-Datenbank verwendet wurde
    nasa_power_url?: string;
    calculation_date: string;
    monthly_data?: number[]; // Monatliche kWh-Werte (Jan-Dez)
    assumptions: {
      losses_percent: number;
      m2_per_kwp?: number; // Legacy
      kw_per_m2?: number; // Neue Berechnung
      p_stc_kwp?: number; // Anlagenleistung
      co2_factor: number;
      kwp?: number; // Legacy
      annual_radiation?: string;
      // Fallback-Berechnung Parameter
      base_radiation?: number;
      latitude_factor?: number;
      tilt_factor?: number;
      azimuth_factor?: number;
    };
  };
}
