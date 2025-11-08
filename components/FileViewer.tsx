import React from 'react';
import { UploadedFile } from '../types';

interface FileViewerProps {
  file: UploadedFile | null;
}

const FileViewer: React.FC<FileViewerProps> = ({
  file,
}) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a file to view its content
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold truncate">{file.name}</h3>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <pre className="text-sm bg-gray-50 p-4 rounded-md">
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
};

export default FileViewer;
