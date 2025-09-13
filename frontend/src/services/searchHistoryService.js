

const STORAGE_KEY = 'solarSearchHistory';
const MAX_ENTRIES = 3;

export const loadSearchHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Fehler beim Laden des Suchverlaufs:', error);
    return [];
  }
};

export const addToSearchHistory = (searchData) => {
  try {
    console.log('[SearchHistoryService] Versuche Suche zu speichern:', searchData);
    
    const currentHistory = loadSearchHistory();
    console.log('[SearchHistoryService] Aktueller Verlauf:', currentHistory);
    
    const newSearch = {
      ...searchData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    console.log('🆕 [SearchHistoryService] Neue Suche erstellt:', newSearch);

    const filteredHistory = currentHistory.filter(item => 
      item.address !== searchData.address || 
      item.lat !== searchData.lat || 
      item.lng !== searchData.lng ||
      item.area !== searchData.area ||
      item.tilt !== searchData.tilt ||
      item.azimuth !== searchData.azimuth
    );
    console.log('🧹 [SearchHistoryService] Nach Duplikat-Entfernung:', filteredHistory);

    const updatedHistory = [newSearch, ...filteredHistory].slice(0, MAX_ENTRIES);
    console.log('[SearchHistoryService] Aktualisierter Verlauf:', updatedHistory);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    console.log('[SearchHistoryService] In LocalStorage gespeichert. Key:', STORAGE_KEY);
    
    return updatedHistory;
  } catch (error) {
    console.error('[SearchHistoryService] Fehler beim Speichern des Suchverlaufs:', error);
    return [];
  }
};

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

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Fehler beim Löschen des Verlaufs:', error);
    return [];
  }
};

export const updateSearchHistory = (newHistory) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Suchverlaufs:', error);
    return [];
  }
};
