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
      <div style={{ marginTop: '32px' }}>
        <h4 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1F2937', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          📊 Monatliche Solarerträge - Balkendiagramm
        </h4>
        

        
        <div style={{ 
          backgroundColor: '#F9FAFB', 
          borderRadius: '8px', 
          padding: '20px',
          border: '1px solid #E5E7EB',
          minHeight: '400px'
        }}>
          {monthlyData && monthlyData.length > 0 ? (
            <>
              {/* Y-Achse Labels und Diagramm */}
              <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '300px' }}>
                {/* Y-Achse */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  height: '100%',
                  minWidth: '40px',
                  paddingRight: '8px'
                }}>
                  {(() => {
                    const maxValue = Math.max(...monthlyData);
                    const yAxisSteps = Math.ceil(maxValue / 50) * 50;
                    const steps = [];
                    for (let i = yAxisSteps; i >= 0; i -= 50) {
                      steps.push(i);
                    }
                    return steps.map(value => (
                      <div key={value} style={{ 
                        fontSize: '12px', 
                        color: '#6B7280',
                        textAlign: 'right',
                        lineHeight: '1'
                      }}>
                        {value}
                      </div>
                    ));
                  })()}
                </div>
                
                {/* Diagramm-Bereich */}
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'end', 
                  gap: '4px',
                  height: '100%',
                  position: 'relative'
                }}>
                  {/* Y-Achse Linien */}
                  {(() => {
                    const maxValue = Math.max(...monthlyData);
                    const yAxisSteps = Math.ceil(maxValue / 50) * 50;
                    const steps = [];
                    for (let i = yAxisSteps; i >= 0; i -= 50) {
                      steps.push(i);
                    }
                    return steps.map((value, index) => (
                      <div
                        key={value}
                        style={{
                          position: 'absolute',
                          top: `${(index / (steps.length - 1)) * 100}%`,
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: '#E5E7EB',
                          zIndex: 1
                        }}
                      />
                    ));
                  })()}
                  
                  {/* Balken */}
                  {monthlyData.map((value, index) => {
                    const maxValue = Math.max(...monthlyData);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const isPeakMonth = value === maxValue;
                    
                    return (
                      <div key={index} style={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        {/* Balken */}
                        <div style={{
                          width: '100%',
                          height: `${height}%`,
                          backgroundColor: isPeakMonth ? '#10B981' : '#3B82F6',
                          borderRadius: '4px 4px 0 0',
                          minHeight: value > 0 ? '4px' : '0px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = isPeakMonth ? '#059669' : '#2563EB';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = isPeakMonth ? '#10B981' : '#3B82F6';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title={`${months[index]}: ${value} kWh`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* X-Achse Labels */}
              <div style={{ 
                display: 'flex', 
                marginTop: '12px',
                marginLeft: '48px'
              }}>
                {months.map((month, index) => (
                  <div key={index} style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    fontSize: '12px', 
                    color: '#6B7280',
                    fontWeight: '500'
                  }}>
                    {month.substring(0, 3)}
                  </div>
                ))}
              </div>
              
              {/* Legende */}
              <div style={{ 
                marginTop: '16px', 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px',
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
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#6B7280'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Keine Diagrammdaten verfügbar
              </div>
              <div style={{ fontSize: '14px' }}>
                Monatliche Daten werden geladen...
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MonthlyStats;
