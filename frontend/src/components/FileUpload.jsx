import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, X } from 'lucide-react';

export default function FileUpload({ file, onFileSelect, onFileRemove, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndPassFile = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      alert('Only PDF and DOCX files are supported.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }
    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1F] mb-2">
        Upload Resume (.PDF or .DOCX) <span className="text-[#991B1B]">*</span>
      </label>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#1F6F5C] bg-[#EAF3F0] scale-[1.01]'
              : 'border-[#E3DFD8] bg-[#FAF8F5] hover:border-[#1F6F5C] hover:bg-[#EAF3F0]/40'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                validateAndPassFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-xl bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center mx-auto text-[#1F6F5C] mb-3 shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-medium text-[#3A3A3A]">
            <span className="text-[#1F6F5C] font-semibold hover:underline">Click to browse</span> or drag and drop your file here
          </p>
          <p className="text-xs text-[#5F5F5F] mt-1.5 font-normal">
            Supported formats: PDF, DOCX (Max 5 MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-[#FAF8F5] border border-[#E3DFD8] rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#EAF3F0] border border-[#1F6F5C]/30 flex items-center justify-center text-[#1F6F5C] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1F1F1F] truncate">{file.name}</p>
              <p className="text-xs text-[#5F5F5F]">{formatSize(file.size)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFileRemove}
            className="p-1.5 text-[#5F5F5F] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-700 mt-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
