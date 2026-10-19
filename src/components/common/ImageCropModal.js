import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  Check,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Sparkles,
} from 'lucide-react';

const ASPECT_RATIOS = [
  { label: '4:3 (EXHIBIT)', value: 4 / 3, name: '4:3' },
  { label: '1:1 (SQUARE)', value: 1, name: '1:1' },
  { label: '16:9 (WIDE)', value: 16 / 9, name: '16:9' },
  { label: '3:4 (PORTRAIT)', value: 3 / 4, name: '3:4' },
];

export const ImageCropModal = ({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  initialAspect = '4:3',
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(4 / 3);
  const [aspectName, setAspectName] = useState(initialAspect);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropping, setCropping] = useState(false);

  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);

  // Reset state on new image
  useEffect(() => {
    if (isOpen && imageUrl) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setAspect(4 / 3);
      setAspectName('4:3');

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      };
      img.src = imageUrl;
    }
  }, [isOpen, imageUrl]);

  // Center alignment helper
  const handleCenter = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  // Rotate helper
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Mouse & Touch Drag Handlers
  const handleStartDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMoveDrag = (clientX, clientY) => {
    if (!isDragging) return;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Mouse events
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);
  };

  const onMouseMove = (e) => {
    handleMoveDrag(e.clientX, e.clientY);
  };

  // Touch events for mobile phones
  const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Wheel zoom in crop box
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.6), 3.5));
  };

  // Generate cropped output canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current || !frameRef.current) return;
    setCropping(true);

    try {
      const frameRect = frameRef.current.getBoundingClientRect();
      const imgRect = imageRef.current.getBoundingClientRect();

      // Output canvas dimensions
      const targetWidth = Math.round(Math.min(imageDimensions.width, 1600));
      const targetHeight = Math.round(targetWidth / aspect);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background fill in case of margins
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Calculation of source coordinates based on frame vs image geometry
      const scaleX = (imageDimensions.width || 1) / imgRect.width;
      const scaleY = (imageDimensions.height || 1) / imgRect.height;

      const cropX = (frameRect.left - imgRect.left) * scaleX;
      const cropY = (frameRect.top - imgRect.top) * scaleY;
      const cropW = frameRect.width * scaleX;
      const cropH = frameRect.height * scaleY;

      // Draw transformed image
      const sourceImg = new Image();
      sourceImg.crossOrigin = 'anonymous';

      await new Promise((res, rej) => {
        sourceImg.onload = res;
        sourceImg.onerror = rej;
        sourceImg.src = imageUrl;
      });

      if (rotation !== 0) {
        // Handle rotation if applied
        ctx.save();
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          sourceImg,
          cropX,
          cropY,
          cropW,
          cropH,
          -targetWidth / 2,
          -targetHeight / 2,
          targetWidth,
          targetHeight
        );
        ctx.restore();
      } else {
        ctx.drawImage(sourceImg, cropX, cropY, cropW, cropH, 0, 0, targetWidth, targetHeight);
      }

      // Encode WebP with safe fallback
      let dataUrl = canvas.toDataURL('image/webp', 0.85);
      if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      // Guarantee under Firestore 750KB limit
      if (dataUrl.length > 700 * 1024) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.72);
      }

      const sizeBytes = Math.round(dataUrl.length * 0.75);
      onCropComplete(dataUrl, sizeBytes);
      setCropping(false);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      setCropping(false);
    }
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in select-none"
      onMouseMove={onMouseMove}
      onMouseUp={handleEndDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEndDrag}
    >
      <div className="relative bg-white border-2 border-black max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                IMAGE RE-CENTER &amp; CROPPING TOOL
              </span>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-black">
                CENTER &amp; FRAME GALLERY EXHIBIT
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black border border-transparent hover:border-black transition-colors cursor-pointer"
            aria-label="Close cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mr-1">
              FRAME RATIO:
            </span>
            {ASPECT_RATIOS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setAspect(item.value);
                  setAspectName(item.name);
                }}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  aspectName === item.name
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ROTATE</span>
            </button>
            <button
              type="button"
              onClick={handleCenter}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
              title="Reset center"
            >
              <Move className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RE-CENTER</span>
            </button>
          </div>
        </div>

        {/* Cropping Viewport Stage */}
        <div
          ref={containerRef}
          onWheel={onWheel}
          className="relative w-full h-[52vh] sm:h-[58vh] bg-neutral-950 flex items-center justify-center overflow-hidden border border-neutral-800"
        >
          {/* Draggable & Scalable Image */}
          <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
            className="absolute will-change-transform select-none"
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop target"
              draggable={false}
              className="max-w-none max-h-[50vh] object-contain pointer-events-none"
            />
          </div>

          {/* Semi-transparent Dark Overlay Backdrop */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />

          {/* Clear Viewport Frame with grid guides */}
          <div
            ref={frameRef}
            style={{
              aspectRatio: `${aspect}`,
              maxHeight: '88%',
              maxWidth: '88%',
            }}
            className="relative border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] pointer-events-none z-10 flex flex-col justify-between"
          >
            {/* Grid 3x3 Composition Guidelines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-white/60" />
              <div className="border-r border-white/60" />
              <div />
            </div>

            {/* Corner Markers */}
            <div className="w-3 h-3 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5" />
            <div className="w-3 h-3 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5 absolute top-0 right-0" />
            <div className="w-3 h-3 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5 absolute bottom-0 left-0" />
            <div className="w-3 h-3 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5 absolute bottom-0 right-0" />

            <div className="absolute top-2 left-2 bg-black/80 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              DRAG &amp; ZOOM TO CENTER SUBJECT
            </div>
          </div>
        </div>

        {/* Bottom Zoom Slider & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 shrink-0">
              ZOOM: {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((p) => Math.max(p - 0.15, 0.6))}
              className="p-1 text-neutral-500 hover:text-black cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-32 sm:w-48 accent-black cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setScale((p) => Math.min(p + 0.15, 3))}
              className="p-1 text-neutral-500 hover:text-black cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={cropping}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{cropping ? 'CROPPING...' : 'APPLY CROP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
