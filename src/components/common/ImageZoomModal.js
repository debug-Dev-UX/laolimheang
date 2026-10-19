import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

export const ImageZoomModal = ({
  isOpen,
  onClose,
  imageUrl,
  images = [],
  title,
  category,
  description,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  // Normalize album image list
  const albumImages = Array.isArray(images) && images.length > 0
    ? images
    : (imageUrl ? [imageUrl] : []);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Active photo URL
  const currentPhoto = albumImages[activePhotoIdx] || imageUrl;

  // Reset state on open or when target changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageUrl, images, isOpen]);

  // Reset zoom position when switching photos inside album
  const handleSelectPhoto = (idx) => {
    setActivePhotoIdx(idx);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Keyboard navigation
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
      } else if (e.key === 'ArrowLeft') {
        if (albumImages.length > 1 && activePhotoIdx > 0) {
          handleSelectPhoto(activePhotoIdx - 1);
        } else if (hasPrev && onPrev) {
          onPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (albumImages.length > 1 && activePhotoIdx < albumImages.length - 1) {
          handleSelectPhoto(activePhotoIdx + 1);
        } else if (hasNext && onNext) {
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, albumImages.length, activePhotoIdx, hasPrev, hasNext, onPrev, onNext, onClose]);

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

  // Mobile touch drag & pan
  const handleTouchStart = (e) => {
    if (scale <= 1 || !e.touches || !e.touches[0]) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1 || !e.touches || !e.touches[0]) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
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

  // Intra-album vs inter-exhibit navigation
  const canGoLeft = (albumImages.length > 1 && activePhotoIdx > 0) || (hasPrev && !!onPrev);
  const canGoRight = (albumImages.length > 1 && activePhotoIdx < albumImages.length - 1) || (hasNext && !!onNext);

  const handleStepLeft = (e) => {
    e.stopPropagation();
    if (albumImages.length > 1 && activePhotoIdx > 0) {
      handleSelectPhoto(activePhotoIdx - 1);
    } else if (hasPrev && onPrev) {
      onPrev();
    }
  };

  const handleStepRight = (e) => {
    e.stopPropagation();
    if (albumImages.length > 1 && activePhotoIdx < albumImages.length - 1) {
      handleSelectPhoto(activePhotoIdx + 1);
    } else if (hasNext && onNext) {
      onNext();
    }
  };

  if (!isOpen || !currentPhoto) return null;

  const modalContent = (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-black/95 backdrop-blur-md animate-fade-in select-none w-screen h-screen overflow-hidden"
      onClick={onClose}
    >
      {/* ── Top Header Controls Bar ── */}
      <div
        className="w-full h-16 sm:h-20 bg-gradient-to-b from-black/90 via-black/70 to-transparent flex items-center justify-between px-4 sm:px-8 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          {category && (
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shrink-0">
              {category}
            </span>
          )}
          {albumImages.length > 1 && (
            <span className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center gap-1 shrink-0">
              <Layers className="w-3 h-3" />
              <span>PHOTO {activePhotoIdx + 1} / {albumImages.length}</span>
            </span>
          )}
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white truncate">
            {title || 'EXHIBIT INSPECTION'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom Level Indicator */}
          <span className="text-[11px] font-mono font-bold text-white bg-white/10 px-2.5 py-1 border border-white/20">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors disabled:opacity-30 cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors disabled:opacity-30 cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title="Reset Zoom (0)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-white text-black hover:bg-neutral-200 transition-colors ml-2 cursor-pointer shadow-md"
            title="Close (Esc)"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ── Main Zoomable Viewport Stage ── */}
      <div
        id="image-zoom-viewport"
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={currentPhoto}
          alt={title || 'Gallery Exhibit'}
          onDoubleClick={handleDoubleClick}
          draggable={false}
          className="max-w-[92vw] max-h-[75vh] object-contain transition-transform duration-100 ease-out select-none will-change-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        />

        {/* Previous Navigation Arrow */}
        {canGoLeft && (
          <button
            type="button"
            onClick={handleStepLeft}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 bg-black/80 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Next Navigation Arrow */}
        {canGoRight && (
          <button
            type="button"
            onClick={handleStepRight}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 bg-black/80 hover:bg-white text-white hover:text-black border border-white/30 flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* ── Bottom Information Ribbon & Album Thumbnails ── */}
      <div
        className="w-full bg-gradient-to-t from-black via-black/85 to-transparent pb-4 pt-2 px-4 sm:px-8 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Album Photo Thumbnails Strip (if multiple photos in album) */}
        {albumImages.length > 1 && (
          <div className="max-w-2xl mx-auto mb-3 flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar">
            {albumImages.map((thumbUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPhoto(idx)}
                className={`relative w-14 h-11 sm:w-16 sm:h-12 border-2 transition-all cursor-pointer shrink-0 overflow-hidden bg-neutral-900 ${
                  activePhotoIdx === idx
                    ? 'border-white scale-105 shadow-md ring-2 ring-amber-400'
                    : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/80'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono font-bold text-white px-1">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Exhibit Info Caption */}
        {(description || title) && (
          <div className="max-w-2xl mx-auto bg-black/90 border border-white/20 p-3 sm:p-4 text-white backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider block truncate">
                  {title}
                </span>
                {description && (
                  <p className="text-[11px] text-neutral-300 font-medium mt-1 leading-relaxed line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 shrink-0 hidden sm:inline">
                DOUBLE-CLICK OR SCROLL TO ZOOM
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default ImageZoomModal;
