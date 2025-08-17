import 'dotenv/config';
import express from 'express';
import solarRouter from './routes/solar';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/solar', solarRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
});
