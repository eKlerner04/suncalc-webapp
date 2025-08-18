import React from 'react';

const SolarChart = ({ solarData, inputs }) => {
  // Monatsdaten generieren (falls nicht vorhanden, verwende Schätzung)
  const generateMonthlyData = () => {
    // Prüfe ob echte monatliche Daten vorhanden sind
    if (solarData?.metadata?.monthly_data && 
        Array.isArray(solarData.metadata.monthly_data) && 
        solarData.metadata.monthly_data.length === 12 &&
        solarData.metadata.monthly_data.some(val => val > 0)) {
      console.log('✅ Verwende echte monatliche Daten:', solarData.metadata.monthly_data);
      return solarData.metadata.monthly_data;
    }
    
    // Fallback: Schätzung basierend auf Jahresertrag
    const annual_kWh = solarData?.annual_kWh || 0;
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
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

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

  // Finde den höchsten Wert für die Skalierung
  const maxValue = Math.max(...monthlyData);
  const chartHeight = 300;

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
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>
          📊 Monats-/Jahresdiagramm
        </h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Visualisierung des Solarertrags über das Jahr
        </p>
      </div>
      
      {/* Einfaches Balkendiagramm ohne Chart.js */}
      <div style={{ height: chartHeight, position: 'relative', marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          height: '100%', 
          gap: '8px',
          paddingBottom: '20px'
        }}>
          {monthlyData.map((value, index) => {
            const height = (value / maxValue) * (chartHeight - 40);
            const color = value === Math.max(...monthlyData) ? '#3B82F6' : 
                         value === Math.min(...monthlyData) ? '#EF4444' : '#10B981';
            
            return (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: `${height}px`,
                  backgroundColor: color,
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {value} kWh
                  </div>
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}>
                  {months[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Statistik-Karten */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '16px', 
        textAlign: 'center' 
      }}>
        <div style={{ backgroundColor: '#DBEAFE', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1D4ED8' }}>
            {Math.max(...monthlyData)}
          </div>
          <div style={{ fontSize: '14px', color: '#1E40AF' }}>Höchster Monat</div>
        </div>
        <div style={{ backgroundColor: '#D1FAE5', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#047857' }}>
            {Math.round(monthlyData.reduce((a, b) => a + b, 0) / 12)}
          </div>
          <div style={{ fontSize: '14px', color: '#065F46' }}>Durchschnitt</div>
        </div>
        <div style={{ backgroundColor: '#FEF3C7', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#D97706' }}>
            {Math.min(...monthlyData)}
          </div>
          <div style={{ fontSize: '14px', color: '#B45309' }}>Niedrigster Monat</div>
        </div>
        <div style={{ backgroundColor: '#F3E8FF', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#7C3AED' }}>
            {solarData.annual_kWh}
          </div>
          <div style={{ fontSize: '14px', color: '#6D28D9' }}>Jahresgesamt</div>
        </div>
      </div>
    </div>
  );
};

export default SolarChart;
