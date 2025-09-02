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
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
          Aufschlüsselung des Solarertrags nach Monaten
        </p>
        <div style={{ 
          backgroundColor: '#F0F9FF', 
          border: '1px solid #BAE6FD', 
          borderRadius: '6px', 
          padding: '8px 12px', 
          fontSize: '12px',
          color: '#0369A1',
          marginBottom: '16px'
        }}>
          {hasRealMonthlyData ? (
            isPVGIS ? (
              <span><strong>Echte monatliche Daten</strong> von PVGIS API - basierend auf historischen Strahlungsmessungen für diesen Standort</span>
            ) : isNASA ? (
              <span><strong>Geschätzte monatliche Daten</strong> basierend auf NASA POWER Strahlungsdaten - realistisch für diesen Standort</span>
            ) : (
              <span><strong>Echte monatliche Daten</strong> von der API - spezifisch für diesen Standort</span>
            )
          ) : (
            <span><strong>Geschätzte monatliche Daten</strong> - typische Verteilung für die Region</span>
          )}
        </div>
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
      <div style={{ 
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '2px solid #F1F5F9'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#1F2937', 
          marginBottom: '8px',
          textAlign: 'left'
        }}>
          Monatlicher Solarertrag - Balkendiagramm
        </h3>
        
        <div style={{ 
          position: 'relative',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          padding: '20px 20px 20px 80px',
          minHeight: '300px'
        }}>
          {/* Y-Achse Beschriftung */}
          <div style={{
            position: 'absolute',
            left: '15px',
            top: '20px',
            bottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6B7280',
            fontWeight: '500',
            width: '40px',
            textAlign: 'right'
          }}>
            {(() => {
              const maxValue = Math.max(...monthlyData);
              // Berechne schöne, gleichmäßige Intervalle
              const step = Math.ceil(maxValue / 4 / 50) * 50; // Runde auf nächste 50er-Stelle
              const yAxisValues = [step * 4, step * 3, step * 2, step, 0];
              return yAxisValues.map((value, index) => (
                <span key={index}>{value}</span>
              ));
            })()}
          </div>

          {/* Y-Achse Label */}
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            fontSize: '12px',
            color: '#6B7280',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            kWh
          </div>

          {/* Y-Achse Linien */}
          <div style={{
            position: 'absolute',
            left: '80px',
            top: '20px',
            right: '20px',
            bottom: '20px',
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

          {/* Balken Container */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'end', 
            justifyContent: 'space-between',
            height: '240px',
            gap: '4px',
            marginLeft: '20px'
          }}>
            {monthlyData.map((value, index) => {
              const maxValue = Math.max(...monthlyData);
              // Verwende die gleiche Logik wie für die Y-Achse
              const step = Math.ceil(maxValue / 4 / 50) * 50;
              const maxYAxisValue = step * 4;
              const heightPercentage = maxYAxisValue > 0 ? (value / maxYAxisValue) * 100 : 0;
              const actualHeight = Math.max((heightPercentage / 100) * 240, value > 0 ? 8 : 0);
              const monthAbbr = months[index].substring(0, 3);
              const isHighest = value === maxValue && value > 0;
              
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  {/* Wert über dem Balken */}
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '4px'
                  }}>
                    {value}
                  </div>
                  
                  {/* Balken */}
                  <div style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${actualHeight}px`,
                    backgroundColor: isHighest ? '#10B981' : '#3B82F6',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: value > 0 ? '8px' : '0px',
                    boxShadow: isHighest ? '0 4px 8px rgba(16, 185, 129, 0.3)' : '0 2px 4px rgba(59, 130, 246, 0.2)',
                    border: isHighest ? '2px solid #059669' : '1px solid #2563EB',
                    transform: 'scaleY(1)',
                    transformOrigin: 'bottom',
                    alignSelf: 'flex-end'
                  }}
                  title={`${months[index]}: ${value} kWh (${Math.round((value / displayTotal) * 100)}%)`}
                  >
                  </div>
                  
                  {/* Monatsname */}
                  <div style={{ 
                    marginTop: '12px', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#6B7280',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    transform: 'rotate(-45deg)',
                    transformOrigin: 'center'
                  }}>
                    {monthAbbr}
                  </div>
                </div>
              );
            })}
          </div>
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#3B82F6', 
              borderRadius: '2px'
            }}></div>
            <span style={{ color: '#6B7280' }}>Monatlicher Ertrag</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
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

export default SolarChart;
