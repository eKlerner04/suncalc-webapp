import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Nominatim API Service
const nominatimService = {
  // Adresse zu Koordinaten
  async searchAddress(query) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=de,at,ch`
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
  },

  // Koordinaten zu Adresse
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Unbekannter Standort';
    } catch (error) {
      console.error('Reverse Geocoding Fehler:', error);
      return 'Unbekannter Standort';
    }
  }
};

// Leaflet Marker-Icon-Fix für React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fadenkreuz-Komponente (für Mausbewegungen und Klicks)
function Crosshair({ onLocationSelect, setCrosshairPosition }) {
  const map = useMapEvents({
    click: (e) => {
      console.log('Crosshair: Karte wurde geklickt:', e.latlng);
      setCrosshairPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
    mousemove: (e) => {
      // Fadenkreuz bei Mausbewegung anzeigen
      map.fire('crosshair:show', { latlng: e.latlng });
    }
  });

  return null;
}

// Haupt-Karten-Komponente
export default function LocationMap({ 
  onLocationSelect, 
  initialLat = null, 
  initialLng = null,
  selectedLat,
  selectedLng
}) {
  const [crosshairPosition, setCrosshairPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Event-Handler für Fadenkreuz-Updates
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleCrosshairShow = (e) => {
      if (!isDragging) {
        setCrosshairPosition(e.latlng);
      }
    };

    map.on('crosshair:show', handleCrosshairShow);

    return () => {
      map.off('crosshair:show', handleCrosshairShow);
    };
  }, [isDragging]);

  // Drag-Events
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  // Karte auf ausgewählten Standort zentrieren (nur wenn explizit gewünscht)
  useEffect(() => {
    if (selectedLat && selectedLng && mapRef.current) {
      // Fadenkreuz-Position setzen und Standort zentrieren (ohne Zoom zu ändern)
      setCrosshairPosition({ lat: selectedLat, lng: selectedLng });
      
      // Aktuellen Zoom-Level beibehalten, nur Position zentrieren
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setView([selectedLat, selectedLng], currentZoom);
    }
  }, [selectedLat, selectedLng]);

  // Adresssuche mit Debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        const results = await nominatimService.searchAddress(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Adresse für aktuelle Koordinaten abrufen
  useEffect(() => {
    if (crosshairPosition) {
      nominatimService.reverseGeocode(crosshairPosition.lat, crosshairPosition.lng)
        .then(address => setCurrentAddress(address));
    }
  }, [crosshairPosition]);

  // Adresse auswählen
  const handleAddressSelect = (result) => {
    setCrosshairPosition({ lat: result.lat, lng: result.lng });
    onLocationSelect(result.lat, result.lng);
    setSearchQuery(result.name);
    setShowSearchResults(false);
    
    // Karte auf gewählten Standort zentrieren
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setView([result.lat, result.lng], currentZoom);
    }
  };

  // Adresssuche löschen
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Event-Handler über whenReady (wenn Karte bereit ist)
  const handleMapReady = () => {
    if (mapRef.current) {
      console.log('Karte ist bereit');
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '60vh', 
      minHeight: '400px',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid #e0e0e0',
      position: 'relative',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Moderne Adresssuche */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 1000,
        maxWidth: '380px'
      }}>
        <div style={{
          position: 'relative',
          width: '100%'
        }}>
          {/* Suchfeld mit modernem Design */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}>
            {/* Such-Icon */}
            <div style={{
              padding: '0 16px',
              color: '#6366f1',
              fontSize: '18px'
            }}>
              🔍
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Adresse oder Ort eingeben..."
              style={{
                flex: 1,
                padding: '16px 0',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '15px',
                color: '#1f2937',
                fontWeight: '500'
              }}
            />
            
            {/* Lösch-Button mit Animation */}
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

          {/* Moderne Suchergebnisse */}
          {showSearchResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '0',
              right: '0',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
              maxHeight: '280px',
              overflowY: 'auto',
              zIndex: 1001,
              animation: 'slideDown 0.3s ease-out'
            }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleAddressSelect(result)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index < searchResults.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    transition: 'all 0.2s ease',
                    borderRadius: index === 0 ? '16px 16px 0 0' : index === searchResults.length - 1 ? '0 0 16px 16px' : '0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.08)';
                    e.target.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#1f2937',
                    fontSize: '15px',
                    marginBottom: '4px'
                  }}>
                    📍 {result.name}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {result.displayName}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Moderner Ladeindikator */}
          {isSearching && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '0',
              right: '0',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              padding: '20px',
              fontSize: '14px',
              color: '#6366f1',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: '500'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(99, 102, 102, 241, 0.2)',
                borderTop: '2px solid #6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Suche läuft...
            </div>
          )}
        </div>
      </div>

      <MapContainer
        ref={mapRef}
        center={[51.5413, 9.9158]} // Deutschland-Zentrum
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        doubleClickZoom={false}
        zoomControl={true}
        attributionControl={true}
        whenReady={handleMapReady}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Fadenkreuz */}
        <Crosshair onLocationSelect={onLocationSelect} setCrosshairPosition={setCrosshairPosition} />
        
        {/* Ausgewählter Standort als Marker */}
        {crosshairPosition && (
          <Marker 
            position={[crosshairPosition.lat, crosshairPosition.lng]}
            icon={L.divIcon({
              className: 'custom-crosshair',
              html: `
                <div style="
                  width: 20px; 
                  height: 20px; 
                  background: #ff4444; 
                  border: 3px solid white; 
                  border-radius: 50%; 
                  box-shadow: 0 0 10px rgba(0,0,0,0.5);
                  position: relative;
                ">
                  <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2px;
                    height: 2px;
                    background: white;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                  "></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          />
        )}
      </MapContainer>
      
      {/* Moderne Koordinaten-Anzeige (oben rechts) */}
      {crosshairPosition && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '16px',
          fontSize: '13px',
          fontFamily: 'monospace',
          zIndex: 1000,
          maxWidth: '280px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🎯 Koordinaten
          </div>
          <div style={{ 
            marginBottom: '8px',
            fontSize: '15px',
            fontWeight: '500',
            color: '#f3f4f6',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}>
            {crosshairPosition.lat.toFixed(4)}, {crosshairPosition.lng.toFixed(4)}
          </div>
          {currentAddress && (
            <div style={{ 
              fontSize: '12px', 
              color: '#d1d5db',
              wordBreak: 'break-word',
              lineHeight: '1.4',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '8px'
            }}>
              📍 {currentAddress}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
