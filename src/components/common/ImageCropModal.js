import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  RefreshCw,
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
  const [imgNatural, setImgNatural] = useState({ width: 0, height: 0 });
  const [cropping, setCropping] = useState(false);
  const [frameDimensions, setFrameDimensions] = useState({ width: 480, height: 360 });

  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);

  // Recalculate frame dimensions based on aspect ratio and container size
  const updateFrameDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const maxW = container.width * 0.92;
    const maxH = container.height * 0.92;

    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    setFrameDimensions({ width: Math.round(w), height: Math.round(h) });
  }, [aspect]);

  useEffect(() => {
    if (isOpen) {
      updateFrameDimensions();
      window.addEventListener('resize', updateFrameDimensions);
      return () => window.removeEventListener('resize', updateFrameDimensions);
    }
  }, [isOpen, updateFrameDimensions]);

  // Load natural dimensions & initialize image to COVER frame
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth || img.width || 800;
      const nh = img.naturalHeight || img.height || 600;
      setImgNatural({ width: nw, height: nh });

      // Reset transform
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setScale(1);
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl]);

  // Handle center reset
  const handleCenter = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  // Rotate helper (90 degrees clockwise)
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Base rendered dimensions of image scaled to "cover" the crop frame at scale=1
  const isRotated90or270 = rotation % 180 !== 0;
  const effectiveImgWidth = isRotated90or270 ? imgNatural.height : imgNatural.width;
  const effectiveImgHeight = isRotated90or270 ? imgNatural.width : imgNatural.height;

  // Cover scale: ensures the image fills the entire frame width & height with NO empty black borders
  const coverRatio = effectiveImgWidth && effectiveImgHeight && frameDimensions.width && frameDimensions.height
    ? Math.max(
        frameDimensions.width / effectiveImgWidth,
        frameDimensions.height / effectiveImgHeight
      )
    : 1;

  const baseWidth = Math.round((imgNatural.width || 400) * coverRatio);
  const baseHeight = Math.round((imgNatural.height || 300) * coverRatio);

  // Drag handlers (mouse & mobile touch)
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

  // Wheel zoom
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.8), 3.5));
  };

  // Apply crop and output clean canvas
  const handleApplyCrop = async () => {
    if (!imageUrl || !imgNatural.width || !imgNatural.height) return;
    setCropping(true);

    try {
      // High-resolution output canvas
      const targetWidth = Math.min(Math.max(imgNatural.width, 1200), 1600);
      const targetHeight = Math.round(targetWidth / aspect);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clean white base fill
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Scale multiplier from on-screen frame to output canvas
      const frameScaleFactor = targetWidth / frameDimensions.width;

      // Mathematical matrix transform: exact WYSIWYG matching what user positioned in the frame
      ctx.save();
      // Center canvas origin
      ctx.translate(targetWidth / 2, targetHeight / 2);
      // Apply user panning offset scaled to canvas
      ctx.translate(position.x * frameScaleFactor, position.y * frameScaleFactor);
      // Apply user rotation
      ctx.rotate((rotation * Math.PI) / 180);
      // Apply user scale
      ctx.scale(scale, scale);

      // Load clean source image
      const sourceImg = new Image();
      sourceImg.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        sourceImg.onload = resolve;
        sourceImg.onerror = reject;
        sourceImg.src = imageUrl;
      });

      // Draw image centered at origin with base cover dimensions
      const drawW = baseWidth * frameScaleFactor;
      const drawH = baseHeight * frameScaleFactor;
      ctx.drawImage(sourceImg, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Export format: WebP with JPEG fallback
      let dataUrl = canvas.toDataURL('image/webp', 0.85);
      if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }

      // Safeguard against Firestore 1MB document limit
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

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in select-none"
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

        {/* Aspect Ratio Selector Pills & Transform Tools */}
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
                    ? 'bg-black text-white shadow-xs'
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
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ROTATE 90°</span>
            </button>
            <button
              type="button"
              onClick={handleCenter}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
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
          {/* Framed Crop Area */}
          <div
            ref={frameRef}
            style={{
              width: `${frameDimensions.width}px`,
              height: `${frameDimensions.height}px`,
            }}
            className="relative overflow-hidden border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] z-10 flex flex-col justify-between"
          >
            {/* The Image inside the frame */}
            <div
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `translate(calc(-50% + ${frameDimensions.width / 2 + position.x}px), calc(-50% + ${frameDimensions.height / 2 + position.y}px)) rotate(${rotation}deg) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transformOrigin: 'center center',
              }}
              className="absolute top-0 left-0 will-change-transform select-none"
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop target"
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Grid 3x3 Composition Guidelines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40 z-20">
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div />
            </div>

            {/* Corner Markers */}
            <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5 z-20" />
            <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5 absolute top-0 right-0 z-20" />
            <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5 absolute bottom-0 left-0 z-20" />
            <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5 absolute bottom-0 right-0 z-20" />

            {/* Subtle instructional pill */}
            <div className="absolute top-2 left-2 bg-black/85 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 z-20 border border-white/20">
              DRAG TO CENTER SUBJECT
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-neutral-200 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-black">
              ZOOM: {Math.round(scale * 100)}%
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(Number((s - 0.1).toFixed(2)), 0.8))}
                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-28 sm:w-44 accent-black cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(Number((s + 0.1).toFixed(2)), 3))}
                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={cropping}
              className="px-4 py-2 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={cropping}
              className="px-5 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {cropping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>APPLY CROP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default ImageCropModal;
