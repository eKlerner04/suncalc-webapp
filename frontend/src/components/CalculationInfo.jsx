import React, { useState } from 'react';

const CalculationInfo = ({ solarData }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!solarData) return null;

  const dataSource = solarData?.cache?.source || solarData?.source || 'unbekannt';
  const isPVGIS = dataSource === 'pvgis';
  const isNASA = dataSource === 'nasa_power';

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Info-Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '6px',
          color: '#0369A1',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#E0F2FE';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#F0F9FF';
        }}
      >
        <span style={{ fontSize: '16px' }}>ℹ️</span>
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
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '12px',
          fontSize: '14px',
          lineHeight: '1.6',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1F2937', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Berechnungsdetails
            </h4>
          </div>
          
          {/* Linke Spalte */}
          <div>
            {/* Datenquelle */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Datenquelle: {isPVGIS ? 'PVGIS API' : isNASA ? 'NASA POWER API' : dataSource}
              </h5>
              <p style={{ color: '#6B7280', fontSize: '13px' }}>
                {isPVGIS ? (
                  'PVGIS (Photovoltaic Geographical Information System) der Europäischen Kommission - basierend auf historischen Strahlungsmessungen'
                ) : isNASA ? (
                  'NASA POWER (Prediction of Worldwide Energy Resources) - basierend auf Satellitendaten und Wettermodellen'
                ) : (
                  'Unbekannte Datenquelle'
                )}
              </p>
            </div>

            {/* Eingabeparameter */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Eingabeparameter
              </h5>
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px', 
                padding: '16px',
                fontSize: '13px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><strong>Standort:</strong> {solarData.inputs?.lat}°, {solarData.inputs?.lng}°</div>
                  <div><strong>Dachfläche:</strong> {solarData.inputs?.area} m²</div>
                  <div><strong>Dachneigung:</strong> {solarData.inputs?.tilt}°</div>
                  <div><strong>Ausrichtung:</strong> {solarData.inputs?.azimuth}°</div>
                </div>
              </div>
            </div>

            {/* Berechnungsformeln */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontWeight: '600', color: '#374151', marginBottom: '12px', fontSize: '15px' }}>
                Berechnungsformeln
              </h5>
            
            {isPVGIS ? (
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px', 
                padding: '16px',
                fontSize: '13px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>1. Leistungsumrechnung</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    kWp = Dachfläche ÷ 6.5 m²/kWp<br/>
                    kWp = {solarData.inputs?.area} ÷ 6.5 = {(solarData.inputs?.area / 6.5).toFixed(2)} kWp
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>2. Jährlicher Ertrag</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    E_y = PVGIS API (data.outputs.totals.fixed.E_y)<br/>
                    E_y = {solarData.yield?.annual_kWh || 'N/A'} kWh/Jahr
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>3. Monatliche Erträge</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    E_m = PVGIS API (data.outputs.monthly.fixed[].E_m)<br/>
                    E_m = Echte monatliche Daten vom Standort
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>4. CO2-Einsparung</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    CO2 = E_y × 0.5 kg CO2/kWh<br/>
                    CO2 = {solarData.yield?.annual_kWh || 0} × 0.5 = {Math.round((solarData.yield?.annual_kWh || 0) * 0.5)} kg CO2/Jahr
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>5. Effizienz</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    η = (E_y ÷ (Fläche × 1000)) × 100%<br/>
                    η = ({solarData.yield?.annual_kWh || 0} ÷ ({solarData.inputs?.area} × 1000)) × 100 = {Math.round(((solarData.yield?.annual_kWh || 0) / ((solarData.inputs?.area || 1) * 1000)) * 100)}%
                  </div>
                </div>
              </div>
            ) : isNASA ? (
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '6px', 
                padding: '12px',
                fontSize: '13px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>1. Strahlungsdaten:</strong>
                  <div style={{ 
                    backgroundColor: '#F3F4F6', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    marginTop: '4px',
                    fontFamily: 'monospace'
                  }}>
                    GHI = NASA POWER (ALLSKY_SFC_SW_DWN)<br/>
                    GHI = Tägliche Strahlung in kWh/m²/Tag
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>2. Jährlicher Ertrag:</strong>
                  <div style={{ 
                    backgroundColor: '#F3F4F6', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    marginTop: '4px',
                    fontFamily: 'monospace'
                  }}>
                    E_y = Σ(GHI) × Fläche × η × 365<br/>
                    E_y = {solarData.yield?.annual_kWh || 'N/A'} kWh/Jahr
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <strong>3. Monatliche Verteilung:</strong>
                  <div style={{ 
                    backgroundColor: '#F3F4F6', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    marginTop: '4px',
                    fontFamily: 'monospace'
                  }}>
                    E_m = E_y × Verteilungsfaktor<br/>
                    E_m = Geschätzte monatliche Aufteilung
                  </div>
                </div>
                
                <div>
                  <strong>4. Verlustfaktoren:</strong>
                  <div style={{ 
                    backgroundColor: '#F3F4F6', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    marginTop: '4px',
                    fontFamily: 'monospace'
                  }}>
                    η = 15% (Wirkungsgrad)<br/>
                    Verluste = 20% (höher als PVGIS)
                  </div>
                </div>
              </div>
            ) : null}
          </div>

            {/* API-Parameter */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                API-Parameter
              </h5>
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px', 
                padding: '16px',
                fontSize: '13px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                {isPVGIS ? (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div><strong>Verluste:</strong> 14%</div>
                    <div><strong>Modultyp:</strong> Kristalline Silizium-Module (crystSi)</div>
                    <div><strong>Montage:</strong> Dachmontage (building)</div>
                    <div><strong>Datenbank:</strong> PVGIS-SARAH2</div>
                    <div><strong>Horizon:</strong> Deaktiviert (usehorizon=0)</div>
                  </div>
                ) : isNASA ? (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div><strong>Verluste:</strong> 20%</div>
                    <div><strong>Wirkungsgrad:</strong> 15%</div>
                    <div><strong>Datenquelle:</strong> Satellitendaten</div>
                    <div><strong>Zeitraum:</strong> 2024 (tägliche Daten)</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Rechte Spalte */}
          <div>
            {/* Beispielrechnung */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ fontWeight: '600', color: '#374151', marginBottom: '12px', fontSize: '15px' }}>
                Beispielrechnung für deinen Standort
              </h5>
              <div style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB', 
                borderRadius: '8px', 
                padding: '16px',
                fontSize: '13px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Schritt 1: Leistung berechnen</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    kWp = {solarData.inputs?.area} m² ÷ 6.5 m²/kWp = {(solarData.inputs?.area / 6.5).toFixed(2)} kWp
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Schritt 2: Jährlicher Ertrag (von API)</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    E_y = {solarData.yield?.annual_kWh || 'N/A'} kWh/Jahr
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Schritt 3: Monatlicher Durchschnitt</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    E_monatlich = {solarData.yield?.annual_kWh || 0} kWh ÷ 12 Monate = {((solarData.yield?.annual_kWh || 0) / 12).toFixed(1)} kWh/Monat
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Schritt 4: CO2-Einsparung</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    CO2 = {solarData.yield?.annual_kWh || 0} kWh × 0.5 kg CO2/kWh = {Math.round((solarData.yield?.annual_kWh || 0) * 0.5)} kg CO2/Jahr
                  </div>
                </div>
                
                <div>
                  <div style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Schritt 5: Flächeneffizienz</div>
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    η = {solarData.yield?.annual_kWh || 0} kWh ÷ ({solarData.inputs?.area} m² × 1000) × 100 = {Math.round(((solarData.yield?.annual_kWh || 0) / ((solarData.inputs?.area || 1) * 1000)) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Hinweise */}
            <div style={{ 
              backgroundColor: '#FEF3C7', 
              border: '1px solid #F59E0B', 
              borderRadius: '6px', 
              padding: '12px',
              fontSize: '13px'
            }}>
              <h6 style={{ fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>
                ⚠️ Wichtige Hinweise:
              </h6>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400E' }}>
                <li>Alle Werte sind Schätzungen basierend auf historischen Daten</li>
                <li>Reale Erträge können um ±10-20% abweichen</li>
                <li>Wetterbedingungen und Verschmutzung beeinflussen die Erträge</li>
                <li>CO2-Faktor von 0.5 kg/kWh ist ein Durchschnittswert</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationInfo;
