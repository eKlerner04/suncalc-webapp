import React from 'react';

const SolarChart = ({ solarData, inputs }) => {
  // Monatsdaten generieren - verwende immer die API-Daten wenn verfügbar
  const generateMonthlyData = () => {
    const annual_kWh = solarData?.annual_kWh || 0;
    
    // Verwende echte monatliche Daten von der API wenn verfügbar
    if (solarData?.metadata?.monthly_data && 
        Array.isArray(solarData.metadata.monthly_data) && 
        solarData.metadata.monthly_data.length === 12 &&
        solarData.metadata.monthly_data.some(val => val > 0)) {
      console.log('✅ Verwende echte monatliche Daten von API:', solarData.metadata.monthly_data);
      return solarData.metadata.monthly_data;
    }
    
    // Fallback: Schätzung basierend auf Jahresertrag
    console.log(`📊 Generiere geschätzte monatliche Daten für ${annual_kWh} kWh/Jahr`);
    
    // Realistische monatliche Verteilung für Deutschland/Europa
    const monthlyDistribution = [
      0.04, 0.06, 0.10, 0.14, 0.16, 0.18, // Jan-Jun (Winter/Frühling)
      0.20, 0.18, 0.14, 0.10, 0.06, 0.04  // Jul-Dez (Sommer/Herbst)
    ];
    
    const estimatedData = monthlyDistribution.map(ratio => Math.round(annual_kWh * ratio));
    console.log('📅 Geschätzte monatliche Daten:', estimatedData);
    return estimatedData;
  };

  const monthlyData = generateMonthlyData();
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  
  // Bestimme Datenquelle für Beschreibung
  const hasRealMonthlyData = solarData?.metadata?.monthly_data && 
    Array.isArray(solarData.metadata.monthly_data) && 
    solarData.metadata.monthly_data.length === 12 &&
    solarData.metadata.monthly_data.some(val => val > 0);
  
  const dataSource = solarData?.cache?.source || solarData?.source || 'unbekannt';
  const isPVGIS = dataSource === 'pvgis';
  const isNASA = dataSource === 'nasa_power';

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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4B5563', marginBottom: '8px' }}>
            Keine Diagramm-Daten verfügbar
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Führe zuerst eine Solar-Berechnung durch
          </p>
        </div>
      </div>
    );
  }

  // Berechne Anteile und Trends
  const totalAnnual = monthlyData.reduce((sum, val) => sum + val, 0);
  const originalAnnual = solarData?.annual_kWh || 0;
  
  // Verwende die Summe der monatlichen Daten für die Gesamt-Zeile (realistischer)
  const displayTotal = totalAnnual;
  
  const getTrend = (index) => {
    if (index === 0) return '↓'; // Januar hat keinen Vormonat
    const current = monthlyData[index];
    const previous = monthlyData[index - 1];
    return current > previous ? '↑' : '↓';
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
          Monatliche Solarerträge
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
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
              const percentage = Math.round((value / displayTotal) * 100);
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
            
            {/* Gesamt-Zeile */}
            <tr style={{ 
              borderTop: '2px solid #E5E7EB',
              backgroundColor: '#F3F4F6',
              fontWeight: '700'
            }}>
              <td style={{ 
                padding: '16px 16px', 
                fontWeight: '700', 
                color: '#1F2937',
                borderRight: '1px solid #E5E7EB',
                fontSize: '15px'
              }}>
                Gesamt
              </td>
              <td style={{ 
                padding: '16px 16px', 
                textAlign: 'right', 
                fontWeight: '700', 
                color: '#1F2937',
                borderRight: '1px solid #E5E7EB',
                fontSize: '15px'
              }}>
                {displayTotal} kWh
              </td>
              <td style={{ 
                padding: '16px 16px', 
                textAlign: 'right', 
                fontWeight: '700', 
                color: '#1F2937',
                borderRight: '1px solid #E5E7EB',
                fontSize: '15px'
              }}>
                100%
              </td>
              <td style={{ 
                padding: '16px 16px', 
                textAlign: 'center', 
                fontSize: '16px'
              }}>
                ↑
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Balkendiagramm */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#1F2937', 
          marginBottom: '8px'
        }}>
          Monatliche Solarerträge - Balkendiagramm
        </h3>
        
        <div style={{ 
          backgroundColor: '#F9FAFB', 
          borderRadius: '8px', 
          padding: '30px',
          border: '1px solid #E5E7EB',
          minHeight: '500px'
        }}>
          {/* Y-Achse Labels und Diagramm */}
          <div style={{ display: 'flex', alignItems: 'end', gap: '12px', height: '400px' }}>
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
                
                // Dynamische Y-Achse: beginnt immer bei 0, Maximum angepasst an Daten
                const stepSize = Math.max(50, Math.ceil(maxValue / 8 / 50) * 50); // Mindestens 50, aber angepasst an Datenbereich
                const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
                const yAxisMin = 0; // Immer bei 0 beginnen
                
                const steps = [];
                for (let i = yAxisMax; i >= yAxisMin; i -= stepSize) {
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
                const stepSize = Math.max(50, Math.ceil(maxValue / 8 / 50) * 50);
                const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
                const yAxisMin = 0;
                
                const steps = [];
                for (let i = yAxisMax; i >= yAxisMin; i -= stepSize) {
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
                const stepSize = Math.max(50, Math.ceil(maxValue / 8 / 50) * 50);
                const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
                const yAxisMin = 0;
                const yAxisRange = yAxisMax - yAxisMin;
                
                const chartHeight = 400; // Feste Diagramm-Höhe in Pixeln
                const heightInPixels = yAxisRange > 0 ? (value / yAxisRange) * chartHeight : 0;
                const isPeakMonth = value === maxValue;
                
                return (
                  <div key={index} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                    height: `${chartHeight}px`,
                    justifyContent: 'flex-end'
                  }}>
                    {/* Unsichtbarer Platzhalter für die Basislinie */}
                    <div style={{
                      width: '100%',
                      height: `${chartHeight - heightInPixels}px`,
                      minHeight: '0px'
                    }}></div>
                    {/* Balken */}
                    <div style={{
                      width: '100%',
                      height: `${heightInPixels}px`,
                      backgroundColor: isPeakMonth ? '#10B981' : '#3B82F6',
                      borderRadius: '4px 4px 0 0',
                      minHeight: value > 0 ? '4px' : '0px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={`${months[index]}: ${value} kWh`}
                    >
                      {/* Wert-Anzeige im Balken */}
                      {value > 0 && (
                        <div style={{
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: '600',
                          textAlign: 'center',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          lineHeight: '1',
                          transform: 'rotate(-90deg)',
                          whiteSpace: 'nowrap'
                        }}>
                          {value}
                        </div>
                      )}
                    </div>
                    

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
        </div>
      </div>

    </div>
  );
};

export default SolarChart;
