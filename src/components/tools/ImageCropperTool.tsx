import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Upload, Download, X, Image as ImageIcon, RotateCw, RotateCcw,
  FlipHorizontal, FlipVertical, Circle, Square, ZoomIn, ZoomOut,
  Smartphone, Monitor, Trash2, Copy, Check, Settings, ChevronDown,
  Maximize2, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AspectRatioPreset {
  label: string;
  value: number | null;
  icon?: React.ReactNode;
  category?: string;
}

const aspectRatioPresets: AspectRatioPreset[] = [
  { label: "Free", value: null, category: "Basic" },
  { label: "1:1 Square", value: 1, category: "Basic" },
  { label: "16:9 Widescreen", value: 16 / 9, category: "Basic" },
  { label: "4:3 Standard", value: 4 / 3, category: "Basic" },
  { label: "3:2 Photo", value: 3 / 2, category: "Basic" },
  { label: "9:16 Portrait", value: 9 / 16, category: "Basic" },
  { label: "3:4 Portrait", value: 3 / 4, category: "Basic" },
  { label: "2:3 Portrait", value: 2 / 3, category: "Basic" },
  // Social Media
  { label: "Instagram Post (1:1)", value: 1, category: "Social Media" },
  { label: "Instagram Story (9:16)", value: 9 / 16, category: "Social Media" },
  { label: "Instagram Landscape (1.91:1)", value: 1.91, category: "Social Media" },
  { label: "Facebook Cover (820:312)", value: 820 / 312, category: "Social Media" },
  { label: "Facebook Post (1.91:1)", value: 1.91, category: "Social Media" },
  { label: "Twitter Header (3:1)", value: 3, category: "Social Media" },
  { label: "Twitter Post (16:9)", value: 16 / 9, category: "Social Media" },
  { label: "LinkedIn Cover (4:1)", value: 4, category: "Social Media" },
  { label: "YouTube Thumbnail (16:9)", value: 16 / 9, category: "Social Media" },
  { label: "TikTok (9:16)", value: 9 / 16, category: "Social Media" },
  { label: "Pinterest (2:3)", value: 2 / 3, category: "Social Media" },
  // Print
  { label: "A4 Paper (1:1.414)", value: 1 / 1.414, category: "Print" },
  { label: "US Letter (1:1.294)", value: 1 / 1.294, category: "Print" },
  { label: "4x6 Photo", value: 4 / 6, category: "Print" },
  { label: "5x7 Photo", value: 5 / 7, category: "Print" },
  { label: "8x10 Photo", value: 8 / 10, category: "Print" },
];

const outputFormats = [
  { label: "JPEG", value: "jpeg", mimeType: "image/jpeg" },
  { label: "PNG", value: "png", mimeType: "image/png" },
  { label: "WebP", value: "webp", mimeType: "image/webp" },
];

interface ImageCropperToolProps {
  tool?: {
    id: string;
    name: string;
    description: string;
  };
}

interface QueuedImage {
  id: string;
  file: File;
  url: string;
  crop?: PixelCrop;
  processed?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropperTool = ({ tool }: ImageCropperToolProps) => {
  // Image state
  const [images, setImages] = useState<QueuedImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircleCrop, setIsCircleCrop] = useState(false);

  // Transform state
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Output settings
  const [outputFormat, setOutputFormat] = useState<string>("jpeg");
  const [quality, setQuality] = useState(92);
  const [outputWidth, setOutputWidth] = useState<number | undefined>(undefined);
  const [outputHeight, setOutputHeight] = useState<number | undefined>(undefined);
  const [removeExif, setRemoveExif] = useState(true);
  const [maintainOutputRatio, setMaintainOutputRatio] = useState(true);

  // Custom aspect ratio
  const [customWidth, setCustomWidth] = useState(16);
  const [customHeight, setCustomHeight] = useState(9);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<{ name: string; url: string; size: number }[]>([]);

