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
      position: 'relative', 
      width: '100%', 
      height: '100%',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <MapContainer
        ref={mapRef}
        center={[initialLat || 51.5413, initialLng || 9.9158]}
        zoom={8}
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '12px'
        }}
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
        onLoad={() => {
          console.log('Karte geladen');
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fadenkreuz-Komponente */}
        <Crosshair 
          onLocationSelect={onLocationSelect} 
          setCrosshairPosition={setCrosshairPosition}
        />
        
        {/* Marker für ausgewählten Standort - Standard Leaflet */}
        {selectedLat && selectedLng && (
          <Marker position={[selectedLat, selectedLng]} />
        )}
        
        {/* Fadenkreuz-Marker - Standard Leaflet */}
        {crosshairPosition && !isDragging && (
          <Marker position={crosshairPosition} />
        )}
      </MapContainer>


      
      {/* Zoom-Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.95)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.95)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          -
        </button>
      </div>

      {/* Adress-Anzeige */}
      {currentAddress && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000,
          maxWidth: '400px'
        }}>
          <strong>Koordinaten:</strong> {crosshairPosition?.lat?.toFixed(6)}, {crosshairPosition?.lng?.toFixed(6)}
          <br />
          <strong>Adresse:</strong> {currentAddress}
        </div>
      )}

      {/* CSS für Animationen */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .crosshair-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
