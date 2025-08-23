import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const mapRef = useRef(null);

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

  // Event-Handler über whenReady (wenn Karte bereit ist)
  const handleMapReady = () => {
    if (mapRef.current) {
      console.log('Karte ist bereit');
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #e0e0e0',
      position: 'relative'
    }}>
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
      
      {/* Anleitung */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        color: '#333',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        🎯 Klicke auf die Karte um einen Standort zu wählen
      </div>
      
      {/* Koordinaten-Anzeige */}
      {crosshairPosition && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 1000
        }}>
          {crosshairPosition.lat.toFixed(4)}, {crosshairPosition.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}
