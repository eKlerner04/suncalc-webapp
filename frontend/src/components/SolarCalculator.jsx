import { useState } from 'react';
import { fetchSolarData } from '../services/api';
import ChartContainer from './ChartContainer';
import SolarDetails from './SolarDetails';

export default function SolarCalculator() {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState('day'); // 'day' oder 'year'
  const [showDetails, setShowDetails] = useState(false);
  
  // State für benutzerdefinierte Koordinaten
  const [coordinates, setCoordinates] = useState({
    lat: '51.5413',
    lng: '9.9158',
    area: '15',
    tilt: '35',
    azimuth: '180'
  });

  const handleCalculateSolar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSolarData(
        parseFloat(coordinates.lat), 
        parseFloat(coordinates.lng), 
        parseFloat(coordinates.area), 
        parseFloat(coordinates.tilt), 
        parseFloat(coordinates.azimuth)
      );
      console.log('Frontend hat Daten erhalten:', data);
      setSolarData(data);
    } catch (err) {
      console.error('Frontend-Fehler:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCoordinates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickLocation = (lat, lng, name) => {
    setCoordinates(prev => ({
      ...prev,
      lat,
      lng
    }));
    console.log(`📍 Schnellstandort gesetzt: ${name} (${lat}, ${lng})`);
  };

  return (
    <section className="card" style={{ 
      width: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Details-Seite anzeigen wenn showDetails true ist */}
      {showDetails ? (
        <SolarDetails 
          solarData={solarData} 
          inputs={solarData.inputs} 
          onBack={() => setShowDetails(false)}
        />
      ) : (
        <>
          <h2>Solar-Potential berechnen</h2>
      
          {/* Koordinaten-Eingabe */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Standort-Koordinaten</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '15px', 
              marginBottom: '20px',
              maxWidth: '800px',
              margin: '0 auto 20px auto',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="lat" style={{ display: 'block', marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}>Breitengrad (lat):</label>
                <input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={coordinates.lat}
                  onChange={(e) => handleInputChange('lat', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="lng" style={{ display: 'block', marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}>Längengrad (lng):</label>
                <input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={coordinates.lng}
                  onChange={(e) => handleInputChange('lng', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px', 
              marginBottom: '20px',
              maxWidth: '800px',
              margin: '0 auto 20px auto',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="area" style={{ display: 'block', marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}>Dachfläche (m²):</label>
                <input
                  id="area"
                  type="number"
                  min="1"
                  value={coordinates.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="tilt" style={{ display: 'block', marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}>Dachneigung (°):</label>
                <input
                  id="tilt"
                  type="number"
                  min="0"
                  max="90"
                  value={coordinates.tilt}
                  onChange={(e) => handleInputChange('tilt', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <label htmlFor="azimuth" style={{ display: 'block', marginBottom: '5px', width: '100%', boxSizing: 'border-box' }}>Ausrichtung (°):</label>
                <input
                  id="azimuth"
                  type="number"
                  min="0"
                  max="360"
                  value={coordinates.azimuth}
                  onChange={(e) => handleInputChange('azimuth', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            
            {/* Schnellstandorte */}
            <div style={{ 
              marginBottom: '20px', 
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Schnellstandorte:</label>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: '100%',
                boxSizing: 'border-box',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <button
                  onClick={() => handleQuickLocation('51.5413', '9.9158', 'Göttingen')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                >
                  Göttingen
                </button>
                <button
                  onClick={() => handleQuickLocation('52.5200', '13.4050', 'Berlin')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                >
                  Berlin
                </button>
                <button
                  onClick={() => handleQuickLocation('48.1351', '11.5820', 'München')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                >
                  München
                </button>
                <button
                  onClick={() => handleQuickLocation('34.08910', '-118.41069', 'Los Angeles')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                >
                  Los Angeles
                </button>
                <button
                  onClick={() => handleQuickLocation('50.9375', '6.9603', 'Köln')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                >
                  Köln
                </button>
              </div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <button 
              onClick={handleCalculateSolar}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Berechne...' : 'Solar-Potential berechnen'}
            </button>
          </div>
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Fehler: {error}
            </div>
          )}
          
          {solarData && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <h3>Berechnete Solar-Daten:</h3>
              
              <h4>Eingabeparameter:</h4>
              <ul>
                <li>Breitengrad: {solarData.inputs.lat}°</li>
                <li>Längengrad: {solarData.inputs.lng}°</li>
                <li>Dachfläche: {solarData.inputs.area} m²</li>
                <li>Dachneigung: {solarData.inputs.tilt}°</li>
                <li>Ausrichtung: {solarData.inputs.azimuth}°</li>
              </ul>
              
              <h4>Ergebnisse:</h4>
              
              {/* Toggle-Switch für Tag/Jahr */}
              <div style={{ 
                marginBottom: '15px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Zeiteinheit:</label>
                <div style={{ 
                  display: 'inline-flex', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '20px', 
                  padding: '2px',
                  cursor: 'pointer'
                }}>
                  <button
                    onClick={() => setTimeUnit('day')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '18px',
                      border: 'none',
                      backgroundColor: timeUnit === 'day' ? '#007bff' : 'transparent',
                      color: timeUnit === 'day' ? 'white' : '#6c757d',
                      cursor: 'pointer',
                      fontWeight: timeUnit === 'day' ? 'bold' : 'normal',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Pro Tag
                  </button>
                  <button
                    onClick={() => setTimeUnit('year')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '18px',
                      border: 'none',
                      backgroundColor: timeUnit === 'year' ? '#007bff' : 'transparent',
                      color: timeUnit === 'year' ? 'white' : '#6c757d',
                      cursor: 'pointer',
                      fontWeight: timeUnit === 'year' ? 'bold' : 'normal',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Pro Jahr
                  </button>
                </div>
              </div>
              
              <ul>
                <li><strong>Jährlicher Ertrag:</strong> {solarData.yield.annual_kWh} kWh</li>
                <li><strong>CO₂-Einsparung:</strong> {solarData.co2} kg/Jahr</li>
                {timeUnit === 'day' ? (
                  <>
                    <li><strong>Durchschnitt pro Tag:</strong> {Math.round(solarData.yield.annual_kWh / 365)} kWh/Tag</li>
                    <li><strong>Durchschnitt pro Monat:</strong> {Math.round(solarData.yield.annual_kWh / 12)} kWh/Monat</li>
                  </>
                ) : (
                  <>
                    <li><strong>Durchschnitt pro Jahr:</strong> {solarData.yield.annual_kWh} kWh/Jahr</li>
                    <li><strong>Durchschnitt pro Jahrzehnt:</strong> {solarData.yield.annual_kWh * 10} kWh/10 Jahre</li>
                  </>
                )}
              </ul>
              
              {/* Detaillierte technische Solar-Daten */}
              {solarData.cache?.solarData?.metadata?.assumptions && (
                <div style={{ 
                  marginTop: '15px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <h4>🔬 Technische Solar-Daten:</h4>
                  
                  {/* Berechnete Endwerte */}
                  <div style={{ 
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <h5 style={{ color: '#495057', marginBottom: '8px' }}>⚡ Berechnete Endwerte (mit Dachneigung & Verlusten):</h5>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '10px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>PVOUT spezifisch:</strong><br/>
                        {timeUnit === 'day' 
                          ? `${((solarData.yield.annual_kWh / (solarData.inputs.area / 6.5)) / 365).toFixed(3)} kWh/kWp/Tag`
                          : `${(solarData.yield.annual_kWh / (solarData.inputs.area / 6.5)).toFixed(1)} kWh/kWp/Jahr`
                        }
                        <br/><small style={{ color: '#6c757d' }}>Mit Dachneigung {solarData.inputs.tilt}° & Ausrichtung {solarData.inputs.azimuth}°</small>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>Installierte Leistung:</strong><br/>
                        {(solarData.inputs.area / 6.5).toFixed(2)} kWp
                        <br/><small style={{ color: '#6c757d' }}>Basierend auf {solarData.inputs.area} m² Dachfläche</small>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>Systemverluste:</strong><br/>
                        {solarData.cache.solarData.metadata.assumptions.losses_percent}%
                        <br/><small style={{ color: '#6c757d' }}>Wechselrichter, Kabel, Verschmutzung</small>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>Flächenbedarf:</strong><br/>
                        {solarData.cache.solarData.metadata.assumptions.m2_per_kwp} m²/kWp
                        <br/><small style={{ color: '#6c757d' }}>Moderne Modul-Effizienz</small>
                      </div>
                      
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>CO₂-Faktor:</strong><br/>
                        {solarData.cache.solarData.metadata.assumptions.co2_factor} kg/kWh
                        <br/><small style={{ color: '#6c757d' }}>Deutscher Strommix</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p><em>{solarData.cache.message}</em></p>
              
              {/* Open Details Button */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px', 
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <button
                  onClick={() => setShowDetails(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  🔍 Open Details
                </button>
              </div>
              
              {/* Chart-Komponenten */}
              <ChartContainer solarData={solarData} inputs={solarData.inputs} />
              
              {/* Debug: Zeige alle Daten */}
              <details style={{ 
                marginTop: '15px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <summary>Debug: Alle empfangenen Daten</summary>
                <pre style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '10px', 
                  borderRadius: '3px',
                  fontSize: '12px',
                  overflow: 'auto',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {JSON.stringify(solarData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </>
      )}
    </section>
  );
}
