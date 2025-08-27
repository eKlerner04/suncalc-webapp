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
            {/* Dach-Animation - Graphisch verbessert */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px',
              height: '150px',
              alignItems: 'flex-end',
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                position: 'relative',
                width: '140px',
                height: '70px'
              }}>
                {/* Haus - komplett neu gebaut */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '50px'
                }}>
                  {/* Hauswand */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100px',
                    height: '50px',
                    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '2px solid #94a3b8',
                    borderRadius: '8px 8px 0 0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} />
                  
                  {/* Tür */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '20px',
                    backgroundColor: '#475569',
                    borderRadius: '4px 4px 0 0',
                    border: '1px solid #334155'
                  }} />
                  
                  {/* Fenster links */}
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '2px',
                    border: '1px solid #0284c7',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }} />
                  
                  {/* Fenster rechts */}
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '2px',
                    border: '1px solid #0284c7',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }} />
                </div>
                
                {/* Dach - schicke schräge Linie mit festem rechten Ende */}
                <div style={{
                  position: 'absolute',
                  top: '17px',
                  right: '17px',
                  width: '100px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)',
                  borderRadius: '2px',
                  transformOrigin: 'right center',
                  transform: `rotate(${coordinates.tilt}deg)`,
                  transition: 'transform 0.2s ease-out',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }} />
                
                {/* Sonne - verbessert */}
                <div style={{
                  position: 'absolute',
                  top: '-70px',
                  right: '-35px',
                  width: '25px',
                  height: '25px',
                  background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 70%, #d97706 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px #fbbf24, 0 0 40px rgba(251, 191, 36, 0.3)',
                  animation: 'pulse 3s ease-in-out infinite'
                }} />
                
                {/* Sonnenstrahlen */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-40px',
                  width: '35px',
                  height: '35px',
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(251, 191, 36, 0.3) 45deg, transparent 90deg, rgba(251, 191, 36, 0.3) 135deg, transparent 180deg, rgba(251, 191, 36, 0.3) 225deg, transparent 270deg, rgba(251, 191, 36, 0.3) 315deg, transparent 360deg)',
                  borderRadius: '50%',
                  animation: 'rotate 8s linear infinite'
                }} />
                
                {/* CSS-Animationen */}
                <style>
                  {`
                    @keyframes pulse {
                      0%, 100% { transform: scale(1); opacity: 1; }
                      50% { transform: scale(1.15); opacity: 0.9; }
                    }
                    @keyframes rotate {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            </div>
            
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
                background: `linear-gradient(to right, #e2e8f0 0%, #1e293b ${(coordinates.tilt / 90) * 100}%, #e2e8f0 ${(coordinates.tilt / 90) * 100}%)`,
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
