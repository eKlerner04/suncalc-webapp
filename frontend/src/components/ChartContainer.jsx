import React from 'react';
import SolarChart from './SolarChart';

const ChartContainer = ({ solarData, inputs }) => {
  const normalized = (() => {
    if (!solarData) return null;
    const cacheData = solarData?.cache?.solarData;
    const yieldData = solarData?.yield;
    const annual_kWh = cacheData?.annual_kWh ?? yieldData?.annual_kWh ?? null;
    const metadata = solarData?.cache?.metadata || cacheData?.metadata || {};
    if (!annual_kWh) return null;
    return { annual_kWh, metadata };
  })();

  if (!normalized || !normalized.annual_kWh) {
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
            Keine Solar-Daten verfügbar
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Führe zuerst eine Solar-Berechnung durch
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <SolarChart solarData={normalized} inputs={inputs} />
    </div>
  );
};

export default ChartContainer;
