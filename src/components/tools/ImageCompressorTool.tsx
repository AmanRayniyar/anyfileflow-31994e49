import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Trash2, Image, ZoomIn, X, FileArchive, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CompressedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  compressedSize: number;
  reduction: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
}

type CompressionLevel = 'low' | 'medium' | 'high' | 'custom';
type OutputFormat = 'original' | 'jpg' | 'png' | 'webp';

const ImageCompressorTool: React.FC = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [customQuality, setCustomQuality] = useState<number>(70);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [keepOriginalQuality, setKeepOriginalQuality] = useState<boolean>(false);
  const [enableResize, setEnableResize] = useState<boolean>(false);
  const [resizeWidth, setResizeWidth] = useState<number>(1920);
  const [resizeHeight, setResizeHeight] = useState<number>(1080);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<CompressedImage | null>(null);

  const getQualityFromLevel = (level: CompressionLevel): number => {
    switch (level) {
      case 'low': return 90;
      case 'medium': return 70;
      case 'high': return 50;
      case 'custom': return customQuality;
      default: return 70;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: CompressedImage[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      compressedBlob: null,
      compressedUrl: null,
      compressedSize: 0,
      reduction: 0,
      status: 'pending' as const
    }));
    setImages(prev => [...prev, ...newImages]);
    toast.success(`Added ${acceptedFiles.length} image(s)`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.originalUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setPreviewImage(null);
  };

  const getOutputMimeType = (originalType: string): string => {
    if (outputFormat === 'original') {
      return originalType;
    }
    switch (outputFormat) {
      case 'jpg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      default: return originalType;
    }
  };

  const getFileExtension = (mimeType: string): string => {
    switch (mimeType) {
      case 'image/jpeg': return '.jpg';
      case 'image/png': return '.png';
      case 'image/webp': return '.webp';
      default: return '.jpg';
    }
  };

  const compressImage = async (imageData: CompressedImage): Promise<CompressedImage> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve({ ...imageData, status: 'error' });
          return;
        }

        let targetWidth = img.width;
        let targetHeight = img.height;

        if (enableResize) {
          if (maintainAspectRatio) {
            const ratio = Math.min(resizeWidth / img.width, resizeHeight / img.height);
            targetWidth = Math.round(img.width * ratio);
            targetHeight = Math.round(img.height * ratio);
          } else {
            targetWidth = resizeWidth;
            targetHeight = resizeHeight;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const quality = keepOriginalQuality ? 1 : getQualityFromLevel(compressionLevel) / 100;
        const mimeType = getOutputMimeType(imageData.originalFile.type);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              const reduction = Math.round(((imageData.originalSize - blob.size) / imageData.originalSize) * 100);
              resolve({
                ...imageData,
                compressedBlob: blob,
                compressedUrl,
                compressedSize: blob.size,
                reduction: Math.max(0, reduction),
                status: 'done'
              });
            } else {
              resolve({ ...imageData, status: 'error' });
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => resolve({ ...imageData, status: 'error' });
      img.src = imageData.originalUrl;
    });
  };

  const compressAll = async () => {
    if (images.length === 0) {
      toast.error('Please add images first');
      return;
    }

    setIsCompressing(true);
    
    const updatedImages = await Promise.all(
      images.map(async (img) => {
        if (img.status === 'done') return img;
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'compressing' as const } : i));
        return await compressImage(img);
      })
    );

    setImages(updatedImages);
    setIsCompressing(false);
    
    const successCount = updatedImages.filter(img => img.status === 'done').length;
    toast.success(`Compressed ${successCount} image(s) successfully!`);
  };

  const downloadSingle = (image: CompressedImage) => {
    if (!image.compressedBlob) return;
    const mimeType = getOutputMimeType(image.originalFile.type);
    const ext = getFileExtension(mimeType);
    const fileName = image.originalFile.name.replace(/\.[^/.]+$/, '') + '_compressed' + ext;
    saveAs(image.compressedBlob, fileName);
  };

  const downloadAllAsZip = async () => {
    const compressedImages = images.filter(img => img.status === 'done' && img.compressedBlob);
    if (compressedImages.length === 0) {
      toast.error('No compressed images to download');
      return;
    }

    const zip = new JSZip();
    compressedImages.forEach(img => {
      if (img.compressedBlob) {
        const mimeType = getOutputMimeType(img.originalFile.type);
        const ext = getFileExtension(mimeType);
        const fileName = img.originalFile.name.replace(/\.[^/.]+$/, '') + '_compressed' + ext;
        zip.file(fileName, img.compressedBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'compressed_images.zip');
    toast.success('ZIP file downloaded!');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressedSize = images.reduce((acc, img) => acc + img.compressedSize, 0);
  const totalReduction = totalOriginalSize > 0 ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100) : 0;

  const faqItems = [
    {
      question: "How does image compression work?",
      answer: "Image compression reduces file size by removing unnecessary data while maintaining visual quality. Our tool uses advanced algorithms to compress JPG, PNG, and WebP images directly in your browser without uploading to any server."
    },
    {
      question: "What's the difference between Low, Medium, and High compression?",
      answer: "Low compression (90% quality) preserves most details with minimal size reduction. Medium (70% quality) offers balanced quality and size reduction. High compression (50% quality) maximizes file size reduction with some visible quality loss."
    },
    {
      question: "Will I lose image quality?",
      answer: "Some quality loss is normal during compression. However, with Low or Medium settings, the difference is usually imperceptible to the human eye. Use the preview feature to compare before and after."
    },
    {
      question: "Is my data safe?",
      answer: "Yes! All image processing happens locally in your browser. Your images are never uploaded to any server, ensuring complete privacy and security."
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG/JPEG, PNG, and WebP formats. You can also convert between formats during compression."
    },
    {
      question: "Can I compress multiple images at once?",
      answer: "Yes! Simply drag and drop multiple images or click to select multiple files. All images will be compressed simultaneously, and you can download them all in a single ZIP file."
    },
    {
      question: "How do I resize images while compressing?",
      answer: "Enable the 'Resize Images' option and set your desired dimensions. You can maintain the aspect ratio to prevent distortion or set custom width and height values."
    },
    {
      question: "Why should I compress images?",
      answer: "Compressed images load faster on websites, use less storage space, and are easier to share via email or messaging. This is especially important for web developers and anyone managing large image libraries."
    }
  ];

  return (
    <div className="space-y-6">
      {/* SEO Description */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground">
          Compress your images instantly with our free online image compressor. Reduce file size by up to 80% without losing quality. 
          Supports JPG, PNG, and WebP formats with bulk compression and ZIP download. No upload required - all processing happens in your browser for maximum privacy.
        </p>
      </div>

      {/* Settings Panel */}
      <Card className="p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Minimize2 className="w-5 h-5" />
          Compression Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Compression Level */}
          <div className="space-y-2">
            <Label>Compression Level</Label>
            <Select 
              value={compressionLevel} 
              onValueChange={(v) => setCompressionLevel(v as CompressionLevel)}
              disabled={keepOriginalQuality}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (90% Quality)</SelectItem>
                <SelectItem value="medium">Medium (70% Quality)</SelectItem>
                <SelectItem value="high">High (50% Quality)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Quality Slider */}
          {compressionLevel === 'custom' && !keepOriginalQuality && (
            <div className="space-y-2">
              <Label>Quality: {customQuality}%</Label>
              <Slider
                value={[customQuality]}
                onValueChange={([val]) => setCustomQuality(val)}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          )}

          {/* Output Format */}
          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Keep Original</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Keep Original Quality */}
          <div className="flex items-center space-x-2">
            <Switch
              id="keep-quality"
              checked={keepOriginalQuality}
              onCheckedChange={setKeepOriginalQuality}
            />
            <Label htmlFor="keep-quality" className="cursor-pointer">Keep Original Quality</Label>
          </div>

          {/* Enable Resize */}
          <div className="flex items-center space-x-2">
            <Switch
              id="enable-resize"
              checked={enableResize}
              onCheckedChange={setEnableResize}
            />
            <Label htmlFor="enable-resize" className="cursor-pointer">Resize Images</Label>
          </div>

          {/* Maintain Aspect Ratio */}
          {enableResize && (
            <div className="flex items-center space-x-2">
              <Switch
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onCheckedChange={setMaintainAspectRatio}
              />
              <Label htmlFor="aspect-ratio" className="cursor-pointer">Maintain Aspect Ratio</Label>
            </div>
          )}
        </div>

        {/* Resize Dimensions */}
        {enableResize && (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="space-y-2">
              <Label>Max Width (px)</Label>
              <Input
                type="number"
                value={resizeWidth}
                onChange={(e) => setResizeWidth(Number(e.target.value))}
                min={1}
                max={10000}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Height (px)</Label>
              <Input
                type="number"
                value={resizeHeight}
                onChange={(e) => setResizeHeight(Number(e.target.value))}
                min={1}
                max={10000}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium text-foreground mb-2">
          {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-muted-foreground">
          or click to select files (JPG, PNG, WebP)
        </p>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          {/* Summary Stats */}
          <Card className="p-4 bg-muted/50">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-xl font-bold text-foreground">{images.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Original Size</p>
                  <p className="text-xl font-bold text-foreground">{formatFileSize(totalOriginalSize)}</p>
                </div>
                {totalCompressedSize > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Compressed Size</p>
                      <p className="text-xl font-bold text-primary">{formatFileSize(totalCompressedSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Saved</p>
                      <p className="text-xl font-bold text-green-500">{totalReduction}%</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </Card>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={image.compressedUrl || image.originalUrl}
                    alt={image.originalFile.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full hover:bg-background transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewImage(image)}
                    className="absolute top-2 left-2 p-1.5 bg-background/80 rounded-full hover:bg-background transition-colors"
                    aria-label="Preview image"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {image.status === 'compressing' && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-foreground truncate" title={image.originalFile.name}>
                    {image.originalFile.name}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Original: {formatFileSize(image.originalSize)}</span>
                    {image.status === 'done' && (
                      <span className="text-primary">Compressed: {formatFileSize(image.compressedSize)}</span>
                    )}
                  </div>
                  {image.status === 'done' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-green-500">
                        -{image.reduction}% saved
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => downloadSingle(image)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              onClick={compressAll}
              disabled={isCompressing || images.length === 0}
              className="min-w-[200px]"
            >
              {isCompressing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Compressing...
                </>
              ) : (
                <>
                  <Minimize2 className="w-5 h-5 mr-2" />
                  Compress All Images
                </>
              )}
            </Button>
            {images.some(img => img.status === 'done') && (
              <Button size="lg" variant="secondary" onClick={downloadAllAsZip}>
                <FileArchive className="w-5 h-5 mr-2" />
                Download All as ZIP
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-card rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-foreground">Before & After Comparison</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewImage(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Original ({formatFileSize(previewImage.originalSize)})</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <img
                    src={previewImage.originalUrl}
                    alt="Original"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              {previewImage.compressedUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">
                    Compressed ({formatFileSize(previewImage.compressedSize)}) 
                    <span className="text-green-500 ml-2">-{previewImage.reduction}%</span>
                  </p>
                  <div className="border border-primary rounded-lg overflow-hidden">
                    <img
                      src={previewImage.compressedUrl}
                      alt="Compressed"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" />
          How to Compress Images
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li><strong>Upload Images:</strong> Drag and drop your images or click to select files (supports JPG, PNG, WebP)</li>
          <li><strong>Choose Compression Level:</strong> Select Low, Medium, High, or set a custom quality percentage</li>
          <li><strong>Optional Settings:</strong> Enable resize option, change output format, or keep original quality</li>
          <li><strong>Compress:</strong> Click "Compress All Images" to process your files</li>
          <li><strong>Preview:</strong> Click the zoom icon to compare before and after</li>
          <li><strong>Download:</strong> Download individual images or get all as a ZIP file</li>
        </ol>
      </Card>

      {/* Why Use Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Maximize2 className="w-5 h-5" />
          Why Use Our Image Compressor?
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>100% Free:</strong> No watermarks, no limits, no registration</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Privacy First:</strong> All processing in browser - files never leave your device</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Bulk Processing:</strong> Compress hundreds of images at once</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Before/After Preview:</strong> Compare quality before downloading</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>ZIP Download:</strong> Get all compressed images in one file</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Format Conversion:</strong> Convert between JPG, PNG, and WebP</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Resize Option:</strong> Reduce dimensions while compressing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Works Offline:</strong> No internet required after page loads</span>
          </li>
        </ul>
      </Card>

      {/* FAQ Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default ImageCompressorTool;
