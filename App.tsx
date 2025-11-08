import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import { UploadedFile } from './types';
import Sidebar from './components/Sidebar';
import FileViewer from './components/FileViewer';
import { PlusIcon } from './components/Icons';

// FIX: Replaced placeholder with a complete, functional React application component.
const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ITEMS_PER_PAGE = 5;
  const TIMEOUT_DURATION = 60; // seconds

  const fetchTotalCount = useCallback(async () => {
    const { count, error } = await supabase
      .from('html_files')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total count:', error);
      return 0;
    }
    return count || 0;
  }, []);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTimeRemaining(TIMEOUT_DURATION);

    // Start countdown timer
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout: Failed to fetch files within 60 seconds'));
        }, TIMEOUT_DURATION * 1000);
      });

      // Create fetch promise
      const fetchPromise = async () => {
        // Fetch total count
        const count = await fetchTotalCount();
        setTotalCount(count);

        // Calculate pagination range
        const from = currentPage * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error } = await supabase
          .from('html_files')
          .select('*')
          .order('name', { ascending: true })
          .range(from, to);

        if (error) {
          throw new Error('Could not fetch files.');
        }

        return data;
      };

      // Race between fetch and timeout
      const data = await Promise.race([fetchPromise(), timeoutPromise]);

      // Clear countdown timer on success
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      setFiles(data || []);
      // Select first file if available, otherwise clear selection
      if (data && data.length > 0) {
        setSelectedFile(data[0]);
      } else {
        setSelectedFile(null);
      }
      setTimeRemaining(TIMEOUT_DURATION);
    } catch (err) {
      // Clear countdown timer on error
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Could not fetch files.';
      setError(errorMessage);
      console.error('Error fetching files:', err);
      setTimeRemaining(TIMEOUT_DURATION);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, fetchTotalCount]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Cleanup countdown timer on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const handleSelectFile = (file: UploadedFile) => {
    setSelectedFile(file);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalCount / ITEMS_PER_PAGE) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen bg-white font-sans">
      <div className="w-64 border-r border-gray-200 flex flex-col shrink-0">
        <Sidebar
          files={files}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          currentPage={currentPage}
          totalCount={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>

      <main className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <p className="text-lg font-medium mb-2">Loading files...</p>
            <p className="text-sm text-gray-400">
              Time remaining: <span className="font-mono font-semibold text-blue-600">{timeRemaining}s</span>
            </p>
          </div>
        ) : error ? (
          <div className="p-4 m-4 bg-red-100 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No files found.</p>
            <p>Click the '+' icon to upload your first file.</p>
          </div>
        ) : (
          <FileViewer
            file={selectedFile}
          />
        )}
      </main>
    </div>
  );
};

export default App;
