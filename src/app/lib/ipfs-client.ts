import { isBrowser } from '../utils/isBrowser';
import { FileMetadata } from '../types';
import type { IPFSHTTPClient } from 'ipfs-http-client';

let ipfs: IPFSHTTPClient | null = null;

const getIpfsClient = async () => {
  if (!isBrowser) {
    throw new Error('IPFS client can only be used in the browser');
  }

  if (!ipfs) {
    const { create } = await import('ipfs-http-client');
    ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
        ).toString('base64')}`,
      },
    });
  }
  return ipfs;
};

export const uploadFile = async (file: File): Promise<FileMetadata> => {
  if (!isBrowser) {
    throw new Error('File upload can only be performed in the browser');
  }

  try {
    const ipfs = await getIpfsClient();
    // Add file to IPFS
    const result = await ipfs.add(file);
    
    // Create metadata
    const metadata: FileMetadata = {
      name: file.name,
      cid: result.path,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      owner: '', // TODO: Add user authentication
      tags: [], // TODO: Add file tagging
    };

    // Store metadata in IPFS
    await ipfs.add(Buffer.from(JSON.stringify(metadata)));

    return metadata;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

export const retrieveFile = async (cid: string): Promise<Uint8Array> => {
  if (!isBrowser) {
    throw new Error('File retrieval can only be performed in the browser');
  }

  try {
    const ipfs = await getIpfsClient();
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    return new Uint8Array(Buffer.concat(chunks));
  } catch (error) {
    console.error('Error retrieving file from IPFS:', error);
    throw error;
  }
};

export const searchFiles = async (query: string): Promise<FileMetadata[]> => {
  if (!isBrowser) {
    throw new Error('File search can only be performed in the browser');
  }

  try {
    // TODO: Implement proper search functionality
    // For now, we'll just log the query and return empty results
    console.log('Searching for:', query);
    return [];
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
}; 