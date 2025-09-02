import React from 'react';
import ChartContainer from './ChartContainer';

const SolarDetails = ({ solarData, inputs, onBack }) => {
  // Koordinaten in Grad/Minuten/Sekunden umrechnen
  const decimalToDMS = (decimal) => {
    const degrees = Math.floor(Math.abs(decimal));
    const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
    const seconds = Math.round(((Math.abs(decimal) - degrees - minutes / 60) * 3600));
    
    const direction = decimal >= 0 ? '' : '-';
    return `${direction}${degrees}°${minutes}'${seconds}"`;
  };

  // Standort-Name basierend auf Koordinaten
  const getLocationName = (lat, lng) => {
    const locations = {
      '51.5413,9.9158': 'Göttingen, Niedersachsen, Germany',
      '52.5200,13.4050': 'Berlin, Berlin, Germany',
      '48.1351,11.5820': 'München, Bayern, Germany',
      '34.08910,-118.41069': 'Los Angeles, California, USA',
      '50.9375,6.9603': 'Köln, Nordrhein-Westfalen, Germany'
    };
    
    const key = `${lat},${lng}`;
    return locations[key] || 'Unbekannter Standort';
  };

  const locationName = getLocationName(inputs.lat, inputs.lng);
  const latDMS = decimalToDMS(inputs.lat);
  const lngDMS = decimalToDMS(inputs.lng);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f8fafc',
      padding: '0',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      zIndex: 1000
    }}>
      {/* Custom Header für Solar-Details */}
      <header style={{ 
        background: '#0A2540',
        color: '#ffffff',
        padding: '32px 0',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 40px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 8px 0',
            fontSize: '3rem',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Solar-Details
          </h1>
          <p style={{ 
            margin: '0',
            fontSize: '1.25rem',
            color: '#e2e8f0',
            fontWeight: '400',
            lineHeight: '1.4'
          }}>
            Detaillierte Analyse deines Solarpotentials
          </p>
        </div>
      </header>

      {/* Navigation Bar */}
      <div style={{ 
        padding: '16px 32px',
        marginBottom: '32px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f8fafc',
              color: '#374151',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            ← Zurück zur Berechnung
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 32px 32px',
        overflowY: 'auto',
        height: 'calc(100vh - 200px)'
      }}>

        {/* Standort-Informationen */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '32px', 
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '24px',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Standort-Details
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '32px'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '16px', 
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Geografische Koordinaten
              </h3>
              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Breitengrad:</span> {latDMS} ({inputs.lat}°)
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Längengrad:</span> {lngDMS} ({inputs.lng}°)
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Standort:</span> {locationName}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '16px', 
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Dach-Parameter
              </h3>
              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4b5563' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Dachfläche:</span> {inputs.area} m²
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Dachneigung:</span> {inputs.tilt}°
                </div>
                <div>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Ausrichtung:</span> {inputs.azimuth}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solar-Ergebnisse */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '32px', 
          marginBottom: '32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            marginBottom: '24px',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Solar-Ergebnisse
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
              padding: '24px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #bbf7d0',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
                {solarData.yield.annual_kWh.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>kWh/Jahr</div>
              <div style={{ color: '#059669', fontSize: '16px', fontWeight: '600' }}>
                Jährlicher Ertrag
              </div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', 
              padding: '24px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #7dd3fc',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#0284c7', marginBottom: '8px' }}>
                {solarData.co2.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>kg/Jahr</div>
              <div style={{ color: '#0284c7', fontSize: '16px', fontWeight: '600' }}>
                CO₂-Einsparung
              </div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', 
              padding: '24px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #fcd34d',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#d97706', marginBottom: '8px' }}>
                {Math.round(solarData.yield.annual_kWh / 365)}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>kWh/Tag</div>
              <div style={{ color: '#d97706', fontSize: '16px', fontWeight: '600' }}>
                Durchschnitt pro Tag
              </div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #faf5ff, #e9d5ff)', 
              padding: '24px', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #c4b5fd',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#7c3aed', marginBottom: '8px' }}>
                {Math.round(solarData.yield.annual_kWh / 12)}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>kWh/Monat</div>
              <div style={{ color: '#7c3aed', fontSize: '16px', fontWeight: '600' }}>
                Durchschnitt pro Monat
              </div>
            </div>
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#64748b', 
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Datenquelle:</span> 
              <span style={{ 
                backgroundColor: '#e2e8f0',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {solarData.cache.message}
              </span>
            </p>
          </div>
        </div>

        {/* Chart-Komponenten */}
        <div style={{ 
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <ChartContainer solarData={solarData} inputs={inputs} />
        </div>
      </div>
    </div>
  );
};

export default SolarDetails;
