export interface Photo {
  filename: string;
  /** URL served by the Express backend: /api/photos/file/<filename> */
  url: string;
  /** ISO timestamp of when the file was last modified */
  takenAt: string;
}
