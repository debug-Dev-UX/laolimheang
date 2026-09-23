import React, { useState, useRef, useCallback } from 'react';

// Common Admin Styles for the Zone
const zoneStyle = {
  border: '2px dashed',
  borderRadius: 12,
  padding: '28px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 120,
  transition: 'all 0.2s',
  userSelect: 'none',
};

const progressRingStyle = { position: 'relative', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' };
const uploadIconStyle   = { width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' };

export const Base64UploadZone = ({ currentUrl, onUploaded }) => {
  const [dragging,  setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  const compressAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to WebP with 0.7 quality to keep size small for Firestore limits
          const dataUrl = canvas.toDataURL('image/webp', 0.7);
          
          // Check size (~1MB limit in Firestore)
          const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
          if (sizeInBytes > 950000) {
            reject(new Error("Image is still too large after compression. Please use a smaller image."));
            return;
          }

          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP, and GIF images are allowed.");
      return;
    }

    setError('');
    setUploading(true);
    setProgress(30);

    try {
      const base64Url = await compressAndConvertToBase64(file);
      setProgress(100);
      onUploaded(base64Url);
      setUploading(false);
    } catch (err) {
      console.error("Compression error:", err);
      setError(err.message || 'Failed to compress image.');
      setUploading(false);
      setProgress(0);
    }
  }, [onUploaded]);

  const onDrop      = useCallback((e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }, [handleFile]);
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div>
      <div
        style={{
          ...zoneStyle,
          borderColor: dragging ? '#a855f7' : currentUrl ? 'rgba(168,85,247,0.5)' : 'rgba(99,102,241,0.25)',
          background:  dragging ? 'rgba(168,85,247,0.08)' : 'rgba(15,15,30,0.6)',
          cursor: uploading ? 'default' : 'pointer',
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={progressRingStyle}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="4"/>
                <circle
                  cx="26" cy="26" r="22" fill="none"
                  stroke="#a855f7" strokeWidth="4"
                  strokeDasharray={`${138.23 * progress / 100} 138.23`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.3s ease' }}
                />
              </svg>
              <span style={{ position: 'absolute', fontSize: 12, fontWeight: 700, color: '#c084fc' }}>{progress}%</span>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, margin: '8px 0 6px' }}>Compressing Image…</p>
          </div>
        ) : currentUrl ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={currentUrl} alt="preview"
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(168,85,247,0.4)', marginBottom: 8 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <p style={{ color: '#34d399', fontSize: 12, margin: 0, fontWeight: 600 }}>✓ Ready — click or drop to replace</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={uploadIconStyle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '6px 0 2px' }}>
              <strong style={{ color: '#c084fc' }}>Drag & drop</strong> or click to select
            </p>
            <p style={{ color: '#475569', fontSize: 11, margin: 0 }}>Will be converted to Base64 directly</p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 12, margin: '8px 0 0', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
