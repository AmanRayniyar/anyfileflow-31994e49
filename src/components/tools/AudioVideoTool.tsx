import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Download, X, Music, Film, RefreshCw, Check, Play, Pause, Scissors, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

interface AudioVideoToolProps {
  tool: Tool;
}

const AudioVideoTool = ({ tool }: AudioVideoToolProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [playing, setPlaying] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(1);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);

  const isAudio = tool.category === "audio";
  const isVideo = tool.category === "video";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setOutputUrl("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isAudio 
      ? { "audio/*": [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"] }
      : { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm", ".gif"] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setOutputUrl("");
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (playing) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const processMedia = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please add a file to process.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // For client-side processing, we'll handle basic operations
      // More complex operations would need ffmpeg.wasm or similar
      
      switch (tool.id) {
        case "video-to-mp3":
        case "extract-audio": {
          // Create audio context to extract audio
          const audioContext = new AudioContext();
          const arrayBuffer = await file.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Convert to WAV (simplified)
          const wavBlob = audioBufferToWav(audioBuffer);
          const url = URL.createObjectURL(wavBlob);
          setOutputUrl(url);
          break;
        }

        case "audio-recorder": {
          // Start recording from microphone
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            setOutputUrl(URL.createObjectURL(blob));
            stream.getTracks().forEach(track => track.stop());
          };

          mediaRecorder.start();
          setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
          toast({ title: "Recording...", description: "Recording for 5 seconds" });
          break;
        }

        case "text-to-speech": {
          // Use Web Speech API
          const text = prompt("Enter text to convert to speech:") || "Hello world";
          const utterance = new SpeechSynthesisUtterance(text);
          speechSynthesis.speak(utterance);
          toast({ title: "Playing speech", description: "Text is being spoken" });
          break;
        }

        case "waveform-visualizer": {
          // Will create visualization in canvas
          const audioContext = new AudioContext();
          const arrayBuffer = await file.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          toast({ title: "Waveform ready", description: "Audio loaded for visualization" });
          break;
        }

        default:
          // For other tools, just show the original file
          // Real implementation would use ffmpeg.wasm
          setOutputUrl(URL.createObjectURL(file));
          toast({
            title: "Preview ready",
            description: "Full processing requires ffmpeg.wasm integration",
          });
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }

    setProcessing(false);
  };

  const downloadOutput = () => {
    if (outputUrl) {
      const a = document.createElement("a");
      a.href = outputUrl;
      a.download = `${tool.id}-output.${isAudio ? "wav" : "mp4"}`;
      a.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Helper function to convert AudioBuffer to WAV
  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const data = buffer.getChannelData(0);
    const samples = data.length;
    const dataSize = samples * bytesPerSample;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    
    writeString(0, "RIFF");
    view.setUint32(4, totalSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);
    
    // Write samples
    let offset = 44;
    for (let i = 0; i < samples; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  return (
    <div className="space-y-6" role="region" aria-label={`${tool.name} tool interface`}>
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
        <input {...getInputProps()} aria-label={`Upload ${isAudio ? "audio" : "video"} file`} />
        <div className="flex flex-col items-center gap-4">
          <div className={cn("p-4 rounded-full", isAudio ? "bg-tool-audio/10" : "bg-tool-video/10")}>
            {isAudio ? (
              <Music className="h-8 w-8 text-tool-audio" aria-hidden="true" />
            ) : (
              <Film className="h-8 w-8 text-tool-video" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {isDragActive ? "Drop your file here" : `Drag & drop ${isAudio ? "audio" : "video"} file`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: {isAudio ? "MP3, WAV, OGG, M4A, AAC, FLAC" : "MP4, MOV, AVI, MKV, WebM, GIF"}
          </p>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <div className={cn("p-2 rounded-lg", isAudio ? "bg-tool-audio/10" : "bg-tool-video/10")}>
            {isAudio ? (
              <Music className="h-5 w-5 text-tool-audio" aria-hidden="true" />
            ) : (
              <Film className="h-5 w-5 text-tool-video" aria-hidden="true" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Tool-specific controls */}
      {file && ['audio-cutter', 'audio-trimmer', 'video-cutter', 'video-trimmer'].includes(tool.id) && (
        <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
          <div>
            <Label>Trim Range: {trimStart}% - {trimEnd}%</Label>
            <Slider
              value={[trimStart, trimEnd]}
              onValueChange={([start, end]) => {
                setTrimStart(start);
                setTrimEnd(end);
              }}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      )}

      {file && ['volume-booster', 'audio-volume'].includes(tool.id) && (
        <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
          <div>
            <Label>Volume: {volume}%</Label>
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              min={0}
              max={200}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      )}

      {file && ['audio-speed', 'video-speed', 'slow-motion', 'fast-motion'].includes(tool.id) && (
        <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
          <div>
            <Label>Speed: {speed}x</Label>
            <Slider
              value={[speed]}
              onValueChange={([v]) => setSpeed(v)}
              min={0.25}
              max={4}
              step={0.25}
              className="mt-2"
            />
          </div>
        </div>
      )}

      {/* Process Button */}
      {file && !outputUrl && (
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={processMedia}
          disabled={processing}
          aria-busy={processing}
        >
          {processing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
              Processing...
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Process {isAudio ? "Audio" : "Video"}
            </>
          )}
        </Button>
      )}

      {/* Output Preview */}
      {outputUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-tool-archive/10">
                <Check className="h-4 w-4 text-tool-archive" aria-hidden="true" />
              </div>
              <span className="font-semibold text-foreground">Output Ready</span>
            </div>
            <Button variant="hero" size="sm" onClick={downloadOutput}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </Button>
          </div>

          {/* Media Preview */}
          <div className="bg-secondary/30 rounded-xl p-4">
            {isAudio ? (
              <audio
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={outputUrl}
                controls
                className="w-full"
                aria-label="Audio preview"
              />
            ) : (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={outputUrl}
                controls
                className="w-full rounded-lg"
                aria-label="Video preview"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVideoTool;
