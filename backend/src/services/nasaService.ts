import { PVGISResponse } from '../types/solar';

export class NASAService {
  private static instance: NASAService;

  private constructor() {}

  public static getInstance(): NASAService {
    if (!NASAService.instance) {
      NASAService.instance = new NASAService();
    }
    return NASAService.instance;
  }

  // NASA POWER API aufrufen
  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse | null> {
    try {
      console.log(`🛰️ NASA POWER Service: Rufe Solar-Daten ab für lat=${lat}, lng=${lng}`);
      
      // NASA POWER API für Strahlungsdaten (korrigierte Parameter)
      // NASA POWER braucht min. 2 Grad Bereich für regionale API
      const latMin = (lat - 1).toFixed(6); // 1 Grad nach unten
      const latMax = (lat + 1).toFixed(6); // 1 Grad nach oben
      const lngMin = (lng - 1).toFixed(6); // 1 Grad nach links
      const lngMax = (lng + 1).toFixed(6); // 1 Grad nach rechts
      
      const nasaUrl = new URL('https://power.larc.nasa.gov/api/temporal/daily/regional');
      nasaUrl.searchParams.set('parameters', 'ALLSKY_SFC_SW_DWN'); // Alle Himmelsstrahlung
      nasaUrl.searchParams.set('community', 'RE');
      nasaUrl.searchParams.set('longitude-min', lngMin);
      nasaUrl.searchParams.set('longitude-max', lngMax);
      nasaUrl.searchParams.set('latitude-min', latMin);
      nasaUrl.searchParams.set('latitude-max', latMax);
      nasaUrl.searchParams.set('start', '20240101');
      nasaUrl.searchParams.set('end', '20241231');
      nasaUrl.searchParams.set('format', 'JSON');
      
      console.log(`🛰️ NASA POWER Request: ${nasaUrl.toString()}`);
      console.log(`🔍 Teste diese URL im Browser: ${nasaUrl.toString()}`);
      
      const response = await fetch(nasaUrl.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ NASA POWER HTTP ${response.status}: ${response.statusText}`);
        console.error(`❌ NASA POWER Error Details: ${errorText}`);
        throw new Error(`NASA POWER HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`📊 NASA POWER Response:`, JSON.stringify(data, null, 2));
      
      // NASA POWER Daten parsen
      if (data.features && data.features.length > 0) {
        // Nehme den ersten Feature (nächster Punkt zu den Koordinaten)
        const feature = data.features[0];
        if (feature.properties && feature.properties.parameter && feature.properties.parameter.ALLSKY_SFC_SW_DWN) {
          const dailyRadiation = feature.properties.parameter.ALLSKY_SFC_SW_DWN;
          
          // Summiere alle täglichen Strahlungswerte
          const annualRadiation = Object.values(dailyRadiation).reduce((sum: number, value: any) => {
            // Ignoriere ungültige Werte (-999)
            return value > -900 ? sum + value : sum;
          }, 0);
          
          // Strahlung zu kWh umrechnen (korrigiert)
          // NASA POWER gibt kWh/m²/Tag zurück, wir brauchen kWh/m²/Jahr
          const efficiency = 0.15; // 15% Modul-Effizienz
          const annual_kWh = Math.round(annualRadiation * area * efficiency);
          
          console.log(`✅ NASA POWER erfolgreich: ${annual_kWh} kWh pro Jahr (Strahlung: ${annualRadiation.toFixed(1)} kWh/m²/Tag summiert)`);
          
          return {
            annual_kWh: annual_kWh,
            co2_saved: Math.round(annual_kWh * 0.5),
            efficiency: Math.round(efficiency * 100),
            timestamp: new Date().toISOString(),
            source: 'nasa_power',
            metadata: {
              nasa_power_url: nasaUrl.toString(),
              calculation_date: new Date().toISOString(),
              assumptions: {
                losses_percent: 20, // Höhere Verluste bei NASA POWER
                m2_per_kwp: 6.5,
                co2_factor: 0.5,
                annual_radiation: annualRadiation.toFixed(1)
              }
            }
          };
        }
      }
      
      console.log(`⚠️ NASA POWER Response hat keine ALLSKY_SFC_SW_DWN in features:`, data);
      return null;
      
    } catch (error) {
      console.error('❌ NASA POWER API-Fehler:', error);
      return null;
    }
  }
}

// Singleton-Instanz exportieren
export const nasaService = NASAService.getInstance();
