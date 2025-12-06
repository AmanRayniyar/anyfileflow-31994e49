import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Download, X, Image as ImageIcon, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageConverterProps {
  fromFormat: string;
  toFormat: string;
  toolName: string;
}

interface ConvertedFile {
  name: string;
  originalName: string;
  url: string;
  size: number;
}

const ImageConverter = ({ fromFormat, toFormat, toolName }: ImageConverterProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setConvertedFiles([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [`.${fromFormat.toLowerCase()}`, ".jpeg", ".jpg", ".png", ".gif", ".webp", ".bmp"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one image to convert.",
        variant: "destructive",
      });
      return;
    }

    setConverting(true);
    const converted: ConvertedFile[] = [];

    for (const file of files) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            resolve();
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });

        const mimeType = toFormat.toLowerCase() === "png" ? "image/png" : 
                         toFormat.toLowerCase() === "jpg" || toFormat.toLowerCase() === "jpeg" ? "image/jpeg" :
                         toFormat.toLowerCase() === "webp" ? "image/webp" :
                         toFormat.toLowerCase() === "gif" ? "image/gif" : "image/png";

        const quality = mimeType === "image/jpeg" ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        const newFileName = file.name.replace(/\.[^/.]+$/, `.${toFormat.toLowerCase()}`);

        converted.push({
          name: newFileName,
          originalName: file.name,
          url: dataUrl,
          size: Math.round((dataUrl.length * 3) / 4),
        });
      } catch (error) {
        console.error("Error converting file:", file.name, error);
        toast({
          title: "Conversion failed",
          description: `Failed to convert ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setConvertedFiles(converted);
    setConverting(false);

    if (converted.length > 0) {
      toast({
        title: "Conversion complete!",
        description: `Successfully converted ${converted.length} file(s).`,
      });
    }
  };

  const downloadFile = (file: ConvertedFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    convertedFiles.forEach((file) => downloadFile(file));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200",
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
              {isDragActive ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse from your computer
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: {fromFormat.toUpperCase()}, JPG, PNG, WebP, GIF, BMP
          </p>
        </div>
      </div>

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
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {files.length > 0 && convertedFiles.length === 0 && (
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={convertImages}
          disabled={converting}
        >
          {converting ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              Convert to {toFormat.toUpperCase()}
            </>
          )}
        </Button>
      )}

      {/* Converted Files */}
      {convertedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-tool-archive/10">
                <Check className="h-4 w-4 text-tool-archive" />
              </div>
              <h3 className="font-semibold text-foreground">
                Converted Files ({convertedFiles.length})
              </h3>
            </div>
            <Button variant="hero" size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4" />
              Download All
            </Button>
          </div>
          <div className="space-y-2">
            {convertedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
              >
                <div className="p-2 rounded-lg bg-tool-archive/10">
                  <Check className="h-4 w-4 text-tool-archive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Converted from {file.originalName}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={clearAll}>
            Convert More Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;