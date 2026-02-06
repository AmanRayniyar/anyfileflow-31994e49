import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Upload, Download, X, Image as ImageIcon, RefreshCw, Check, Zap,
  FolderOpen, Archive, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ConvertedImage, ConversionSettings, defaultSettings } from './types';
import { useConversionHistory } from './useConversionHistory';
import ConversionSettingsPanel from './ConversionSettingsPanel';
import ImageCompareSlider from './ImageCompareSlider';
import ConversionHistoryPanel from './ConversionHistoryPanel';
import ShareResultButton from './ShareResultButton';
import ComparisonTable from './ComparisonTable';
import TrustBadges from './TrustBadges';

const AdvancedJpgToPngConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [settings, setSettings] = useState<ConversionSettings>(defaultSettings);
  const [progress, setProgress] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState<ConvertedImage | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const { history, addBulkToHistory, clearHistory } = useConversionHistory();
  const conversionStartTime = useRef<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter only image files
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || 
      /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name)
    );
    setFiles(prev => [...prev, ...imageFiles]);
    setConvertedImages([]);
    setSelectedPreview(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedImages([]);
    setSelectedPreview(null);
    setProgress(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const convertImage = async (file: File, index: number): Promise<ConvertedImage | null> => {
    const startTime = performance.now();
    
    try {
      // Create image from file
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Apply PNG type processing
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (settings.pngType === 'png-8') {
        // Reduce to 256 colors (simple quantization)
        imageData = quantizeColors(imageData, 256);
        ctx.putImageData(imageData, 0, 0);
      }

      // Add watermark if enabled
      if (settings.addWatermark) {
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'right';
        ctx.fillText('Converted by AnyFileFlow', canvas.width - 10, canvas.height - 10);
      }

      // Convert to PNG
      const quality = settings.compression === 'ultra' ? 0.85 : 1;
      const dataUrl = canvas.toDataURL('image/png', quality);
      
      // Calculate sizes
      const convertedSize = Math.round((dataUrl.length * 3) / 4);
      const originalSize = file.size;
      const compressionPercent = Math.max(0, Math.round((1 - convertedSize / originalSize) * 100));
      
      const endTime = performance.now();
      const conversionTime = (endTime - startTime) / 1000;

      const convertedImage: ConvertedImage = {
        id: `${Date.now()}-${index}`,
        originalName: file.name,
        originalSize,
        originalUrl: objectUrl,
        convertedName: file.name.replace(/\.[^/.]+$/, '.png'),
        convertedSize,
        convertedUrl: dataUrl,
        compressionPercent,
        conversionTime,
        pngType: settings.pngType,
        hasTransparency: settings.removeBackground,
        timestamp: Date.now(),
        width: img.width,
        height: img.height,
        dpi: settings.dpi,
        metadataRemoved: !settings.keepMetadata,
      };

      return convertedImage;
    } catch (error) {
      console.error(`Failed to convert ${file.name}:`, error);
      return null;
    }
  };

  // Simple color quantization for PNG-8
  const quantizeColors = (imageData: ImageData, maxColors: number): ImageData => {
    const data = imageData.data;
    const palette: Map<string, number[]> = new Map();
    
    // Build color palette (simplified)
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      if (!palette.has(key)) {
        palette.set(key, [r, g, b]);
      }
    }

    // Apply quantized colors
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / 32) * 32;
      data[i + 1] = Math.round(data[i + 1] / 32) * 32;
      data[i + 2] = Math.round(data[i + 2] / 32) * 32;
    }

    return imageData;
  };

  const convertAll = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please add at least one image to convert.',
        variant: 'destructive',
      });
      return;
    }

    setConverting(true);
    setProgress(0);
    conversionStartTime.current = performance.now();
    
    const converted: ConvertedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await convertImage(files[i], i);
      if (result) {
        converted.push(result);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setConvertedImages(converted);
    setConverting(false);

    if (converted.length > 0) {
      addBulkToHistory(converted);
      setSelectedPreview(converted[0]);
      
      const totalTime = ((performance.now() - conversionStartTime.current) / 1000).toFixed(2);
      toast({
        title: `⚡ Converted ${converted.length} image(s) in ${totalTime}s`,
        description: `Average ${(converted.reduce((a, b) => a + b.compressionPercent, 0) / converted.length).toFixed(0)}% size reduction`,
      });
    }
  };

  const downloadFile = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.convertedUrl;
    link.download = image.convertedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (convertedImages.length === 0) return;

    const zip = new JSZip();
    
    for (const image of convertedImages) {
      // Convert data URL to blob
      const response = await fetch(image.convertedUrl);
      const blob = await response.blob();
      zip.file(image.convertedName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted-images.zip');

    toast({
      title: 'ZIP downloaded!',
      description: `${convertedImages.length} images packaged successfully`,
    });
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
  const totalConvertedSize = convertedImages.reduce((acc, f) => acc + f.convertedSize, 0);
  const totalSaved = totalOriginalSize - totalConvertedSize;
  const totalSavedPercent = totalOriginalSize > 0 ? Math.round((totalSaved / totalOriginalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <TrustBadges />

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {isDragActive ? "Drop your images here" : "Drag & drop JPG images here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Supports folders • 100+ files at once
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary"><FolderOpen className="h-3 w-3 mr-1" />Folder Support</Badge>
            <Badge variant="secondary"><Archive className="h-3 w-3 mr-1" />Bulk Convert</Badge>
            <Badge variant="secondary"><Sparkles className="h-3 w-3 mr-1" />AI Features</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, JPEG, PNG, WebP, GIF, BMP • No size limits • 100% free
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Advanced Settings
            </span>
            {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ConversionSettingsPanel settings={settings} onChange={setSettings} />
        </CollapsibleContent>
      </Collapsible>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Selected Files ({files.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
              >
                <div className="p-2 rounded-lg bg-tool-image/10">
                  <ImageIcon className="h-4 w-4 text-tool-image" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert Button with Progress */}
      {files.length > 0 && convertedImages.length === 0 && (
        <div className="space-y-3">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={convertAll}
            disabled={converting}
          >
            {converting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Converting... {progress}%
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Convert {files.length} Image{files.length > 1 ? 's' : ''} to PNG
              </>
            )}
          </Button>
          {converting && (
            <Progress value={progress} className="h-2" />
          )}
        </div>
      )}

      {/* Converted Files */}
      {convertedImages.length > 0 && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{convertedImages.length}</p>
              <p className="text-xs text-muted-foreground">Images Converted</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-tool-archive">{totalSavedPercent}%</p>
              <p className="text-xs text-muted-foreground">Size Reduced</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{formatSize(totalConvertedSize)}</p>
              <p className="text-xs text-muted-foreground">Total Size</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-tool-image">
                {(convertedImages.reduce((a, b) => a + b.conversionTime, 0)).toFixed(2)}s
              </p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
          </div>

          {/* Before/After Preview */}
          {selectedPreview && (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Live Preview</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    ⚡ {selectedPreview.conversionTime.toFixed(2)}s
                  </Badge>
                  <ShareResultButton image={selectedPreview} />
                </div>
              </div>
              <ImageCompareSlider
                beforeSrc={selectedPreview.originalUrl}
                afterSrc={selectedPreview.convertedUrl}
              />
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <span className="text-muted-foreground">
                  Original: <strong>{formatSize(selectedPreview.originalSize)}</strong>
                </span>
                <span className="text-tool-archive font-semibold">
                  → {formatSize(selectedPreview.convertedSize)} (-{selectedPreview.compressionPercent}%)
                </span>
              </div>
            </div>
          )}

          {/* Download Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="hero" size="lg" className="flex-1" onClick={downloadAllAsZip}>
              <Archive className="h-5 w-5" />
              Download All as ZIP
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={clearAll}>
              Convert More Images
            </Button>
          </div>

          {/* Converted Files List */}
          <div className="space-y-2">
            {convertedImages.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "flex items-center gap-3 p-3 bg-card border rounded-lg cursor-pointer transition-all",
                  selectedPreview?.id === image.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedPreview(image)}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img
                    src={image.convertedUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{image.convertedName}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-tool-archive font-medium">-{image.compressionPercent}%</span>
                    <span>•</span>
                    <span>{formatSize(image.convertedSize)}</span>
                    <span>•</span>
                    <span>⚡ {image.conversionTime.toFixed(2)}s</span>
                    <Badge variant="secondary" className="text-[10px]">{image.pngType.toUpperCase()}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <ShareResultButton image={image} />
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); downloadFile(image); }}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Panel */}
      <ConversionHistoryPanel
        images={history.images}
        totalConverted={history.totalConverted}
        onDownload={downloadFile}
        onClear={clearHistory}
      />

      {/* Comparison Table */}
      <ComparisonTable />
    </div>
  );
};

export default AdvancedJpgToPngConverter;
