import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ImageCompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before (JPG)',
  afterLabel = 'After (PNG)',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const zoomIn = () => setZoom(prev => Math.min(400, prev + 50));
  const zoomOut = () => setZoom(prev => Math.max(50, prev - 50));
  const resetZoom = () => setZoom(100);

  return (
    <div className="space-y-3">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 400}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <Move className="h-4 w-4" />
          </Button>
        </div>
        <Slider
          value={[sliderPosition]}
          onValueChange={(v) => setSliderPosition(v[0])}
          max={100}
          min={0}
          step={1}
          className="w-32"
        />
      </div>

      {/* Compare Container */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden cursor-ew-resize border border-border bg-secondary/30"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        role="slider"
        aria-label="Compare before and after images"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* After Image (Background) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
        >
          <img
            src={afterSrc}
            alt="After conversion"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center',
          }}
        >
          <img
            src={beforeSrc}
            alt="Before conversion"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
              <div className="w-0.5 h-4 bg-primary-foreground rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
          {beforeLabel}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
          {afterLabel}
        </div>
      </div>
    </div>
  );
};

export default ImageCompareSlider;
