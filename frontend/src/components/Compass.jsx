import React from 'react';

export default function Compass({ azimuth, onInputChange }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      {/* Elegante Windrose */}
      <div style={{
        position: 'relative',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #f8fafc 0deg, #e2e8f0 45deg, #f1f5f9 90deg, #e2e8f0 135deg, #f8fafc 180deg, #e2e8f0 225deg, #f1f5f9 270deg, #e2e8f0 315deg, #f8fafc 360deg)',
        border: '3px solid #e2e8f0',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 2px 8px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.3s ease'
      }}>
        {/* Äußerer Ring für bessere Definition */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #cbd5e0 0%, #e2e8f0 50%, #f1f5f9 100%)',
          zIndex: '-1'
        }}></div>
        
        {/* Innere Kreise für Tiefe */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          bottom: '15px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(241, 245, 249, 0.4) 70%, transparent 100%)',
          border: '1px solid rgba(255, 255, 255, 0.6)'
        }}></div>
        
        {/* Gradmarkierungen mit verbesserter Optik */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '3px',
              height: deg % 90 === 0 ? '20px' : '12px',
              backgroundColor: deg % 90 === 0 ? '#64748b' : '#94a3b8',
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-105px)`,
              transformOrigin: 'center bottom',
              borderRadius: '1.5px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          ></div>
        ))}
        
        {/* Himmelsrichtungen - außerhalb positioniert */}
        <div style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1rem',
          fontWeight: '800',
          color: '#1e293b',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>N</div>
        <div style={{
          position: 'absolute',
          bottom: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1rem',
          fontWeight: '800',
          color: '#1e293b',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>S</div>
        <div style={{
          position: 'absolute',
          left: '-25px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
          fontWeight: '800',
          color: '#1e293b',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>W</div>
        <div style={{
          position: 'absolute',
          right: '-25px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
          fontWeight: '800',
          color: '#1e293b',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>O</div>
        
        {/* Zwischenrichtungen - elegant positioniert */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#475569',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '2px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>NO</div>
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#475569',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '2px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>NW</div>
        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#475569',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '2px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>SO</div>
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '15px',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: '#475569',
          textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '2px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.5)'
        }}>SW</div>
        
        {/* Elegantes Zentrum */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
          border: '2px solid #cbd5e0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.9)',
          transform: 'translate(-50%, -50%)',
          zIndex: '10'
        }}></div>
        
        {/* Elegante greifbare Kompass-Nadel */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50px',
            height: '100px',
            transform: `translate(-50%, -50%) rotate(${azimuth}deg)`,
            zIndex: '20',
            cursor: 'grab',
            userSelect: 'none',
            transition: 'filter 0.2s ease'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let isDragging = false;
            const compassElement = document.querySelector('[data-compass]');
            
            const handleMouseMove = (e) => {
              if (!isDragging) {
                isDragging = true;
                document.body.style.cursor = 'grabbing';
                e.currentTarget.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(49, 130, 206, 0.6))';
              }
              
              e.preventDefault();
              
              const rect = compassElement.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              
              const deltaX = e.clientX - centerX;
              const deltaY = centerY - e.clientY;
              
              let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
              angle = (90 - angle + 360) % 360;
              
              // Sofort den Wert aktualisieren
              onInputChange('azimuth', Math.round(angle).toString());
            };
            
            const handleMouseUp = (e) => {
              document.removeEventListener('mousemove', handleMouseMove, true);
              document.removeEventListener('mouseup', handleMouseUp, true);
              document.body.style.cursor = '';
              e.currentTarget.style.filter = '';
              isDragging = false;
            };
            
            document.addEventListener('mousemove', handleMouseMove, true);
            document.addEventListener('mouseup', handleMouseUp, true);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = 'grab';
            e.currentTarget.style.filter = 'brightness(1.1) drop-shadow(0 0 15px rgba(49, 130, 206, 0.4))';
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget.style.cursor !== 'grabbing') {
              e.currentTarget.style.filter = '';
            }
          }}
          onDragStart={(e) => {
            e.preventDefault();
            return false;
          }}
        >
          {/* Hauptzeiger mit Gradient */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '8px',
            height: '80px',
            background: 'linear-gradient(180deg, #4299e1 0%, #3182ce 50%, #2c5aa0 100%)',
            borderRadius: '4px',
            transform: 'translateX(-50%) translateY(-50%)',
            boxShadow: '0 4px 20px rgba(49, 130, 206, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none',
            transition: 'all 0.2s ease'
          }}></div>
          
          {/* Elegante Pfeilspitze */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '18px solid #3182ce',
            transform: 'translateX(-50%) translateY(-50%) translateY(-40px)',
            filter: 'drop-shadow(0 4px 12px rgba(49, 130, 206, 0.5)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))',
            pointerEvents: 'none'
          }}></div>
          
          {/* Südpol der Nadel */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '30px',
            background: 'linear-gradient(180deg, #fc8181 0%, #e53e3e 50%, #c53030 100%)',
            borderRadius: '3px',
            transform: 'translateX(-50%) translateY(-50%) translateY(40px)',
            boxShadow: '0 3px 12px rgba(229, 62, 62, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: 'none'
          }}></div>
          
          {/* Zentral-Punkt */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '16px',
            height: '16px',
            background: 'radial-gradient(circle, #ffffff 0%, #e2e8f0 50%, #cbd5e0 100%)',
            borderRadius: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.8)',
            border: '2px solid #3182ce',
            pointerEvents: 'none',
            zIndex: '1'
          }}></div>
        </div>
        
        {/* Klickbare Bereiche für schnelle Auswahl */}
        <div
          data-compass
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const clickX = e.clientX;
            const clickY = e.clientY;
            
            // Berechne Winkel
            const deltaX = clickX - centerX;
            const deltaY = centerY - clickY;
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            
            // Konvertiere zu 0-360 Grad (0° = Norden)
            angle = (90 - angle + 360) % 360;
            
            // Sofort den Wert aktualisieren
            onInputChange('azimuth', Math.round(angle).toString());
          }}
        ></div>
      </div>
      

      
      {/* Direkte Gradzahl-Eingabe */}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input
          type="number"
          min="0"
          max="359"
          value={azimuth}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            const clampedValue = Math.max(0, Math.min(359, value));
            onInputChange('azimuth', clampedValue.toString());
          }}
          onBlur={(e) => {
            const value = parseInt(e.target.value) || 0;
            const clampedValue = Math.max(0, Math.min(359, value));
            onInputChange('azimuth', clampedValue.toString());
          }}
          style={{
            width: '60px',
            padding: '6px 8px',
            fontSize: '0.875rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            textAlign: 'center',
            outline: 'none',
            transition: 'all 0.2s ease'
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
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#64748b'
        }}>
          °
        </span>
      </div>
    </div>
  );
}
