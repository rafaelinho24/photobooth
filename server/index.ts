import cors from 'cors';
import express from 'express';

import { config } from './config';
import { photosRouter } from './routes/photos';
import { printRouter } from './routes/print';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '20mb' }));

app.use('/api/photos', photosRouter);
app.use('/api/print', printRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(config.port, () => {
  console.log(`[server] Running on http://localhost:${config.port}`);
  console.log(`[server] Photos    : ${config.photosFolder}`);
  console.log(`[server] Printer   : ${config.printerName}`);
});
