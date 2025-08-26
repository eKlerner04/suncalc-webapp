import React from 'react';

export default function QuickLocations({ onQuickLocation }) {
  const locations = [
    { lat: '51.5413', lng: '9.9158', name: 'Göttingen' },
    { lat: '52.5200', lng: '13.4050', name: 'Berlin' },
    { lat: '48.1351', lng: '11.5820', name: 'München' },
    { lat: '34.08910', lng: '-118.41069', name: 'Los Angeles' },
    { lat: '50.9375', lng: '6.9603', name: 'Köln' }
  ];

  return (
    <div style={{ 
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => onQuickLocation(location.lat, location.lng, location.name)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#ffffff',
              color: '#374151',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.borderColor = '#cbd5e0';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
}
