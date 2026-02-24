import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import type { Request, Response } from 'express';
import { Router } from 'express';

const execAsync = promisify(exec);
const router = Router();

// WHY: absolute path to the .ps1 avoids working-directory issues regardless of
// where the server process is launched from
const SCRIPT_PATH = path.resolve(import.meta.dirname, '../scripts/trigger-shutter.ps1');

router.post('/', async (_req: Request, res: Response) => {
  try {
    await execAsync(
      `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${SCRIPT_PATH}"`,
      { timeout: 5000 },
    );
    res.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('not found')) {
      res.status(503).json({ error: "EOS Utility introuvable — ouvrez l'application" });
    } else {
      res.status(500).json({ error: 'Échec du déclenchement' });
    }
  }
});

export { router as shutterRouter };
