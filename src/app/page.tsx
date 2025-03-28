'use client';

import { useState } from 'react';
import { ArrowUpTrayIcon, MagnifyingGlassIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { SearchResult } from './types';
import { isBrowser } from './utils/isBrowser';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file || !isBrowser) return;
    
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const { uploadFile } = await import('./lib/ipfs-client');
      setUploadProgress(20); // Starting upload
      
      const metadata = await uploadFile(file);
      setUploadProgress(80); // File uploaded
      
      const searchResult: SearchResult = {
        name: metadata.name,
        cid: metadata.cid,
        size: metadata.size,
        type: metadata.type,
        uploadedAt: metadata.uploadedAt,
      };
      
      setSearchResults([searchResult]);
      setFile(null);
      setUploadProgress(100); // Complete
      
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery || !isBrowser) return;
    
    setError(null);
    try {
      const { searchFiles } = await import('./lib/ipfs-client');
      const results = await searchFiles(searchQuery);
      const searchResults: SearchResult[] = results.map(result => ({
        name: result.name,
        cid: result.cid,
        size: result.size,
        type: result.type,
        uploadedAt: result.uploadedAt,
      }));
      setSearchResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search files. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload File</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ArrowUpTrayIcon className="w-8 h-8 text-gray-400" />
                <p className="pt-1 text-sm tracking-wider text-gray-400">
                  {file ? file.name : 'Select a file'}
                </p>
                <p className="text-xs text-gray-500">Drag and drop or click to upload</p>
              </div>
              <input
                type="file"
                className="opacity-0"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
          
          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!file || uploading || !isBrowser}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Files</h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename or CID..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!isBrowser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results</h3>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <DocumentIcon className="h-8 w-8 text-gray-400 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.name}</p>
                    <p className="text-xs text-gray-500">CID: {result.cid}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
