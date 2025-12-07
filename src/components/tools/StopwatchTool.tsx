import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, Flag, Maximize2, Minimize2,
  Volume2, VolumeX, Download, Copy, Keyboard, Clock,
  Timer, Split, Trash2, Moon, Sun, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type StopwatchMode = 'standard' | 'countdown' | 'split';

interface Lap {
  id: number;
  lapTime: number;
  totalTime: number;
  timestamp: Date;
}

interface StopwatchSettings {
  soundEnabled: boolean;
  keyboardShortcuts: boolean;
  theme: 'default' | 'neon' | 'minimal' | 'retro';
}

const STORAGE_KEY = 'anyfileflow-stopwatch-laps';
const SETTINGS_KEY = 'anyfileflow-stopwatch-settings';

const StopwatchTool: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [mode, setMode] = useState<StopwatchMode>('standard');
  const [countdownStart, setCountdownStart] = useState(60000); // 1 minute default
  const [countdownInput, setCountdownInput] = useState('01:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<StopwatchSettings>({
    soundEnabled: true,
    keyboardShortcuts: true,
    theme: 'default'
  });
  const [lastLapTime, setLastLapTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load laps and settings from localStorage
  useEffect(() => {
    const savedLaps = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedLaps) {
      try {
        const parsed = JSON.parse(savedLaps);
        setLaps(parsed.map((lap: any) => ({
          ...lap,
          timestamp: new Date(lap.timestamp)
        })));
      } catch (e) {
        console.error('Failed to load laps:', e);
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save laps to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(laps));
  }, [laps]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Play beep sound
  const playBeep = useCallback((frequency = 800, duration = 100) => {
    if (!settings.soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      console.error('Audio not supported:', e);
    }
  }, [settings.soundEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        
        if (mode === 'countdown') {
          const remaining = countdownStart - elapsed;
          if (remaining <= 0) {
            setTime(0);
            setIsRunning(false);
            playBeep(1000, 500);
            toast.success('Countdown complete!');
            return;
          }
          setTime(remaining);
        } else {
          setTime(elapsed);
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, countdownStart, playBeep]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!settings.keyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleRunning();
          break;
        case 'KeyL':
          e.preventDefault();
          if (isRunning || time > 0) addLap();
          break;
        case 'KeyR':
          e.preventDefault();
          reset();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardShortcuts, isRunning, time]);

  const toggleRunning = () => {
    if (!isRunning && mode === 'countdown' && time === 0) {
      setTime(countdownStart);
      startTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
    playBeep(isRunning ? 400 : 600);
  };

  const reset = () => {
    setIsRunning(false);
    if (mode === 'countdown') {
      setTime(countdownStart);
    } else {
      setTime(0);
    }
    setLastLapTime(0);
    playBeep(300);
  };

  const addLap = () => {
    const lapTime = mode === 'split' ? time - lastLapTime : time;
    const newLap: Lap = {
      id: Date.now(),
      lapTime: lapTime,
      totalTime: time,
      timestamp: new Date()
    };
    setLaps(prev => [newLap, ...prev]);
    setLastLapTime(time);
    playBeep(800);
  };

  const clearLaps = () => {
    setLaps([]);
    setLastLapTime(0);
    toast.success('Laps cleared');
  };

  const formatTime = (ms: number, showMs = true): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000));
    
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    const mmm = milliseconds.toString().padStart(3, '0');
    
    if (showMs) {
      return `${hh}:${mm}:${ss}.${mmm}`;
    }
    return `${hh}:${mm}:${ss}`;
  };

  const parseCountdownInput = (input: string): number => {
    const parts = input.split(':').map(p => parseInt(p) || 0);
    if (parts.length === 2) {
      return (parts[0] * 60 + parts[1]) * 1000;
    } else if (parts.length === 3) {
      return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    }
    return 60000;
  };

  const handleCountdownInputChange = (value: string) => {
    setCountdownInput(value);
    const ms = parseCountdownInput(value);
    setCountdownStart(ms);
    if (!isRunning) {
      setTime(ms);
    }
  };

  const handleModeChange = (newMode: StopwatchMode) => {
    setMode(newMode);
    setIsRunning(false);
    setLastLapTime(0);
    if (newMode === 'countdown') {
      setTime(countdownStart);
    } else {
      setTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const copyLaps = () => {
    const text = laps.map((lap, index) => 
      `Lap ${laps.length - index}: ${formatTime(lap.lapTime)} (Total: ${formatTime(lap.totalTime)})`
    ).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Laps copied to clipboard!');
  };

  const downloadLaps = (format: 'txt' | 'csv') => {
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'csv') {
      content = 'Lap,Lap Time,Total Time,Timestamp\n' + 
        laps.map((lap, index) => 
          `${laps.length - index},${formatTime(lap.lapTime)},${formatTime(lap.totalTime)},${lap.timestamp.toISOString()}`
        ).join('\n');
      filename = 'stopwatch-laps.csv';
      mimeType = 'text/csv';
    } else {
      content = `Stopwatch Laps - ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n` +
        laps.map((lap, index) => 
          `Lap ${laps.length - index}: ${formatTime(lap.lapTime)} (Total: ${formatTime(lap.totalTime)})`
        ).join('\n');
      filename = 'stopwatch-laps.txt';
      mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${format.toUpperCase()}`);
  };

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'neon':
        return 'bg-black text-green-400 font-mono';
      case 'minimal':
        return 'bg-background text-foreground';
      case 'retro':
        return 'bg-amber-950 text-amber-400 font-mono';
      default:
        return 'bg-background text-foreground';
    }
  };

  const getTimerClasses = () => {
    switch (settings.theme) {
      case 'neon':
        return 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]';
      case 'retro':
        return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      default:
        return 'text-foreground';
    }
  };

  // Find best and worst laps
  const bestLap = laps.length > 1 ? laps.reduce((best, lap) => lap.lapTime < best.lapTime ? lap : best, laps[0]) : null;
  const worstLap = laps.length > 1 ? laps.reduce((worst, lap) => lap.lapTime > worst.lapTime ? lap : worst, laps[0]) : null;

  return (
    <div 
      ref={containerRef}
      className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 flex flex-col items-center justify-center p-8' : ''} ${getThemeClasses()}`}
    >
      {/* Mode Selector */}
      {!isFullscreen && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Select value={mode} onValueChange={(v: StopwatchMode) => handleModeChange(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Standard Stopwatch
                </span>
              </SelectItem>
              <SelectItem value="countdown">
                <span className="flex items-center gap-2">
                  <Timer className="h-4 w-4" /> Countdown to Stopwatch
                </span>
              </SelectItem>
              <SelectItem value="split">
                <span className="flex items-center gap-2">
                  <Split className="h-4 w-4" /> Split Time Mode
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {mode === 'countdown' && (
            <div className="flex items-center gap-2">
              <Label htmlFor="countdown-input" className="text-sm">Start from:</Label>
              <Input
                id="countdown-input"
                value={countdownInput}
                onChange={(e) => handleCountdownInputChange(e.target.value)}
                placeholder="MM:SS or HH:MM:SS"
                className="w-28 text-center font-mono"
                disabled={isRunning}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Timer Display */}
      <div className={`text-center ${isFullscreen ? 'flex-1 flex items-center justify-center' : ''}`}>
        <div className={`font-mono font-bold tracking-wider transition-all duration-300 ${
          isFullscreen 
            ? 'text-[15vw] leading-none' 
            : 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
        } ${getTimerClasses()}`}>
          {formatTime(time)}
        </div>
        
        {mode === 'split' && lastLapTime > 0 && (
          <p className="text-muted-foreground mt-2">
            Current lap: {formatTime(time - lastLapTime)}
          </p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Button
          onClick={toggleRunning}
          size="lg"
          className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full text-lg ${
            isRunning 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-950' 
              : 'bg-green-500 hover:bg-green-600 text-green-950'
          }`}
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
        
        <Button
          onClick={addLap}
          size="lg"
          variant="outline"
          disabled={!isRunning && time === 0}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full"
          aria-label="Add lap"
        >
          <Flag className="h-6 w-6" />
        </Button>
        
        <Button
          onClick={reset}
          size="lg"
          variant="outline"
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full"
          aria-label="Reset"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          size="lg"
          variant="ghost"
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      {!isFullscreen && settings.keyboardShortcuts && (
        <p className="text-center text-xs text-muted-foreground">
          <Keyboard className="inline h-3 w-3 mr-1" />
          Space: Start/Pause | L: Lap | R: Reset
        </p>
      )}

      {/* Laps Section */}
      {!isFullscreen && laps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Laps ({laps.length})
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyLaps}>
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadLaps('txt')}>
                <Download className="h-4 w-4 mr-1" /> TXT
              </Button>
              <Button variant="ghost" size="sm" onClick={() => downloadLaps('csv')}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={clearLaps}>
                <Trash2 className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Lap</th>
                  <th className="px-4 py-2 text-left font-medium">Lap Time</th>
                  <th className="px-4 py-2 text-left font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((lap, index) => {
                  const lapNumber = laps.length - index;
                  const isBest = bestLap && lap.id === bestLap.id;
                  const isWorst = worstLap && lap.id === worstLap.id;
                  
                  return (
                    <tr 
                      key={lap.id}
                      className={`border-t border-border/50 ${
                        isBest ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                        isWorst ? 'bg-red-500/10 text-red-600 dark:text-red-400' : ''
                      }`}
                    >
                      <td className="px-4 py-2 font-mono">
                        {lapNumber}
                        {isBest && ' 🏆'}
                        {isWorst && ' 🐢'}
                      </td>
                      <td className="px-4 py-2 font-mono">{formatTime(lap.lapTime)}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">{formatTime(lap.totalTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {!isFullscreen && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="settings">
            <AccordionTrigger className="text-sm">
              Settings & Customization
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    Sound Effects
                  </Label>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard" className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Keyboard Shortcuts
                  </Label>
                  <Switch
                    id="keyboard"
                    checked={settings.keyboardShortcuts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, keyboardShortcuts: checked }))}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Theme</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['default', 'neon', 'minimal', 'retro'] as const).map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.theme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, theme }))}
                        className="capitalize"
                      >
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* FAQ Section with Schema */}
      {!isFullscreen && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What features does this stopwatch have?</AccordionTrigger>
              <AccordionContent>
                This advanced stopwatch includes millisecond precision timing, lap recording with 
                best/worst lap indicators, multiple modes (standard, countdown, split time), 
                keyboard shortcuts, sound notifications, fullscreen focus mode, theme customization, 
                and the ability to export laps as TXT or CSV files.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I use keyboard shortcuts?</AccordionTrigger>
              <AccordionContent>
                Press Space to start or pause the stopwatch, L to record a lap, and R to reset. 
                You can enable or disable keyboard shortcuts in the Settings section.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are my laps saved if I close the browser?</AccordionTrigger>
              <AccordionContent>
                Yes! Your laps are automatically saved to your browser's local storage. When you 
                return to the stopwatch, your previous laps will still be there. You can also 
                export them as TXT or CSV files for permanent backup.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What is Split Time Mode?</AccordionTrigger>
              <AccordionContent>
                Split Time Mode shows you the time since your last lap marker, which is useful 
                for tracking interval times. The lap time shows the duration of each segment, 
                while the total time shows the overall elapsed time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Does this stopwatch work offline?</AccordionTrigger>
              <AccordionContent>
                Yes! Once loaded, the stopwatch works entirely in your browser with no internet 
                connection required. All processing happens locally on your device.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What features does this stopwatch have?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This advanced stopwatch includes millisecond precision timing, lap recording, multiple modes, keyboard shortcuts, sound notifications, fullscreen focus mode, and export options."
                }
              },
              {
                "@type": "Question",
                "name": "Are my laps saved if I close the browser?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Your laps are automatically saved to local storage and persist across browser sessions."
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Use the Online Stopwatch",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Select a mode",
                "text": "Choose between Standard, Countdown, or Split Time mode"
              },
              {
                "@type": "HowToStep",
                "name": "Start the timer",
                "text": "Click the green play button or press Space to start"
              },
              {
                "@type": "HowToStep",
                "name": "Record laps",
                "text": "Click the flag button or press L to record lap times"
              },
              {
                "@type": "HowToStep",
                "name": "Export results",
                "text": "Copy laps or download as TXT/CSV file"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Stopwatch - AnyFile Flow",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any (Web-based)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free online stopwatch with millisecond precision, lap recording, multiple modes, keyboard shortcuts, and export options.",
            "featureList": [
              "Millisecond precision",
              "Lap recording",
              "Multiple modes",
              "Keyboard shortcuts",
              "Sound notifications",
              "Fullscreen mode",
              "Theme customization",
              "Export to TXT/CSV",
              "Offline support"
            ]
          })
        }}
      />
    </div>
  );
};

export default StopwatchTool;
