import { useState, useRef } from 'react';
import { fetchSolarData } from '../services/api';
import { addToSearchHistory } from '../services/searchHistoryService';
import SolarDetails from './SolarDetails';
import LocationMap from './LocationMap';
import LocationInputs from './LocationInputs';
import RoofParameters from './RoofParameters';
import SolarResults from './SolarResults';

export default function SolarCalculator() {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const [showDetails, setShowDetails] = useState(false);
  
  // State für benutzerdefinierte Koordinaten
  const [coordinates, setCoordinates] = useState({
    lat: '',
    lng: '',
    area: '15',
    tilt: '35',
    azimuth: '180'
  });

  // Suchfunktionalität
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Nominatim API Service
  const searchAddress = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      );
      const data = await response.json();
      return data.map(item => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        name: item.name || item.display_name.split(',')[0]
      }));
    } catch (error) {
      console.error('Nominatim API Fehler:', error);
      return [];
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Verzögerung (Debouncing) - warte 500ms nach dem letzten Tastendruck
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddress(query);
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 500);
  };

  const handleAddressSelect = (result) => {
    setSearchQuery(result.displayName);
    setCoordinates(prev => ({
      ...prev,
      lat: result.lat.toString(),
      lng: result.lng.toString()
    }));
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

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
      
      // Suchverlauf speichern
      console.log('🔍 [SolarCalculator] Versuche Suchverlauf zu speichern...');
      console.log('📊 [SolarCalculator] Empfangene Daten:', data);
      console.log('📍 [SolarCalculator] Aktuelle Koordinaten:', coordinates);
      console.log('🏠 [SolarCalculator] Aktuelle Adresse:', searchQuery);
      
      if (data && data.yield && data.yield.annual_kWh) {
        console.log('✅ [SolarCalculator] Daten sind gültig, erstelle Suchdaten...');
        
        const searchData = {
          address: searchQuery || `${coordinates.lat}, ${coordinates.lng}`,
          lat: parseFloat(coordinates.lat),
          lng: parseFloat(coordinates.lng),
          area: parseFloat(coordinates.area),
          tilt: parseFloat(coordinates.tilt),
          azimuth: parseFloat(coordinates.azimuth),
          solarPotential: Math.round(data.yield.annual_kWh)
        };
        
        console.log('📝 [SolarCalculator] Suchdaten erstellt:', searchData);
        const result = addToSearchHistory(searchData);
        console.log('💾 [SolarCalculator] Suchverlauf gespeichert, Ergebnis:', result);
      } else {
        console.log('❌ [SolarCalculator] Daten sind ungültig oder yield.annual_kWh fehlt:', data);
        console.log('🔍 [SolarCalculator] Verfügbare Datenfelder:', Object.keys(data || {}));
        if (data && data.yield) {
          console.log('📊 [SolarCalculator] Yield-Daten:', data.yield);
        }
      }
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

  // Suchverlauf wiederherstellen
  const handleRestoreSearch = (searchItem) => {
    setCoordinates({
      lat: searchItem.lat.toString(),
      lng: searchItem.lng.toString(),
      area: searchItem.area.toString(),
      tilt: searchItem.tilt.toString(),
      azimuth: searchItem.azimuth.toString()
    });
    setSearchQuery(searchItem.address);
    
    // Solar-Daten zurücksetzen, damit neue Berechnung nötig ist
    setSolarData(null);
    
    // KEINE automatische Berechnung - User muss selbst klicken
  };



  const handleMapLocationSelect = async (lat, lng) => {
    setCoordinates(prev => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString()
    }));
    console.log(`Standort von Karte gesetzt: (${lat}, ${lng})`);
    
    // Automatisch Adresse für die neuen Koordinaten abrufen und ins Suchfeld eintragen
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        setSearchQuery(data.display_name);
        console.log(`Adresse automatisch ausgefüllt: ${data.display_name}`);
      }
    } catch (error) {
      console.error('Fehler beim automatischen Adressabruf:', error);
    }
  };

  return (
    <>
      {/* Globale CSS-Regeln für horizontales Scrollen verhindern */}
      <style>
        {`
          body {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          html {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        `}
      </style>
      
      <div style={{ 
        width: '100%',
        minHeight: '100vh',
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#ffffff',
        overflowX: 'hidden',
        maxWidth: '100vw'
      }}>
      {/* Details-Seite anzeigen wenn showDetails true ist */}
      {showDetails ? (
        <SolarDetails 
          solarData={solarData} 
          inputs={solarData.inputs} 
          onBack={() => {
            setShowDetails(false);
            // Nach dem Zurückschalten nach oben scrollen
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>

      
          {/* Hauptinhalt - Volle Breite Grid */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
            width: '100%',
            minHeight: 'calc(100vh - 300px)'
          }}>
            {/* Linke Spalte - Karte (Volle Höhe) */}
            <div style={{ 
              background: '#ffffff',
              padding: '40px',
              borderRight: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                margin: '0 0 32px 0',
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#475569',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span style={{
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '700'
                }}>
                  1
                </span>
                Standort wählen
              </h2>
              
              <div style={{ 
                width: '100%',
                height: '1000px',
                maxWidth: '2000px',
                margin: '0 auto',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '32px',
                border: '2px solid #e2e8f0',
                backgroundColor: '#ffffff'
              }}>
                <LocationMap
                  onLocationSelect={handleMapLocationSelect}
                  selectedLat={coordinates.lat ? parseFloat(coordinates.lat) : null}
                  selectedLng={coordinates.lng ? parseFloat(coordinates.lng) : null}
                />
              </div>
              
              {/* Adress-Suchfeld */}
              <div style={{ 
                width: '100%',
                marginBottom: '24px',
                boxSizing: 'border-box'
              }}>
                <label htmlFor="address" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%', 
                  boxSizing: 'border-box',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Adresse oder Ort eingeben
                </label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}>

                  
                  <input
                    id="address"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    placeholder="Geben Sie eine Adresse oder einen Ort ein..."
                    style={{
                      flex: 1,
                      padding: '16px 16px',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '1rem',
                      color: '#1a202c',
                      fontWeight: '500'
                    }}
                  />
                  
                  {/* Lösch-Button */}
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      style={{
                        padding: '8px',
                        margin: '0 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        fontSize: '16px',
                        cursor: 'pointer',
                        color: '#ef4444',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Suchergebnisse */}
                {showSearchResults && searchResults.length > 0 && (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    marginTop: '8px',
                    transition: 'all 0.3s ease'
                  }}>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleAddressSelect(result)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: index < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#1e293b',
                          fontSize: '14px',
                          marginBottom: '4px'
                        }}>
                          📍 {result.name}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#64748b',
                          lineHeight: '1.3'
                        }}>
                          {result.displayName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ladeindikator */}
                {isSearching && (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    fontSize: '14px',
                    color: '#6366f1',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(99, 102, 241, 0.2)',
                      borderTop: '2px solid #6366f1',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Suche läuft...
                  </div>
                )}
              </div>
              
              {/* Koordinaten-Eingabefelder */}
              <LocationInputs 
                coordinates={coordinates} 
                onInputChange={handleInputChange} 
              />
            </div>

            {/* Rechte Spalte - Eingaben (Volle Höhe) */}
            <div style={{ 
              background: '#ffffff',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {/* Dachparameter */}
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  margin: '0 0 32px 0',
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#475569',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '700'
                  }}>
                    2
                  </span>
                  Dachparameter einstellen
                </h2>
                          <RoofParameters 
            coordinates={coordinates}
            onInputChange={handleInputChange}
            onRestoreSearch={handleRestoreSearch}
          />
              </div>


            </div>
          </div>

          {/* Solar-Potential Button - Zentral unten, volle Breite */}
          <div style={{ 
            background: '#ffffff',
            padding: '40px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              margin: '0 0 24px 0',
              fontSize: '1.75rem',
              fontWeight: '600',
              color: '#475569',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{
                background: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}>
                3
              </span>
              Solarpotential berechnen
            </h2>
            <button 
              onClick={handleCalculateSolar}
              disabled={loading || !coordinates.lat || !coordinates.lng}
              style={{
                padding: '24px 48px',
                backgroundColor: loading || !coordinates.lat || !coordinates.lng ? '#cbd5e0' : '#1e293b',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: loading || !coordinates.lat || !coordinates.lng ? 'not-allowed' : 'pointer',
                fontSize: '1.25rem',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                minWidth: '300px',
                boxShadow: loading || !coordinates.lat || !coordinates.lng ? 'none' : '0 8px 24px rgba(30, 41, 59, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(30, 41, 59, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(30, 41, 59, 0.3)';
                }
              }}
            >
              {loading ? 'Berechne...' : 'Solar-Potential berechnen'}
            </button>
            
            {(!coordinates.lat || !coordinates.lng) && (
              <p style={{
                margin: '16px 0 0 0',
                fontSize: '0.875rem',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                Bitte wählen Sie zuerst einen Standort aus
              </p>
            )}
          </div>
          
          {/* Fehlermeldung - Volle Breite */}
          {error && (
            <div style={{ 
              background: '#fef2f2',
              color: '#991b1b', 
              padding: '24px 40px',
              borderTop: '1px solid #fecaca',
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              ❌ Fehler: {error}
            </div>
          )}
          
          {/* Ergebnisse - Volle Breite */}
          {solarData && (
            <div style={{ 
              background: '#f8fafc',
              padding: '40px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <SolarResults 
                solarData={solarData} 
                onShowDetails={() => setShowDetails(true)}
              />
            </div>
          )}

          {/* CSS für Animationen */}
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      </div>
    </>
  );
}
