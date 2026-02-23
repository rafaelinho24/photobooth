import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import type { Request, Response } from 'express';
import { Router } from 'express';

import { config } from '../config';

const router = Router();

const PHOTO_EXTENSIONS = /\.(jpg|jpeg|cr3|cr2)$/i;

// List last 10 photos sorted by modification time (newest first)
router.get('/', (_req: Request, res: Response) => {
  const folder = config.photosFolder;

  if (!existsSync(folder)) {
    res.json({ photos: [] });
    return;
  }

  try {
    const files = readdirSync(folder)
      .filter(f => PHOTO_EXTENSIONS.test(f))
      .map(f => {
        const filePath = path.join(folder, f);
        return { filename: f, mtime: statSync(filePath).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 10)
      .map(f => ({
        filename: f.filename,
        // WHY: URL-encoded filename avoids issues with spaces and special chars in Canon filenames
        url: `/api/photos/file/${encodeURIComponent(f.filename)}`,
        takenAt: new Date(f.mtime).toISOString(),
      }));

    res.json({ photos: files });
  } catch {
    res.status(500).json({ error: 'Failed to read photos folder' });
  }
});

// Serve individual photo file
router.get('/file/:filename', (req: Request, res: Response) => {
  const filename = decodeURIComponent(req.params.filename ?? '');
  const filePath = path.resolve(config.photosFolder, filename);

  // WHY: path.resolve + startsWith check prevents path traversal attacks
  if (!filePath.startsWith(path.resolve(config.photosFolder))) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  if (!existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.sendFile(filePath);
});

export { router as photosRouter };
