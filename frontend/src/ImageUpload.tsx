import React, { useState, useEffect, useRef } from 'react';

export interface ImageUploadProps {
  api: string;
  listingId: number;
  onNotify: (msg: string) => void;
  onUploadComplete?: () => void;
}

interface UploadedImage {
  id: number;
  filename: string;
  url: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ api, listingId, onNotify, onUploadComplete }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const fetchImages = async () => {
    try {
      const res = await fetch(`${baseApi}/upload/?listing_id=${listingId}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (e) {
      console.error('Failed to fetch images', e);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [baseApi, listingId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    if (images.length + files.length > 3) {
      onNotify('Maximum 3 images allowed per listing');
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        onNotify(`File ${file.name} is not an image`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        onNotify(`File ${file.name} exceeds 10MB limit`);
        continue;
      }

      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('listing_id', listingId.toString());

    try {
      const res = await fetch(`${baseApi}/upload/`, {
        method: 'POST',
        body: formData,
      });

      setProgress(100);

      if (!res.ok) {
        const data = await res.json();
        onNotify(data.error || 'Upload failed');
      } else {
        onNotify('Image uploaded successfully');
        await fetchImages();
        if (onUploadComplete) onUploadComplete();
      }
    } catch (error) {
      onNotify('Upload error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const res = await fetch(`${baseApi}/upload/${encodeURIComponent(filename)}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onNotify('Image deleted');
        await fetchImages();
      } else {
        onNotify('Failed to delete image');
      }
    } catch (e) {
      onNotify('Error deleting image');
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#f0f8ff' : '#fafafa'
        }}
      >
        <p>Drag & drop images here, or click to select</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>Max 3 images. Size up to 10MB.</p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
      </div>

      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={progress} max="100" style={{ width: '100%' }}></progress>
        </div>
      )}

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {images.map(img => (
            <div key={img.id} style={{ position: 'relative', width: '100px', height: '100px' }}>
              <img
                src={img.url}
                alt="Uploaded"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
              <button
                onClick={() => handleDelete(img.filename)}
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
