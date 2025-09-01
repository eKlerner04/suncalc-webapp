// Service für die Verwaltung des Suchverlaufs mit LocalStorage

const STORAGE_KEY = 'solarSearchHistory';
const MAX_ENTRIES = 3;

// Suchverlauf laden
export const loadSearchHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Fehler beim Laden des Suchverlaufs:', error);
    return [];
  }
};

// Suche zum Verlauf hinzufügen
export const addToSearchHistory = (searchData) => {
  try {
    console.log('🔍 [SearchHistoryService] Versuche Suche zu speichern:', searchData);
    
    const currentHistory = loadSearchHistory();
    console.log('📚 [SearchHistoryService] Aktueller Verlauf:', currentHistory);
    
    // Neue Suche erstellen
    const newSearch = {
      ...searchData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    console.log('🆕 [SearchHistoryService] Neue Suche erstellt:', newSearch);

    // Duplikate entfernen (gleiche Adresse + Koordinaten + Dachparameter)
    const filteredHistory = currentHistory.filter(item => 
      item.address !== searchData.address || 
      item.lat !== searchData.lat || 
      item.lng !== searchData.lng ||
      item.area !== searchData.area ||
      item.tilt !== searchData.tilt ||
      item.azimuth !== searchData.azimuth
    );
    console.log('🧹 [SearchHistoryService] Nach Duplikat-Entfernung:', filteredHistory);

    // Neue Suche an den Anfang setzen und auf MAX_ENTRIES begrenzen
    const updatedHistory = [newSearch, ...filteredHistory].slice(0, MAX_ENTRIES);
    console.log('📝 [SearchHistoryService] Aktualisierter Verlauf:', updatedHistory);

    // In LocalStorage speichern
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    console.log('💾 [SearchHistoryService] In LocalStorage gespeichert. Key:', STORAGE_KEY);
    
    return updatedHistory;
  } catch (error) {
    console.error('❌ [SearchHistoryService] Fehler beim Speichern des Suchverlaufs:', error);
    return [];
  }
};

// Eintrag aus dem Verlauf löschen
export const removeFromSearchHistory = (id) => {
  try {
    const currentHistory = loadSearchHistory();
    const updatedHistory = currentHistory.filter(item => item.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Fehler beim Löschen des Eintrags:', error);
    return [];
  }
};

// Verlauf komplett löschen
export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Fehler beim Löschen des Verlaufs:', error);
    return [];
  }
};

// Suchverlauf aktualisieren (für externe Komponenten)
export const updateSearchHistory = (newHistory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Suchverlaufs:', error);
    return [];
  }
};
