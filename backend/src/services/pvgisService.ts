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

  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse | null> {
    try {
      console.log(`PVGIS-Service: Rufe Solar-Daten ab für lat=${lat}, lng=${lng}`);
      
      const pvgisUrl = new URL('https://re.jrc.ec.europa.eu/api/v5_2/PVcalc');
      pvgisUrl.searchParams.set('lat', lat.toString());
      pvgisUrl.searchParams.set('lon', lng.toString());
      pvgisUrl.searchParams.set('angle', tilt.toString());
      pvgisUrl.searchParams.set('aspect', azimuth.toString());
      pvgisUrl.searchParams.set('loss', '14'); 
      pvgisUrl.searchParams.set('outputformat', 'json');
      pvgisUrl.searchParams.set('pvtechchoice', 'crystSi'); 
      pvgisUrl.searchParams.set('mountingplace', 'building'); 
      pvgisUrl.searchParams.set('raddatabase', 'PVGIS-SARAH2');
      // Optimierungen für schnellere Antworten
      pvgisUrl.searchParams.set('usehorizon', '0'); // Keine Horizon-Berechnung
      pvgisUrl.searchParams.set('horizon', '0'); // Keine Horizon-Daten
      
      const m2_per_kwp = 6.5;
      const kwp = area / m2_per_kwp;
      pvgisUrl.searchParams.set('peakpower', kwp.toFixed(2));
      
      console.log(` PVGIS-Request: ${pvgisUrl.toString()}`);
      console.log(` Teste diese URL im Browser: ${pvgisUrl.toString()}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 Sekunden Timeout
      
      const response = await fetch(pvgisUrl.toString(), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(` PVGIS HTTP ${response.status}: ${response.statusText}`);
        console.error(` PVGIS Error Details: ${errorText}`);
        throw new Error(`PVGIS HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(` PVGIS Response erhalten (${JSON.stringify(data).length} Zeichen)`);
      
      if (data.outputs && data.outputs.totals && data.outputs.totals.fixed) {
        const annual_kWh = Math.round(data.outputs.totals.fixed.E_y); 
        const co2_saved = Math.round(annual_kWh * 0.5); 
        const efficiency = Math.round((annual_kWh / (area * 1000)) * 100); 
        
        let annual_radiation = null;
        let monthly_data = null;
        
        if (data.outputs && data.outputs.monthly && data.outputs.monthly.fixed) {
          monthly_data = data.outputs.monthly.fixed.map((month: any) => {
            return Math.round(month.E_m || 0);
          });
          console.log(` Monatliche Daten extrahiert (${monthly_data.length} Monate)`);
          
          const totalMonthlyRadiation = monthly_data.reduce((sum: number, val: number) => sum + val, 0);
          annual_radiation = (totalMonthlyRadiation / area).toFixed(1);
        } else {
          console.log(` Keine monatlichen Daten von PVGIS, generiere Schätzung`);
          const monthlyDistribution = [
            0.04, 0.06, 0.10, 0.14, 0.16, 0.18, 
            0.20, 0.18, 0.14, 0.10, 0.06, 0.04  
          ];
          monthly_data = monthlyDistribution.map(ratio => Math.round(annual_kWh * ratio));
          annual_radiation = (annual_kWh / area).toFixed(1);
        }
        
        console.log(` PVGIS erfolgreich: ${annual_kWh} kWh pro Jahr`);
        
        return {
          annual_kWh: annual_kWh,
          co2_saved: co2_saved,
          efficiency: efficiency,
          timestamp: new Date().toISOString(),
          source: 'pvgis',
          metadata: {
            pvgis_url: pvgisUrl.toString(),
            calculation_date: new Date().toISOString(),
            monthly_data: monthly_data,
            assumptions: {
              losses_percent: 14,
              m2_per_kwp: m2_per_kwp,
              co2_factor: 0.5,
              kwp: kwp,
              annual_radiation: annual_radiation
            }
          }
        };
      }
      
      console.log(` PVGIS Response hat keine outputs.totals.fixed:`, data);
      return null;
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error(' PVGIS-API-Timeout nach 15 Sekunden');
      } else {
        console.error(' PVGIS-API-Fehler:', error);
      }
      return null;
    }
  }
}

export const pvgisService = PVGISService.getInstance();
