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
                  {solarData.annual_kWh?.toFixed(1) || 'N/A'} kWh
                </div>
              </div>
              <div>
                <span style={{ color: '#718096', fontWeight: '500' }}>Monatlicher Ø:</span>
                <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                  {solarData.annual_kWh ? (solarData.annual_kWh / 12).toFixed(1) : 'N/A'} kWh
                </div>
              </div>
            </div>
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
