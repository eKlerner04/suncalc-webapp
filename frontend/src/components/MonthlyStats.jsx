import React from 'react';

const MonthlyStats = ({ solarData, inputs }) => {
  // Monatsdaten generieren (gleiche Logik wie im Chart)
  const generateMonthlyData = () => {
    if (solarData?.metadata?.monthly_data && 
        Array.isArray(solarData.metadata.monthly_data) && 
        solarData.metadata.monthly_data.length === 12 &&
        solarData.metadata.monthly_data.some(val => val > 0)) {
      return solarData.metadata.monthly_data;
    }
    
    const annual_kWh = solarData?.annual_kWh || 0;
    const monthlyDistribution = [
      0.04, 0.06, 0.10, 0.14, 0.16, 0.18, // Jan-Jun (Winter/Frühling)
      0.20, 0.18, 0.14, 0.10, 0.06, 0.04  // Jul-Dez (Sommer/Herbst)
    ];
    
    return monthlyDistribution.map(ratio => Math.round(annual_kWh * ratio));
  };

  const monthlyData = generateMonthlyData();
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  // Prüfe ob Daten vorhanden sind
  if (!monthlyData || monthlyData.every(val => val === 0)) {
    return (
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        padding: '24px', 
        marginBottom: '24px' 
      }}>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4B5563', marginBottom: '8px' }}>
            Keine Statistiken verfügbar
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Führe zuerst eine Solar-Berechnung durch
          </p>
        </div>
      </div>
    );
  }

  // Berechne Anteile und Trends
  const total = monthlyData.reduce((a, b) => a + b, 0);
  
  const getTrend = (index) => {
    if (index === 0) return '📉'; // Januar hat keinen Vormonat
    const current = monthlyData[index];
    const previous = monthlyData[index - 1];
    return current > previous ? '📈' : '📉';
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
      padding: '20px', 
      marginBottom: '20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          📊 Monatliche Solarerträge
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Aufschlüsselung des Solarertrags nach Monaten
        </p>
      </div>

      {/* Einfache Tabelle */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: '#F9FAFB',
              borderBottom: '2px solid #E5E7EB'
            }}>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Monat
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                kWh
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'right', 
                fontWeight: '600', 
                color: '#374151',
                borderRight: '1px solid #E5E7EB'
              }}>
                Anteil
              </th>
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center', 
                fontWeight: '600', 
                color: '#374151'
              }}>
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((value, index) => {
              const percentage = Math.round((value / total) * 100);
              const trend = getTrend(index);
              
              return (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #F3F4F6',
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                }}>
                  <td style={{ 
                    padding: '12px 16px', 
                    fontWeight: '500', 
                    color: '#374151',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    {months[index]}
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    textAlign: 'right', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    {value} kWh
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    textAlign: 'right', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    borderRight: '1px solid #E5E7EB'
                  }}>
                    {percentage}%
                  </td>
                  <td style={{ 
                    padding: '12px 16px', 
                    textAlign: 'center', 
                    fontSize: '16px'
                  }}>
                    {trend}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Balkendiagramm */}
      <div style={{ 
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '2px solid #F1F5F9'
      }}>
        <h4 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          📈 Monatlicher Solarertrag - Balkendiagramm
        </h4>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          justifyContent: 'space-between',
          height: '200px',
          padding: '0 8px',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}>
          {/* Y-Achse Beschriftung */}
          <div style={{
            position: 'absolute',
            left: '-40px',
            top: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6B7280',
            fontWeight: '500'
          }}>
            <span>{Math.max(...monthlyData)}</span>
            <span>{Math.round(Math.max(...monthlyData) * 0.75)}</span>
            <span>{Math.round(Math.max(...monthlyData) * 0.5)}</span>
            <span>{Math.round(Math.max(...monthlyData) * 0.25)}</span>
            <span>0</span>
          </div>

          {/* Y-Achse Linien */}
          <div style={{
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <div key={index} style={{
                height: '1px',
                backgroundColor: '#E2E8F0',
                width: '100%'
              }} />
            ))}
          </div>

          {/* Balken */}
          {monthlyData.map((value, index) => {
            const maxValue = Math.max(...monthlyData);
            const height = (value / maxValue) * 100;
            const monthAbbr = months[index].substring(0, 3);
            
            return (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                margin: '0 2px'
              }}>
                {/* Balken */}
                <div style={{
                  width: '100%',
                  maxWidth: '24px',
                  height: `${height}%`,
                  backgroundColor: value === maxValue ? '#10B981' : '#3B82F6',
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  minHeight: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = value === maxValue ? '#059669' : '#2563EB';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = value === maxValue ? '#10B981' : '#3B82F6';
                  e.target.style.transform = 'scale(1)';
                }}
                title={`${months[index]}: ${value} kWh (${Math.round((value / total) * 100)}%)`}
                >
                  {/* Tooltip */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1F2937',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0';
                  }}
                  >
                    {value} kWh
                  </div>
                </div>
                
                {/* Monatsname */}
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '11px', 
                  fontWeight: '500', 
                  color: '#6B7280',
                  textAlign: 'center',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {monthAbbr}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Achse Beschriftung */}
        <div style={{ 
          marginTop: '8px', 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#6B7280',
          fontWeight: '500'
        }}>
          Monate
        </div>

        {/* Legende */}
        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#3B82F6', 
              borderRadius: '2px' 
            }}></div>
            <span style={{ color: '#6B7280' }}>Monatlicher Ertrag</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#10B981', 
              borderRadius: '2px' 
            }}></div>
            <span style={{ color: '#6B7280' }}>Höchster Ertrag</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats;
