import express from 'express';
import solarRoutes from './routes/solar';
import { backgroundJobController } from './services/backgroundJobController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});
app.use(express.json());

// Routes
app.use('/api/solar', solarRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend läuft!' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SunCalc Backend läuft!',
    timestamp: new Date().toISOString(),
    backgroundJobs: backgroundJobController.getStatus(),
    endpoints: {
      health: '/health',
      solar: '/api/solar',
      backgroundJobs: '/api/background-jobs'
    }
  });
});

// Background-Jobs Status
app.get('/api/background-jobs/status', (req, res) => {
  res.json(backgroundJobController.getStatus());
});



// Background-Jobs manuell starten
app.post('/api/background-jobs/cleanup', async (req, res) => {
  try {
    await backgroundJobController.manualCleanup();
    res.json({ message: 'Manueller Cleanup gestartet' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim manuellen Cleanup' });
  }
});

// Background-Jobs Modus wechseln
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

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 SunCalc Backend läuft auf Port ${PORT}`);
  console.log(`📊 Background-Jobs Status:`, backgroundJobController.getStatus());
});
