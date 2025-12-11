import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mic, 
  MicOff, 
  Activity, 
  Music, 
  Waves, 
  BarChart3, 
  Settings, 
  Download,
  Volume2,
  Pause,
  Play,
  RefreshCw,
  Zap,
  Target,
  TrendingUp,
  History,
  FileAudio
} from 'lucide-react';

// Musical note frequencies (A4 = 440Hz standard tuning)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4_FREQUENCY = 440;
const SEMITONE_RATIO = Math.pow(2, 1/12);

interface FrequencyData {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  amplitude: number;
  timestamp: number;
}

interface HistoryEntry {
  frequency: number;
  note: string;
  octave: number;
  timestamp: Date;
}

const FrequencyDetectorTool: React.FC = () => {
  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<number>(0);
  const [currentNote, setCurrentNote] = useState<string>('-');
  const [currentOctave, setCurrentOctave] = useState<number>(0);
  const [cents, setCents] = useState<number>(0);
  const [amplitude, setAmplitude] = useState<number>(0);
  const [peakFrequency, setPeakFrequency] = useState<number>(0);
  const [averageFrequency, setAverageFrequency] = useState<number>(0);
  
  // Settings
  const [sensitivity, setSensitivity] = useState<number>(50);
  const [minFrequency, setMinFrequency] = useState<number>(20);
  const [maxFrequency, setMaxFrequency] = useState<number>(20000);
  const [fftSize, setFftSize] = useState<string>('2048');
  const [smoothing, setSmoothing] = useState<number>(0.8);
  const [showSpectrogram, setShowSpectrogram] = useState<boolean>(true);
  const [showWaveform, setShowWaveform] = useState<boolean>(true);
  const [darkVisualization, setDarkVisualization] = useState<boolean>(false);
  const [referenceFrequency, setReferenceFrequency] = useState<number>(440);
  
  // History
  const [frequencyHistory, setFrequencyHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramCanvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramDataRef = useRef<ImageData | null>(null);
  const frequencyBufferRef = useRef<number[]>([]);
  
  // Convert frequency to musical note
  const frequencyToNote = useCallback((freq: number): { note: string; octave: number; cents: number } => {
    if (freq <= 0) return { note: '-', octave: 0, cents: 0 };
    
    // Calculate semitones from A4
    const semitones = 12 * Math.log2(freq / referenceFrequency);
    const roundedSemitones = Math.round(semitones);
    
    // Calculate cents deviation
    const centsDeviation = Math.round((semitones - roundedSemitones) * 100);
    
    // Calculate note index (A = 9)
    const noteIndex = ((roundedSemitones % 12) + 12 + 9) % 12;
    const octave = Math.floor((roundedSemitones + 9) / 12) + 4;
    
    return {
      note: NOTES[noteIndex],
      octave: Math.max(0, Math.min(9, octave)),
      cents: centsDeviation
    };
  }, [referenceFrequency]);
  
  // Autocorrelation for pitch detection
  const autoCorrelate = useCallback((buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;
    let foundGoodCorrelation = false;
    const correlations = new Array(MAX_SAMPLES);
    
    // Calculate RMS
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    
    // Not enough signal
    if (rms < 0.01 * (sensitivity / 100)) return -1;
    
    let lastCorrelation = 1;
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
      }
      correlation = 1 - (correlation / MAX_SAMPLES);
      correlations[offset] = correlation;
      
      if ((correlation > 0.9) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      } else if (foundGoodCorrelation) {
        // Refine using parabolic interpolation
        const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
        return sampleRate / (bestOffset + (8 * shift));
      }
      lastCorrelation = correlation;
    }
    
    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset;
    }
    return -1;
  }, [sensitivity]);
  
  // Draw spectrum analyzer
  const drawSpectrum = useCallback((analyser: AnalyserNode, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / bufferLength * 2.5;
    
    ctx.fillStyle = darkVisualization ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      // Create gradient based on frequency
      const hue = (i / bufferLength) * 270;
      ctx.fillStyle = `hsl(${hue}, 80%, ${darkVisualization ? 60 : 50}%)`;
      
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
    
    // Draw frequency scale
    ctx.fillStyle = darkVisualization ? '#94a3b8' : '#64748b';
    ctx.font = '10px sans-serif';
    const frequencies = [100, 500, 1000, 5000, 10000, 20000];
    frequencies.forEach(freq => {
      const position = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      ctx.fillText(`${freq >= 1000 ? freq / 1000 + 'k' : freq}`, position, height - 5);
    });
  }, [darkVisualization]);
  
  // Draw waveform
  const drawWaveform = useCallback((analyser: AnalyserNode, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = darkVisualization ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkVisualization ? '#22d3ee' : '#0891b2';
    ctx.beginPath();
    
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i];
      const y = (v * 0.5 + 0.5) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    
    ctx.stroke();
    
    // Draw center line
    ctx.strokeStyle = darkVisualization ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [darkVisualization]);
  
  // Draw spectrogram
  const drawSpectrogram = useCallback((analyser: AnalyserNode, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    // Shift existing image left
    if (spectrogramDataRef.current) {
      ctx.putImageData(spectrogramDataRef.current, -1, 0);
    }
    
    // Draw new column
    for (let i = 0; i < height; i++) {
      const dataIndex = Math.floor((i / height) * bufferLength);
      const value = dataArray[bufferLength - 1 - dataIndex];
      
      // Color based on intensity
      const hue = 240 - (value / 255) * 240;
      ctx.fillStyle = `hsl(${hue}, 100%, ${value / 5 + 10}%)`;
      ctx.fillRect(width - 1, i, 1, 1);
    }
    
    // Save current image data
    spectrogramDataRef.current = ctx.getImageData(0, 0, width, height);
  }, []);
  
  // Main analysis loop
  const analyze = useCallback(() => {
    if (!analyserRef.current || isPaused) {
      animationRef.current = requestAnimationFrame(analyze);
      return;
    }
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);
    
    // Detect pitch
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const frequency = autoCorrelate(buffer, sampleRate);
    
    if (frequency > minFrequency && frequency < maxFrequency) {
      setCurrentFrequency(Math.round(frequency * 10) / 10);
      
      const noteInfo = frequencyToNote(frequency);
      setCurrentNote(noteInfo.note);
      setCurrentOctave(noteInfo.octave);
      setCents(noteInfo.cents);
      
      // Update peak
      if (frequency > peakFrequency) {
        setPeakFrequency(Math.round(frequency * 10) / 10);
      }
      
      // Calculate average
      frequencyBufferRef.current.push(frequency);
      if (frequencyBufferRef.current.length > 100) {
        frequencyBufferRef.current.shift();
      }
      const avg = frequencyBufferRef.current.reduce((a, b) => a + b, 0) / frequencyBufferRef.current.length;
      setAverageFrequency(Math.round(avg * 10) / 10);
    }
    
    // Calculate amplitude
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / bufferLength);
    const db = 20 * Math.log10(rms);
    setAmplitude(Math.max(-100, Math.min(0, db)));
    
    // Draw visualizations
    if (spectrumCanvasRef.current) {
      drawSpectrum(analyser, spectrumCanvasRef.current);
    }
    if (waveformCanvasRef.current && showWaveform) {
      drawWaveform(analyser, waveformCanvasRef.current);
    }
    if (spectrogramCanvasRef.current && showSpectrogram) {
      drawSpectrogram(analyser, spectrogramCanvasRef.current);
    }
    
    animationRef.current = requestAnimationFrame(analyze);
  }, [isPaused, autoCorrelate, frequencyToNote, drawSpectrum, drawWaveform, drawSpectrogram, minFrequency, maxFrequency, peakFrequency, showWaveform, showSpectrogram]);
  
  // Start listening
  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000
        }
      });
      
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = parseInt(fftSize);
      analyser.smoothingTimeConstant = smoothing;
      analyser.minDecibels = -100;
      analyser.maxDecibels = -10;
      
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsListening(true);
      setIsPaused(false);
      
      // Clear spectrogram
      if (spectrogramCanvasRef.current) {
        const ctx = spectrogramCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, spectrogramCanvasRef.current.width, spectrogramCanvasRef.current.height);
        }
        spectrogramDataRef.current = null;
      }
      
      analyze();
      toast.success('Microphone activated');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };
  
  // Stop listening
  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsListening(false);
    setIsPaused(false);
    setCurrentFrequency(0);
    setCurrentNote('-');
    setAmplitude(0);
    
    toast.info('Microphone deactivated');
  };
  
  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Reset stats
  const resetStats = () => {
    setPeakFrequency(0);
    setAverageFrequency(0);
    frequencyBufferRef.current = [];
    toast.success('Statistics reset');
  };
  
  // Add to history
  const addToHistory = () => {
    if (currentFrequency > 0) {
      setFrequencyHistory(prev => [
        {
          frequency: currentFrequency,
          note: currentNote,
          octave: currentOctave,
          timestamp: new Date()
        },
        ...prev.slice(0, 49)
      ]);
      toast.success('Frequency saved to history');
    }
  };
  
  // Export data
  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      currentFrequency,
      currentNote: `${currentNote}${currentOctave}`,
      cents,
      peakFrequency,
      averageFrequency,
      history: frequencyHistory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frequency-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Update analyser settings when changed
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.fftSize = parseInt(fftSize);
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [fftSize, smoothing]);
  
  // Get cents color
  const getCentsColor = (cents: number): string => {
    const absCents = Math.abs(cents);
    if (absCents <= 5) return 'text-green-500';
    if (absCents <= 15) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Get amplitude bar width
  const getAmplitudeWidth = (): string => {
    const normalized = (amplitude + 100) / 100;
    return `${Math.max(0, Math.min(100, normalized * 100))}%`;
  };

  return (
    <div className="space-y-6">
      {/* Main Display */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Frequency Display */}
            <div className="relative">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary font-mono tracking-tight">
                {currentFrequency > 0 ? currentFrequency.toFixed(1) : '---.-'}
                <span className="text-2xl sm:text-3xl text-muted-foreground ml-2">Hz</span>
              </div>
            </div>
            
            {/* Note Display */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  {currentNote}
                  <sub className="text-lg text-muted-foreground">{currentOctave > 0 ? currentOctave : ''}</sub>
                </span>
              </div>
              
              {/* Cents Indicator */}
              <div className={`text-xl font-mono ${getCentsColor(cents)}`}>
                {cents > 0 ? '+' : ''}{cents} cents
              </div>
            </div>
            
            {/* Tuning Indicator */}
            <div className="relative h-8 bg-secondary/50 rounded-full overflow-hidden max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-0.5 h-full bg-foreground/50" />
              </div>
              <div 
                className="absolute top-0 bottom-0 w-4 bg-primary rounded-full transition-all duration-75"
                style={{ 
                  left: `calc(50% + ${(cents / 50) * 50}% - 8px)`,
                  opacity: currentFrequency > 0 ? 1 : 0.3
                }}
              />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 text-xs text-muted-foreground">
                <span>-50</span>
                <span>0</span>
                <span>+50</span>
              </div>
            </div>
            
            {/* Amplitude Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3" />
                  Volume Level
                </span>
                <span>{amplitude.toFixed(1)} dB</span>
              </div>
              <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75 rounded-full"
                  style={{ width: getAmplitudeWidth() }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!isListening ? (
          <Button onClick={startListening} size="lg" className="gap-2">
            <Mic className="h-5 w-5" />
            Start Detection
          </Button>
        ) : (
          <>
            <Button onClick={stopListening} variant="destructive" size="lg" className="gap-2">
              <MicOff className="h-5 w-5" />
              Stop
            </Button>
            <Button onClick={togglePause} variant="secondary" size="lg" className="gap-2">
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </>
        )}
        <Button onClick={addToHistory} variant="outline" size="lg" className="gap-2" disabled={currentFrequency <= 0}>
          <Target className="h-5 w-5" />
          Save
        </Button>
        <Button onClick={resetStats} variant="outline" size="lg" className="gap-2">
          <RefreshCw className="h-5 w-5" />
          Reset
        </Button>
        <Button onClick={exportData} variant="outline" size="lg" className="gap-2">
          <Download className="h-5 w-5" />
          Export
        </Button>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs">Current</span>
            </div>
            <div className="text-xl font-bold text-primary">{currentFrequency.toFixed(1)} Hz</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Peak</span>
            </div>
            <div className="text-xl font-bold text-orange-500">{peakFrequency.toFixed(1)} Hz</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Average</span>
            </div>
            <div className="text-xl font-bold text-blue-500">{averageFrequency.toFixed(1)} Hz</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <History className="h-4 w-4" />
              <span className="text-xs">Saved</span>
            </div>
            <div className="text-xl font-bold text-green-500">{frequencyHistory.length}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Visualizations */}
      <Tabs defaultValue="spectrum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="spectrum" className="gap-2 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Spectrum</span>
          </TabsTrigger>
          <TabsTrigger value="waveform" className="gap-2 text-xs sm:text-sm">
            <Waves className="h-4 w-4" />
            <span className="hidden sm:inline">Waveform</span>
          </TabsTrigger>
          <TabsTrigger value="spectrogram" className="gap-2 text-xs sm:text-sm">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Spectrogram</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spectrum" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <canvas 
                ref={spectrumCanvasRef}
                width={800}
                height={200}
                className="w-full h-48 sm:h-64 rounded-lg"
                style={{ backgroundColor: darkVisualization ? '#0f172a' : '#f8fafc' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="waveform" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <canvas 
                ref={waveformCanvasRef}
                width={800}
                height={200}
                className="w-full h-48 sm:h-64 rounded-lg"
                style={{ backgroundColor: darkVisualization ? '#0f172a' : '#f8fafc' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spectrogram" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <canvas 
                ref={spectrogramCanvasRef}
                width={800}
                height={200}
                className="w-full h-48 sm:h-64 rounded-lg bg-slate-900"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sensitivity */}
            <div className="space-y-2">
              <Label className="text-sm">Detection Sensitivity: {sensitivity}%</Label>
              <Slider
                value={[sensitivity]}
                onValueChange={([v]) => setSensitivity(v)}
                min={10}
                max={100}
                step={5}
              />
            </div>
            
            {/* Smoothing */}
            <div className="space-y-2">
              <Label className="text-sm">Smoothing: {(smoothing * 100).toFixed(0)}%</Label>
              <Slider
                value={[smoothing * 100]}
                onValueChange={([v]) => setSmoothing(v / 100)}
                min={0}
                max={100}
                step={5}
              />
            </div>
            
            {/* Min Frequency */}
            <div className="space-y-2">
              <Label className="text-sm">Min Frequency: {minFrequency} Hz</Label>
              <Slider
                value={[minFrequency]}
                onValueChange={([v]) => setMinFrequency(v)}
                min={20}
                max={1000}
                step={10}
              />
            </div>
            
            {/* Max Frequency */}
            <div className="space-y-2">
              <Label className="text-sm">Max Frequency: {maxFrequency} Hz</Label>
              <Slider
                value={[maxFrequency]}
                onValueChange={([v]) => setMaxFrequency(v)}
                min={1000}
                max={20000}
                step={100}
              />
            </div>
            
            {/* FFT Size */}
            <div className="space-y-2">
              <Label className="text-sm">FFT Size (Resolution)</Label>
              <Select value={fftSize} onValueChange={setFftSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024">1024 (Fast)</SelectItem>
                  <SelectItem value="2048">2048 (Balanced)</SelectItem>
                  <SelectItem value="4096">4096 (Accurate)</SelectItem>
                  <SelectItem value="8192">8192 (High Precision)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Reference Frequency */}
            <div className="space-y-2">
              <Label className="text-sm">Reference A4: {referenceFrequency} Hz</Label>
              <Slider
                value={[referenceFrequency]}
                onValueChange={([v]) => setReferenceFrequency(v)}
                min={415}
                max={466}
                step={1}
              />
            </div>
          </div>
          
          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={showWaveform} onCheckedChange={setShowWaveform} />
              <Label className="text-sm">Show Waveform</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showSpectrogram} onCheckedChange={setShowSpectrogram} />
              <Label className="text-sm">Show Spectrogram</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={darkVisualization} onCheckedChange={setDarkVisualization} />
              <Label className="text-sm">Dark Visualization</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* History */}
      {frequencyHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Saved Frequencies
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Hide' : 'Show'} ({frequencyHistory.length})
              </Button>
            </div>
          </CardHeader>
          {showHistory && (
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {frequencyHistory.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{entry.note}{entry.octave}</Badge>
                      <span className="font-mono font-bold">{entry.frequency.toFixed(1)} Hz</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 w-full"
                onClick={() => setFrequencyHistory([])}
              >
                Clear History
              </Button>
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Music className="h-4 w-4" />
              About Musical Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Musical notes are based on frequency. The standard tuning uses A4 = 440 Hz.
              Each octave doubles the frequency (A5 = 880 Hz, A3 = 220 Hz).
            </p>
            <p>
              Cents measure how far a note is from perfect pitch. ±5 cents is generally 
              considered in-tune. Green = in tune, yellow = slightly off, red = out of tune.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Frequency Ranges
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="space-y-1">
              <li><strong>Sub-bass:</strong> 20-60 Hz</li>
              <li><strong>Bass:</strong> 60-250 Hz</li>
              <li><strong>Midrange:</strong> 250-4000 Hz</li>
              <li><strong>Treble:</strong> 4000-20000 Hz</li>
            </ul>
            <p>Human hearing typically ranges from 20 Hz to 20,000 Hz.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FrequencyDetectorTool;
