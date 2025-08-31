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

  async getSolarData(lat: number, lng: number, area: number, tilt: number, azimuth: number): Promise<PVGISResponse | null> {
    try {
      console.log(` NASA POWER Service: Rufe Solar-Daten ab für lat=${lat}, lng=${lng}`);
      
      // Erweiterte Parameter für bessere Strahlungsdaten
      const latMin = (lat - 1).toFixed(6);
      const latMax = (lat + 1).toFixed(6); 
      const lngMin = (lng - 1).toFixed(6); 
      const lngMax = (lng + 1).toFixed(6); 
      
      const nasaUrl = new URL('https://power.larc.nasa.gov/api/temporal/daily/regional');
      nasaUrl.searchParams.set('parameters', 'ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,ALLSKY_SFC_SW_DNI,ALLSKY_SFC_SW_DIF'); 
      nasaUrl.searchParams.set('community', 'RE');
      nasaUrl.searchParams.set('longitude-min', lngMin);
      nasaUrl.searchParams.set('longitude-max', lngMax);
      nasaUrl.searchParams.set('latitude-min', latMin);
      nasaUrl.searchParams.set('latitude-max', latMax);
      nasaUrl.searchParams.set('start', '20240101');
      nasaUrl.searchParams.set('end', '20241231');
      nasaUrl.searchParams.set('format', 'JSON');
      
      console.log(` NASA POWER Request: ${nasaUrl.toString()}`);
      console.log(` Teste diese URL im Browser: ${nasaUrl.toString()}`);
      
      const response = await fetch(nasaUrl.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(` NASA POWER HTTP ${response.status}: ${response.statusText}`);
        console.error(` NASA POWER Error Details: ${errorText}`);
        throw new Error(`NASA POWER HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`NASA POWER Response:`, JSON.stringify(data, null, 2));
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.properties && feature.properties.parameter) {
          const params = feature.properties.parameter;
          
          // Extrahiere verschiedene Strahlungswerte
          const allSkyRadiation = params.ALLSKY_SFC_SW_DWN || {};
          const clearSkyRadiation = params.CLRSKY_SFC_SW_DWN || {};
          const dniRadiation = params.ALLSKY_SFC_SW_DNI || {};
          const difRadiation = params.ALLSKY_SFC_SW_DIF || {};
          
          // Berechne jährliche Durchschnittswerte
          const annualGHI = this.calculateAnnualAverage(allSkyRadiation);
          const annualDNI = this.calculateAnnualAverage(dniRadiation);
          const annualDIF = this.calculateAnnualAverage(difRadiation);
          
          if (annualGHI > 0) {
            // Realistische Berechnung mit verbesserten Annahmen
            const panelEfficiency = 0.18; // 18% Modulwirkungsgrad (konservativ für NASA)
            const inverterEfficiency = 0.95; // 95% Wechselrichterwirkungsgrad
            const temperatureLosses = 0.06; // 6% Temperaturverluste (höher bei NASA)
            const soilingLosses = 0.04; // 4% Verschmutzungsverluste
            const shadingLosses = 0.03; // 3% Verschattungsverluste
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
            const annualRadiation = this.calculateTiltedRadiation(
              annualGHI,
              annualDNI,
              annualDIF,
              tilt,
              azimuth,
              lat
            );
            
            // Jährlichen Ertrag berechnen
            const annual_kWh = Math.round(annualRadiation * area * systemEfficiency);
            
            console.log(`✅ NASA POWER erfolgreich: ${annual_kWh} kWh pro Jahr (Systemwirkungsgrad: ${(systemEfficiency * 100).toFixed(1)}%)`);
            console.log(` Strahlungswerte: GHI=${annualGHI.toFixed(1)}, DNI=${annualDNI.toFixed(1)}, DIF=${annualDIF.toFixed(1)} kWh/m²/Jahr`);
            
            return {
              annual_kWh: annual_kWh,
              co2_saved: Math.round(annual_kWh * 0.5),
              efficiency: Math.round(systemEfficiency * 100),
              timestamp: new Date().toISOString(),
              source: 'nasa_power',
              radiation: {
                dni: Math.round(annualDNI),
                ghi: Math.round(annualGHI),
                dif: Math.round(annualDIF),
                annual_total: Math.round(annualRadiation)
              },
              metadata: {
                nasa_power_url: nasaUrl.toString(),
                calculation_date: new Date().toISOString(),
                monthly_data: this.generateMonthlyDistribution(annual_kWh),
                monthly_radiation: this.generateMonthlyRadiationDistribution(annualRadiation),
                assumptions: {
                  losses_percent: Math.round(totalLosses * 100),
                  m2_per_kwp: 6.5,
                  co2_factor: 0.5,
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
        }
      }
      
      console.log(`⚠️ NASA POWER Response hat keine gültigen Strahlungsdaten:`, data);
      return null;
      
    } catch (error) {
      console.error('❌ NASA POWER API-Fehler:', error);
      return null;
    }
  }

  // Neue Methode: Jährlichen Durchschnitt aus täglichen Werten berechnen
  private calculateAnnualAverage(dailyData: any): number {
    let total = 0;
    let count = 0;
    
    Object.values(dailyData).forEach((value: any) => {
      if (value > -900 && value !== null && value !== undefined) {
        total += value;
        count++;
      }
    });
    
    return count > 0 ? total / count : 0;
  }

  // Neue Methode: Strahlung auf geneigte Fläche berechnen (wie in PVGIS)
  private calculateTiltedRadiation(ghi: number, dni: number, dif: number, tilt: number, azimuth: number, lat: number): number {
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

  // Neue Methode: Monatliche Strahlungsverteilung generieren
  private generateMonthlyRadiationDistribution(annualRadiation: number): number[] {
    const monthlyDistribution = [
      0.05, 0.08, 0.12, 0.15, 0.18, 0.20, 
      0.22, 0.20, 0.15, 0.12, 0.08, 0.05  
    ];
    
    return monthlyDistribution.map(ratio => Math.round(annualRadiation * ratio));
  }

  private generateMonthlyDistribution(annual_kWh: number): number[] {
  
    const monthlyDistribution = [
      0.05, 0.08, 0.12, 0.15, 0.18, 0.20, 
      0.22, 0.20, 0.15, 0.12, 0.08, 0.05  
    ];
    
    return monthlyDistribution.map(ratio => Math.round(annual_kWh * ratio));
  }
}

// Singleton-Instanz exportieren
export const nasaService = NASAService.getInstance();
