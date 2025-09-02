import React, { useState, useEffect, useMemo } from 'react';
import ChartContainer from './ChartContainer';
import CalculationInfo from './CalculationInfo';

export default function SolarResults({ solarData, onShowDetails }) {
  const [isCalculationInfoOpen, setIsCalculationInfoOpen] = useState(false);

  // Schließe die Berechnungsdetails, wenn sich die solarData ändert
  useEffect(() => {
    setIsCalculationInfoOpen(false);
  }, [solarData]);

  // Erstelle einen eindeutigen Key basierend auf allen relevanten Daten
  const calculationInfoKey = useMemo(() => {
    if (!solarData) return 'no-data';
    return `calc-${solarData.inputs?.lat}-${solarData.inputs?.lng}-${solarData.inputs?.area}-${solarData.inputs?.tilt}-${solarData.inputs?.azimuth}-${solarData.yield?.annual_kWh}-${solarData.cache?.source}`;
  }, [solarData]);
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
                <div style={{ marginTop: '4px' }}>
                  {solarData.cache?.metadata?.pvgis_url ? (
                    <a 
                      href={solarData.cache.metadata.pvgis_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#3182ce',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#ebf8ff',
                        border: '1px solid #bee3f8',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dbeafe';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ebf8ff';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      🔗 PVGIS API
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>↗</span>
                    </a>
                  ) : solarData.cache?.metadata?.nasa_power_url ? (
                    <a 
                      href={solarData.cache.metadata.nasa_power_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#3182ce',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#ebf8ff',
                        border: '1px solid #bee3f8',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dbeafe';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#ebf8ff';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      🚀 NASA POWER API
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>↗</span>
                    </a>
                  ) : (
                    <span style={{ color: '#2d3748', fontWeight: '600' }}>
                      {solarData.cache?.source || 'N/A'}
                    </span>
                  )}
                </div>
                {solarData.cache?.metadata?.pvgis_url || solarData.cache?.metadata?.nasa_power_url ? (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b', 
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    Klicken Sie auf den Link, um die ursprüngliche API-Antwort zu überprüfen
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Berechnungsdetails */}
      <CalculationInfo 
        key={calculationInfoKey}
        solarData={solarData}
        isOpen={isCalculationInfoOpen}
        onToggle={() => setIsCalculationInfoOpen(!isCalculationInfoOpen)}
        inputs={solarData?.inputs}
      />
      
      {/* Charts */}
      <ChartContainer 
        solarData={solarData} 
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
