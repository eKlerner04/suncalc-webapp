import React from 'react';
import ChartContainer from './ChartContainer';

export default function SolarResults({ solarData, timeUnit, setTimeUnit, onShowDetails }) {
  return (
    <div style={{ 
      marginTop: '48px', 
      padding: '32px', 
      backgroundColor: '#f7fafc', 
      borderRadius: '20px',
      width: '100%',
      boxSizing: 'border-box',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#2d3748',
        margin: '0 0 24px 0',
        textAlign: 'center'
      }}>
        Berechnete Solar-Daten
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
      }}>
        <div>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#4a5568',
            margin: '0 0 16px 0'
          }}>
            Eingabeparameter
          </h4>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Breitengrad:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.inputs.lat}°
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Längengrad:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.inputs.lng}°
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Dachfläche:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.inputs.area} m²
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Dachneigung:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.inputs.tilt}°
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#718096', fontWeight: '500' }}>Ausrichtung:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.inputs.azimuth}°
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#4a5568',
            margin: '0 0 16px 0'
          }}>
            Ergebnisse
          </h4>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Jährlicher Ertrag:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.yield?.annual_kWh?.toFixed(1) || 'N/A'} kWh
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Monatlicher Ø:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.yield?.annual_kWh ? (solarData.yield.annual_kWh / 12).toFixed(1) : 'N/A'} kWh
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#718096', fontWeight: '500' }}>Datenquelle:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.cache?.source || 'Unbekannt'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Neue Sektion für Strahlungswerte */}
      {solarData.radiation && (
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#4a5568',
            margin: '0 0 16px 0'
          }}>
            Strahlungswerte
          </h4>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              fontSize: '0.875rem'
            }}>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>DNI (Direkt):</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.radiation.dni?.toFixed(1) || 'N/A'} kWh/m²/Jahr
                </div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '2px' }}>
                  Direct Normal Irradiation
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>GHI (Global):</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.radiation.ghi?.toFixed(1) || 'N/A'} kWh/m²/Jahr
                </div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '2px' }}>
                  Global Horizontal Irradiation
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>DIF (Diffus):</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.radiation.dif?.toFixed(1) || 'N/A'} kWh/m²/Jahr
                </div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '2px' }}>
                  Diffuse Horizontal Irradiation
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Gesamt (Geneigt):</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.radiation.annual_total?.toFixed(1) || 'N/A'} kWh/m²/Jahr
                </div>
                <div style={{ color: '#a0aec0', fontSize: '0.75rem', marginTop: '2px' }}>
                  Auf geneigte Fläche
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Neue Sektion: Map Data (Standort-Strahlungswerte) */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#4a5568',
          margin: '0 0 16px 0'
        }}>
          🗺️ Map Data (Standort-Strahlung)
        </h4>
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #0ea5e9',
          borderLeft: '4px solid #0ea5e9'
        }}>
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0f2fe'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#0369a1', 
              fontSize: '0.875rem',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              <strong>Info:</strong> Diese Werte zeigen die Strahlung direkt am Standort, 
              unabhängig von Dachneigung und Ausrichtung. Sie stammen von Satellitendaten 
              und meteorologischen Modellen.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            fontSize: '0.875rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e0f2fe',
              textAlign: 'center'
            }}>
              <div style={{ color: '#0ea5e9', fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
                DNI
              </div>
              <div style={{ color: '#2d3748', fontWeight: '600', fontSize: '1.125rem', marginBottom: '4px' }}>
                {solarData.radiation?.dni?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                kWh/m²/Jahr
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                Direct Normal
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e0f2fe',
              textAlign: 'center'
            }}>
              <div style={{ color: '#0ea5e9', fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
                GHI
              </div>
              <div style={{ color: '#2d3748', fontWeight: '600', fontSize: '1.125rem', marginBottom: '4px' }}>
                {solarData.radiation?.ghi?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                kWh/m²/Jahr
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                Global Horizontal
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e0f2fe',
              textAlign: 'center'
            }}>
              <div style={{ color: '#0ea5e9', fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
                DIF
              </div>
              <div style={{ color: '#2d3748', fontWeight: '600', fontSize: '1.125rem', marginBottom: '4px' }}>
                {solarData.radiation?.dif?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                kWh/m²/Jahr
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>
                Diffuse
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0f2fe'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#64748b', 
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              <strong>Quelle:</strong> {solarData.cache?.source === 'pvgis' ? 'PVGIS (EU Joint Research Centre)' : 
              solarData.cache?.source === 'nasa_power' ? 'NASA POWER (Satellitendaten)' : 
              'Lokale Berechnung'} • 
              <strong>Standort:</strong> {solarData.inputs.lat}°, {solarData.inputs.lng}°
            </p>
          </div>
        </div>
      </div>
      
      {/* Toggle-Switch für Tag/Jahr */}
      <div style={{ 
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <label style={{ 
          marginRight: '16px', 
          fontWeight: '600',
          color: '#4a5568',
          fontSize: '0.875rem'
        }}>
          Zeiteinheit:
        </label>
        <div style={{ 
          display: 'inline-flex', 
          backgroundColor: '#e2e8f0', 
          borderRadius: '24px', 
          padding: '4px',
          cursor: 'pointer'
        }}>
          <button
            onClick={() => setTimeUnit('day')}
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: timeUnit === 'day' ? '#3182ce' : 'transparent',
              color: timeUnit === 'day' ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontWeight: timeUnit === 'day' ? '600' : '500',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem'
            }}
          >
            Pro Tag
          </button>
          <button
            onClick={() => setTimeUnit('year')}
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: timeUnit === 'day' ? 'transparent' : '#3182ce',
              color: timeUnit === 'day' ? '#4a5568' : 'white',
              cursor: 'pointer',
              fontWeight: timeUnit === 'day' ? '500' : '600',
              transition: 'all 0.2s ease',
              fontSize: '0.875rem'
            }}
          >
            Pro Jahr
          </button>
        </div>
      </div>
      
      {/* Charts */}
      <ChartContainer 
        solarData={solarData} 
        timeUnit={timeUnit}
      />
      
      {/* Details-Button */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button
          onClick={onShowDetails}
          style={{
            padding: '16px 32px',
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(56, 161, 105, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(56, 161, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 14px rgba(56, 161, 105, 0.3)';
          }}
        >
          Detaillierte Analyse anzeigen
        </button>
      </div>
    </div>
  );
}
