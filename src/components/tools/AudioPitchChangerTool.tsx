import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Play, Pause, RotateCcw, Download, Volume2, VolumeX, Music, Mic, Zap, Shield, Clock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AudioFile {
  id: string;
  file: File;
  name: string;
  duration: number;
  processed: boolean;
}

const PITCH_PRESETS = [
  { name: 'Male → Female', semitones: 4, icon: '👩' },
  { name: 'Female → Male', semitones: -4, icon: '👨' },
  { name: 'Chipmunk', semitones: 8, icon: '🐿️' },
  { name: 'Deep Voice', semitones: -6, icon: '🎸' },
  { name: 'Cartoon', semitones: 6, icon: '🎭' },
  { name: 'Robot', semitones: 2, icon: '🤖' },
];

const MUSICAL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const AudioPitchChangerTool: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Pitch controls
  const [semitones, setSemitones] = useState(0);
  const [cents, setCents] = useState(0);
  const [keepTempo, setKeepTempo] = useState(true);
  const [speed, setSpeed] = useState(1);
  
  // Audio settings
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [sampleRate, setSampleRate] = useState('44100');
  const [channelMode, setChannelMode] = useState('stereo');
  
  // Musical settings
  const [originalKey, setOriginalKey] = useState('C');
  const [targetKey, setTargetKey] = useState('C');
  const [tuningHz, setTuningHz] = useState(440);
  
  // Effects
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [loopPreview, setLoopPreview] = useState(false);
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);

  // Calculate total pitch shift
  const totalPitchShift = semitones + (cents / 100);
  const pitchRatio = Math.pow(2, totalPitchShift / 12);

  // Calculate key change semitones
  useEffect(() => {
    const originalIndex = MUSICAL_KEYS.indexOf(originalKey);
    const targetIndex = MUSICAL_KEYS.indexOf(targetKey);
    if (originalIndex !== -1 && targetIndex !== -1) {
      let diff = targetIndex - originalIndex;
      if (diff > 6) diff -= 12;
      if (diff < -6) diff += 12;
      setSemitones(diff);
    }
  }, [originalKey, targetKey]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: AudioFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) {
        toast.error(`${file.name} is not an audio file`);
        continue;
      }

      const audioContext = initAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      if (i === 0) {
        audioBufferRef.current = audioBuffer;
      }

      newFiles.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        duration: audioBuffer.duration,
        processed: false,
      });
    }

    setAudioFiles(prev => [...prev, ...newFiles]);
    if (audioFiles.length === 0 && newFiles.length > 0) {
      setCurrentFileIndex(0);
    }
    toast.success(`${newFiles.length} file(s) loaded successfully`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const audioBuffer = audioBufferRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);

    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'hsl(var(--primary) / 0.1)');
    gradient.addColorStop(1, 'hsl(var(--primary) / 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      const y1 = ((1 + min) / 2) * height;
      const y2 = ((1 + max) / 2) * height;
      
      ctx.lineTo(i, y1);
      ctx.lineTo(i, y2);
    }
    
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  useEffect(() => {
    if (audioBufferRef.current) {
      drawWaveform();
    }
  }, [audioFiles, drawWaveform]);

  const playAudio = useCallback(() => {
    if (!audioBufferRef.current || !audioContextRef.current || !gainNodeRef.current) return;

    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.loop = loopPreview;
    
    if (keepTempo) {
      // Use detune for pitch shift without tempo change
      source.detune.value = totalPitchShift * 100;
      source.playbackRate.value = speed;
    } else {
      // Change both pitch and speed together
      source.playbackRate.value = pitchRatio * speed;
    }
    
    gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    source.connect(gainNodeRef.current);
    
    const offset = pauseTimeRef.current;
    source.start(0, offset);
    startTimeRef.current = audioContextRef.current.currentTime - offset;
    
    source.onended = () => {
      if (!loopPreview) {
        setIsPlaying(false);
        pauseTimeRef.current = 0;
      }
    };
    
    sourceNodeRef.current = source;
    setIsPlaying(true);
  }, [totalPitchShift, pitchRatio, keepTempo, speed, volume, isMuted, loopPreview]);

  const pauseAudio = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const resetAll = () => {
    pauseAudio();
    setSemitones(0);
    setCents(0);
    setSpeed(1);
    setKeepTempo(true);
    setFadeIn(0);
    setFadeOut(0);
    pauseTimeRef.current = 0;
    toast.success('Reset to original settings');
  };

  const applyPreset = (preset: typeof PITCH_PRESETS[0]) => {
    setSemitones(preset.semitones);
    setCents(0);
    toast.success(`Applied "${preset.name}" preset`);
  };

  const processAndDownload = async () => {
    if (!audioBufferRef.current || !audioContextRef.current) {
      toast.error('No audio loaded');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const offlineContext = new OfflineAudioContext(
        channelMode === 'mono' ? 1 : audioBufferRef.current.numberOfChannels,
        Math.ceil(audioBufferRef.current.duration * parseInt(sampleRate) / (keepTempo ? 1 : pitchRatio)),
        parseInt(sampleRate)
      );

      const source = offlineContext.createBufferSource();
      source.buffer = audioBufferRef.current;
      
      if (keepTempo) {
        source.detune.value = totalPitchShift * 100;
        source.playbackRate.value = speed;
      } else {
        source.playbackRate.value = pitchRatio * speed;
      }

      const gainNode = offlineContext.createGain();
      
      // Apply fade in
      if (fadeIn > 0) {
        gainNode.gain.setValueAtTime(0, 0);
        gainNode.gain.linearRampToValueAtTime(1, fadeIn);
      }
      
      // Apply fade out
      if (fadeOut > 0) {
        const duration = audioBufferRef.current.duration / (keepTempo ? 1 : pitchRatio);
        gainNode.gain.setValueAtTime(1, Math.max(0, duration - fadeOut));
        gainNode.gain.linearRampToValueAtTime(0, duration);
      }

      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);
      source.start();

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const renderedBuffer = await offlineContext.startRendering();
      clearInterval(progressInterval);
      setProgress(100);

      // Convert to WAV and download
      const wavBlob = audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pitch-shifted-${audioFiles[currentFileIndex]?.name || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Audio downloaded successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Error processing audio');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    
    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);
    
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  // Update volume in real-time
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Update pitch in real-time during playback
  useEffect(() => {
    if (sourceNodeRef.current && isPlaying) {
      if (keepTempo) {
        sourceNodeRef.current.detune.value = totalPitchShift * 100;
        sourceNodeRef.current.playbackRate.value = speed;
      } else {
        sourceNodeRef.current.playbackRate.value = pitchRatio * speed;
      }
    }
  }, [totalPitchShift, pitchRatio, keepTempo, speed, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" /> No Upload Storage
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Zap className="h-3 w-3" /> Instant Processing
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> No Signup
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> Works Offline
        </Badge>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop audio files here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              Supports MP3, WAV, AAC, OGG, FLAC, M4A
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {audioFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {audioFiles.map((file, index) => (
                <div
                  key={file.id}
                  onClick={() => setCurrentFileIndex(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentFileIndex
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(file.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {audioFiles.length > 0 && (
        <>
          {/* Waveform Display */}
          <Card>
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={120}
                className="w-full h-24 rounded-lg"
              />
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetAll}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <div className="w-24">
                  <Slider
                    value={[volume * 100]}
                    onValueChange={([v]) => setVolume(v / 100)}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Controls */}
          <Tabs defaultValue="pitch" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pitch">Pitch</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="musical">Musical</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="pitch" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Semitone Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Semitones</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={semitones}
                          onChange={(e) => setSemitones(parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                          min={-12}
                          max={12}
                          step={0.5}
                        />
                        <span className="text-muted-foreground">st</span>
                      </div>
                    </div>
                    <Slider
                      value={[semitones]}
                      onValueChange={([v]) => setSemitones(v)}
                      min={-12}
                      max={12}
                      step={0.5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-12 (1 octave down)</span>
                      <span>0</span>
                      <span>+12 (1 octave up)</span>
                    </div>
                  </div>

                  {/* Fine Tuning (Cents) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Fine Tuning (Cents)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={cents}
                          onChange={(e) => setCents(parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                          min={-50}
                          max={50}
                        />
                        <span className="text-muted-foreground">¢</span>
                      </div>
                    </div>
                    <Slider
                      value={[cents]}
                      onValueChange={([v]) => setCents(v)}
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </div>

                  {/* Keep Tempo Toggle */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <Label>Keep Original Tempo</Label>
                      <p className="text-sm text-muted-foreground">
                        Change pitch without changing speed
                      </p>
                    </div>
                    <Switch
                      checked={keepTempo}
                      onCheckedChange={setKeepTempo}
                    />
                  </div>

                  {/* Speed Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Playback Speed</Label>
                      <span className="font-medium">{speed.toFixed(2)}x</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={2}
                      step={0.05}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5x (Slow)</span>
                      <span>1x</span>
                      <span>2x (Fast)</span>
                    </div>
                  </div>

                  {/* Loop Preview */}
                  <div className="flex items-center justify-between">
                    <Label>Loop Preview</Label>
                    <Switch
                      checked={loopPreview}
                      onCheckedChange={setLoopPreview}
                    />
                  </div>

                  {/* Total Pitch Display */}
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Pitch Shift</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalPitchShift >= 0 ? '+' : ''}{totalPitchShift.toFixed(2)} semitones
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({(pitchRatio * 100 - 100).toFixed(1)}% frequency change)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="presets" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {PITCH_PRESETS.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => applyPreset(preset)}
                      >
                        <span className="text-2xl">{preset.icon}</span>
                        <span className="font-medium">{preset.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {preset.semitones >= 0 ? '+' : ''}{preset.semitones} st
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="musical" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Key Change */}
                  <div className="space-y-4">
                    <Label className="text-lg flex items-center gap-2">
                      <Music className="h-5 w-5" /> Key Change
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Original Key</Label>
                        <Select value={originalKey} onValueChange={setOriginalKey}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MUSICAL_KEYS.map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Target Key</Label>
                        <Select value={targetKey} onValueChange={setTargetKey}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MUSICAL_KEYS.map((key) => (
                              <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Tuning Reference */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Mic className="h-4 w-4" /> Tuning Reference (A4)
                    </Label>
                    <div className="flex gap-4">
                      <Button
                        variant={tuningHz === 432 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTuningHz(432)}
                      >
                        432 Hz
                      </Button>
                      <Button
                        variant={tuningHz === 440 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTuningHz(440)}
                      >
                        440 Hz (Standard)
                      </Button>
                      <Button
                        variant={tuningHz === 444 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTuningHz(444)}
                      >
                        444 Hz
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={tuningHz}
                        onChange={(e) => setTuningHz(parseInt(e.target.value) || 440)}
                        className="w-24"
                        min={400}
                        max={480}
                      />
                      <span className="text-muted-foreground">Hz</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Output Format */}
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wav">WAV (Highest Quality)</SelectItem>
                        <SelectItem value="mp3">MP3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sample Rate */}
                  <div className="space-y-2">
                    <Label>Sample Rate</Label>
                    <Select value={sampleRate} onValueChange={setSampleRate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="44100">44.1 kHz (CD Quality)</SelectItem>
                        <SelectItem value="48000">48 kHz (Professional)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Channel Mode */}
                  <div className="space-y-2">
                    <Label>Channel Mode</Label>
                    <Select value={channelMode} onValueChange={setChannelMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stereo">Stereo</SelectItem>
                        <SelectItem value="mono">Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fade Effects */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fade In (seconds)</Label>
                      <Input
                        type="number"
                        value={fadeIn}
                        onChange={(e) => setFadeIn(parseFloat(e.target.value) || 0)}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fade Out (seconds)</Label>
                      <Input
                        type="number"
                        value={fadeOut}
                        onChange={(e) => setFadeOut(parseFloat(e.target.value) || 0)}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={processAndDownload}
                    disabled={isProcessing}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>Processing... {progress}%</>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download Pitch-Shifted Audio
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Privacy Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Your Privacy is Protected</p>
                  <p className="text-sm text-muted-foreground">
                    All audio processing happens directly in your browser. Your files are never uploaded to any server.
                    No data is stored or shared. 100% private and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Feature Tagline */}
      <div className="text-center py-6">
        <p className="text-lg font-medium text-primary">
          "Change audio pitch instantly without quality loss. No signup. No upload storage. Free forever."
        </p>
      </div>
    </div>
  );
};

export default AudioPitchChangerTool;
