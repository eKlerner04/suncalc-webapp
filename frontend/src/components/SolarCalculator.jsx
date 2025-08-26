import { useState } from 'react';
import { fetchSolarData } from '../services/api';
import SolarDetails from './SolarDetails';
import LocationMap from './LocationMap';
import LocationInputs from './LocationInputs';
import RoofParameters from './RoofParameters';
import QuickLocations from './QuickLocations';
import SolarResults from './SolarResults';

export default function SolarCalculator() {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState('day'); // 'day' oder 'year'
  const [showDetails, setShowDetails] = useState(false);
  
  // State für benutzerdefinierte Koordinaten
  const [coordinates, setCoordinates] = useState({
    lat: '',
    lng: '',
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
    console.log(`handleInputChange: ${field} = ${value}`);
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
    console.log(`Schnellstandort gesetzt: ${name} (${lat}, ${lng})`);
  };

  const handleMapLocationSelect = (lat, lng) => {
    setCoordinates(prev => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString()
    }));
    console.log(`Standort von Karte gesetzt: (${lat}, ${lng})`);
  };

  return (
    <section style={{ 
      width: '100%',
      minHeight: '100vh',
      margin: '0',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
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
          {/* Header-Bereich */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            padding: '0'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 16px 0',
              letterSpacing: '-0.025em'
            }}>
              Solar-Potential berechnen
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#4a5568',
              margin: '0',
              lineHeight: '1.6'
            }}>
              Wählen Sie Ihren Standort und die Dachparameter für eine präzise Solarpotential-Berechnung
            </p>
          </div>
      
          {/* Interaktive Karte zur Standortauswahl */}
          <div style={{ 
            marginBottom: '48px',
            padding: '0'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '32px',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Standort auf der Karte wählen
            </h2>
            
            <div style={{ 
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '32px'
            }}>
              <LocationMap
                onLocationSelect={handleMapLocationSelect}
                selectedLat={coordinates.lat ? parseFloat(coordinates.lat) : null}
                selectedLng={coordinates.lng ? parseFloat(coordinates.lng) : null}
              />
            </div>
            
            {/* Koordinaten-Eingabefelder */}
            <LocationInputs 
              coordinates={coordinates} 
              onInputChange={handleInputChange} 
            />

            {/* Dachparameter */}
            <RoofParameters 
              coordinates={coordinates} 
              onInputChange={handleInputChange} 
            />
            
            {/* Schnellstandorte */}
            <QuickLocations onQuickLocation={handleQuickLocation} />
          </div>
          
          {/* Berechnen-Button */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            padding: '0'
          }}>
            <button 
              onClick={handleCalculateSolar}
              disabled={loading || !coordinates.lat || !coordinates.lng}
              style={{
                padding: '20px 40px',
                backgroundColor: loading || !coordinates.lat || !coordinates.lng ? '#cbd5e0' : '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: loading || !coordinates.lat || !coordinates.lng ? 'not-allowed' : 'pointer',
                fontSize: '1.125rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(49, 130, 206, 0.3)',
                minWidth: '280px'
              }}
              onMouseEnter={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(49, 130, 206, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(49, 130, 206, 0.3)';
                }
              }}
            >
              {loading ? 'Berechne...' : 'Solar-Potential berechnen'}
            </button>
          </div>
          
          {/* Fehlermeldung */}
          {error && (
            <div style={{ 
              color: '#e53e3e', 
              marginTop: '24px',
              padding: '16px 24px',
              backgroundColor: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '24px auto 0 auto',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Fehler: {error}
            </div>
          )}
          
          {/* Ergebnisse */}
          {solarData && (
            <SolarResults 
                solarData={solarData} 
                timeUnit={timeUnit}
              setTimeUnit={setTimeUnit}
              onShowDetails={() => setShowDetails(true)}
            />
          )}
        </>
      )}
    </section>
  );
}
