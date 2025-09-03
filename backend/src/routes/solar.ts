import { Router } from 'express';
import { solarCacheService } from '../services/solarCache';

const router = Router();

// Einfache GET-Route für /api/solar
router.get('/', async (req, res) => {
  console.log('🌞 Solar-Anfrage erhalten:', req.query);
  
  // Einfache Parameter-Validierung
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const area = parseFloat(req.query.area as string) || 10;
  const tilt = parseFloat(req.query.tilt as string) || 30;
  const azimuth = parseFloat(req.query.azimuth as string) || 0;
  
  // Prüfe ob Koordinaten gültig sind
  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ 
      error: 'Ungültige Koordinaten. lat und lng müssen Zahlen sein.' 
    });
  }
  
  try {
    // Verwende den Cache-Service für Solar-Daten (alle Parameter übergeben)
    const { data: solarData, source } = await solarCacheService.getSolarData(lat, lng, area, tilt, azimuth);
    
    // Berechne zusätzliche Werte basierend auf der Dachfläche
    const annual_kWh = solarData.annual_kWh; // Direkt von der API
    const co2 = solarData.co2_saved; // Direkt von der API
    
    const response = {
      inputs: { lat, lng, area, tilt, azimuth },
      yield: { 
        annual_kWh,
        monthly_data: solarData.metadata?.monthly_data || null // Monatliche Daten direkt verfügbar machen
      },
      co2,
      cache: {
        source,
        solarData,
        message: `Daten von: ${source}`,
        metadata: solarData.metadata
      }
    };
    
    console.log(`✅ Solar-Daten erfolgreich berechnet (${source}):`, response);
    res.json(response);
    
  } catch (error: any) {
    console.error('❌ Fehler bei der Solar-Berechnung:', error);
    res.status(500).json({ 
      error: 'Interner Server-Fehler bei der Solar-Berechnung',
      details: error.message
    });
  }
});

export default router;
