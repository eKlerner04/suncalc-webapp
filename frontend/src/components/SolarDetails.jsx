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
      width: '100%',
      padding: '15px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Header mit Zurück-Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '20px',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Zurück zur Berechnung
        </button>
        <h1 style={{ margin: 0, color: '#495057', flex: 1, textAlign: 'center' }}>☀️ Solar-Details</h1>
        <div style={{ width: '120px' }}></div> {/* Platzhalter für Balance */}
      </div>

      {/* Standort-Informationen */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px', 
        padding: '20px', 
        marginBottom: '25px',
        border: '1px solid #e9ecef',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          color: '#495057', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          📍 Standort-Details
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          width: '100%'
        }}>
          <div>
            <h3 style={{ color: '#6c757d', marginBottom: '10px', fontSize: '18px' }}>
              🌍 Geografische Koordinaten
            </h3>
            <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <strong>Breitengrad:</strong> {latDMS} ({inputs.lat}°)<br/>
              <strong>Längengrad:</strong> {lngDMS} ({inputs.lng}°)<br/>
              <strong>Standort:</strong> {locationName}
            </div>
          </div>
          
          <div>
            <h3 style={{ color: '#6c757d', marginBottom: '10px', fontSize: '18px' }}>
              🏠 Dach-Parameter
            </h3>
            <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
              <strong>Dachfläche:</strong> {inputs.area} m²<br/>
              <strong>Dachneigung:</strong> {inputs.tilt}°<br/>
              <strong>Ausrichtung:</strong> {inputs.azimuth}° (Süd = 180°)
            </div>
          </div>
        </div>
      </div>

      {/* Solar-Ergebnisse */}
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        borderRadius: '10px', 
        padding: '20px', 
        marginBottom: '25px',
        border: '1px solid #c3e6c3',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          color: '#2d5a2d', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          ⚡ Solar-Ergebnisse
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          width: '100%'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #c3e6c3'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#28a745', marginBottom: '5px' }}>
              {solarData.yield.annual_kWh}
            </div>
            <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/Jahr</div>
            <div style={{ color: '#28a745', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
              Jährlicher Ertrag
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #c3e6c3'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#17a2b8', marginBottom: '5px' }}>
              {solarData.co2}
            </div>
            <div style={{ color: '#6c757d', fontSize: '14px' }}>kg/Jahr</div>
            <div style={{ color: '#17a2b8', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
              CO₂-Einsparung
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #c3e6c3'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107', marginBottom: '5px' }}>
              {Math.round(solarData.yield.annual_kWh / 365)}
            </div>
            <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/Tag</div>
            <div style={{ color: '#ffc107', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
              Durchschnitt pro Tag
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #c3e6c3'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#6f42c1', marginBottom: '5px' }}>
              {Math.round(solarData.yield.annual_kWh / 12)}
            </div>
            <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/Monat</div>
            <div style={{ color: '#6f42c1', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
              Durchschnitt pro Monat
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #c3e6c3'
        }}>
          <p style={{ margin: 0, color: '#6c757d', fontStyle: 'italic' }}>
            <strong>Datenquelle:</strong> {solarData.cache.message}
          </p>
        </div>
      </div>

      {/* Neue Sektion: Strahlungswerte */}
      {solarData.radiation && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          borderRadius: '10px', 
          padding: '20px', 
          marginBottom: '25px',
          border: '1px solid #ffeaa7',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ 
            color: '#856404', 
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            ☀️ Strahlungswerte (Wissenschaftlich)
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            width: '100%'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#f39c12', marginBottom: '5px' }}>
                {solarData.radiation.dni?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/m²/Jahr</div>
              <div style={{ color: '#f39c12', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
                DNI (Direct Normal)
              </div>
              <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '5px' }}>
                Direkte Sonnenstrahlung
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#e74c3c', marginBottom: '5px' }}>
                {solarData.radiation.ghi?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/m²/Jahr</div>
              <div style={{ color: '#e74c3c', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
                GHI (Global Horizontal)
              </div>
              <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '5px' }}>
                Gesamtstrahlung horizontal
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#9b59b6', marginBottom: '5px' }}>
                {solarData.radiation.dif?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/m²/Jahr</div>
              <div style={{ color: '#9b59b6', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
                DIF (Diffuse)
              </div>
              <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '5px' }}>
                Diffuse Strahlung
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#27ae60', marginBottom: '5px' }}>
                {solarData.radiation.annual_total?.toFixed(1) || 'N/A'}
              </div>
              <div style={{ color: '#6c757d', fontSize: '14px' }}>kWh/m²/Jahr</div>
              <div style={{ color: '#27ae60', fontSize: '16px', fontWeight: '600', marginTop: '5px' }}>
                Gesamt (Geneigt)
              </div>
              <div style={{ color: '#a0aec0', fontSize: '12px', marginTop: '5px' }}>
                Auf geneigte Fläche
              </div>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '1px solid #ffeaa7'
          }}>
            <p style={{ margin: 0, color: '#856404', fontStyle: 'italic', fontSize: '14px' }}>
              <strong>Wissenschaftliche Grundlage:</strong> Diese Werte stammen von der PVGIS-API (Joint Research Centre der EU) 
              und der NASA POWER API. Sie basieren auf Satellitendaten und meteorologischen Modellen und sind 
              international anerkannte Standards für Solarberechnungen.
            </p>
          </div>
        </div>
      )}

      {/* Chart-Komponenten */}
      <div style={{ 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <ChartContainer solarData={solarData} inputs={inputs} />
      </div>
    </div>
  );
};

export default SolarDetails;
