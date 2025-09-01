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
    </div>
  );
};

export default MonthlyStats;
