export interface Gabarit {
  /** Unique key derived from the file path */
  id: string;
  /** Display name — filename without extension */
  name: string;
  /** Resolved URL served by Vite */
  url: string;
}
