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

  // Statistiken berechnen
  const maxMonth = months[monthlyData.indexOf(Math.max(...monthlyData))];
  const minMonth = months[monthlyData.indexOf(Math.min(...monthlyData))];
  const average = Math.round(monthlyData.reduce((a, b) => a + b, 0) / 12);
  const total = monthlyData.reduce((a, b) => a + b, 0);

  // Sommer/Winter-Verhältnis
  const summerMonths = monthlyData.slice(4, 9); // Mai bis September
  const winterMonths = [...monthlyData.slice(0, 3), ...monthlyData.slice(9, 12)]; // Jan-Mär, Okt-Dez
  const summerTotal = summerMonths.reduce((a, b) => a + b, 0);
  const winterTotal = winterMonths.reduce((a, b) => a + b, 0);
  const summerRatio = Math.round((summerTotal / total) * 100);

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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          📈 Detaillierte Monatsstatistiken
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Aufschlüsselung des Solarertrags nach Monaten
        </p>
      </div>

      {/* Hauptstatistiken */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', 
          borderRadius: '8px', 
          padding: '16px', 
          color: 'white' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{maxMonth}</div>
          <div style={{ color: '#BFDBFE', fontSize: '14px' }}>Bester Monat</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>
            {Math.max(...monthlyData)} kWh
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #10B981, #047857)', 
          borderRadius: '8px', 
          padding: '16px', 
          color: 'white' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{average}</div>
          <div style={{ color: '#A7F3D0', fontSize: '14px' }}>Monatsdurchschnitt</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>kWh</div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #F59E0B, #D97706)', 
          borderRadius: '8px', 
          padding: '16px', 
          color: 'white' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{minMonth}</div>
          <div style={{ color: '#FDE68A', fontSize: '14px' }}>Schwächster Monat</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>
            {Math.min(...monthlyData)} kWh
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
          borderRadius: '8px', 
          padding: '16px', 
          color: 'white' 
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{total}</div>
          <div style={{ color: '#DDD6FE', fontSize: '14px' }}>Jahresgesamt</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>kWh</div>
        </div>
      </div>

      {/* Saisonalität */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ backgroundColor: '#FEF3C7', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
            ☀️ Sommer-Performance (Mai-Sep)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#92400E' }}>Gesamtertrag:</span>
              <span style={{ fontWeight: '600', color: '#92400E' }}>{summerTotal} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#92400E' }}>Anteil am Jahr:</span>
              <span style={{ fontWeight: '600', color: '#92400E' }}>{summerRatio}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#92400E' }}>Durchschnitt:</span>
              <span style={{ fontWeight: '600', color: '#92400E' }}>
                {Math.round(summerTotal / 5)} kWh/Monat
              </span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#DBEAFE', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1E40AF', marginBottom: '12px' }}>
            ❄️ Winter-Performance (Okt-Mär)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#1E40AF' }}>Gesamtertrag:</span>
              <span style={{ fontWeight: '600', color: '#1E40AF' }}>{winterTotal} kWh</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#1E40AF' }}>Anteil am Jahr:</span>
              <span style={{ fontWeight: '600', color: '#1E40AF' }}>{100 - summerRatio}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#1E40AF' }}>Durchschnitt:</span>
              <span style={{ fontWeight: '600', color: '#1E40AF' }}>
                {Math.round(winterTotal / 7)} kWh/Monat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monatstabelle */}
      <div style={{ 
        overflowX: 'auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <table style={{ 
          width: '100%', 
          fontSize: '14px',
          minWidth: '600px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '8px', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Monat</th>
              <th style={{ padding: '8px', textAlign: 'right', color: '#374151', fontWeight: '600' }}>kWh</th>
              <th style={{ padding: '8px', textAlign: 'right', color: '#374151', fontWeight: '600' }}>Anteil</th>
              <th style={{ padding: '8px', textAlign: 'center', color: '#374151', fontWeight: '600' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((kwh, index) => {
              const percentage = Math.round((kwh / total) * 100);
              const isHigh = kwh > average * 1.2;
              const isLow = kwh < average * 0.8;
              
              return (
                <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '8px', color: '#374151', fontWeight: '500' }}>
                    {months[index]}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600' }}>
                    {kwh} kWh
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', color: '#6B7280' }}>
                    {percentage}%
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {isHigh ? (
                      <span style={{ color: '#10B981' }}>📈</span>
                    ) : isLow ? (
                      <span style={{ color: '#EF4444' }}>📉</span>
                    ) : (
                      <span style={{ color: '#6B7280' }}>➡️</span>
                    )}
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