  const currentImage = images[currentImageIndex];

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            const id = Math.random().toString(36).substr(2, 9);
            const url = URL.createObjectURL(file);
            setImages((prev) => [...prev, { id, file, url }]);
            if (images.length === 0) {
              setImgSrc(url);
            }
            toast({
              title: "Image pasted!",
              description: "Image added from clipboard.",
            });
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [images.length]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: QueuedImage[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (images.length === 0 && newImages.length > 0) {
      setImgSrc(newImages[0].url);
      setCurrentImageIndex(0);
    }

    setProcessedImages([]);
    resetTransforms();
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"],
    },
    multiple: true,
  });

  const resetTransforms = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const selectImage = (index: number) => {
    // Save current crop to current image
    if (currentImage && completedCrop) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === currentImageIndex ? { ...img, crop: completedCrop } : img
        )
      );
    }

    setCurrentImageIndex(index);
    const img = images[index];
    if (img) {
      setImgSrc(img.url);
      if (img.crop) {
        setCompletedCrop(img.crop);
      } else {
        resetTransforms();
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    if (newImages.length === 0) {
      setImgSrc("");
      setCurrentImageIndex(0);
      resetTransforms();
    } else if (index <= currentImageIndex) {
      const newIndex = Math.max(0, currentImageIndex - 1);
      setCurrentImageIndex(newIndex);
      setImgSrc(newImages[newIndex]?.url || "");
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop({
        unit: "%",
        x: 5,
        y: 5,
        width: 90,
        height: 90,
      });
    }
  };

  const handleAspectChange = (value: string) => {
    if (value === "custom") {
      const customAspect = customWidth / customHeight;
      setAspect(customAspect);
      if (imgRef.current) {
        setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, customAspect));
      }
    } else if (value === "free") {
      setAspect(undefined);
    } else {
      const preset = aspectRatioPresets.find((p) => p.label === value);
      if (preset) {
        setAspect(preset.value || undefined);
        if (preset.value && imgRef.current) {
          setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, preset.value));
        }
      }
    }
  };

  const handleCustomAspect = () => {
    if (customWidth > 0 && customHeight > 0) {
      const customAspect = customWidth / customHeight;
      setAspect(customAspect);
      if (imgRef.current) {
        setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, customAspect));
      }
    }
  };

  const rotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop,
    format: string,
    qual: number
  ): Promise<{ blob: Blob; width: number; height: number }> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate the actual crop dimensions
    let cropWidth = pixelCrop.width * scaleX;
    let cropHeight = pixelCrop.height * scaleY;
    let cropX = pixelCrop.x * scaleX;
    let cropY = pixelCrop.y * scaleY;

    // Apply rotation to canvas
    const rotRad = (rotation * Math.PI) / 180;

    // For rotation, we need to handle the canvas differently
    if (rotation !== 0) {
      // Create a temporary canvas for the full rotated image
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) throw new Error("No 2d context");

      // Calculate rotated dimensions
      const sin = Math.abs(Math.sin(rotRad));
      const cos = Math.abs(Math.cos(rotRad));
      const rotatedWidth = image.naturalWidth * cos + image.naturalHeight * sin;
      const rotatedHeight = image.naturalWidth * sin + image.naturalHeight * cos;

      tempCanvas.width = rotatedWidth;
      tempCanvas.height = rotatedHeight;

      // Apply transforms
      tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
      tempCtx.rotate(rotRad);
      if (flipH) tempCtx.scale(-1, 1);
      if (flipV) tempCtx.scale(1, -1);
      tempCtx.drawImage(
        image,
        -image.naturalWidth / 2,
        -image.naturalHeight / 2
      );

      // Now crop from the rotated image
      // Recalculate crop based on rotation
      const displayWidth = imgRef.current?.width || image.width;
      const displayHeight = imgRef.current?.height || image.height;
      const tempScaleX = rotatedWidth / displayWidth;
      const tempScaleY = rotatedHeight / displayHeight;

      cropWidth = pixelCrop.width * tempScaleX;
      cropHeight = pixelCrop.height * tempScaleY;
      cropX = pixelCrop.x * tempScaleX;
      cropY = pixelCrop.y * tempScaleY;

      // Set final canvas size
      let finalWidth = outputWidth || cropWidth;
      let finalHeight = outputHeight || cropHeight;

      if (maintainOutputRatio && (outputWidth || outputHeight)) {
        const cropAspect = cropWidth / cropHeight;
        if (outputWidth && !outputHeight) {
          finalHeight = outputWidth / cropAspect;
        } else if (outputHeight && !outputWidth) {
          finalWidth = outputHeight * cropAspect;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      if (isCircleCrop) {
        ctx.beginPath();
        ctx.arc(finalWidth / 2, finalHeight / 2, Math.min(finalWidth, finalHeight) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      ctx.drawImage(
        tempCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        finalWidth,
        finalHeight
      );
    } else {
      // No rotation case
      let finalWidth = outputWidth || cropWidth;
      let finalHeight = outputHeight || cropHeight;

      if (maintainOutputRatio && (outputWidth || outputHeight)) {
        const cropAspect = cropWidth / cropHeight;
        if (outputWidth && !outputHeight) {
          finalHeight = outputWidth / cropAspect;
        } else if (outputHeight && !outputWidth) {
          finalWidth = outputHeight * cropAspect;
        }
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      if (isCircleCrop) {
        ctx.beginPath();
        ctx.arc(finalWidth / 2, finalHeight / 2, Math.min(finalWidth, finalHeight) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      // Apply flips
      if (flipH || flipV) {
        ctx.translate(flipH ? finalWidth : 0, flipV ? finalHeight : 0);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      }

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        finalWidth,
        finalHeight
      );
    }

    const mimeType = outputFormats.find((f) => f.value === format)?.mimeType || "image/jpeg";
    const qualityValue = mimeType === "image/png" ? undefined : qual / 100;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve({ blob, width: canvas.width, height: canvas.height });
        },
        mimeType,
        qualityValue
      );
    });
  };

  const processSingleImage = async (queuedImage: QueuedImage): Promise<{ name: string; url: string; size: number } | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        try {
          const cropToUse = queuedImage.crop || completedCrop;
          if (!cropToUse) {
            // If no crop, use full image
            const fullCrop: PixelCrop = {
              x: 0,
              y: 0,
              width: img.width,
              height: img.height,
              unit: "px",
            };
            const { blob } = await getCroppedImg(img, fullCrop, outputFormat, quality);
            const url = URL.createObjectURL(blob);
            const newName = queuedImage.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
            resolve({ name: newName, url, size: blob.size });
          } else {
            const { blob } = await getCroppedImg(img, cropToUse, outputFormat, quality);
            const url = URL.createObjectURL(blob);
            const newName = queuedImage.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`);
            resolve({ name: newName, url, size: blob.size });
          }
        } catch (error) {
          console.error("Error processing image:", error);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = queuedImage.url;
    });
  };

  const processCurrentImage = async () => {
    if (!completedCrop || !imgRef.current) {
      toast({
        title: "No crop selected",
        description: "Please select a crop area first.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      const { blob } = await getCroppedImg(imgRef.current, completedCrop, outputFormat, quality);
      const url = URL.createObjectURL(blob);
      const newName = currentImage?.file.name.replace(/\.[^/.]+$/, `.${outputFormat}`) || `cropped.${outputFormat}`;

      setProcessedImages([{ name: newName, url, size: blob.size }]);

      toast({
        title: "Image cropped!",
        description: "Your image has been cropped successfully.",
      });
    } catch (error) {
      console.error("Error cropping image:", error);
      toast({
        title: "Error",
        description: "Failed to crop image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const processBatchImages = async () => {
    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please add at least one image.",
        variant: "destructive",
      });
      return;
    }

    // Save current crop to current image first
    if (currentImage && completedCrop) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === currentImageIndex ? { ...img, crop: completedCrop } : img
        )
      );
    }

    setProcessing(true);
    const results: { name: string; url: string; size: number }[] = [];

    for (const image of images) {
      const result = await processSingleImage(image);
      if (result) {
        results.push(result);
      }
    }

    setProcessedImages(results);
    setProcessing(false);

    if (results.length > 0) {
      toast({
        title: "Batch complete!",
        description: `Successfully processed ${results.length} image(s).`,
      });
    }
  };

  const downloadFile = (file: { name: string; url: string }) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    processedImages.forEach((file) => downloadFile(file));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const clearAll = () => {
    setImages([]);
    setImgSrc("");
    setProcessedImages([]);
    resetTransforms();
    setCurrentImageIndex(0);
  };

  // Group aspect ratios by category
  const groupedAspectRatios = aspectRatioPresets.reduce((acc, preset) => {
    const category = preset.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(preset);
    return acc;
  }, {} as Record<string, AspectRatioPreset[]>);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!imgSrc && (
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
                {isDragActive ? "Drop your images here" : "Drag & drop images here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse from your computer
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-secondary rounded">Ctrl+V to paste</span>
              <span className="px-2 py-1 bg-secondary rounded">JPG, PNG, WebP, GIF</span>
              <span className="px-2 py-1 bg-secondary rounded">Batch upload</span>
            </div>
          </div>
        </div>
      )}

      {/* Editor Section */}
      {imgSrc && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Main Cropping Area */}
          <div className="xl:col-span-3 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rotate(-90)}
                  title="Rotate Left"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rotate(90)}
                  title="Rotate Right"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant={flipH ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFlipH(!flipH)}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
                <Button
                  variant={flipV ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFlipV(!flipV)}
                  title="Flip Vertical"
                >
                  <FlipVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-border" />

              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom * 100]}
                  onValueChange={([val]) => setZoom(val / 100)}
                  min={50}
                  max={200}
                  step={5}
                  className="w-24"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground w-10">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="h-6 w-px bg-border" />

              <Button
                variant={isCircleCrop ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsCircleCrop(!isCircleCrop);
                  if (!isCircleCrop) {
                    setAspect(1);
                    if (imgRef.current) {
                      setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, 1));
                    }
                  }
                }}
                title="Circle Crop"
              >
                <Circle className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Circle</span>
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetTransforms}
                >
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Crop Canvas */}
            <div 
              className="relative bg-secondary/30 rounded-xl overflow-hidden flex items-center justify-center p-4"
              style={{ minHeight: "400px", maxHeight: "600px" }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                  transition: "transform 0.2s ease",
                }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  circularCrop={isCircleCrop}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{
                      maxHeight: "500px",
                      maxWidth: "100%",
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    }}
                    className="block"
                  />
                </ReactCrop>
              </div>
            </div>

            {/* Image Queue (for batch) */}
            {images.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Images ({images.length})</Label>
                  <Button variant="ghost" size="sm" {...getRootProps()}>
                    <input {...getInputProps()} />
                    Add More
                  </Button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className={cn(
                        "relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                        index === currentImageIndex
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => selectImage(index)}
                    >
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {img.crop && (
                        <div className="absolute bottom-0.5 left-0.5 p-0.5 bg-primary rounded-full">
                          <Check className="h-2 w-2 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <Accordion type="multiple" defaultValue={["aspect", "output"]} className="space-y-2">
              {/* Aspect Ratio */}
              <AccordionItem value="aspect" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    <span className="font-medium">Aspect Ratio</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-3">
                  <Select onValueChange={handleAspectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free (No constraint)</SelectItem>
                      {Object.entries(groupedAspectRatios).map(([category, presets]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {category}
                          </div>
                          {presets.map((preset) => (
                            <SelectItem key={preset.label} value={preset.label}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                      <SelectItem value="custom">Custom...</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number(e.target.value))}
                      className="w-16 text-center"
                      min={1}
                    />
                    <span className="text-muted-foreground">:</span>
                    <Input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number(e.target.value))}
                      className="w-16 text-center"
                      min={1}
                    />
                    <Button size="sm" variant="outline" onClick={handleCustomAspect}>
                      Apply
                    </Button>
                  </div>

                  {/* Quick presets */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "1:1", value: 1 },
                      { label: "16:9", value: 16 / 9 },
                      { label: "4:3", value: 4 / 3 },
                      { label: "9:16", value: 9 / 16 },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant={aspect === preset.value ? "secondary" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setAspect(preset.value);
                          if (imgRef.current) {
                            setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, preset.value));
                          }
                        }}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Output Settings */}
              <AccordionItem value="output" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Output Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Format</Label>
                    <div className="flex gap-1">
                      {outputFormats.map((format) => (
                        <Button
                          key={format.value}
                          variant={outputFormat === format.value ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setOutputFormat(format.value)}
                          className="flex-1"
                        >
                          {format.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {outputFormat !== "png" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Quality</Label>
                        <span className="text-sm text-muted-foreground">{quality}%</span>
                      </div>
                      <Slider
                        value={[quality]}
                        onValueChange={([val]) => setQuality(val)}
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm">Output Size (optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={outputWidth || ""}
                        onChange={(e) => setOutputWidth(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        placeholder="Height"
                        value={outputHeight || ""}
                        onChange={(e) => setOutputHeight(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Remove EXIF data</Label>
                    <Switch
                      checked={removeExif}
                      onCheckedChange={setRemoveExif}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Social Media Presets */}
              <AccordionItem value="social" className="bg-card border border-border rounded-xl px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">Social Media</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Instagram", ratio: 1, icon: "📷" },
                      { label: "Story", ratio: 9 / 16, icon: "📱" },
                      { label: "Facebook", ratio: 1.91, icon: "👍" },
                      { label: "Twitter", ratio: 16 / 9, icon: "🐦" },
                      { label: "LinkedIn", ratio: 4, icon: "💼" },
                      { label: "YouTube", ratio: 16 / 9, icon: "▶️" },
                      { label: "TikTok", ratio: 9 / 16, icon: "🎵" },
                      { label: "Pinterest", ratio: 2 / 3, icon: "📌" },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => {
                          setAspect(preset.ratio);
                          if (imgRef.current) {
                            setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, preset.ratio));
                          }
                        }}
                      >
                        <span className="mr-1">{preset.icon}</span>
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="hero"
                className="w-full"
                onClick={processCurrentImage}
                disabled={processing || !completedCrop}
              >
                {processing ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Crop & Download
                  </>
                )}
              </Button>

              {images.length > 1 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={processBatchImages}
                  disabled={processing}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Batch Crop All ({images.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processed Files */}
      {processedImages.length > 0 && (
        <div className="space-y-4 p-4 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-green-500/10">
                <Check className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground">
                Cropped Images ({processedImages.length})
              </h3>
            </div>
            {processedImages.length > 1 && (
              <Button variant="hero" size="sm" onClick={downloadAll}>
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {processedImages.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={clearAll}>
            Crop More Images
          </Button>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-8 p-6 bg-card border border-border rounded-xl">
        <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="faq-1" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline text-left">
              How do I crop an image to a specific size?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Upload your image, select an aspect ratio from the presets or enter custom dimensions, 
              adjust the crop area by dragging the corners, and click "Crop & Download". You can also 
              specify exact output dimensions in the Output Settings panel.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline text-left">
              Can I crop multiple images at once?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! Upload multiple images using drag & drop or the file picker. Set your crop area 
              for each image in the queue, then use "Batch Crop All" to process them all with your 
              current settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline text-left">
              What image formats are supported?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              You can upload JPG, JPEG, PNG, WebP, GIF, BMP, and TIFF images. For output, you can 
              choose between JPEG, PNG, and WebP formats with adjustable quality settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline text-left">
              How do I create a circular crop?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Click the "Circle" button in the toolbar. This will enable circular cropping mode and 
              automatically set a 1:1 aspect ratio. The cropped image will have a circular shape with 
              a transparent background (when using PNG format).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline text-left">
              Is my image data secure?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! All image processing happens directly in your browser. Your images are never 
              uploaded to any server. EXIF data (including GPS location) can be automatically removed 
              for privacy.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ImageCropperTool;
