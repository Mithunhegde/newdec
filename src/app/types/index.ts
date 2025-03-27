export interface SearchResult {
  name: string;
  cid: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface FileMetadata {
  name: string;
  cid: string;
  size: number;
  type: string;
  uploadedAt: Date;
  owner: string;
  tags: string[];
} 