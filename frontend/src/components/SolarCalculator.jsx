import { useState } from 'react';
import { fetchSolarData } from '../services/api';
import ChartContainer from './ChartContainer';
import SolarDetails from './SolarDetails';
import LocationMap from './LocationMap';

export default function SolarCalculator() {
  const [solarData, setSolarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeUnit, setTimeUnit] = useState('day'); // 'day' oder 'year'
  const [showDetails, setShowDetails] = useState(false);
  
  // State für benutzerdefinierte Koordinaten
  const [coordinates, setCoordinates] = useState({
    lat: '',
    lng: '',
    area: '15',
    tilt: '35',
    azimuth: '180'
  });

  const handleCalculateSolar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSolarData(
        parseFloat(coordinates.lat), 
        parseFloat(coordinates.lng), 
        parseFloat(coordinates.area), 
        parseFloat(coordinates.tilt), 
        parseFloat(coordinates.azimuth)
      );
      console.log('Frontend hat Daten erhalten:', data);
      setSolarData(data);
    } catch (err) {
      console.error('Frontend-Fehler:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCoordinates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickLocation = (lat, lng, name) => {
    setCoordinates(prev => ({
      ...prev,
      lat,
      lng
    }));
    console.log(`Schnellstandort gesetzt: ${name} (${lat}, ${lng})`);
  };

  const handleMapLocationSelect = (lat, lng) => {
    setCoordinates(prev => ({
      ...prev,
      lat: lat.toString(),
      lng: lng.toString()
    }));
    console.log(`Standort von Karte gesetzt: (${lat}, ${lng})`);
  };

  return (
    <section style={{ 
      width: '100%',
      minHeight: '100vh',
      margin: '0',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Details-Seite anzeigen wenn showDetails true ist */}
      {showDetails ? (
        <SolarDetails 
          solarData={solarData} 
          inputs={solarData.inputs} 
          onBack={() => setShowDetails(false)}
        />
      ) : (
        <>
          {/* Header-Bereich */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            padding: '0'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: '0 0 16px 0',
              letterSpacing: '-0.025em'
            }}>
              Solar-Potential berechnen
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#4a5568',
              margin: '0',
              lineHeight: '1.6'
            }}>
              Wählen Sie Ihren Standort und die Dachparameter für eine präzise Solarpotential-Berechnung
            </p>
          </div>
      
          {/* Interaktive Karte zur Standortauswahl */}
          <div style={{ 
            marginBottom: '48px',
            padding: '0'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '32px',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              Standort auf der Karte wählen
            </h2>
            
            <div style={{ 
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '32px'
            }}>
              <LocationMap
                onLocationSelect={handleMapLocationSelect}
                selectedLat={coordinates.lat ? parseFloat(coordinates.lat) : null}
                selectedLng={coordinates.lng ? parseFloat(coordinates.lng) : null}
              />
            </div>
            
            {/* Aktuelle Koordinaten anzeigen */}
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
                  onChange={(e) => handleInputChange('lat', e.target.value)}
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
                  onChange={(e) => handleInputChange('lng', e.target.value)}
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

            {/* Dachparameter */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '32px', 
              marginTop: '32px',
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
                  fontWeight: '500',
                  color: '#4a5568'
                }}>
                  Dachfläche (m²)
                </label>
                <input
                  id="area"
                  type="number"
                  min="1"
                  value={coordinates.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
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
                <label htmlFor="tilt" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%', 
                  boxSizing: 'border-box',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#4a5568'
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
                  onChange={(e) => handleInputChange('tilt', e.target.value)}
                  style={{
                    width: '100%',
                      height: '8px',
                    borderRadius: '4px',
                      background: 'linear-gradient(to right, #e2e8f0 0%, #3182ce 50%, #e2e8f0 100%)',
                      outline: 'none',
                      cursor: 'pointer',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                    onInput={(e) => {
                      const value = e.target.value;
                      const percentage = (value / 90) * 100;
                      e.target.style.background = `linear-gradient(to right, #e2e8f0 0%, #3182ce ${percentage}%, #e2e8f0 ${percentage}%)`;
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: '#718096'
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
                  fontWeight: '500',
                  color: '#4a5568'
                }}>
                  Ausrichtung: {coordinates.azimuth}°
                </label>
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
                         transform: `translate(-50%, -50%) rotate(${coordinates.azimuth}deg)`,
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
                           
                           handleInputChange('azimuth', Math.round(angle).toString());
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
                         
                         handleInputChange('azimuth', Math.round(angle).toString());
                       }}
                     ></div>
                   </div>
                  
                  {/* Aktuelle Ausrichtung anzeigen */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#3182ce',
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    {coordinates.azimuth}°
                  </div>
                </div>
              </div>
            </div>
            
            {/* Schnellstandorte */}
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
                <button
                  onClick={() => handleQuickLocation('51.5413', '9.9158', 'Göttingen')}
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
                  Göttingen
                </button>
                <button
                  onClick={() => handleQuickLocation('52.5200', '13.4050', 'Berlin')}
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
                  Berlin
                </button>
                <button
                  onClick={() => handleQuickLocation('48.1351', '11.5820', 'München')}
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
                  München
                </button>
                <button
                  onClick={() => handleQuickLocation('34.08910', '-118.41069', 'Los Angeles')}
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
                  Los Angeles
                </button>
                <button
                  onClick={() => handleQuickLocation('50.9375', '6.9603', 'Köln')}
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
                  Köln
                </button>
              </div>
            </div>
          </div>
          
          {/* Berechnen-Button */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '48px',
            padding: '0'
          }}>
            <button 
              onClick={handleCalculateSolar}
              disabled={loading || !coordinates.lat || !coordinates.lng}
              style={{
                padding: '20px 40px',
                backgroundColor: loading || !coordinates.lat || !coordinates.lng ? '#cbd5e0' : '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: loading || !coordinates.lat || !coordinates.lng ? 'not-allowed' : 'pointer',
                fontSize: '1.125rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(49, 130, 206, 0.3)',
                minWidth: '280px'
              }}
              onMouseEnter={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(49, 130, 206, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && coordinates.lat && coordinates.lng) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(49, 130, 206, 0.3)';
                }
              }}
            >
              {loading ? 'Berechne...' : 'Solar-Potential berechnen'}
            </button>
          </div>
          
          {/* Fehlermeldung */}
          {error && (
            <div style={{ 
              color: '#e53e3e', 
              marginTop: '24px',
              padding: '16px 24px',
              backgroundColor: '#fed7d7',
              border: '1px solid #feb2b2',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '24px auto 0 auto',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Fehler: {error}
            </div>
          )}
          
          {/* Ergebnisse */}
          {solarData && (
            <div style={{ 
              marginTop: '48px', 
              padding: '32px', 
              backgroundColor: '#f7fafc', 
              borderRadius: '20px',
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#2d3748',
                margin: '0 0 24px 0',
                textAlign: 'center'
              }}>
                Berechnete Solar-Daten
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                marginBottom: '32px'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    margin: '0 0 16px 0'
                  }}>
                    Eingabeparameter
                  </h4>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      fontSize: '0.875rem'
                    }}>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Breitengrad:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.inputs.lat}°
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Längengrad:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.inputs.lng}°
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Dachfläche:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.inputs.area} m²
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Dachneigung:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.inputs.tilt}°
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Ausrichtung:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.inputs.azimuth}°
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#4a5568',
                    margin: '0 0 16px 0'
                  }}>
                    Ergebnisse
                  </h4>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      fontSize: '0.875rem'
                    }}>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Jährlicher Ertrag:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.annual_kWh?.toFixed(1) || 'N/A'} kWh
                        </div>
                      </div>
                      <div>
                        <span style={{ color: '#718096', fontWeight: '500' }}>Monatlicher Ø:</span>
                        <div style={{ color: '#2d3748', fontWeight: '600', marginTop: '4px' }}>
                          {solarData.annual_kWh ? (solarData.annual_kWh / 12).toFixed(1) : 'N/A'} kWh
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Toggle-Switch für Tag/Jahr */}
              <div style={{ 
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <label style={{ 
                  marginRight: '16px', 
                  fontWeight: '600',
                  color: '#4a5568',
                  fontSize: '0.875rem'
                }}>
                  Zeiteinheit:
                </label>
                <div style={{ 
                  display: 'inline-flex', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '24px', 
                  padding: '4px',
                  cursor: 'pointer'
                }}>
                  <button
                    onClick={() => setTimeUnit('day')}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: timeUnit === 'day' ? '#3182ce' : 'transparent',
                      color: timeUnit === 'day' ? 'white' : '#4a5568',
                      cursor: 'pointer',
                      fontWeight: timeUnit === 'day' ? '600' : '500',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem'
                    }}
                  >
                    Pro Tag
                  </button>
                  <button
                    onClick={() => setTimeUnit('year')}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: timeUnit === 'day' ? 'transparent' : '#3182ce',
                      color: timeUnit === 'day' ? '#4a5568' : 'white',
                      cursor: 'pointer',
                      fontWeight: timeUnit === 'day' ? '500' : '600',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem'
                    }}
                  >
                    Pro Jahr
                  </button>
                </div>
              </div>
              
              {/* Charts */}
              <ChartContainer 
                solarData={solarData} 
                timeUnit={timeUnit}
              />
              
              {/* Details-Button */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button
                  onClick={() => setShowDetails(true)}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#38a169',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(56, 161, 105, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(56, 161, 105, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(56, 161, 105, 0.3)';
                  }}
                >
                  Detaillierte Analyse anzeigen
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
