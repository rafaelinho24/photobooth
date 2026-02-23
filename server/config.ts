// WHY: All environment-specific values in one place — operator configures via .env, never touches code
export const config = {
  port: Number(process.env.PORT ?? 3001),
  cameraIp: process.env.CAMERA_IP ?? '192.168.1.3',
  photosFolder: process.env.PHOTOS_FOLDER ?? 'C:\\Users\\rafae\\Pictures\\EOS Utility',
  printerName: process.env.PRINTER_NAME ?? 'Canon SELPHY CP1500',
} as const;
