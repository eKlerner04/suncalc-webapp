import React, { useState, useEffect } from 'react';
import { 
  loadSearchHistory, 
  removeFromSearchHistory, 
  clearSearchHistory 
} from '../services/searchHistoryService';

export default function SearchHistory({ onRestoreSearch }) {
  const [searchHistory, setSearchHistory] = useState([]);

  // Suchverlauf beim Laden der Komponente abrufen
  useEffect(() => {
    console.log('🚀 [SearchHistory] Komponente geladen, lade Suchverlauf...');
    loadSearchHistoryFromService();
  }, []);

  // Suchverlauf aus dem Service laden
  const loadSearchHistoryFromService = () => {
    console.log('📚 [SearchHistory] Lade Suchverlauf aus dem Service...');
    const history = loadSearchHistory();
    console.log('📖 [SearchHistory] Geladener Verlauf:', history);
    setSearchHistory(history);
    console.log('🔄 [SearchHistory] State aktualisiert, Länge:', history.length);
  };

  // Suche aus dem Verlauf wiederherstellen
  const restoreSearch = (searchItem) => {
    onRestoreSearch(searchItem);
  };

  // Suchverlauf aktualisieren (wird von außen aufgerufen)
  useEffect(() => {
    const interval = setInterval(() => {
      loadSearchHistoryFromService();
    }, 1000); // Alle Sekunde aktualisieren
    
    return () => clearInterval(interval);
  }, []);

  // Eintrag aus dem Verlauf löschen
  const removeFromHistory = (id) => {
    const updatedHistory = removeFromSearchHistory(id);
    setSearchHistory(updatedHistory);
  };

  // Verlauf komplett löschen
  const clearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  // Datum formatieren
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log('🎨 [SearchHistory] Rendere Komponente, Verlaufslänge:', searchHistory.length);
  
  // Immer anzeigen, auch wenn kein Verlauf vorhanden ist

  return (
    <div style={{
      marginTop: '100px',
      padding: '20px',
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Letzte Suchen
        </h3>
        <button
          onClick={clearHistory}
          style={{
            padding: '6px 12px',
            fontSize: '0.75rem',
            color: '#64748b',
            background: 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f1f5f9';
            e.target.style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = '#cbd5e1';
          }}
        >
          Verlauf löschen
        </button>
      </div>

      <div style={{
        display: 'grid',
        gap: '12px'
      }}>
        {searchHistory.length === 0 ? (
          // Info-Nachricht wenn kein Verlauf vorhanden
          <div style={{
            padding: '24px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #ffffff',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '12px',
              opacity: '0.6'
            }}>
              
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#475569',
              marginBottom: '8px'
            }}>
              Noch keine Suchen vorhanden
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748b',
              lineHeight: '1.4'
            }}>
              Machen Sie eine Solarpotential-Berechnung, um Ihren Suchverlauf zu starten
            </div>
          </div>
        ) : (
          // Normale Suchergebnisse anzeigen
          searchHistory.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ffffff';
              e.target.style.boxShadow = 'none';
            }}
            onClick={() => restoreSearch(item)}
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {item.address}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                display: 'flex',
                gap: '16px'
              }}>
                <span>Fläche: {item.area} m²</span>
                <span>Neigung: {item.tilt}°</span>
                <span>Ausrichtung: {item.azimuth}°</span>
                <span>Potential: {item.solarPotential} kWh</span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                marginTop: '4px'
              }}>
                {formatDate(item.timestamp)}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(item.id);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                color: '#ef4444',
                background: 'transparent',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fef2f2';
                e.target.style.borderColor = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = '#fecaca';
              }}
            >
              ×
            </button>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
