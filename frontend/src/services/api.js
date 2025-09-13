const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  
  : 'http://localhost:3000/api';  

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
    const healthUrl = process.env.NODE_ENV === 'production' 
      ? '/health'  
      : 'http://localhost:3000/health';  
    const response = await fetch(healthUrl);
    return response.ok;
  } catch (error) {
    return false;
  }
};
