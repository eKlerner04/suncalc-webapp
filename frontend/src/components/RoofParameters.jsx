import React from 'react';
import Compass from './Compass';
import SearchHistory from './SearchHistory';

export default function RoofParameters({ coordinates, onInputChange, onRestoreSearch }) {
  console.log('🏗️ [RoofParameters] Komponente wird gerendert, onRestoreSearch:', onRestoreSearch);
  
  return (
    <div style={{ 
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
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
            Modulfläche: <span style={{ color: '#00000', fontWeight: '700' }}>{coordinates.area} m²</span>
          </label>
          
                  {/* Dachfläche - Einfache Darstellung */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          height: '200px',
          alignItems: 'center',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <style>
            {`
              @keyframes cellAppear {
                0% {
                  opacity: 0;
                  transform: scale(0.8) rotate(-5deg);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.1) rotate(2deg);
                }
                100% {
                  opacity: 1;
                  transform: scale(1) rotate(0deg);
                }
              }
              
              @keyframes panelExpand {
                0% {
                  transform: scaleX(0.8);
                }
                100% {
                  transform: scaleX(1);
                }
              }
            `}
          </style>
            {/* Einfache Dachfläche-Visualisierung */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Solarpanel-Design wie im Bild */}
              <div style={{
                width: `${Math.min(90, Math.max(40, coordinates.area * 2.2))}%`,
                height: `${Math.min(70, Math.max(30, coordinates.area * 1.6))}%`,
                background: '#ffffff',
                borderRadius: '8px',
                border: '3px solid #374151',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'panelExpand 0.8s ease-out'
              }}>
                {/* Innerer Rahmen */}
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  right: '6px',
                  bottom: '6px',
                  border: '1px solid #9ca3af',
                  borderRadius: '4px'
                }} />
                
                {/* Vertikale Teilung (mittlere Linie) - nur ab 15 m² */}
                {coordinates.area >= 15 && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    width: '2px',
                    height: 'calc(100% - 12px)',
                    background: '#374151',
                    transform: 'translateX(-50%)'
                  }} />
                )}
                
                {/* Solarzellen-Gitter - Linke Seite (immer sichtbar) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: coordinates.area >= 15 ? 'calc(50% - 18px)' : 'calc(100% - 24px)',
                  height: 'calc(100% - 24px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap: '2px'
                }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    // Berechne, wie viele Zellen bei der aktuellen Fläche sichtbar sein sollen
                    const visibleCells = Math.min(12, Math.ceil(coordinates.area * 0.8));
                    const isVisible = i < visibleCells;
                    
                    return (
                      <div key={`left-${i}`} style={{
                        background: isVisible ? '#6b7280' : '#e5e7eb',
                        border: '1px solid #374151',
                        borderRadius: '2px',
                        animation: isVisible ? `cellAppear 0.6s ease-out ${i * 0.05}s both` : 'none',
                        opacity: isVisible ? 1 : 0.3,
                        transform: isVisible ? 'scale(0.8)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }} />
                    );
                  })}
                </div>
                
                {/* Solarzellen-Gitter - Rechte Seite (nur ab 15 m²) */}
                {coordinates.area >= 15 && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: 'calc(50% - 18px)',
                    height: 'calc(100% - 24px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: '2px'
                  }}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={`right-${i}`} style={{
                        background: '#6b7280',
                        border: '1px solid #374151',
                        borderRadius: '2px',
                        animation: `cellAppear 0.6s ease-out ${(i + 12) * 0.05}s both`,
                        opacity: 0,
                        transform: 'scale(0.8)'
                      }} />
                    ))}
                  </div>
                )}
              </div>
              

            </div>
          </div>
          
          <input
            id="area"
            type="number"
            min="0.01"
            step="0.01"
            value={coordinates.area}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value < 0.01) {
                e.target.setCustomValidity('Die Modulfläche muss mindestens 0,01 m² betragen');
                e.target.style.borderColor = '#dc2626';
              } else {
                e.target.setCustomValidity('');
                e.target.style.borderColor = '#e2e8f0';
              }
              onInputChange('area', e.target.value);
            }}
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
              if (parseFloat(e.target.value) < 0.01) {
                e.target.style.borderColor = '#dc2626';
              } else {
                e.target.style.borderColor = '#e2e8f0';
              }
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {/* Warnung für Mindestfläche - nur bei ungültigen Werten */}
          {parseFloat(coordinates.area) < 0.01 && (
            <div style={{
              marginTop: '8px',
              fontSize: '0.75rem',
              color: '#dc2626',
              fontStyle: 'italic',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              Mindestfläche: 0,01 m²
            </div>
          )}
          
          {/* CSS-Animationen für Dachfläche */}
          <style>
            {`
              @keyframes tileMove {
                0% { transform: translateX(0px) translateY(0px); }
                100% { transform: translateX(-10px) translateY(-10px); }
              }
              @keyframes shine {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
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
            padding: '0px 0'
          }}>
            {/* Dach-Animation - Graphisch verbessert */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px',
              height: '200px',
              alignItems: 'flex-end',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '0px',
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
                  top: '20px',
                  right: '20px',
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
                  top: '-100px',
                  right: '-10px',
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
                  top: '-100px',
                  right: '-10px',
                  width: '25px',
                  height: '25px',
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

      {/* Suchverlauf */}
      <SearchHistory onRestoreSearch={onRestoreSearch} />
    </div>
  );
}
