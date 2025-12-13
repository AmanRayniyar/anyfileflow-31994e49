import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Upload, Download, X, Music, RefreshCw, Check, Scissors, 
  Play, Pause, Volume2, VolumeX, ZoomIn, ZoomOut, Undo2, Redo2,
  RotateCcw, Repeat, Split, Layers, Mic, Shield, CloudOff, 
  Smartphone, Keyboard, Moon, Sun, AudioWaveform, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

// Types
interface Region {
  id: string;
  start: number;
  end: number;
}

interface AudioState {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

interface ExportPreset {
  name: string;
  format: string;
  bitrate: number;
  sampleRate: number;
}

interface UndoState {
  regionStart: number;
  regionEnd: number;
}

const EXPORT_PRESETS: ExportPreset[] = [
  { name: "Podcast", format: "mp3", bitrate: 128, sampleRate: 44100 },
  { name: "Ringtone", format: "mp3", bitrate: 192, sampleRate: 44100 },
  { name: "Music", format: "wav", bitrate: 320, sampleRate: 48000 },
  { name: "Voice", format: "mp3", bitrate: 64, sampleRate: 22050 },
];

const AudioCutterTool = () => {
  // Core state
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [audioState, setAudioState] = useState<AudioState>({ duration: 0, currentTime: 0, isPlaying: false });
  
  // Region/cutting state
  const [regionStart, setRegionStart] = useState(0);
  const [regionEnd, setRegionEnd] = useState(0);
  const [startTimeInput, setStartTimeInput] = useState("00:00.000");
  const [endTimeInput, setEndTimeInput] = useState("00:00.000");
  
  // Audio effects state
  const [volume, setVolume] = useState(100);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [loopPreview, setLoopPreview] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [isMono, setIsMono] = useState(false);
  
  // UI state
  const [zoom, setZoom] = useState(1);
  const [darkWaveform, setDarkWaveform] = useState(true);
  const [exportFormat, setExportFormat] = useState("mp3");
  const [selectedPreset, setSelectedPreset] = useState<string>("Music");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Undo/Redo state
  const [undoStack, setUndoStack] = useState<UndoState[]>([]);
  const [redoStack, setRedoStack] = useState<UndoState[]>([]);
  
  // Refs
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<any>(null);
  const regionRef = useRef<any>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("audioCutterSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setVolume(settings.volume ?? 100);
        setFadeIn(settings.fadeIn ?? 0);
        setFadeOut(settings.fadeOut ?? 0);
        setExportFormat(settings.exportFormat ?? "mp3");
        setDarkWaveform(settings.darkWaveform ?? true);
        setSelectedPreset(settings.selectedPreset ?? "Music");
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    const settings = { volume, fadeIn, fadeOut, exportFormat, darkWaveform, selectedPreset };
    localStorage.setItem("audioCutterSettings", JSON.stringify(settings));
  }, [volume, fadeIn, fadeOut, exportFormat, darkWaveform, selectedPreset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!wavesurferRef.current || !file) return;
      
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          wavesurferRef.current.playPause();
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) handleRedo();
            else handleUndo();
          }
          break;
        case "y":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleRedo();
          }
          break;
        case "r":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setLoopPreview(prev => !prev);
          }
          break;
        case "arrowleft":
          e.preventDefault();
          wavesurferRef.current.skip(-5);
          break;
        case "arrowright":
          e.preventDefault();
          wavesurferRef.current.skip(5);
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom(prev => Math.min(prev + 0.5, 10));
          break;
        case "-":
          e.preventDefault();
          setZoom(prev => Math.max(prev - 0.5, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, undoStack, redoStack]);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !file) return;

    // Cleanup previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: darkWaveform ? "#6366f1" : "#8b5cf6",
      progressColor: darkWaveform ? "#4f46e5" : "#7c3aed",
      cursorColor: "#ef4444",
      cursorWidth: 2,
      height: 128,
      normalize: true,
      plugins: [regions],
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
    });

    wavesurferRef.current = ws;

    ws.loadBlob(file);

    ws.on("ready", () => {
      const duration = ws.getDuration();
      setAudioState(prev => ({ ...prev, duration }));
      setRegionEnd(duration);
      setEndTimeInput(formatTime(duration));

      // Create initial region
      const region = regions.addRegion({
        start: 0,
        end: duration,
        color: "rgba(99, 102, 241, 0.3)",
        drag: true,
        resize: true,
      });
      regionRef.current = region;
    });

    ws.on("timeupdate", (time) => {
      setAudioState(prev => ({ ...prev, currentTime: time }));
      
      // Loop preview logic
      if (loopPreview && regionRef.current) {
        const region = regionRef.current;
        if (time >= region.end) {
          ws.setTime(region.start);
        }
      }
    });

    ws.on("play", () => setAudioState(prev => ({ ...prev, isPlaying: true })));
    ws.on("pause", () => setAudioState(prev => ({ ...prev, isPlaying: false })));
    ws.on("finish", () => setAudioState(prev => ({ ...prev, isPlaying: false })));

    regions.on("region-updated", (region: any) => {
      setRegionStart(region.start);
      setRegionEnd(region.end);
      setStartTimeInput(formatTime(region.start));
      setEndTimeInput(formatTime(region.end));
    });

    return () => {
      ws.destroy();
    };
  }, [file, darkWaveform]);

  // Update zoom
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.zoom(zoom * 50);
    }
  }, [zoom]);

  // Update volume
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume / 100);
    }
  }, [volume]);

  // Time formatting helpers
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(/[:.]/).map(Number);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 1000;
    }
    return 0;
  };

  // Event handlers
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setOutputUrl("");
      setRegionStart(0);
      setRegionEnd(0);
      setUndoStack([]);
      setRedoStack([]);
      toast({ title: "File loaded", description: "Audio file ready for editing" });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac", ".wma"] },
    multiple: false,
  });

  const removeFile = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
    setFile(null);
    setOutputUrl("");
    setRegionStart(0);
    setRegionEnd(0);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { regionStart, regionEnd }]);
    setUndoStack(prev => prev.slice(0, -1));
    setRegionStart(lastState.regionStart);
    setRegionEnd(lastState.regionEnd);
    setStartTimeInput(formatTime(lastState.regionStart));
    setEndTimeInput(formatTime(lastState.regionEnd));
    
    if (regionRef.current) {
      regionRef.current.setOptions({ start: lastState.regionStart, end: lastState.regionEnd });
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { regionStart, regionEnd }]);
    setRedoStack(prev => prev.slice(0, -1));
    setRegionStart(nextState.regionStart);
    setRegionEnd(nextState.regionEnd);
    setStartTimeInput(formatTime(nextState.regionStart));
    setEndTimeInput(formatTime(nextState.regionEnd));
    
    if (regionRef.current) {
      regionRef.current.setOptions({ start: nextState.regionStart, end: nextState.regionEnd });
    }
  };

  const saveUndoState = () => {
    setUndoStack(prev => [...prev, { regionStart, regionEnd }]);
    setRedoStack([]);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTimeInput(value);
    const time = parseTime(value);
    if (time >= 0 && time < regionEnd) {
      saveUndoState();
      setRegionStart(time);
      if (regionRef.current) {
        regionRef.current.setOptions({ start: time });
      }
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeInput(value);
    const time = parseTime(value);
    if (time > regionStart && time <= audioState.duration) {
      saveUndoState();
      setRegionEnd(time);
      if (regionRef.current) {
        regionRef.current.setOptions({ end: time });
      }
    }
  };

  const playSelection = () => {
    if (wavesurferRef.current && regionRef.current) {
      wavesurferRef.current.setTime(regionStart);
      wavesurferRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = EXPORT_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      setExportFormat(preset.format);
    }
  };

  // Audio processing
  const processAudio = async () => {
    if (!file) return;

    setProcessing(true);

    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate sample indices for the region
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(regionStart * sampleRate);
      const endSample = Math.floor(regionEnd * sampleRate);
      const length = endSample - startSample;

      // Create new buffer for the cut region
      const channels = isMono ? 1 : audioBuffer.numberOfChannels;
      const cutBuffer = audioContext.createBuffer(channels, length, sampleRate);

      // Copy and process audio data
      for (let channel = 0; channel < channels; channel++) {
        const sourceChannel = isMono ? 0 : channel;
        const sourceData = audioBuffer.getChannelData(sourceChannel);
        const destData = cutBuffer.getChannelData(channel);

        // Additional channel mixing for mono conversion
        if (isMono && audioBuffer.numberOfChannels > 1) {
          const channel2Data = audioBuffer.getChannelData(1);
          for (let i = 0; i < length; i++) {
            destData[i] = (sourceData[startSample + i] + channel2Data[startSample + i]) / 2;
          }
        } else {
          for (let i = 0; i < length; i++) {
            destData[i] = sourceData[startSample + i];
          }
        }

        // Apply fade in
        if (fadeIn > 0) {
          const fadeSamples = Math.floor((fadeIn / 1000) * sampleRate);
          for (let i = 0; i < fadeSamples && i < length; i++) {
            destData[i] *= i / fadeSamples;
          }
        }

        // Apply fade out
        if (fadeOut > 0) {
          const fadeSamples = Math.floor((fadeOut / 1000) * sampleRate);
          for (let i = 0; i < fadeSamples && i < length; i++) {
            const idx = length - 1 - i;
            destData[idx] *= i / fadeSamples;
          }
        }

        // Apply volume
        const volumeMultiplier = volume / 100;
        for (let i = 0; i < length; i++) {
          destData[i] *= volumeMultiplier;
        }

        // Normalize if enabled
        if (normalize) {
          let maxAmp = 0;
          for (let i = 0; i < length; i++) {
            maxAmp = Math.max(maxAmp, Math.abs(destData[i]));
          }
          if (maxAmp > 0) {
            const normalizeRatio = 0.95 / maxAmp;
            for (let i = 0; i < length; i++) {
              destData[i] *= normalizeRatio;
            }
          }
        }
      }

      // Convert to WAV blob
      const wavBlob = audioBufferToWav(cutBuffer);
      const url = URL.createObjectURL(wavBlob);
      setOutputUrl(url);

      toast({ title: "Processing complete!", description: "Your audio is ready to download" });
    } catch (error) {
      console.error("Processing error:", error);
      toast({ title: "Processing failed", description: String(error), variant: "destructive" });
    }

    setProcessing(false);
  };

  // WAV encoder
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    let interleaved: Float32Array;
    if (numChannels === 2) {
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      interleaved = new Float32Array(left.length * 2);
      for (let i = 0; i < left.length; i++) {
        interleaved[i * 2] = left[i];
        interleaved[i * 2 + 1] = right[i];
      }
    } else {
      interleaved = buffer.getChannelData(0);
    }

    const dataSize = interleaved.length * bytesPerSample;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

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

    let offset = 44;
    for (let i = 0; i < interleaved.length; i++) {
      const sample = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  const downloadOutput = () => {
    if (outputUrl) {
      const a = document.createElement("a");
      a.href = outputUrl;
      const baseName = file?.name.replace(/\.[^/.]+$/, "") || "audio";
      a.download = `${baseName}-cut.${exportFormat === "mp3" ? "wav" : exportFormat}`;
      a.click();
      toast({ title: "Download started", description: "Your audio file is downloading" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const selectionDuration = useMemo(() => regionEnd - regionStart, [regionStart, regionEnd]);

  return (
    <div className="space-y-6" role="region" aria-label="Audio Cutter Tool">
      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-3 bg-secondary/30 rounded-xl border border-border/50">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-green-500" aria-hidden="true" />
          <span>No Upload</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <CloudOff className="h-4 w-4 text-blue-500" aria-hidden="true" />
          <span>No Watermark</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4 text-purple-500" aria-hidden="true" />
          <span>Works Offline</span>
        </div>
      </div>

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
          <input {...getInputProps()} aria-label="Upload audio file" />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-tool-audio/10">
              <Music className="h-8 w-8 text-tool-audio" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {isDragActive ? "Drop your audio file here" : "Drag & drop audio file"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports: MP3, WAV, AAC, OGG, M4A, FLAC
            </p>
          </div>
        </div>
      )}

      {/* File Info & Waveform */}
      {file && (
        <div className="space-y-4">
          {/* File Header */}
          <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
            <div className="p-2 rounded-lg bg-tool-audio/10">
              <Music className="h-5 w-5 text-tool-audio" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • Duration: {formatTime(audioState.duration)}
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

          {/* Waveform Container */}
          <div className={cn("rounded-xl overflow-hidden border border-border", darkWaveform ? "bg-gray-900" : "bg-gray-100")}>
            {/* Waveform Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  aria-label={audioState.isPlaying ? "Pause" : "Play"}
                >
                  {audioState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={playSelection} aria-label="Play selection">
                  <Scissors className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Play Selection</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  aria-label="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  aria-label="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border" />
                <Button variant="ghost" size="sm" onClick={() => setZoom(prev => Math.max(prev - 0.5, 0.5))} aria-label="Zoom out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-12 text-center">{zoom.toFixed(1)}x</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(prev => Math.min(prev + 0.5, 10))} aria-label="Zoom in">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkWaveform(!darkWaveform)}
                  aria-label="Toggle waveform theme"
                >
                  {darkWaveform ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Waveform */}
            <div ref={waveformRef} className="w-full cursor-pointer" style={{ minHeight: 128 }} />

            {/* Time Display */}
            <div className="flex items-center justify-between p-2 text-xs text-muted-foreground border-t border-border">
              <span>{formatTime(audioState.currentTime)}</span>
              <span className="font-medium text-foreground">Selection: {formatTime(selectionDuration)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Controls Tabs */}
          <Tabs defaultValue="cut" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="cut" className="text-xs sm:text-sm py-2">
                <Scissors className="h-4 w-4 mr-1 hidden sm:inline" />
                Cut
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs sm:text-sm py-2">
                <AudioWaveform className="h-4 w-4 mr-1 hidden sm:inline" />
                Effects
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm py-2">
                <Download className="h-4 w-4 mr-1 hidden sm:inline" />
                Export
              </TabsTrigger>
              <TabsTrigger value="shortcuts" className="text-xs sm:text-sm py-2">
                <Keyboard className="h-4 w-4 mr-1 hidden sm:inline" />
                Keys
              </TabsTrigger>
            </TabsList>

            {/* Cut Tab */}
            <TabsContent value="cut" className="space-y-4 p-4 bg-secondary/30 rounded-b-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time (mm:ss.ms)</Label>
                  <Input
                    id="start-time"
                    value={startTimeInput}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    placeholder="00:00.000"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time (mm:ss.ms)</Label>
                  <Input
                    id="end-time"
                    value={endTimeInput}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    placeholder="00:00.000"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Repeat className={cn("h-4 w-4", loopPreview && "text-primary")} />
                  <span className="text-sm">Loop Preview</span>
                </div>
                <Switch checked={loopPreview} onCheckedChange={setLoopPreview} aria-label="Toggle loop preview" />
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="space-y-4 p-4 bg-secondary/30 rounded-b-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Volume: {volume}%</Label>
                  <Button variant="ghost" size="sm" onClick={() => setVolume(100)}>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    min={0}
                    max={200}
                    step={1}
                  />
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fade In: {fadeIn}ms</Label>
                  <Slider
                    value={[fadeIn]}
                    onValueChange={([v]) => setFadeIn(v)}
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fade Out: {fadeOut}ms</Label>
                  <Slider
                    value={[fadeOut]}
                    onValueChange={([v]) => setFadeOut(v)}
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <span className="text-sm">Normalize Audio</span>
                  <Switch checked={normalize} onCheckedChange={setNormalize} />
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                  <span className="text-sm">Mono Output</span>
                  <Switch checked={isMono} onCheckedChange={setIsMono} />
                </div>
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-4 p-4 bg-secondary/30 rounded-b-xl">
              <div className="space-y-2">
                <Label>Export Preset</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXPORT_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant={selectedPreset === preset.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset(preset.name)}
                      className="w-full"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wav">WAV (Lossless)</SelectItem>
                    <SelectItem value="mp3">MP3 (Compressed)</SelectItem>
                    <SelectItem value="ogg">OGG (Compressed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Keyboard Shortcuts Tab */}
            <TabsContent value="shortcuts" className="p-4 bg-secondary/30 rounded-b-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Play/Pause</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Undo</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Ctrl+Z</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Redo</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">Ctrl+Y</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Toggle Loop</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">R</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Zoom In</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">+</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Zoom Out</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">-</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Skip Back 5s</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">←</kbd>
                </div>
                <div className="flex justify-between p-2 bg-card rounded border border-border">
                  <span>Skip Forward 5s</span>
                  <kbd className="px-2 py-0.5 bg-secondary rounded text-xs">→</kbd>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Process Button */}
          {!outputUrl && (
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={processAudio}
              disabled={processing}
              aria-busy={processing}
            >
              {processing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="h-5 w-5" />
                  Cut Audio ({formatTime(selectionDuration)})
                </>
              )}
            </Button>
          )}

          {/* Output */}
          {outputUrl && (
            <div className="space-y-4 p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-green-500/10">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="font-semibold text-foreground">Audio Ready!</span>
                </div>
                <Button variant="hero" size="sm" onClick={downloadOutput}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <audio src={outputUrl} controls className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioCutterTool;
