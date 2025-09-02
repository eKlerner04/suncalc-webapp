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
      // PVGIS Azimut: 0°=Süd, +90°=West, -90°=Ost, ±180°=Nord
      // Frontend: 0°=Nord, 90°=Ost, 180°=Süd, 270°=West (im Uhrzeigersinn)
      // Korrekte Umrechnung: pvgis_azimuth = (bearing_from_north_clockwise) - 180
      let pvgisAzimuth = azimuth - 180;
      // Normalisierung in [-180, +180] - aber PVGIS akzeptiert auch +180 für Nord
      if (pvgisAzimuth > 180) pvgisAzimuth -= 360;
      if (pvgisAzimuth < -180) pvgisAzimuth += 360;
      // Spezialfall: -180° zu +180° für Nord (PVGIS akzeptiert beide)
      if (pvgisAzimuth === -180) pvgisAzimuth = 180;
      console.log(` PVGIS Azimut Debug - Frontend: ${azimuth}° → PVGIS: ${pvgisAzimuth}°`);
      console.log(` PVGIS Azimut Interpretation - Frontend ${azimuth}° = ${azimuth === 0 ? 'Nord' : azimuth === 90 ? 'Ost' : azimuth === 180 ? 'Süd' : azimuth === 270 ? 'West' : 'Zwischenrichtung'}`);
      pvgisUrl.searchParams.set('aspect', pvgisAzimuth.toString());
      pvgisUrl.searchParams.set('loss', '14'); 
      pvgisUrl.searchParams.set('outputformat', 'json');
      pvgisUrl.searchParams.set('pvtechchoice', 'crystSi'); 
      pvgisUrl.searchParams.set('mountingplace', 'building'); 
      pvgisUrl.searchParams.set('raddatabase', 'PVGIS-SARAH2');
      // Horizon aktivieren für genauere Berechnungen
      pvgisUrl.searchParams.set('use_horizon', 'true');
      
      // Moderne Module: 0.20-0.24 kW/m² (≈ 4.2-5.0 m²/kWp)
      // Konservativ: 0.22 kW/m² für realistische Berechnung
      const kw_per_m2 = 0.22;
      const kwp = area * kw_per_m2;
      pvgisUrl.searchParams.set('peakpower', kwp.toFixed(2));
      
      console.log(` PVGIS-Request: ${pvgisUrl.toString()}`);
      console.log(` PVGIS Parameter Check - lat: ${lat}, lon: ${lng}, angle: ${tilt}, aspect: ${pvgisAzimuth}, peakpower: ${kwp.toFixed(2)}`);
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
        // Debug: Überprüfe alle verfügbaren Felder
        console.log(` PVGIS Debug - Verfügbare Felder:`, Object.keys(data.outputs.totals.fixed));
        console.log(` PVGIS Debug - E_y: ${data.outputs.totals.fixed.E_y}, H(i)_y: ${data.outputs.totals.fixed['H(i)_y']}, peak_power: ${kwp}`);
        
        // Modus A: PVGIS mit peak_power = P_STC → E_y ist absoluter Ertrag der Anlage
        const annual_kWh = Math.round(data.outputs.totals.fixed.E_y);
        const co2_saved = Math.round(annual_kWh * 0.5);
        // Spezifischer Ertrag Y_f = E_y / P_STC
        const specific_yield = Math.round(annual_kWh / kwp);
        
        // Plausibilitätsprüfung
        console.log(` PVGIS Plausibilität - Y_f: ${specific_yield} kWh/kWp·a (erwartet: 900-1150 für DE Süd)`);
        
        // Sanity-Check für Azimut-Mapping
        if (pvgisAzimuth === 0 && specific_yield < 800) {
          console.warn(` ⚠️  UNPLAUSIBEL: Süd (azimuth=0°) hat nur ${specific_yield} kWh/kWp·a - Azimut-Mapping könnte falsch sein!`);
        }
        if (Math.abs(pvgisAzimuth) === 180 && specific_yield > 800) {
          console.warn(` ⚠️  UNPLAUSIBEL: Nord (azimuth=±180°) hat ${specific_yield} kWh/kWp·a - sollte < 700 sein!`);
        } 
        
        let annual_radiation = null;
        let monthly_data = null;
        
        if (data.outputs && data.outputs.monthly && data.outputs.monthly.fixed) {
          // Modus A: PVGIS mit peak_power = P_STC → E_m sind absolute monatliche Erträge der Anlage
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
          efficiency: specific_yield, // Spezifischer Ertrag in kWh/kWp·a
          timestamp: new Date().toISOString(),
          source: 'pvgis',
          metadata: {
            pvgis_url: pvgisUrl.toString(),
            calculation_date: new Date().toISOString(),
            monthly_data: monthly_data,
            assumptions: {
              losses_percent: 14,
              kw_per_m2: kw_per_m2,
              p_stc_kwp: kwp,
              co2_factor: 0.5,
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
