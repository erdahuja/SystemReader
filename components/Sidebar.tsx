// FIX: Replaced placeholder content with a functional Sidebar component.
import React from 'react';
import { UploadedFile } from '../types';
import { FileIcon } from './Icons';

interface SidebarProps {
  files: UploadedFile[];
  selectedFile: UploadedFile | null;
  onSelectFile: (file: UploadedFile) => void;
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  files,
  selectedFile,
  onSelectFile,
  currentPage,
  totalCount,
  itemsPerPage,
  onPreviousPage,
  onNextPage,
}) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalCount);

  return (
    <div className="flex flex-col h-full bg-gray-100 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Files</h2>
        {totalCount > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Showing {startItem}-{endItem} of {totalCount}
          </p>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {files.map((file) => (
          <a
            key={file.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectFile(file);
            }}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${selectedFile?.id === file.id
              ? 'bg-blue-100 text-blue-900'
              : 'text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FileIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </a>
        ))}
      </nav>
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onPreviousPage}
            disabled={!canGoPrevious}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={!canGoNext}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;