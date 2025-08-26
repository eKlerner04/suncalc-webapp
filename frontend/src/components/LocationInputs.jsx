import React from 'react';

export default function LocationInputs({ coordinates, onInputChange }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '32px', 
      marginTop: '32px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        <label htmlFor="lat" style={{ 
          display: 'block', 
          marginBottom: '8px', 
          width: '100%', 
          boxSizing: 'border-box',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Breitengrad (Latitude)
        </label>
        <input
          id="lat"
          type="number"
          step="0.0001"
          value={coordinates.lat}
          onChange={(e) => onInputChange('lat', e.target.value)}
          placeholder="Klicke auf die Karte oder gib Koordinaten ein"
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            boxSizing: 'border-box',
            fontSize: '1rem',
            color: '#1a202c',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3182ce';
            e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        <label htmlFor="lng" style={{ 
          display: 'block', 
          marginBottom: '8px', 
          width: '100%', 
          boxSizing: 'border-box',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#4a5568'
        }}>
          Längengrad (Longitude)
        </label>
        <input
          id="lng"
          type="number"
          step="0.0001"
          value={coordinates.lng}
          onChange={(e) => onInputChange('lng', e.target.value)}
          placeholder="Klicke auf die Karte oder gib Koordinaten ein"
          style={{
            width: '100%',
            padding: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            boxSizing: 'border-box',
            fontSize: '1rem',
            color: '#1a202c',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3182ce';
            e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
}
