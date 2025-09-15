import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import solarRoutes from './routes/solar';
import locationsRoutes from './routes/locations';
import addressCacheRoutes from './routes/addressCache';
import { backgroundJobController } from './services/backgroundJobController';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS-Konfiguration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://c110-055.cloud.gwdg.de'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
};

app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Requests pro IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// JSON Parser
app.use(express.json());


app.use('/api/solar', solarRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/address-cache', addressCacheRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend läuft!' });
});


app.get('/', (req, res) => {
  res.json({ 
    message: 'SunCalc Backend läuft erfolgreich!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: [
      'Solar-Berechnung mit PVGIS/NASA POWER',
      'Intelligentes Caching mit TTL',
      'Popularitäts-basierte Pre-Fetch-Strategie',
      'Automatische Background-Jobs'
    ],
    backgroundJobs: backgroundJobController.getStatus(),
    endpoints: {
      health: '/health',
      solar: '/api/solar',
      locations: '/api/locations',
      backgroundJobs: '/api/background-jobs'
    },
    documentation: 'Siehe /api/locations für Popularitäts-Statistiken'
  });
});


app.get('/api/background-jobs/status', (req, res) => {
  res.json(backgroundJobController.getStatus());
});




app.post('/api/background-jobs/cleanup', async (req, res) => {
  try {
    const result = await backgroundJobController.manualCleanup();
    res.json({ 
      message: 'Manueller Cleanup abgeschlossen',
      result: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim manuellen Cleanup' });
  }
});


app.post('/api/background-jobs/mode', (req, res) => {
  try {
    const { mode } = req.body;
    if (mode === 'simple') {
      backgroundJobController.switchToSimple();
      res.json({ message: 'Modus zu simple gewechselt' });
    } else if (mode === 'bullmq') {
      backgroundJobController.switchToBullMQ();
      res.json({ message: 'Modus zu bullmq gewechselt' });
    } else {
      res.status(400).json({ error: 'Ungültiger Modus. Verwende "simple" oder "bullmq"' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Wechseln des Modus' });
  }
});


app.listen(PORT, () => {
  console.log('\n[SERVER] SunCalc Backend gestartet');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`[URL] Server läuft auf: http://localhost:${PORT}`);
  console.log(`[API] Verfügbare Endpunkte:`);
  console.log(`  • Solar-Berechnung: /api/solar`);
  console.log(`  • Standort-Info: /api/locations`);
  console.log(`  • Health-Check: /health`);
  console.log(`  • Root: /`);
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`[JOBS] Background-Jobs Status:`, backgroundJobController.getStatus());
  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
});
