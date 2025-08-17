// Solar-Daten Interface für alle API-Responses
export interface PVGISResponse {
  annual_kWh: number;
  co2_saved: number;
  efficiency: number;
  timestamp: string;
  source: 'pvgis' | 'nasa_power' | 'fallback' | 'local' | 'local_stale';
  metadata?: {
    pvgis_url?: string;
    nasa_power_url?: string;
    calculation_date: string;
    assumptions: {
      losses_percent: number;
      m2_per_kwp: number;
      co2_factor: number;
      kwp?: number;
      annual_radiation?: string;
    };
  };
}
