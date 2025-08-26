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
      marginTop: '40px',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ 
        marginBottom: '24px',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#2d3748'
      }}>
        Schnellstandorte
      </h3>
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
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
              padding: '12px 24px',
              backgroundColor: '#f7fafc',
              color: '#2d3748',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#edf2f7';
              e.target.style.borderColor = '#cbd5e0';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f7fafc';
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
}
