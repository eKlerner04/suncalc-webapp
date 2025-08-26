import React from 'react';
import Compass from './Compass';

export default function RoofParameters({ coordinates, onInputChange }) {
  return (
    <div style={{ 
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          <label htmlFor="area" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            width: '100%', 
            boxSizing: 'border-box',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            Dachfläche (m²)
          </label>
          <input
            id="area"
            type="number"
            min="1"
            value={coordinates.area}
            onChange={(e) => onInputChange('area', e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              boxSizing: 'border-box',
              fontSize: '1rem',
              color: '#1a202c',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1e293b';
              e.target.style.boxShadow = '0 0 0 3px rgba(30, 41, 59, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          <label htmlFor="tilt" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            width: '100%', 
            boxSizing: 'border-box',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            Dachneigung: {coordinates.tilt}°
          </label>
          <div style={{
            position: 'relative',
            width: '100%',
            padding: '20px 0'
          }}>
            <input
              id="tilt"
              type="range"
              min="0"
              max="90"
              value={coordinates.tilt}
              onChange={(e) => onInputChange('tilt', e.target.value)}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #e2e8f0 0%, #1e293b 50%, #e2e8f0 100%)',
                outline: 'none',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
              onInput={(e) => {
                const value = e.target.value;
                const percentage = (value / 90) * 100;
                e.target.style.background = `linear-gradient(to right, #e2e8f0 0%, #1e293b ${percentage}%, #e2e8f0 ${percentage}%)`;
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: '500'
            }}>
              <span>0° (Flach)</span>
              <span>45°</span>
              <span>90° (Steil)</span>
            </div>
          </div>
        </div>
        
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          <label htmlFor="azimuth" style={{ 
            display: 'block', 
            marginBottom: '8px', 
            width: '100%', 
            boxSizing: 'border-box',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            Ausrichtung: {parseInt(coordinates.azimuth) || 0}°
          </label>
          <Compass 
            azimuth={parseInt(coordinates.azimuth) || 0} 
            onInputChange={onInputChange} 
          />
        </div>
      </div>
    </div>
  );
}
