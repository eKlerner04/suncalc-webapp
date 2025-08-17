import express from 'express';
import solarRouter from './routes/solar';

const app = express();
const PORT = 3000;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend läuft!' });
});

app.use('/api/solar', solarRouter);

app.get('/', (req, res) => {
  res.json({ 
    message: 'SunCalc Backend läuft!',
    endpoints: {
      health: '/health',
      solar: '/api/solar'
    }
  });
});


app.listen(PORT, () => {
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
  console.log(`📡 Solar-API: http://localhost:${PORT}/api/solar`);
  console.log(`🏥 Health-Check: http://localhost:${PORT}/health`);
});
