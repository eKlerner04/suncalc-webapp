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
            Dachfläche (m²)
          </label>
          
          {/* Dachfläche-Animation - Schicker gemacht */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            height: '200px',
            alignItems: 'flex-end',
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '16px',
            padding: '0px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            {/* Hintergrund-Textur */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
              pointerEvents: 'none'
            }} />
            {/* Dachfläche-Visualisierung */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
                {/* Dachfläche als animierte Fläche - Schicker gemacht */}
               <div style={{
                 width: `${Math.min(80, Math.max(20, coordinates.area * 2))}%`,
                 height: `${Math.min(60, Math.max(15, coordinates.area * 1.5))}%`,
                 background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 40%, #991b1b 70%, #7f1d1d 100%)',
                 borderRadius: '12px',
                 border: '3px solid #7f1d1d',
                 boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                 transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                 position: 'relative',
                 overflow: 'hidden',
                 transform: 'perspective(100px) rotateX(5deg)',
                 filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
               }}>
                 {/* Dachziegel-Muster - Schicker gemacht */}
                 <div style={{
                   position: 'absolute',
                   top: '0',
                   left: '0',
                   width: '100%',
                   height: '100%',
                   background: `
                     repeating-linear-gradient(
                       90deg,
                       transparent 0px,
                       transparent 6px,
                       rgba(255,255,255,0.15) 6px,
                       rgba(255,255,255,0.15) 8px
                     ),
                     repeating-linear-gradient(
                       0deg,
                       transparent 0px,
                       transparent 6px,
                       rgba(255,255,255,0.15) 6px,
                       rgba(255,255,255,0.15) 8px
                     )
                   `,
                   animation: 'tileMove 4s linear infinite'
                 }} />
                 
                 {/* Sonnenreflexion - Schicker gemacht */}
                 <div style={{
                   position: 'absolute',
                   top: '8%',
                   left: '8%',
                   width: '35%',
                   height: '25%',
                   background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
                   borderRadius: '50%',
                   animation: 'shine 5s ease-in-out infinite',
                   filter: 'blur(1px)'
                 }} />
                 
                 {/* Zusätzliche Glanzpunkte */}
                 <div style={{
                   position: 'absolute',
                   top: '25%',
                   right: '15%',
                   width: '20%',
                   height: '15%',
                   background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 60%)',
                   borderRadius: '50%',
                   animation: 'shine 3s ease-in-out infinite 1s'
                 }} />
              </div>
              
                {/* Größenanzeige - Schicker gemacht */}
               <div style={{
                 position: 'absolute',
                 bottom: '12px',
                 right: '12px',
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                 padding: '6px 12px',
                 borderRadius: '12px',
                 fontSize: '0.8rem',
                 fontWeight: '700',
                 color: '#1e293b',
                 border: '2px solid rgba(255,255,255,0.8)',
                 boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                 backdropFilter: 'blur(10px)',
                 letterSpacing: '0.5px'
               }}>
                 {coordinates.area} m²
               </div>
            </div>
          </div>
          
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
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
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
