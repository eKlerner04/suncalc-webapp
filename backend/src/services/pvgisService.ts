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
      
      // Zuerst hole ich die Strahlungsdaten (DNI, GHI, DIF)
      const radiationData = await this.getRadiationData(lat, lng);
      
      // Falls keine Strahlungsdaten von der API kommen, verwende Fallback
      const finalRadiationData = radiationData || this.calculateFallbackRadiation(lat);
      
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
      
      const m2_per_kwp = 6.5;
      const kwp = area / m2_per_kwp;
      pvgisUrl.searchParams.set('peakpower', kwp.toFixed(2));
      
      console.log(` PVGIS-Request: ${pvgisUrl.toString()}`);
      console.log(` Teste diese URL im Browser: ${pvgisUrl.toString()}`);
      
      const response = await fetch(pvgisUrl.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(` PVGIS HTTP ${response.status}: ${response.statusText}`);
        console.error(` PVGIS Error Details: ${errorText}`);
        throw new Error(`PVGIS HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(` PVGIS Response:`, JSON.stringify(data, null, 2));
      
      if (data.outputs && data.outputs.totals && data.outputs.totals.fixed) {
        // Realistische Berechnung mit verbesserten Annahmen
        const panelEfficiency = 0.20; // 20% Modulwirkungsgrad (realistisch für moderne Module)
        const inverterEfficiency = 0.96; // 96% Wechselrichterwirkungsgrad
        const temperatureLosses = 0.05; // 5% Temperaturverluste
        const soilingLosses = 0.03; // 3% Verschmutzungsverluste
        const shadingLosses = 0.02; // 2% Verschattungsverluste (konservativ)
        const wiringLosses = 0.02; // 2% Leitungsverluste
        
        // Gesamtverluste berechnen
        const totalLosses = 1 - (
          (1 - temperatureLosses) * 
          (1 - soilingLosses) * 
          (1 - shadingLosses) * 
          (1 - wiringLosses)
        );
        
        // Systemwirkungsgrad
        const systemEfficiency = panelEfficiency * inverterEfficiency * (1 - totalLosses);
        
        // Strahlung auf geneigte Fläche berechnen
        let annualRadiation = 0;
        if (finalRadiationData) {
          // Berechne Strahlung auf geneigte Fläche basierend auf DNI, GHI, DIF
          annualRadiation = this.calculateTiltedRadiation(
            finalRadiationData.ghi || 0,
            finalRadiationData.dni || 0,
            finalRadiationData.dif || 0,
            tilt,
            azimuth,
            lat
          );
        } else {
          // Fallback: Verwende PVGIS-Daten
          annualRadiation = data.outputs.totals.fixed.H_i || 1000; // kWh/m²/Jahr
        }
        
        // Jährlichen Ertrag berechnen
        const annual_kWh = Math.round(annualRadiation * area * systemEfficiency);
        const co2_saved = Math.round(annual_kWh * 0.5); 
        const efficiency = Math.round(systemEfficiency * 100);
        
        let monthly_data = null;
        let monthly_radiation = null;
        
        if (data.outputs && data.outputs.monthly && data.outputs.monthly.fixed) {
          monthly_data = data.outputs.monthly.fixed.map((month: any) => {
            const monthly_kWh = month.E_m || 0;
            console.log(` Monat ${month.month}: ${monthly_kWh} kWh`);
            return Math.round(monthly_kWh);
          });
          
          // Monatliche Strahlungswerte extrahieren
          monthly_radiation = data.outputs.monthly.fixed.map((month: any) => {
            return Math.round(month.H_i || 0);
          });
          
          console.log(` Monatliche Daten extrahiert:`, monthly_data);
          console.log(` Monatliche Strahlungswerte:`, monthly_radiation);
        } else {
          console.log(` Keine monatlichen Daten von PVGIS, generiere Schätzung`);
          const monthlyDistribution = [
            0.04, 0.06, 0.10, 0.14, 0.16, 0.18, 
            0.20, 0.18, 0.14, 0.10, 0.06, 0.04  
          ];
          monthly_data = monthlyDistribution.map(ratio => Math.round(annual_kWh * ratio));
          monthly_radiation = monthlyDistribution.map(ratio => Math.round(annualRadiation * ratio));
          console.log(` Geschätzte monatliche Daten generiert:`, monthly_data);
        }
        
        console.log(` PVGIS erfolgreich: ${annual_kWh} kWh pro Jahr (Systemwirkungsgrad: ${(systemEfficiency * 100).toFixed(1)}%)`);
        
        return {
          annual_kWh: annual_kWh,
          co2_saved: co2_saved,
          efficiency: efficiency,
          timestamp: new Date().toISOString(),
          source: 'pvgis',
          radiation: {
            dni: finalRadiationData?.dni,
            ghi: finalRadiationData?.ghi,
            dif: finalRadiationData?.dif,
            annual_total: Math.round(annualRadiation)
          },
          metadata: {
            pvgis_url: pvgisUrl.toString(),
            calculation_date: new Date().toISOString(),
            monthly_data: monthly_data,
            monthly_radiation: monthly_radiation,
            assumptions: {
              losses_percent: Math.round(totalLosses * 100),
              m2_per_kwp: m2_per_kwp,
              co2_factor: 0.5,
              kwp: kwp,
              annual_radiation: annualRadiation.toFixed(1),
              panel_efficiency: Math.round(panelEfficiency * 100),
              inverter_efficiency: Math.round(inverterEfficiency * 100),
              temperature_losses: Math.round(temperatureLosses * 100),
              soiling_losses: Math.round(soilingLosses * 100),
              shading_losses: Math.round(shadingLosses * 100),
              wiring_losses: Math.round(wiringLosses * 100)
            }
          }
        };
      }
      
      console.log(` PVGIS Response hat keine outputs.totals.fixed:`, data);
      return null;
      
    } catch (error) {
      console.error(' PVGIS-API-Fehler:', error);
      return null;
    }
  }

  // Neue Methode: Strahlungsdaten von PVGIS abrufen
  private async getRadiationData(lat: number, lng: number): Promise<{
    dni?: number;
    ghi?: number;
    dif?: number;
  } | null> {
    try {
      const radiationUrl = new URL('https://re.jrc.ec.europa.eu/api/v5_2/DRcalc');
      radiationUrl.searchParams.set('lat', lat.toString());
      radiationUrl.searchParams.set('lon', lng.toString());
      radiationUrl.searchParams.set('outputformat', 'json');
      radiationUrl.searchParams.set('raddatabase', 'PVGIS-SARAH2');
      radiationUrl.searchParams.set('startyear', '2020');
      radiationUrl.searchParams.set('endyear', '2020');
      
      console.log(` Strahlungsdaten-Request: ${radiationUrl.toString()}`);
      
      const response = await fetch(radiationUrl.toString());
      if (!response.ok) {
        console.log(` Strahlungsdaten nicht verfügbar, verwende Fallback`);
        return null;
      }
      
      const data = await response.json();
      
      if (data.outputs && data.outputs.monthly) {
        // Berechne jährliche Durchschnittswerte
        let totalGHI = 0;
        let totalDNI = 0;
        let totalDIF = 0;
        let monthCount = 0;
        
        data.outputs.monthly.forEach((month: any) => {
          if (month.Hg) totalGHI += month.Hg;
          if (month.Hb) totalDNI += month.Hb;
          if (month.Hd) totalDIF += month.Hd;
          monthCount++;
        });
        
        if (monthCount > 0) {
          return {
            ghi: Math.round(totalGHI / monthCount),
            dni: Math.round(totalDNI / monthCount),
            dif: Math.round(totalDIF / monthCount)
          };
        }
      }
      
      return null;
    } catch (error) {
      console.log(` Fehler beim Abrufen der Strahlungsdaten:`, error);
      return null;
    }
  }

  // Neue Methode: Strahlung auf geneigte Fläche berechnen
  private calculateTiltedRadiation(ghi: number, dni: number, dif: number, tilt: number, azimuth: number, lat: number): number {
    // Vereinfachte Berechnung der Strahlung auf geneigte Fläche
    // Basierend auf dem Perez-Modell (vereinfacht)
    
    const tiltRad = (tilt * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    
    // Direkte Strahlung auf geneigte Fläche
    const dniTilted = dni * Math.cos(tiltRad);
    
    // Diffuse Strahlung auf geneigte Fläche (isotropes Modell)
    const difTilted = dif * (1 + Math.cos(tiltRad)) / 2;
    
    // Bodenreflexion (Albedo = 0.2 für typische Umgebung)
    const albedo = 0.2;
    const groundReflection = ghi * albedo * (1 - Math.cos(tiltRad)) / 2;
    
    // Gesamtstrahlung auf geneigte Fläche
    const totalTilted = dniTilted + difTilted + groundReflection;
    
    return Math.round(totalTilted);
  }

  // Neue Methode: Fallback-Strahlungsdaten generieren, falls PVGIS-API fehlschlägt
  private calculateFallbackRadiation(lat: number): { ghi?: number; dni?: number; dif?: number } {
    console.log(` PVGIS-Service: Verwende Fallback-Strahlungsdaten für lat=${lat}`);
    // Einfache Annahmen für Fallback (z.B. 1000 kWh/m²/Jahr)
    return {
      ghi: 1000,
      dni: 1000,
      dif: 1000
    };
  }
}

export const pvgisService = PVGISService.getInstance();
