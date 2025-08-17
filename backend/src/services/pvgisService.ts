import { PVGISResponse } from '../types/solar';

export class PVGISService {
  private static instance: PVGISService;

  private constructor() {}

  public static getInstance(): PVGISService {
    if (!PVGISService.instance) {
      PVGISService.instance = new PVGISService();
    }
    return PVGISService.instance;
  }

  // PVGIS-API aufrufen
  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse | null> {
    try {
      console.log(`🌞 PVGIS-Service: Rufe Solar-Daten ab für lat=${lat}, lng=${lng}`);
      
      // PVGIS-URL mit korrigierten Parametern
      const pvgisUrl = new URL('https://re.jrc.ec.europa.eu/api/v5_2/PVcalc');
      pvgisUrl.searchParams.set('lat', lat.toString());
      pvgisUrl.searchParams.set('lon', lng.toString());
      pvgisUrl.searchParams.set('angle', tilt.toString());
      pvgisUrl.searchParams.set('aspect', azimuth.toString());
      pvgisUrl.searchParams.set('loss', '14'); // 14% Verluste (Standard)
      pvgisUrl.searchParams.set('outputformat', 'json');
      pvgisUrl.searchParams.set('pvtechchoice', 'crystSi'); // Kristalline Silizium-Module
      pvgisUrl.searchParams.set('mountingplace', 'building'); // Gebäude-Montage
      pvgisUrl.searchParams.set('raddatabase', 'PVGIS-SARAH2'); // Beste Strahlungsdaten
      
      // WICHTIG: peakpower Parameter hinzufügen (in kWp)
      const m2_per_kwp = 6.5; // Standard: 6.5 m² pro kWp
      const kwp = area / m2_per_kwp;
      pvgisUrl.searchParams.set('peakpower', kwp.toFixed(2));
      
      console.log(`📡 PVGIS-Request: ${pvgisUrl.toString()}`);
      console.log(`🔍 Teste diese URL im Browser: ${pvgisUrl.toString()}`);
      
      const response = await fetch(pvgisUrl.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ PVGIS HTTP ${response.status}: ${response.statusText}`);
        console.error(`❌ PVGIS Error Details: ${errorText}`);
        throw new Error(`PVGIS HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`📊 PVGIS Response:`, JSON.stringify(data, null, 2));
      
      // PVGIS-Daten parsen
      if (data.outputs && data.outputs.totals && data.outputs.totals.fixed) {
        const annual_kWh = Math.round(data.outputs.totals.fixed.E_y); // Jährliche kWh direkt
        const co2_saved = Math.round(annual_kWh * 0.5); // 0.5 kg CO2 pro kWh
        const efficiency = Math.round((annual_kWh / (area * 1000)) * 100); // Effizienz in %
        
        console.log(`✅ PVGIS erfolgreich: ${annual_kWh} kWh pro Jahr`);
        
        return {
          annual_kWh: annual_kWh,
          co2_saved: co2_saved,
          efficiency: efficiency,
          timestamp: new Date().toISOString(),
          source: 'pvgis',
          metadata: {
            pvgis_url: pvgisUrl.toString(),
            calculation_date: new Date().toISOString(),
            assumptions: {
              losses_percent: 14,
              m2_per_kwp: m2_per_kwp,
              co2_factor: 0.5,
              kwp: kwp,
              annual_radiation: (data.outputs.totals.fixed.E_y / (area * 1000)).toFixed(1)
            }
          }
        };
      }
      
      console.log(`⚠️ PVGIS Response hat keine outputs.totals.fixed:`, data);
      return null;
      
    } catch (error) {
      console.error('❌ PVGIS-API-Fehler:', error);
      return null;
    }
  }
}

// Singleton-Instanz exportieren
export const pvgisService = PVGISService.getInstance();
