// Solar-Daten Interface für alle API-Responses
export interface PVGISResponse {
  annual_kWh: number;
  co2_saved: number;
  efficiency: number;
  timestamp: string;
  source: 'pvgis' | 'nasa_power' | 'fallback' | 'local' | 'local_stale';
  // Neue Strahlungswerte
  radiation?: {
    dni?: number;        // Direct Normal Irradiation (kWh/m²/Jahr)
    ghi?: number;        // Global Horizontal Irradiation (kWh/m²/Jahr)
    dif?: number;        // Diffuse Horizontal Irradiation (kWh/m²/Jahr)
    annual_total?: number; // Gesamtstrahlung auf geneigte Fläche (kWh/m²/Jahr)
  };
  metadata?: {
    pvgis_url?: string;
    nasa_power_url?: string;
    calculation_date: string;
    monthly_data?: number[]; // Monatliche kWh-Werte (Jan-Dez)
    monthly_radiation?: number[]; // Monatliche Strahlungswerte (kWh/m²)
    assumptions: {
      losses_percent: number;
      m2_per_kwp: number;
      co2_factor: number;
      kwp?: number;
      annual_radiation?: string;
      // Neue realistische Annahmen
      panel_efficiency?: number;      // Modulwirkungsgrad (15-22%)
      inverter_efficiency?: number;   // Wechselrichterwirkungsgrad (95-98%)
      temperature_losses?: number;    // Temperaturverluste (3-8%)
      soiling_losses?: number;        // Verschmutzungsverluste (2-5%)
      shading_losses?: number;        // Verschattungsverluste (0-10%)
      wiring_losses?: number;         // Leitungsverluste (1-3%)
    };
  };
}
