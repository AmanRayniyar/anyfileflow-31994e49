import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Upload, Play, Pause, Music, Trash2, GripVertical, 
  Download, Volume2, VolumeX, Plus, Undo2, Redo2,
  Shield, Wifi, WifiOff, FileAudio, Merge, ArrowUpDown,
  Clock, Waves, Settings2, Loader2
} from 'lucide-react';

interface AudioTrack {
  id: string;
  file: File;
  name: string;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  audioBuffer: AudioBuffer | null;
  waveformData: number[];
}

interface HistoryState {
  tracks: AudioTrack[];
}

const EXPORT_PRESETS = {
  music: { bitrate: 320, format: 'mp3', label: 'Music (320kbps)' },
  podcast: { bitrate: 128, format: 'mp3', label: 'Podcast (128kbps)' },
  audiobook: { bitrate: 64, format: 'mp3', label: 'Audiobook (64kbps)' },
  ringtone: { bitrate: 192, format: 'mp3', label: 'Ringtone (192kbps)' },
  lossless: { bitrate: 0, format: 'wav', label: 'Lossless (WAV)' },
};

export const AudioJoinerTool: React.FC = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0);
  const [gapDuration, setGapDuration] = useState(0);
  const [masterVolume, setMasterVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [exportPreset, setExportPreset] = useState<keyof typeof EXPORT_PRESETS>('music');
  const [normalizeAudio, setNormalizeAudio] = useState(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draggedTrack, setDraggedTrack] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('audioJoinerSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setCrossfadeDuration(settings.crossfadeDuration ?? 0);
        setGapDuration(settings.gapDuration ?? 0);
        setMasterVolume(settings.masterVolume ?? 100);
        setExportPreset(settings.exportPreset ?? 'music');
        setNormalizeAudio(settings.normalizeAudio ?? false);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('audioJoinerSettings', JSON.stringify({
      crossfadeDuration,
      gapDuration,
      masterVolume,
      exportPreset,
      normalizeAudio,
    }));
  }, [crossfadeDuration, gapDuration, masterVolume, exportPreset, normalizeAudio]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === ' ') {
        e.preventDefault();
        if (tracks.length > 0) togglePlayback();
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key === 'm') {
        setIsMuted(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tracks, historyIndex]);

  // Generate waveform data from AudioBuffer
  const generateWaveformData = (audioBuffer: AudioBuffer, samples: number = 100): number[] => {
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const waveform: number[] = [];
    
    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j] || 0);
      }
      waveform.push(sum / blockSize);
    }
    
    const max = Math.max(...waveform);
    return waveform.map(v => v / (max || 1));
  };

  // Save to history
  const saveToHistory = useCallback((newTracks: AudioTrack[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ tracks: [...newTracks] });
    setHistory(newHistory.slice(-50));
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTracks(history[historyIndex - 1].tracks);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTracks(history[historyIndex + 1].tracks);
    }
  }, [history, historyIndex]);

  // Process uploaded files
  const processFiles = useCallback(async (files: File[]) => {
    const audioContext = getAudioContext();
    const newTracks: AudioTrack[] = [];
    
    for (const file of files) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const waveformData = generateWaveformData(audioBuffer);
        
        newTracks.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          duration: audioBuffer.duration,
          volume: 100,
          fadeIn: 0,
          fadeOut: 0,
          audioBuffer,
          waveformData,
        });
      } catch (error) {
        toast.error(`Failed to load ${file.name}`);
        console.error('Audio decode error:', error);
      }
    }
    
    const updatedTracks = [...tracks, ...newTracks];
    setTracks(updatedTracks);
    saveToHistory(updatedTracks);
    toast.success(`Added ${newTracks.length} track(s)`);
  }, [tracks, getAudioContext, saveToHistory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'audio/aac': ['.aac'],
      'audio/flac': ['.flac'],
      'audio/m4a': ['.m4a'],
    },
    onDrop: processFiles,
    multiple: true,
  });

  // Remove track
  const removeTrack = useCallback((id: string) => {
    const updatedTracks = tracks.filter(t => t.id !== id);
    setTracks(updatedTracks);
    saveToHistory(updatedTracks);
  }, [tracks, saveToHistory]);

  // Update track property
  const updateTrack = useCallback((id: string, updates: Partial<AudioTrack>) => {
    const updatedTracks = tracks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTracks(updatedTracks);
  }, [tracks]);

  // Reorder tracks via drag and drop
  const handleDragStart = (id: string) => {
    setDraggedTrack(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTrack || draggedTrack === targetId) return;
    
    const draggedIndex = tracks.findIndex(t => t.id === draggedTrack);
    const targetIndex = tracks.findIndex(t => t.id === targetId);
    
    const newTracks = [...tracks];
    const [removed] = newTracks.splice(draggedIndex, 1);
    newTracks.splice(targetIndex, 0, removed);
    
    setTracks(newTracks);
  };

  const handleDragEnd = () => {
    if (draggedTrack) {
      saveToHistory(tracks);
    }
    setDraggedTrack(null);
  };

  // Move track up/down
  const moveTrack = (id: string, direction: 'up' | 'down') => {
    const index = tracks.findIndex(t => t.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === tracks.length - 1)) return;
    
    const newTracks = [...tracks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newTracks[index], newTracks[targetIndex]] = [newTracks[targetIndex], newTracks[index]];
    
    setTracks(newTracks);
    saveToHistory(newTracks);
  };

  // Toggle playback
  const togglePlayback = async () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      await playPreview();
    }
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playPreview = async () => {
    if (tracks.length === 0) return;
    
    stopPlayback();
    
    const audioContext = getAudioContext();
    const mergedBuffer = await mergeAudioBuffers();
    if (!mergedBuffer) return;
    
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = mergedBuffer;
    gainNode.gain.value = isMuted ? 0 : masterVolume / 100;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    sourceNodeRef.current = source;
    gainNodeRef.current = gainNode;
    
    source.onended = () => setIsPlaying(false);
    source.start();
    setIsPlaying(true);
  };

  // Merge audio buffers
  const mergeAudioBuffers = async (): Promise<AudioBuffer | null> => {
    if (tracks.length === 0) return null;
    
    const audioContext = getAudioContext();
    const sampleRate = audioContext.sampleRate;
    const gapSamples = Math.floor(gapDuration * sampleRate);
    const crossfadeSamples = Math.floor(crossfadeDuration * sampleRate);
    
    // Calculate total length
    let totalLength = 0;
    tracks.forEach((track, index) => {
      if (track.audioBuffer) {
        totalLength += track.audioBuffer.length;
        if (index < tracks.length - 1) {
          totalLength += gapSamples - crossfadeSamples;
        }
      }
    });
    
    const numberOfChannels = Math.max(...tracks.map(t => t.audioBuffer?.numberOfChannels || 2));
    const outputBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);
    
    let offset = 0;
    
    tracks.forEach((track, trackIndex) => {
      if (!track.audioBuffer) return;
      
      const buffer = track.audioBuffer;
      const volume = track.volume / 100;
      const fadeInSamples = Math.floor(track.fadeIn * sampleRate);
      const fadeOutSamples = Math.floor(track.fadeOut * sampleRate);
      
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sourceChannel = channel < buffer.numberOfChannels 
          ? buffer.getChannelData(channel) 
          : buffer.getChannelData(0);
        const outputChannel = outputBuffer.getChannelData(channel);
        
        for (let i = 0; i < buffer.length; i++) {
          let sample = sourceChannel[i] * volume;
          
          // Apply fade in
          if (i < fadeInSamples) {
            sample *= i / fadeInSamples;
          }
          
          // Apply fade out
          const fadeOutStart = buffer.length - fadeOutSamples;
          if (i > fadeOutStart) {
            sample *= (buffer.length - i) / fadeOutSamples;
          }
          
          // Apply crossfade with previous track
          if (trackIndex > 0 && i < crossfadeSamples && crossfadeSamples > 0) {
            sample *= i / crossfadeSamples;
          }
          
          // Mix with existing audio (for crossfade)
          const targetIndex = offset + i;
          if (targetIndex < outputBuffer.length) {
            outputChannel[targetIndex] = (outputChannel[targetIndex] || 0) + sample;
          }
        }
      }
      
      offset += buffer.length + gapSamples - crossfadeSamples;
    });
    
    // Normalize if enabled
    if (normalizeAudio) {
      let maxSample = 0;
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = outputBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          maxSample = Math.max(maxSample, Math.abs(channelData[i]));
        }
      }
      
      if (maxSample > 0) {
        const normalizeGain = 0.95 / maxSample;
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const channelData = outputBuffer.getChannelData(channel);
          for (let i = 0; i < channelData.length; i++) {
            channelData[i] *= normalizeGain;
          }
        }
      }
    }
    
    return outputBuffer;
  };

  // Export merged audio
  const exportAudio = async () => {
    if (tracks.length === 0) {
      toast.error('Add at least one audio track');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const mergedBuffer = await mergeAudioBuffers();
      if (!mergedBuffer) throw new Error('Failed to merge audio');
      
      const preset = EXPORT_PRESETS[exportPreset];
      
      // Convert to WAV (browser limitation - MP3 encoding would need a library)
      const wavBlob = audioBufferToWav(mergedBuffer);
      
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-audio-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Audio exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export audio');
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert AudioBuffer to WAV
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
    
    const channels: Float32Array[] = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Calculate total duration
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0) + 
    (tracks.length > 1 ? (tracks.length - 1) * (gapDuration - crossfadeDuration) : 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
          <Shield className="w-4 h-4 text-green-500" />
          No Upload
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
          <FileAudio className="w-4 h-4 text-blue-500" />
          No Watermark
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
          <WifiOff className="w-4 h-4 text-purple-500" />
          Works Offline
        </Badge>
      </div>

      {/* Drop Zone */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-medium">Drop audio files here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports MP3, WAV, OGG, AAC, FLAC, M4A
            </p>
          </div>
        </div>
      </Card>

      {/* Tracks List */}
      {tracks.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Music className="w-5 h-5" />
              Tracks ({tracks.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                draggable
                onDragStart={() => handleDragStart(track.id)}
                onDragOver={(e) => handleDragOver(e, track.id)}
                onDragEnd={handleDragEnd}
                className={`p-3 rounded-lg border bg-card transition-all ${
                  draggedTrack === track.id ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  
                  {/* Mini Waveform */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{track.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                    <div className="h-8 bg-muted/50 rounded flex items-center justify-center gap-px overflow-hidden">
                      {track.waveformData.map((v, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary/60 rounded-full"
                          style={{ height: `${Math.max(4, v * 100)}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Track Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <Slider
                        value={[track.volume]}
                        onValueChange={([v]) => updateTrack(track.id, { volume: v })}
                        max={100}
                        step={1}
                        className="w-16"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveTrack(track.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUpDown className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTrack(track.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Track Fade Controls */}
                <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t text-sm">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Fade In:</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={track.fadeIn}
                      onChange={(e) => updateTrack(track.id, { fadeIn: parseFloat(e.target.value) || 0 })}
                      className="w-16 h-7 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Fade Out:</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={track.fadeOut}
                      onChange={(e) => updateTrack(track.id, { fadeOut: parseFloat(e.target.value) || 0 })}
                      className="w-16 h-7 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Button */}
          <div {...getRootProps()} className="pt-2">
            <Button variant="outline" className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add More Tracks
            </Button>
          </div>
        </Card>
      )}

      {/* Settings Panel */}
      {tracks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5" />
            <h3 className="font-semibold">Merge Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Crossfade */}
            <div className="space-y-2">
              <Label className="text-sm">Crossfade Duration</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[crossfadeDuration]}
                  onValueChange={([v]) => setCrossfadeDuration(v)}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">{crossfadeDuration}s</span>
              </div>
            </div>

            {/* Gap */}
            <div className="space-y-2">
              <Label className="text-sm">Gap Between Tracks</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[gapDuration]}
                  onValueChange={([v]) => setGapDuration(v)}
                  max={5}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">{gapDuration}s</span>
              </div>
            </div>

            {/* Master Volume */}
            <div className="space-y-2">
              <Label className="text-sm">Master Volume</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : masterVolume]}
                  onValueChange={([v]) => {
                    setMasterVolume(v);
                    setIsMuted(false);
                    if (gainNodeRef.current) {
                      gainNodeRef.current.gain.value = v / 100;
                    }
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-10">{masterVolume}%</span>
              </div>
            </div>

            {/* Export Preset */}
            <div className="space-y-2">
              <Label className="text-sm">Export Preset</Label>
              <Select value={exportPreset} onValueChange={(v) => setExportPreset(v as keyof typeof EXPORT_PRESETS)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPORT_PRESETS).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Normalize */}
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-sm">Normalize Audio</Label>
              <Switch
                checked={normalizeAudio}
                onCheckedChange={setNormalizeAudio}
              />
            </div>

            {/* Total Duration */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Total: <strong>{formatTime(totalDuration)}</strong>
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {tracks.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={togglePlayback}
            disabled={isProcessing}
            className="min-w-[140px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Preview
              </>
            )}
          </Button>
          
          <Button
            size="lg"
            onClick={exportAudio}
            disabled={isProcessing}
            className="min-w-[180px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Merge className="w-5 h-5 mr-2" />
                Join & Download
              </>
            )}
          </Button>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> Play/Pause
          {' • '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd> Undo
          {' • '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">M</kbd> Mute
        </p>
      </div>
    </div>
  );
};

export default AudioJoinerTool;
