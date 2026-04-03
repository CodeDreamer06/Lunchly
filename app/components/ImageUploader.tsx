"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  className?: string;
}

export default function ImageUploader({ onImageSelected, className = "" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(",")[1];
      setPreview(result);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-3xl"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors ${
            isDragging
              ? "border-primary bg-primary-container/10"
              : "border-outline-variant bg-surface-container-lowest hover:border-primary/50"
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            add_photo_alternate
          </span>
          <p className="text-sm text-on-surface-variant">
            Click or drag to upload lunchbox photo
          </p>
        </button>
      )}
    </div>
  );
}
