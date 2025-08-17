import { useState } from 'react';
import { fetchSolarData } from '../services/api';

export default function SolarCalculator() {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
    <section className="card">
      <h2>Solar-Potential berechnen</h2>
      
      {/* Koordinaten-Eingabe */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Standort-Koordinaten</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="lat">Breitengrad (lat):</label>
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
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="lng">Längengrad (lng):</label>
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
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div>
            <label htmlFor="area">Dachfläche (m²):</label>
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
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="tilt">Dachneigung (°):</label>
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
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="azimuth">Ausrichtung (°):</label>
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
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Schnellstandorte */}
        <div style={{ marginBottom: '15px' }}>
          <label>Schnellstandorte:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button
              onClick={() => handleQuickLocation('51.5413', '9.9158', 'Göttingen')}
              style={{
                padding: '5px 10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px'
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
                fontSize: '12px'
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
                fontSize: '12px'
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
                fontSize: '12px'
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
                fontSize: '12px'
              }}
            >
              Köln
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleCalculateSolar}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Berechne...' : 'Solar-Potential berechnen'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Fehler: {error}
        </div>
      )}
      
      {solarData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
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
          <ul>
            <li><strong>Jährlicher Ertrag:</strong> {solarData.yield.annual_kWh} kWh</li>
            <li><strong>CO₂-Einsparung:</strong> {solarData.co2} kg/Jahr</li>
          </ul>
          
          <p><em>{solarData.cache.message}</em></p>
          
          {/* Debug: Zeige alle Daten */}
          <details style={{ marginTop: '15px' }}>
            <summary>Debug: Alle empfangenen Daten</summary>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(solarData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </section>
  );
}
