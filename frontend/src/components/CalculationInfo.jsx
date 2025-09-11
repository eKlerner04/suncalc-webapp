import React from 'react';

const CalculationInfo = ({ solarData, isOpen, onToggle, inputs }) => {
  if (!solarData || !inputs) return null;

  // DIREKT aus Props extrahieren - keine Zwischenspeicherung
  // Prüfe sowohl cache.source als auch die ursprüngliche Quelle in den gecachten Daten
  const cacheSource = solarData?.cache?.source || 'unbekannt';
  const originalSource = solarData?.cache?.solarData?.source || solarData?.source || 'unbekannt';
  
  // Verwende die ursprüngliche Quelle für die Berechnungsdetails, auch wenn sie aus dem Cache kommt
  const dataSource = cacheSource === 'local' ? originalSource : cacheSource;
  const isPVGIS = dataSource === 'pvgis';
  const isNASA = dataSource === 'nasa_power';

  // Alle Werte DIREKT aus inputs Props extrahieren (UI-Eingabeparameter)
  const currentLat = inputs.lat || 0;
  const currentLng = inputs.lng || 0;
  const currentArea = inputs.area || 15;
  const currentTilt = inputs.tilt || 35;
  const currentAzimuth = inputs.azimuth || 180;
  const currentAnnualKWh = solarData?.yield?.annual_kWh || 0;





  // PVGIS Azimut-Konvertierung für Anzeige
  const pvgisAzimuth = (() => {
    let pvgisAz = currentAzimuth - 180;
    if (pvgisAz > 180) pvgisAz -= 360;
    if (pvgisAz < -180) pvgisAz += 360;
    if (pvgisAz === -180) pvgisAz = 180; // Spezialfall für Nord
    return pvgisAz;
  })();

  // Berechnungen für Beispiel
  const kwPerM2 = 0.22; // kWp pro m²
  const pStc = currentArea * kwPerM2; // kWp
  const yf = currentAnnualKWh / pStc; // kWh/kWp·a

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Info-Button */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          color: '#475569',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F1F5F9';
          e.target.style.borderColor = '#CBD5E1';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#F8FAFC';
          e.target.style.borderColor = '#E2E8F0';
        }}
      >
        <span style={{ fontSize: '16px' }}></span>
        Berechnungsdetails anzeigen
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px'
        }}>
          ▼
        </span>
      </button>

      {/* Info-Panel */}
      {isOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Header */}
          <div style={{ 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #F1F5F9'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#1E293B' 
            }}>
              Berechnungsdetails
            </h3>
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '14px', 
              color: '#64748B' 
            }}>
              Transparente Darstellung der verwendeten Formeln und Parameter
            </p>
          </div>

          {/* Zwei-Spalten-Layout */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Linke Spalte: Berechnungsformeln */}
            <div>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Formeln
              </h4>
              


              {/* Berechnungsformeln */}
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '16px',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                </div>
                
                {isPVGIS ? (
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '8px', 
                    padding: '16px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>1. Anlagenleistung P_STC</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        P_STC = Dachfläche × Leistungsdichte<br/>
                        P_STC = {solarData.inputs?.area} m² × 0.22 kW/m² = {((solarData.inputs?.area || 0) * 0.22).toFixed(2)} kWp
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>2. PVGIS-Abfrage</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        PVGIS Input: lat, lon, slope={solarData.inputs?.tilt}°, azimuth={(() => {
                          let pvgisAzimuth = (solarData.inputs?.azimuth || 0) - 180;
                          if (pvgisAzimuth > 180) pvgisAzimuth -= 360;
                          if (pvgisAzimuth < -180) pvgisAzimuth += 360;
                          return pvgisAzimuth;
                        })()}°<br/>
                        PVGIS Input: peak_power={((solarData.inputs?.area || 0) * 0.22).toFixed(2)} kWp, system_loss=14%<br/>
                        PVGIS Output: E_y = {solarData.yield?.annual_kWh || 'N/A'} kWh/Jahr (absoluter Ertrag)
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>3. Spezifischer Ertrag Y_f</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        Y_f = E_y ÷ P_STC [kWh/kWp·a]<br/>
                        Y_f = {currentAnnualKWh} ÷ {pStc.toFixed(2)} = {yf.toFixed(0)} kWh/kWp·a
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>4. CO2-Einsparung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        CO2 = E_y × Grid-Faktor [kg]<br/>
                        CO2 = {currentAnnualKWh} × 0.5 = {Math.round(currentAnnualKWh * 0.5)} kg CO2/Jahr
                      </div>
                    </div>
                  </div>
                ) : isNASA ? (
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '8px', 
                    padding: '16px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>1. NASA POWER API-Abfrage</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        NASA POWER Input: lat={currentLat}, lon={currentLng}<br/>
                        NASA POWER Output: Solarstrahlung (kWh/m²/Jahr)
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>2. Anlagenleistung P_STC</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        P_STC = Dachfläche × Leistungsdichte<br/>
                        P_STC = {currentArea} m² × 0.22 kW/m² = {pStc.toFixed(2)} kWp
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>3. Ertragsberechnung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        E_y = Solarstrahlung × P_STC × Systemeffizienz<br/>
                        E_y = NASA_Strahlung × {pStc.toFixed(2)} × 0.85 = {currentAnnualKWh} kWh/Jahr
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>4. CO2-Einsparung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        CO2 = E_y × Grid-Faktor [kg]<br/>
                        CO2 = {currentAnnualKWh} × 0.5 = {Math.round(currentAnnualKWh * 0.5)} kg CO2/Jahr
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    borderRadius: '8px', 
                    padding: '16px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>1. Fallback-Berechnung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        Basis-Strahlung = f(Breitengrad, Dachneigung, Ausrichtung)<br/>
                        Breitengrad-Faktor = cos(|{currentLat}| × π/180)<br/>
                        Dachneigung-Faktor = cos(({currentTilt} - 30) × π/180)
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>2. Anlagenleistung P_STC</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        P_STC = Dachfläche × Leistungsdichte<br/>
                        P_STC = {currentArea} m² × 0.22 kW/m² = {pStc.toFixed(2)} kWp
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>3. Ertragsberechnung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        E_y = Basis-Strahlung × Faktoren × P_STC × Effizienz<br/>
                        E_y = {solarData?.cache?.solarData?.metadata?.assumptions?.base_radiation || 1200} × {pStc.toFixed(2)} × 0.20 × 0.85 = {currentAnnualKWh} kWh/Jahr
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>4. CO2-Einsparung</div>
                      <div style={{ 
                        backgroundColor: '#FFFFFF', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        border: '1px solid #E2E8F0'
                      }}>
                        CO2 = E_y × Grid-Faktor [kg]<br/>
                        CO2 = {currentAnnualKWh} × 0.5 = {Math.round(currentAnnualKWh * 0.5)} kg CO2/Jahr
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rechte Spalte: Beispielrechnung */}
            <div>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Beispielrechnung für deinen Standort
              </h4>
              
              {isPVGIS ? (
                <div style={{ 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  padding: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 1: P_STC berechnen</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      P_STC = {currentArea} m² × 0.22 kW/m² = {pStc.toFixed(2)} kWp
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 2: PVGIS-Abfrage</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      PVGIS: slope={currentTilt}°, azimuth={pvgisAzimuth}°<br/>
                      PVGIS: peak_power={pStc.toFixed(2)} kWp<br/>
                      PVGIS Output: E_y = {currentAnnualKWh} kWh/Jahr
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 3: Spezifischer Ertrag</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      Y_f = E_y ÷ P_STC [kWh/kWp·a]<br/>
                      Y_f = {currentAnnualKWh} ÷ {pStc.toFixed(2)} = {yf.toFixed(0)} kWh/kWp·a
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 4: Monatswerte</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      E_m[1..12] = PVGIS monatliche kWh<br/>
                      Anteil_m[%] = 100 × E_m ÷ E_y
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 5: CO2-Einsparung</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      CO2 = E_y × Grid-Faktor<br/>
                      CO2 = {solarData.yield?.annual_kWh || 0} × 0.5 = {Math.round((solarData.yield?.annual_kWh || 0) * 0.5)} kg CO2/Jahr
                    </div>
                  </div>
                </div>
              ) : isNASA ? (
                <div style={{ 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  padding: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 1: NASA POWER API</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      NASA POWER: lat={currentLat}, lon={currentLng}<br/>
                      Output: Solarstrahlung = {solarData?.cache?.solarData?.metadata?.assumptions?.base_radiation || 1200} kWh/m²/Jahr
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 2: P_STC berechnen</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      P_STC = {currentArea} m² × 0.22 kW/m² = {pStc.toFixed(2)} kWp
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 3: Ertrag berechnen</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      E_y = Strahlung × P_STC × Effizienz<br/>
                      E_y = {solarData?.cache?.solarData?.metadata?.assumptions?.base_radiation || 1200} × {pStc.toFixed(2)} × 0.85 = {currentAnnualKWh} kWh/Jahr
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 4: CO2-Einsparung</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      CO2 = E_y × Grid-Faktor<br/>
                      CO2 = {currentAnnualKWh} × 0.5 = {Math.round(currentAnnualKWh * 0.5)} kg CO2/Jahr
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  padding: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 1: Fallback-Berechnung</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      Basis-Strahlung = {solarData?.cache?.solarData?.metadata?.assumptions?.base_radiation || 1200} kWh/m²/Jahr<br/>
                      Breitengrad-Faktor = {solarData?.cache?.solarData?.metadata?.assumptions?.latitude_factor?.toFixed(2) || '0.85'}<br/>
                      Dachneigung-Faktor = {solarData?.cache?.solarData?.metadata?.assumptions?.tilt_factor?.toFixed(2) || '0.95'}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 2: P_STC berechnen</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      P_STC = {currentArea} m² × 0.22 kW/m² = {pStc.toFixed(2)} kWp
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 3: Ertrag berechnen</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      E_y = Basis × Faktoren × P_STC × Effizienz<br/>
                      E_y = {solarData?.cache?.solarData?.metadata?.assumptions?.base_radiation || 1200} × {pStc.toFixed(2)} × 0.20 × 0.85 = {currentAnnualKWh} kWh/Jahr
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Schritt 4: CO2-Einsparung</div>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid #E2E8F0'
                    }}>
                      CO2 = E_y × Grid-Faktor<br/>
                      CO2 = {currentAnnualKWh} × 0.5 = {Math.round(currentAnnualKWh * 0.5)} kg CO2/Jahr
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      )}
    </div>
  );
};

export default CalculationInfo;