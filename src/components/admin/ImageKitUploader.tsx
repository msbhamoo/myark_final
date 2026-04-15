'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageKitUploaderProps {
  onUpload: (url: string) => void;
  currentImage?: string | null;
  folder?: string;
  label?: string;
}

const IMAGEKIT_PUBLIC_KEY = 'public_0fH+D8F9G3BqwkbXNKHERCY2j/U=';
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/okc7zsagpd';

export function ImageKitUploader({ onUpload, currentImage, folder = '/blog', label = 'Cover Image' }: ImageKitUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // Step 1: Get auth params from our server
      const authRes = await fetch('/api/imagekit-auth');
      if (!authRes.ok) throw new Error('Failed to get upload credentials');
      const { signature, token, expire } = await authRes.json();
      setProgress(30);

      // Step 2: Generate a clean filename
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `blog-${Date.now()}.${ext}`;

      // Step 3: Upload to ImageKit
      const formData = new FormData();
      formData.append('file', file);
      formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
      formData.append('signature', signature);
      formData.append('expire', String(expire));
      formData.append('token', token);
      formData.append('fileName', fileName);
      formData.append('folder', folder);

      setProgress(50);

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.message || `Upload failed (${uploadRes.status})`);
      }

      const data = await uploadRes.json();
      const imageUrl = data.url || `${IMAGEKIT_URL_ENDPOINT}${data.filePath}`;
      
      setProgress(100);
      setPreview(imageUrl);
      onUpload(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError((err as Error).message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [onUpload, folder]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        {label}
      </label>

      {preview ? (
        /* Image Preview */
        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
          <img 
            src={preview} 
            alt="Cover preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Remove
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[10px] font-mono px-3 py-1.5 rounded-lg truncate backdrop-blur-sm">
            {preview}
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 text-center ${
            dragActive
              ? 'border-[#0066FF] bg-[#0066FF]/5 dark:bg-blue-900/10 scale-[1.01]'
              : uploading
              ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 cursor-wait'
              : 'border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] hover:border-[#0066FF]/40 hover:bg-[#0066FF]/[0.02]'
          }`}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Uploading to ImageKit...</p>
              {/* Progress Bar */}
              <div className="w-48 mx-auto h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
                dragActive 
                  ? 'bg-[#0066FF]/10 text-[#0066FF] dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'
              }`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {dragActive ? 'Drop image here' : 'Click or drag image to upload'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  JPG, PNG, WebP · Max 10MB · Powered by ImageKit
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 px-4 py-2 rounded-xl">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
