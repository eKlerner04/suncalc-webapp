import express from 'express';
import addressCacheService from '../services/addressCacheService';

const router = express.Router();


router.post('/process', async (req, res) => {
  try {
    const { lat, lng, displayName, name, countryCode } = req.body;
    
    
    if (!lat || !lng || !displayName || !name) {
      console.warn('Ungültige Adressdaten: erforderliche Felder fehlen', { body: req.body });
      return res.status(400).json({ 
        error: 'Alle erforderlichen Felder (lat, lng, displayName, name) müssen angegeben werden' 
      });
    }

    console.log(` Zentrale Adress-Operation: ${displayName} (${lat}, ${lng})`);
    
    const result = await addressCacheService.processAddressOperation(
      parseFloat(lat),
      parseFloat(lng),
      displayName,
      name,
      countryCode
    );
    
    if (result.success) {
      if (result.isNew) {
        console.log(` Neue Adresse erfolgreich verarbeitet: ${displayName} (ID: ${result.addressId})`);
        res.json({ 
          success: true, 
          message: 'Neue Adresse erfolgreich erstellt',
          isNew: true,
          addressId: result.addressId,
          data: { lat, lng, displayName, name, countryCode }
        });
      } else {
        console.log(` Bestehende Adresse erfolgreich aktualisiert: ${displayName} (ID: ${result.addressId})`);
        res.json({ 
          success: true, 
          message: 'Bestehende Adresse erfolgreich aktualisiert',
          isNew: false,
          addressId: result.addressId,
          data: { lat, lng, displayName, name, countryCode }
        });
      }
    } else {
      console.error(` Fehler bei der Adress-Operation: ${displayName}`);
      res.status(500).json({ 
        error: 'Fehler bei der Adress-Operation' 
      });
    }
  } catch (error: any) {
    console.error(' Fehler bei der zentralen Adress-Operation:', error);
    res.status(500).json({ 
      error: 'Interner Server-Fehler bei der Adress-Operation',
      details: error.message 
    });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      console.warn('Ungültige Suchanfrage: query Parameter fehlt oder ist kein String');
      return res.status(400).json({ 
        error: 'Query-Parameter ist erforderlich und muss ein String sein' 
      });
    }

    console.log(` Adress-Suche gestartet: "${query}"`);
    
    const results = await addressCacheService.searchLocalDatabase(query);
    
    console.log(` Adress-Suche abgeschlossen: ${results.length} Ergebnisse gefunden`);
    
    res.json({
      success: true,
      results,
      count: results.length,
      query
    });
  } catch (error: any) {
    console.error(' Fehler bei der Adress-Suche:', error);
    res.status(500).json({ 
      error: 'Interner Server-Fehler bei der Adress-Suche',
      details: error.message 
    });
  }
});


router.post('/cleanup-all', async (req, res) => {
  try {
    console.log(' Starte globale Duplikatsbereinigung...');
    
    await addressCacheService.cleanupDuplicates();
    
    console.log(' Globale Duplikatsbereinigung abgeschlossen');
    res.json({ 
      success: true, 
      message: 'Globale Duplikatsbereinigung erfolgreich abgeschlossen'
    });
  } catch (error: any) {
    console.error(' Fehler bei der globalen Duplikatsbereinigung:', error);
    res.status(500).json({ 
      error: 'Interner Server-Fehler bei der globalen Duplikatsbereinigung',
      details: error.message 
    });
  }
});

export default router;
