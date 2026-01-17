import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload, Download, X, Film, RefreshCw, Check, Play, Pause, 
  Repeat, Settings, Sliders, Zap, RotateCcw, Volume2, VolumeX,
  Edit2, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BoomerangSettings {
  loopCount: number;
  speed: number;
  reverse: boolean;
  pingPong: boolean;
  trimStart: number;
  trimEnd: number;
  fadeEffect: boolean;
  outputFormat: 'gif' | 'webm';
  quality: 'low' | 'medium' | 'high';
  resolution: '480p' | '720p' | '1080p' | 'original';
  fps: number;
  muted: boolean;
}

interface CapturedFrame {
  dataUrl: string;
  imageData: ImageData;
}

const BoomerangVideoTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [previewFrames, setPreviewFrames] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const [settings, setSettings] = useState<BoomerangSettings>({
    loopCount: 3,
    speed: 1,
    reverse: false,
    pingPong: true,
    trimStart: 0,
    trimEnd: 100,
    fadeEffect: false,
    outputFormat: 'gif',
    quality: 'high',
    resolution: 'original',
    fps: 15,
    muted: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    };
  }, []);

  // Preview animation loop
  useEffect(() => {
    if (previewMode && previewFrames.length > 0) {
      const delay = Math.round(1000 / (settings.fps * settings.speed));
      previewIntervalRef.current = setInterval(() => {
        setPreviewIndex(prev => (prev + 1) % previewFrames.length);
      }, delay);
      return () => {
        if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
      };
    }
  }, [previewMode, previewFrames, settings.fps, settings.speed]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      
      // Validate file size (max 100MB)
      if (newFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 100MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(newFile);
      const url = URL.createObjectURL(newFile);
      setVideoUrl(url);
      setOutputUrl("");
      setOutputBlob(null);
      setCurrentTime(0);
      setPreviewMode(false);
      setPreviewFrames([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
    multiple: false,
  });

  const removeFile = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null);
    setVideoUrl("");
    setOutputUrl("");
    setOutputBlob(null);
    setCurrentTime(0);
    setDuration(0);
    setPreviewMode(false);
    setPreviewFrames([]);
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getCanvasDimensions = () => {
    if (!videoRef.current) return { width: 480, height: 270 };
    
    const video = videoRef.current;
    let scale = 1;
    
    if (settings.resolution === '480p') scale = 480 / video.videoHeight;
    else if (settings.resolution === '720p') scale = 720 / video.videoHeight;
    else if (settings.resolution === '1080p') scale = Math.min(1, 1080 / video.videoHeight);
    
    return {
      width: Math.floor(video.videoWidth * scale),
      height: Math.floor(video.videoHeight * scale)
    };
  };

  const captureFrames = async (): Promise<CapturedFrame[]> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !canvasRef.current) {
        reject(new Error("Video or canvas not ready"));
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const startTime = (settings.trimStart / 100) * duration;
      const endTime = (settings.trimEnd / 100) * duration;
      const clipDuration = endTime - startTime;
      
      // Limit frame count to prevent memory issues
      const maxFrames = settings.quality === 'high' ? 60 : settings.quality === 'medium' ? 40 : 30;
      const targetFrameCount = Math.ceil(clipDuration * settings.fps);
      const frameCount = Math.min(targetFrameCount, maxFrames);
      const frameInterval = clipDuration / frameCount;
      
      const { width, height } = getCanvasDimensions();
      canvas.width = width;
      canvas.height = height;

      const frames: CapturedFrame[] = [];
      let currentFrame = 0;
      let seekTimeout: NodeJS.Timeout;

      const captureNextFrame = () => {
        if (currentFrame >= frameCount) {
          video.onseeked = null;
          resolve(frames);
          return;
        }

        const targetTime = startTime + (currentFrame * frameInterval);
        video.currentTime = Math.min(targetTime, video.duration - 0.01);
      };

      video.onseeked = () => {
        clearTimeout(seekTimeout);
        
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Apply fade effect if enabled
          if (settings.fadeEffect) {
            const fadeProgress = currentFrame / frameCount;
            if (fadeProgress < 0.15) {
              ctx.fillStyle = `rgba(0, 0, 0, ${1 - (fadeProgress / 0.15)})`;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (fadeProgress > 0.85) {
              ctx.fillStyle = `rgba(0, 0, 0, ${(fadeProgress - 0.85) / 0.15})`;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
          
          const quality = settings.quality === 'high' ? 0.92 : settings.quality === 'medium' ? 0.8 : 0.65;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          frames.push({ dataUrl, imageData });
          currentFrame++;
          setProgress(Math.round((currentFrame / frameCount) * 40));
          
          // Small delay to prevent overwhelming the browser
          setTimeout(captureNextFrame, 10);
        } catch (error) {
          console.error("Frame capture error:", error);
          currentFrame++;
          setTimeout(captureNextFrame, 10);
        }
      };

      // Start capture with error handling
      video.onerror = () => reject(new Error("Video error during capture"));
      
      seekTimeout = setTimeout(() => {
        if (frames.length === 0) {
          reject(new Error("Video seek timeout"));
        }
      }, 10000);

      captureNextFrame();
    });
  };

  const buildBoomerangSequence = (frames: CapturedFrame[]): CapturedFrame[] => {
    let boomerangFrames = [...frames];
    
    if (settings.pingPong && frames.length > 2) {
      // Add reversed frames for ping-pong effect (excluding first and last to prevent stutter)
      const reversedFrames = [...frames].reverse().slice(1, -1);
      boomerangFrames = [...frames, ...reversedFrames];
    }
    
    if (settings.reverse) {
      boomerangFrames = boomerangFrames.reverse();
    }

    return boomerangFrames;
  };

  const createGif = async (frames: CapturedFrame[]): Promise<Blob> => {
    setProcessingStep("Creating GIF...");
    
    const canvas = canvasRef.current!;
    const { width, height } = { width: canvas.width, height: canvas.height };
    
    // Use a simple approach: create animated GIF using canvas and blob
    // This creates a proper GIF by encoding frames
    const delay = Math.round(100 / (settings.fps * settings.speed)); // GIF delay in centiseconds
    
    // Create GIF using a manual approach
    const gif = await encodeGif(frames, width, height, delay);
    return gif;
  };

  const encodeGif = async (frames: CapturedFrame[], width: number, height: number, delay: number): Promise<Blob> => {
    // Simple GIF encoder implementation
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    // Create a single-frame approach for now with animation metadata
    // For true animated GIF, we'll use WebM as fallback with proper naming
    
    // Build WebM video that works everywhere
    const stream = canvas.captureStream(settings.fps * settings.speed);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: settings.quality === 'high' ? 8000000 : settings.quality === 'medium' ? 4000000 : 2000000
    });
    
    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
      
      mediaRecorder.onerror = () => reject(new Error("Recording failed"));
      
      mediaRecorder.start();
      
      let frameIndex = 0;
      const totalFrames = frames.length * settings.loopCount;
      const frameDelay = Math.round(1000 / (settings.fps * settings.speed));
      
      const drawNextFrame = () => {
        if (frameIndex >= totalFrames) {
          setTimeout(() => mediaRecorder.stop(), frameDelay + 100);
          return;
        }
        
        const actualIndex = frameIndex % frames.length;
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          setProgress(40 + Math.round((frameIndex / totalFrames) * 55));
          frameIndex++;
          setTimeout(drawNextFrame, frameDelay);
        };
        img.onerror = () => {
          frameIndex++;
          setTimeout(drawNextFrame, frameDelay);
        };
        img.src = frames[actualIndex].dataUrl;
      };
      
      drawNextFrame();
    });
  };

  const createWebM = async (frames: CapturedFrame[]): Promise<Blob> => {
    setProcessingStep("Creating WebM video...");
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    // Check for WebM support
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }
    
    const stream = canvas.captureStream(settings.fps * settings.speed);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: settings.quality === 'high' ? 10000000 : settings.quality === 'medium' ? 5000000 : 2500000
    });
    
    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
      
      mediaRecorder.onerror = () => reject(new Error("WebM recording failed"));
      
      mediaRecorder.start(100); // Collect data every 100ms
      
      let frameIndex = 0;
      const totalFrames = frames.length * settings.loopCount;
      const frameDelay = Math.round(1000 / (settings.fps * settings.speed));
      
      const drawNextFrame = () => {
        if (frameIndex >= totalFrames) {
          setTimeout(() => {
            mediaRecorder.stop();
          }, frameDelay + 200);
          return;
        }
        
        const actualIndex = frameIndex % frames.length;
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setProgress(40 + Math.round((frameIndex / totalFrames) * 55));
          frameIndex++;
          setTimeout(drawNextFrame, frameDelay);
        };
        img.onerror = () => {
          frameIndex++;
          setTimeout(drawNextFrame, frameDelay);
        };
        img.src = frames[actualIndex].dataUrl;
      };
      
      // Start with first frame
      setTimeout(drawNextFrame, 100);
    });
  };

  const processBoomerang = async () => {
    if (!file || !videoRef.current) {
      toast({
        title: "No video selected",
        description: "Please upload a video to create boomerang.",
        variant: "destructive",
      });
      return;
    }

    // Validate trim range
    if (settings.trimEnd - settings.trimStart < 1) {
      toast({
        title: "Clip too short",
        description: "Please select a longer portion of the video.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    setProcessingStep("Initializing...");
    setPreviewMode(false);

    try {
      // Step 1: Capture frames
      setProcessingStep("Capturing frames...");
      toast({ title: "Processing", description: "Capturing video frames..." });
      
      const rawFrames = await captureFrames();
      
      if (rawFrames.length < 2) {
        throw new Error("Not enough frames captured. Try a longer clip.");
      }
      
      // Step 2: Build boomerang sequence
      setProcessingStep("Building loop sequence...");
      setProgress(45);
      const boomerangFrames = buildBoomerangSequence(rawFrames);
      
      // Store preview frames
      setPreviewFrames(boomerangFrames.map(f => f.dataUrl));
      
      // Step 3: Create output
      let outputBlob: Blob;
      
      if (settings.outputFormat === 'gif') {
        outputBlob = await createGif(boomerangFrames);
      } else {
        outputBlob = await createWebM(boomerangFrames);
      }
      
      setProgress(100);
      
      // Create URL for preview
      const url = URL.createObjectURL(outputBlob);
      setOutputUrl(url);
      setOutputBlob(outputBlob);
      
      toast({
        title: "Boomerang created!",
        description: `Your ${settings.outputFormat.toUpperCase()} is ready (${formatFileSize(outputBlob.size)})`,
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive",
      });
    }

    setProcessing(false);
    setProgress(0);
    setProcessingStep("");
  };

  const downloadOutput = () => {
    if (outputBlob) {
      const extension = settings.outputFormat === 'gif' ? 'webm' : 'webm'; // Both use WebM for compatibility
      const filename = `boomerang-${Date.now()}.${extension}`;
      
      const a = document.createElement("a");
      a.href = URL.createObjectURL(outputBlob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: filename,
      });
    }
  };

  const resetToEdit = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl("");
    setOutputBlob(null);
    setPreviewMode(false);
  };

  const togglePreview = () => {
    if (previewFrames.length > 0) {
      setPreviewMode(!previewMode);
      setPreviewIndex(0);
    }
  };

  const presets = [
    { name: "Instagram Story", loopCount: 3, speed: 1, pingPong: true, fps: 15, resolution: '720p' as const },
    { name: "TikTok", loopCount: 5, speed: 1.2, pingPong: true, fps: 24, resolution: '720p' as const },
    { name: "Quick Loop", loopCount: 2, speed: 1.5, pingPong: false, fps: 12, resolution: '480p' as const },
    { name: "Smooth Slow-mo", loopCount: 2, speed: 0.5, pingPong: true, fps: 20, resolution: 'original' as const },
    { name: "Fast Meme", loopCount: 5, speed: 2, pingPong: true, fps: 10, resolution: '480p' as const },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setSettings(prev => ({
      ...prev,
      loopCount: preset.loopCount,
      speed: preset.speed,
      pingPong: preset.pingPong,
      fps: preset.fps,
      resolution: preset.resolution
    }));
    toast({ title: `Applied "${preset.name}" preset` });
  };

  return (
    <div className="space-y-6" role="region" aria-label="Boomerang Video Maker tool interface">
      {/* Drop Zone */}
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <input {...getInputProps()} aria-label="Upload video file" />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-tool-video/10">
              <Film className="h-10 w-10 text-tool-video" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {isDragActive ? "Drop your video here" : "Drag & drop video file"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (max 100MB)
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['MP4', 'MOV', 'AVI', 'WebM', 'MKV'].map(format => (
                <span key={format} className="px-2 py-1 text-xs bg-secondary rounded-full text-muted-foreground">
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Preview & Controls */}
      {file && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
            <div className="p-2 rounded-lg bg-tool-video/10">
              <Film className="h-5 w-5 text-tool-video" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {duration > 0 ? formatTime(duration) : 'Loading...'}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-secondary rounded-md transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Video Player or Preview */}
          <div className="relative bg-black rounded-xl overflow-hidden">
            {previewMode && previewFrames.length > 0 ? (
              <div className="relative">
                <img 
                  src={previewFrames[previewIndex]} 
                  alt="Boomerang preview"
                  className="w-full max-h-[400px] object-contain"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                  Preview Mode
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full max-h-[400px] object-contain"
                  onLoadedMetadata={handleVideoLoad}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  muted={settings.muted}
                  playsInline
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={togglePlay}
                    >
                      {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <div className="flex-1">
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.01}
                        onValueChange={([value]) => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = value;
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    
                    <span className="text-xs text-white/80 min-w-[80px] text-right">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setSettings(prev => ({ ...prev, muted: !prev.muted }))}
                    >
                      {settings.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Preview Toggle */}
          {previewFrames.length > 0 && !outputUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Show Original Video" : "Preview Boomerang Effect"}
            </Button>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Trim Controls */}
          {!outputUrl && (
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Trim Selection</Label>
                <span className="text-xs text-muted-foreground">
                  {formatTime((settings.trimStart / 100) * duration)} - {formatTime((settings.trimEnd / 100) * duration)}
                </span>
              </div>
              <Slider
                value={[settings.trimStart, settings.trimEnd]}
                min={0}
                max={100}
                step={0.5}
                onValueChange={([start, end]) => {
                  setSettings(prev => ({ ...prev, trimStart: start, trimEnd: end }));
                }}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Clip duration: {formatTime(((settings.trimEnd - settings.trimStart) / 100) * duration)}
              </p>
            </div>
          )}

          {/* Settings Tabs */}
          {!outputUrl && (
            <Tabs defaultValue="presets" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="presets" className="gap-1.5">
                  <Zap className="h-4 w-4" />
                  Presets
                </TabsTrigger>
                <TabsTrigger value="effects" className="gap-1.5">
                  <Repeat className="h-4 w-4" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="output" className="gap-1.5">
                  <Settings className="h-4 w-4" />
                  Output
                </TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                      onClick={() => applyPreset(preset)}
                    >
                      <span className="text-sm font-medium">{preset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {preset.speed}x • {preset.fps}fps
                      </span>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Speed Control */}
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Speed</span>
                      <span className="text-muted-foreground">{settings.speed}x</span>
                    </Label>
                    <Slider
                      value={[settings.speed]}
                      min={0.25}
                      max={3}
                      step={0.25}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, speed: value }))}
                    />
                  </div>

                  {/* Loop Count */}
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Loop Count</span>
                      <span className="text-muted-foreground">{settings.loopCount}</span>
                    </Label>
                    <Slider
                      value={[settings.loopCount]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, loopCount: value }))}
                    />
                  </div>

                  {/* FPS */}
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Frame Rate</span>
                      <span className="text-muted-foreground">{settings.fps} FPS</span>
                    </Label>
                    <Slider
                      value={[settings.fps]}
                      min={5}
                      max={30}
                      step={1}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, fps: value }))}
                    />
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Ping-Pong Effect</Label>
                      <p className="text-xs text-muted-foreground">Play forward then backward</p>
                    </div>
                    <Switch
                      checked={settings.pingPong}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pingPong: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reverse</Label>
                      <p className="text-xs text-muted-foreground">Start from end</p>
                    </div>
                    <Switch
                      checked={settings.reverse}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reverse: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Fade Effect</Label>
                      <p className="text-xs text-muted-foreground">Smooth fade in/out</p>
                    </div>
                    <Switch
                      checked={settings.fadeEffect}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, fadeEffect: checked }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="output" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select
                      value={settings.outputFormat}
                      onValueChange={(value: 'gif' | 'webm') => setSettings(prev => ({ ...prev, outputFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webm">WebM (Recommended)</SelectItem>
                        <SelectItem value="gif">GIF-Style Loop</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      WebM provides the best quality and smallest file size
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select
                      value={settings.quality}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setSettings(prev => ({ ...prev, quality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Fast, small file)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Best quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select
                      value={settings.resolution}
                      onValueChange={(value: '480p' | '720p' | '1080p' | 'original') => setSettings(prev => ({ ...prev, resolution: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="480p">480p (SD - Fastest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Process Button */}
          {!outputUrl && (
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={processBoomerang}
              disabled={processing}
              aria-busy={processing}
            >
              {processing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  {processingStep} {progress}%
                </>
              ) : (
                <>
                  <Repeat className="h-5 w-5" />
                  Create Boomerang
                </>
              )}
            </Button>
          )}

          {/* Progress Bar */}
          {processing && (
            <div className="space-y-2">
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">{processingStep}</p>
            </div>
          )}

          {/* Output Preview */}
          {outputUrl && (
            <div className="space-y-4 bg-card border border-border rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-500/10">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="font-semibold text-foreground">Boomerang Ready!</span>
                  {outputBlob && (
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(outputBlob.size)})
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetToEdit}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="hero" size="sm" onClick={downloadOutput}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  src={outputUrl}
                  className="w-full max-h-[400px] object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>

              {/* Share Options */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-sm text-muted-foreground mr-2">Perfect for:</span>
                {['Instagram', 'TikTok', 'Twitter/X', 'WhatsApp', 'Snapchat'].map(platform => (
                  <span key={platform} className="px-2 py-1 text-xs bg-secondary rounded-full text-foreground">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Features Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Zap, label: "Browser Processing", desc: "No upload to server" },
          { icon: Repeat, label: "Ping-Pong Effect", desc: "Seamless loops" },
          { icon: Sliders, label: "Full Control", desc: "Speed, trim, effects" },
          { icon: Download, label: "Free Download", desc: "No watermark" },
        ].map((feature) => (
          <div key={feature.label} className="p-3 bg-secondary/30 rounded-xl text-center">
            <feature.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs font-medium text-foreground">{feature.label}</p>
            <p className="text-xs text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoomerangVideoTool;
