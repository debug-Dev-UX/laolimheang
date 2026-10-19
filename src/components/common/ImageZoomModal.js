import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

export const ImageZoomModal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  category,
  description,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Reset zoom on item switch or close
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl, isOpen]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext, onClose]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleReset();
    } else {
      setScale(2.5);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.25, 4));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      {/* ── Top Header Controls Bar ── */}
      <div
        className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between px-4 sm:px-8 z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          {category && (
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shrink-0">
              {category}
            </span>
          )}
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate">
            {title || 'EXHIBIT INSPECTION'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Level Indicator */}
          <span className="text-[11px] font-mono font-bold text-white bg-white/10 px-2.5 py-1 border border-white/20">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors disabled:opacity-30 cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors disabled:opacity-30 cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleReset}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title="Reset Zoom (0)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors ml-2 cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main Zoomable Viewport ── */}
      <div
        id="image-zoom-viewport"
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={imageUrl}
          alt={title || 'Gallery Exhibit'}
          onDoubleClick={handleDoubleClick}
          draggable={false}
          className="max-w-[90vw] max-h-[80vh] object-contain transition-transform duration-150 ease-out select-none will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        />

        {/* Navigation Arrows */}
        {hasPrev && onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer z-20"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {hasNext && onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer z-20"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* ── Bottom Information Ribbon ── */}
      {(description || title) && (
        <div
          className="absolute bottom-4 inset-x-4 sm:inset-x-8 max-w-2xl mx-auto bg-black/85 border border-white/20 p-4 z-30 text-white backdrop-blur-sm pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-wider block truncate">
                {title}
              </span>
              {description && (
                <p className="text-[11px] text-neutral-300 font-medium mt-1 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 shrink-0">
              DOUBLE-CLICK OR SCROLL TO ZOOM
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageZoomModal;
