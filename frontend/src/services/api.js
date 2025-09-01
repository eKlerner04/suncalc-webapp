// Einfacher API-Service für die Backend-Kommunikation
const API_BASE_URL = 'http://localhost:3000/api';

// Solar-Daten vom Backend abrufen
export const fetchSolarData = async (lat, lng, area = 10, tilt = 30, azimuth = 0) => {
  console.log('API: Sende Request an:', `${API_BASE_URL}/solar?lat=${lat}&lng=${lng}&area=${area}&tilt=${tilt}&azimuth=${azimuth}`);
  
  const response = await fetch(
    `${API_BASE_URL}/solar?lat=${lat}&lng=${lng}&area=${area}&tilt=${tilt}&azimuth=${azimuth}`
  );
  
  console.log('API: Response Status:', response.status, response.statusText);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('API: Empfangene Daten:', data);
  
  return data;
};

export const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:3000/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};
