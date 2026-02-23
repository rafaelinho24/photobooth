import { exec } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { Request, Response } from 'express';
import { Router } from 'express';

import { config } from '../config';

const router = Router();

interface PrintBody {
  imageBase64: string;
}

router.post('/', (req: Request, res: Response) => {
  const { imageBase64 } = req.body as PrintBody;

  if (!imageBase64) {
    res.status(400).json({ error: 'imageBase64 is required' });
    return;
  }

  // Strip data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Save composited image to a temp file
  const tmpFile = path.join(tmpdir(), `photobooth_print_${Date.now()}.jpg`);
  writeFileSync(tmpFile, buffer);

  if (!existsSync(tmpFile)) {
    res.status(500).json({ error: 'Failed to save temp file' });
    return;
  }

  // WHY: shimgvw.dll ImageView_PrintTo silently sends to printer without UI dialog
  const cmd = `rundll32 "C:\\Windows\\System32\\shimgvw.dll",ImageView_PrintTo /pt "${tmpFile}" "${config.printerName}"`;

  exec(cmd, error => {
    if (error) {
      res.status(500).json({ error: 'Print failed', details: error.message });
      return;
    }
    res.json({ success: true });
  });
});

export { router as printRouter };
