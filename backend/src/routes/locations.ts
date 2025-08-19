import { Router } from 'express';
import { hotLocationsService } from '../services/popularity/hotLocationsService';
import { preFetchService } from '../services/popularity/preFetchService';
import { popularityTrackerService } from '../services/popularity/popularityTracker';
import { scoreDecayService } from '../services/popularity/scoreDecayService';
import { cleanupService } from '../services/cleanupService';

const router = Router();

// GET /api/locations/hot - Alle "heißen" Standorte
router.get('/hot', async (req, res) => {
  try {
    console.log('[LOCATIONS] Anfrage für "heiße" Standorte erhalten');
    const hotLocations = await hotLocationsService.getHotLocations();
    res.json({
      success: true,
      count: hotLocations.length,
      locations: hotLocations,
      message: `${hotLocations.length} "heiße" Standorte gefunden`
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Holen der "heißen" Standorte:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Holen der "heißen" Standorte',
      details: error.message
    });
  }
});

// GET /api/locations/top - Top 10 Standorte nach Popularity
router.get('/top', async (req, res) => {
  try {
    console.log('[LOCATIONS] Anfrage für Top-Standorte erhalten');
    const topLocations = await hotLocationsService.getTopLocations(10);
    res.json({
      success: true,
      count: topLocations.length,
      locations: topLocations,
      message: `Top ${topLocations.length} Standorte nach Popularity`
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Holen der Top-Standorte:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Holen der Top-Standorte',
      details: error.message
    });
  }
});

// GET /api/locations/stats - Popularity-Statistiken
router.get('/stats', async (req, res) => {
  try {
    console.log('[LOCATIONS] Anfrage für Popularity-Statistiken erhalten');
    const stats = await hotLocationsService.getPopularityStats();
    res.json({
      success: true,
      stats: stats,
      message: 'Popularity-Statistiken erfolgreich geladen'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Holen der Popularity-Statistiken:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Holen der Popularity-Statistiken',
      details: error.message
    });
  }
});

// POST /api/locations/prefetch/run - Manueller Pre-Fetch
router.post('/prefetch/run', async (req, res) => {
  try {
    console.log('[LOCATIONS] Manueller Pre-Fetch angefordert');
    const { gridKey } = req.body || {};
    
    let result;
    if (gridKey) {
      // Pre-Fetch für spezifischen Standort
      result = await preFetchService.manualPreFetch(gridKey);
    } else {
      // Pre-Fetch für alle "heißen" Standorte
      result = await preFetchService.runPreFetch();
    }
    
    res.json({
      success: true,
      result: result,
      message: gridKey ? `Pre-Fetch für ${gridKey} gestartet` : 'Pre-Fetch für alle Standorte gestartet'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim manuellen Pre-Fetch:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim manuellen Pre-Fetch',
      details: error.message
    });
  }
});

// GET /api/locations/prefetch/status - Pre-Fetch Status
router.get('/prefetch/status', async (req, res) => {
  try {
    console.log('[LOCATIONS] Pre-Fetch Status angefordert');
    const status = preFetchService.getStatus();
    res.json({
      success: true,
      status: status,
      message: 'Pre-Fetch Status erfolgreich geladen'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Laden des Pre-Fetch Status:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Pre-Fetch Status',
      details: error.message
    });
  }
});

// POST /api/locations/decay/run - Manueller Score-Degradation
router.post('/decay/run', async (req, res) => {
  try {
    console.log('[LOCATIONS] Manueller Score-Degradation angefordert');
    const result = await scoreDecayService.manualScoreDecay();
    res.json({
      success: true,
      result: result,
      message: 'Score-Degradation erfolgreich gestartet'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim manuellen Score-Degradation:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim manuellen Score-Degradation',
      details: error.message
    });
  }
});

// GET /api/locations/decay/status - Score-Degradation Status
router.get('/decay/status', async (req, res) => {
  try {
    console.log('[LOCATIONS] Score-Degradation Status angefordert');
    const status = scoreDecayService.getStatus();
    res.json({
      success: true,
      status: status,
      message: 'Score-Degradation Status erfolgreich geladen'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Laden des Score-Degradation Status:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Score-Degradation Status',
      details: error.message
    });
  }
});

// POST /api/locations/cleanup/run - Manueller Cache-Cleanup
router.post('/cleanup/run', async (req, res) => {
  try {
    console.log('[LOCATIONS] Manueller Cache-Cleanup angefordert');
    
    // Verwende den neuen echten Cleanup-Service
    const result = await cleanupService.manualCleanup();
    
    res.json({
      success: true,
      result: result,
      message: 'Cache-Cleanup erfolgreich gestartet'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim manuellen Cache-Cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim manuellen Cache-Cleanup',
      details: error.message
    });
  }
});

// GET /api/locations/cleanup/status - Cleanup Status
router.get('/cleanup/status', async (req, res) => {
  try {
    console.log('[LOCATIONS] Cleanup Status angefordert');
    
    const status = cleanupService.getStatus();
    
    res.json({
      success: true,
      status: status,
      message: 'Cleanup Status erfolgreich geladen'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Laden des Cleanup Status:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden des Cleanup Status',
      details: error.message
    });
  }
});

// PUT /api/locations/config - Konfiguration aktualisieren
router.put('/config', async (req, res) => {
  try {
    console.log('[LOCATIONS] Konfigurations-Update angefordert');
    const { preFetchThreshold, hotLocationThreshold } = req.body;
    
    if (preFetchThreshold !== undefined) {
      await popularityTrackerService.updateConfig({ preFetchThreshold });
    }
    
    if (hotLocationThreshold !== undefined) {
      await popularityTrackerService.updateConfig({ hotLocationThreshold });
    }
    
    res.json({
      success: true,
      message: 'Konfiguration erfolgreich aktualisiert',
      config: await popularityTrackerService.getConfig()
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Aktualisieren der Konfiguration:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren der Konfiguration',
      details: error.message
    });
  }
});

// GET /api/locations/config - Aktuelle Konfiguration
router.get('/config', async (req, res) => {
  try {
    console.log('[LOCATIONS] Konfiguration angefordert');
    const config = await popularityTrackerService.getConfig();
    res.json({
      success: true,
      config: config,
      message: 'Konfiguration erfolgreich geladen'
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Laden der Konfiguration:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Laden der Konfiguration',
      details: error.message
    });
  }
});

// PUT /api/locations/:gridKey/hot - Standort als "heiß" markieren
router.put('/:gridKey/hot', async (req, res) => {
  try {
    const { gridKey } = req.params;
    const { isHot } = req.body;
    
    console.log(`[LOCATIONS] Update für Standort ${gridKey} angefordert`);
    
    if (typeof isHot !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isHot muss ein Boolean-Wert sein'
      });
    }
    
    const result = await hotLocationsService.updateHotStatus(gridKey, isHot);
    
    res.json({
      success: true,
      result: result,
      message: `Standort ${gridKey} erfolgreich aktualisiert`
    });
  } catch (error: any) {
    console.error('[ERROR] Fehler beim Aktualisieren des Standorts:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren des Standorts',
      details: error.message
    });
  }
});

export default router;
