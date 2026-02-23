import type { Request, Response } from 'express';
import { Router } from 'express';

import { config } from '../config';

const router = Router();

// WHY: Single JPEG frame per request — client polls at desired fps using cache-busting timestamp
router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`http://${config.cameraIp}/ccapi/ver100/live/viewfinder`, {
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      res.status(503).json({ error: 'Camera not responding' });
      return;
    }

    const buffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'no-store');
    res.send(Buffer.from(buffer));
  } catch {
    // WHY: 503 instead of 500 — signals a recoverable connectivity issue, not a server bug
    res.status(503).json({ error: 'Camera unavailable' });
  }
});

export { router as liveviewRouter };
