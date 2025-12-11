import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, FabricImage, FabricText, Circle, Rect } from 'fabric';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface WatermarkSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  position: string;
  offsetX: number;
  offsetY: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  stroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  repeat: boolean;
  repeatGap: number;
}

interface LogoSettings {
  opacity: number;
  scale: number;
  rotation: number;
  position: string;
  offsetX: number;
  offsetY: number;
}

const FONTS = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Palatino Linotype',
  'Lucida Console'
];

const POSITIONS = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center-left', label: 'Center Left' },
  { value: 'center', label: 'Center' },
  { value: 'center-right', label: 'Center Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

const WatermarkImageTool: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  const [textSettings, setTextSettings] = useState<WatermarkSettings>({
    text: '© Your Name',
    fontSize: 32,
    fontFamily: 'Arial',
    color: '#ffffff',
    opacity: 50,
    rotation: 0,
    position: 'bottom-right',
    offsetX: 20,
    offsetY: 20,
    shadow: true,
    shadowColor: '#000000',
    shadowBlur: 4,
    stroke: false,
    strokeColor: '#000000',
    strokeWidth: 1,
    repeat: false,
    repeatGap: 150
  });

  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    opacity: 50,
    scale: 20,
    rotation: 0,
    position: 'bottom-right',
    offsetX: 20,
    offsetY: 20
  });

  const onDropImages = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setImages(prev => [...prev, ...imageFiles].slice(0, 50));
      toast.success(`Added ${imageFiles.length} image(s) for watermarking`);
    }
  }, []);

  const onDropLogo = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Logo uploaded successfully');
    }
  }, []);

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps, isDragActive: isImagesDragActive } = useDropzone({
    onDrop: onDropImages,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'] },
    multiple: true
  });

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({
    onDrop: onDropLogo,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    multiple: false
  });

  // Generate preview
  useEffect(() => {
    if (images.length > 0) {
      generatePreview();
    }
  }, [images, textSettings, logoSettings, logoFile, activeTab]);

  const generatePreview = async () => {
    if (images.length === 0) return;
    
    const file = images[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (activeTab === 'text') {
      await applyTextWatermark(ctx, canvas.width, canvas.height);
    } else if (activeTab === 'image' && logoFile) {
      await applyLogoWatermark(ctx, canvas.width, canvas.height);
    }

    setPreviewUrl(canvas.toDataURL('image/png'));
    URL.revokeObjectURL(img.src);
  };

  const getPosition = (canvasWidth: number, canvasHeight: number, itemWidth: number, itemHeight: number, position: string, offsetX: number, offsetY: number) => {
    let x = 0, y = 0;

    switch (position) {
      case 'top-left':
        x = offsetX;
        y = offsetY;
        break;
      case 'top-center':
        x = (canvasWidth - itemWidth) / 2;
        y = offsetY;
        break;
      case 'top-right':
        x = canvasWidth - itemWidth - offsetX;
        y = offsetY;
        break;
      case 'center-left':
        x = offsetX;
        y = (canvasHeight - itemHeight) / 2;
        break;
      case 'center':
        x = (canvasWidth - itemWidth) / 2;
        y = (canvasHeight - itemHeight) / 2;
        break;
      case 'center-right':
        x = canvasWidth - itemWidth - offsetX;
        y = (canvasHeight - itemHeight) / 2;
        break;
      case 'bottom-left':
        x = offsetX;
        y = canvasHeight - itemHeight - offsetY;
        break;
      case 'bottom-center':
        x = (canvasWidth - itemWidth) / 2;
        y = canvasHeight - itemHeight - offsetY;
        break;
      case 'bottom-right':
        x = canvasWidth - itemWidth - offsetX;
        y = canvasHeight - itemHeight - offsetY;
        break;
    }

    return { x, y };
  };

  const applyTextWatermark = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { text, fontSize, fontFamily, color, opacity, rotation, position, offsetX, offsetY, shadow, shadowColor, shadowBlur, stroke, strokeColor, strokeWidth, repeat, repeatGap } = textSettings;
    
    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    if (shadow) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;

    if (repeat) {
      // Repeat pattern
      const diagonalLength = Math.sqrt(width * width + height * height);
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      for (let y = -diagonalLength; y < diagonalLength; y += repeatGap + textHeight) {
        for (let x = -diagonalLength; x < diagonalLength; x += repeatGap + textWidth) {
          if (stroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.strokeText(text, x, y);
          }
          ctx.fillText(text, x, y);
        }
      }
    } else {
      const { x, y } = getPosition(width, height, textWidth, textHeight, position, offsetX, offsetY);
      
      ctx.translate(x + textWidth / 2, y + textHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      if (stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(text, -textWidth / 2, textHeight / 2 - 5);
      }
      ctx.fillText(text, -textWidth / 2, textHeight / 2 - 5);
    }

    ctx.restore();
  };

  const applyLogoWatermark = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!logoFile) return;

    const logo = new Image();
    logo.src = logoPreview;
    
    await new Promise((resolve) => {
      logo.onload = resolve;
    });

    const { opacity, scale, rotation, position, offsetX, offsetY } = logoSettings;
    const logoWidth = (logo.width * scale) / 100;
    const logoHeight = (logo.height * scale) / 100;

    ctx.save();
    ctx.globalAlpha = opacity / 100;

    const { x, y } = getPosition(width, height, logoWidth, logoHeight, position, offsetX, offsetY);

    ctx.translate(x + logoWidth / 2, y + logoHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(logo, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);

    ctx.restore();
  };

  const processImages = async () => {
    if (images.length === 0) {
      toast.error('Please upload images first');
      return;
    }

    if (activeTab === 'image' && !logoFile) {
      toast.error('Please upload a logo/watermark image');
      return;
    }

    setProcessing(true);

    try {
      if (images.length === 1) {
        // Single image - download directly
        const result = await processImage(images[0]);
        saveAs(result, `watermarked_${images[0].name}`);
        toast.success('Image watermarked successfully!');
      } else {
        // Multiple images - create ZIP
        const zip = new JSZip();
        const folder = zip.folder('watermarked-images');

        for (let i = 0; i < images.length; i++) {
          const result = await processImage(images[i]);
          const fileName = `watermarked_${images[i].name}`;
          folder?.file(fileName, result);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'watermarked-images.zip');
        toast.success(`${images.length} images watermarked successfully!`);
      }
    } catch (error) {
      toast.error('Error processing images');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const processImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (activeTab === 'text') {
          await applyTextWatermark(ctx, canvas.width, canvas.height);
        } else if (activeTab === 'image' && logoFile) {
          await applyLogoWatermark(ctx, canvas.width, canvas.height);
        }

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 1);

        URL.revokeObjectURL(img.src);
      };

      img.onerror = reject;
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
    setPreviewUrl('');
    setLogoFile(null);
    setLogoPreview('');
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Upload Images (up to 50)</Label>
          <div
            {...getImagesRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isImagesDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getImagesInputProps()} />
            <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-muted-foreground mb-2">Drag & drop images here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>

          {images.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{images.length} image(s) selected</span>
                <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Preview</Label>
          <div className="border border-border rounded-xl overflow-hidden bg-muted/50 min-h-[200px] flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
            ) : (
              <p className="text-muted-foreground text-sm">Upload an image to see preview</p>
            )}
          </div>
        </div>
      </div>

      {/* Watermark Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'image')}>
          <TabsList className="grid w-full grid-cols-2 mb-6 h-auto min-h-[44px]">
            <TabsTrigger value="text" className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs sm:text-sm whitespace-nowrap">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              <span className="hidden xs:inline">Text</span>
              <span className="xs:hidden">Text</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-xs sm:text-sm whitespace-nowrap">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Image/Logo</span>
              <span className="sm:hidden">Logo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            {/* Text Input */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Watermark Text</Label>
                <Input
                  value={textSettings.text}
                  onChange={(e) => setTextSettings(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="© Your Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Font Family</Label>
                <Select
                  value={textSettings.fontFamily}
                  onValueChange={(v) => setTextSettings(prev => ({ ...prev, fontFamily: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map(font => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Font Size & Color */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Font Size: {textSettings.fontSize}px</Label>
                <Slider
                  value={[textSettings.fontSize]}
                  onValueChange={([v]) => setTextSettings(prev => ({ ...prev, fontSize: v }))}
                  min={12}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={textSettings.color}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={textSettings.color}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Opacity: {textSettings.opacity}%</Label>
                <Slider
                  value={[textSettings.opacity]}
                  onValueChange={([v]) => setTextSettings(prev => ({ ...prev, opacity: v }))}
                  min={10}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Position & Rotation */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Position</Label>
                <Select
                  value={textSettings.position}
                  onValueChange={(v) => setTextSettings(prev => ({ ...prev, position: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rotation: {textSettings.rotation}°</Label>
                <Slider
                  value={[textSettings.rotation]}
                  onValueChange={([v]) => setTextSettings(prev => ({ ...prev, rotation: v }))}
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Offset X</Label>
                  <Input
                    type="number"
                    value={textSettings.offsetX}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, offsetX: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Offset Y</Label>
                  <Input
                    type="number"
                    value={textSettings.offsetY}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, offsetY: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shadow */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Shadow Effect</Label>
                  <Switch
                    checked={textSettings.shadow}
                    onCheckedChange={(v) => setTextSettings(prev => ({ ...prev, shadow: v }))}
                  />
                </div>
                {textSettings.shadow && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Shadow Color</Label>
                      <input
                        type="color"
                        value={textSettings.shadowColor}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, shadowColor: e.target.value }))}
                        className="w-full h-8 rounded border border-border cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Blur: {textSettings.shadowBlur}px</Label>
                      <Slider
                        value={[textSettings.shadowBlur]}
                        onValueChange={([v]) => setTextSettings(prev => ({ ...prev, shadowBlur: v }))}
                        min={0}
                        max={20}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Stroke */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Stroke/Outline</Label>
                  <Switch
                    checked={textSettings.stroke}
                    onCheckedChange={(v) => setTextSettings(prev => ({ ...prev, stroke: v }))}
                  />
                </div>
                {textSettings.stroke && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Stroke Color</Label>
                      <input
                        type="color"
                        value={textSettings.strokeColor}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, strokeColor: e.target.value }))}
                        className="w-full h-8 rounded border border-border cursor-pointer mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Width: {textSettings.strokeWidth}px</Label>
                      <Slider
                        value={[textSettings.strokeWidth]}
                        onValueChange={([v]) => setTextSettings(prev => ({ ...prev, strokeWidth: v }))}
                        min={1}
                        max={10}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Repeat Pattern */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="font-semibold">Repeat Pattern (Tiled Watermark)</Label>
                  <p className="text-xs text-muted-foreground">Cover entire image with repeated watermarks</p>
                </div>
                <Switch
                  checked={textSettings.repeat}
                  onCheckedChange={(v) => setTextSettings(prev => ({ ...prev, repeat: v }))}
                />
              </div>
              {textSettings.repeat && (
                <div>
                  <Label>Gap Between Watermarks: {textSettings.repeatGap}px</Label>
                  <Slider
                    value={[textSettings.repeatGap]}
                    onValueChange={([v]) => setTextSettings(prev => ({ ...prev, repeatGap: v }))}
                    min={50}
                    max={300}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Upload Logo/Watermark Image</Label>
              <div
                {...getLogoRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isLogoDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...getLogoInputProps()} />
                {logoPreview ? (
                  <div className="flex items-center gap-4">
                    <img src={logoPreview} alt="Logo" className="w-16 h-16 object-contain rounded-lg bg-muted" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{logoFile?.name}</p>
                      <p className="text-xs text-muted-foreground">Click or drag to replace</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 mx-auto mb-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-muted-foreground">Drag & drop logo image (PNG with transparency recommended)</p>
                  </>
                )}
              </div>
            </div>

            {/* Logo Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Opacity: {logoSettings.opacity}%</Label>
                <Slider
                  value={[logoSettings.opacity]}
                  onValueChange={([v]) => setLogoSettings(prev => ({ ...prev, opacity: v }))}
                  min={10}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Scale: {logoSettings.scale}%</Label>
                <Slider
                  value={[logoSettings.scale]}
                  onValueChange={([v]) => setLogoSettings(prev => ({ ...prev, scale: v }))}
                  min={5}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Position</Label>
                <Select
                  value={logoSettings.position}
                  onValueChange={(v) => setLogoSettings(prev => ({ ...prev, position: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rotation: {logoSettings.rotation}°</Label>
                <Slider
                  value={[logoSettings.rotation]}
                  onValueChange={([v]) => setLogoSettings(prev => ({ ...prev, rotation: v }))}
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Offset X</Label>
                  <Input
                    type="number"
                    value={logoSettings.offsetX}
                    onChange={(e) => setLogoSettings(prev => ({ ...prev, offsetX: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Offset Y</Label>
                  <Input
                    type="number"
                    value={logoSettings.offsetY}
                    onChange={(e) => setLogoSettings(prev => ({ ...prev, offsetY: parseInt(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          size="lg"
          onClick={processImages}
          disabled={processing || images.length === 0}
          className="min-w-[200px]"
        >
          {processing ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Apply Watermark & Download
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      {/* Features Info */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        {[
          { icon: "🎨", title: "Custom Fonts", desc: "10+ font styles" },
          { icon: "📍", title: "Smart Positioning", desc: "9 preset positions" },
          { icon: "🔄", title: "Batch Processing", desc: "Up to 50 images" },
          { icon: "🔒", title: "100% Private", desc: "Processed locally" }
        ].map((feature) => (
          <div key={feature.title} className="bg-muted/50 rounded-xl p-4 text-center">
            <span className="text-2xl block mb-2">{feature.icon}</span>
            <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
            <p className="text-xs text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatermarkImageTool;
