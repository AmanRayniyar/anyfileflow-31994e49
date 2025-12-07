import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, RotateCcw, Plus, Trash2, Maximize2, Minimize2,
  Volume2, VolumeX, Download, Copy, Keyboard, Bell, Clock,
  Settings, X, Save, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Timer {
  id: string;
  name: string;
  duration: number; // in milliseconds
  remaining: number;
  isRunning: boolean;
  startTime: number | null;
}

interface TimerPreset {
  id: string;
  name: string;
  duration: number;
}

interface TimerHistoryItem {
  id: string;
  name: string;
  duration: number;
  completedAt: Date;
}

interface TimerSettings {
  soundEnabled: boolean;
  alarmTone: 'beep' | 'bell' | 'chime' | 'alarm';
  keyboardShortcuts: boolean;
  notificationsEnabled: boolean;
}

const STORAGE_PRESETS_KEY = 'anyfileflow-timer-presets';
const STORAGE_HISTORY_KEY = 'anyfileflow-timer-history';
const STORAGE_SETTINGS_KEY = 'anyfileflow-timer-settings';

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: '1min', name: '1 Minute', duration: 60000 },
  { id: '5min', name: '5 Minutes', duration: 300000 },
  { id: '10min', name: '10 Minutes', duration: 600000 },
  { id: '25min', name: '25 Minutes', duration: 1500000 },
  { id: '30min', name: '30 Minutes', duration: 1800000 },
  { id: '1hour', name: '1 Hour', duration: 3600000 },
];

const CountdownTimerTool: React.FC = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [presets, setPresets] = useState<TimerPreset[]>(DEFAULT_PRESETS);
  const [history, setHistory] = useState<TimerHistoryItem[]>([]);
  const [settings, setSettings] = useState<TimerSettings>({
    soundEnabled: true,
    alarmTone: 'beep',
    keyboardShortcuts: true,
    notificationsEnabled: true,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newTimerInput, setNewTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [newPresetName, setNewPresetName] = useState('');
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load data from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem(STORAGE_PRESETS_KEY);
    const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
    const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
    
    if (savedPresets) {
      try {
        const parsed = JSON.parse(savedPresets);
        setPresets([...DEFAULT_PRESETS, ...parsed.filter((p: TimerPreset) => !DEFAULT_PRESETS.find(d => d.id === p.id))]);
      } catch (e) {}
    }
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((h: any) => ({ ...h, completedAt: new Date(h.completedAt) })));
      } catch (e) {}
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    const customPresets = presets.filter(p => !DEFAULT_PRESETS.find(d => d.id === p.id));
    localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(customPresets));
  }, [presets]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }, [history]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Play alarm sound
  const playAlarm = useCallback((tone: string) => {
    if (!settings.soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      
      const frequencies: Record<string, number[]> = {
        beep: [800, 600, 800],
        bell: [523, 659, 784],
        chime: [440, 554, 659, 880],
        alarm: [880, 440, 880, 440],
      };
      
      const freqs = frequencies[tone] || frequencies.beep;
      
      freqs.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = tone === 'bell' ? 'sine' : tone === 'chime' ? 'triangle' : 'square';
        
        gainNode.gain.setValueAtTime(0.3, now + i * 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.15);
        
        oscillator.start(now + i * 0.2);
        oscillator.stop(now + i * 0.2 + 0.2);
      });
    } catch (e) {
      console.error('Audio not supported:', e);
    }
  }, [settings.soundEnabled]);

  // Send browser notification
  const sendNotification = useCallback((timerName: string) => {
    if (!settings.notificationsEnabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: `${timerName} has finished.`,
        icon: '/favicon.ico',
      });
    }
  }, [settings.notificationsEnabled]);

  // Timer tick logic
  const startTimer = useCallback((timerId: string) => {
    setTimers(prev => prev.map(timer => {
      if (timer.id === timerId) {
        return { ...timer, isRunning: true, startTime: Date.now() };
      }
      return timer;
    }));

    const interval = setInterval(() => {
      setTimers(prev => {
        const timer = prev.find(t => t.id === timerId);
        if (!timer || !timer.isRunning || !timer.startTime) return prev;
        
        const elapsed = Date.now() - timer.startTime;
        const newRemaining = Math.max(0, timer.remaining - elapsed);
        
        if (newRemaining === 0) {
          clearInterval(interval);
          intervalsRef.current.delete(timerId);
          playAlarm(settings.alarmTone);
          sendNotification(timer.name);
          
          // Add to history
          setHistory(h => [{
            id: Date.now().toString(),
            name: timer.name,
            duration: timer.duration,
            completedAt: new Date(),
          }, ...h]);
          
          toast.success(`${timer.name} complete!`);
          
          return prev.map(t => 
            t.id === timerId 
              ? { ...t, remaining: 0, isRunning: false, startTime: null }
              : t
          );
        }
        
        return prev.map(t => 
          t.id === timerId 
            ? { ...t, remaining: newRemaining, startTime: Date.now() }
            : t
        );
      });
    }, 100);

    intervalsRef.current.set(timerId, interval);
  }, [playAlarm, sendNotification, settings.alarmTone]);

  const pauseTimer = useCallback((timerId: string) => {
    const interval = intervalsRef.current.get(timerId);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(timerId);
    }
    
    setTimers(prev => prev.map(timer => {
      if (timer.id === timerId) {
        return { ...timer, isRunning: false, startTime: null };
      }
      return timer;
    }));
  }, []);

  const resetTimer = useCallback((timerId: string) => {
    pauseTimer(timerId);
    setTimers(prev => prev.map(timer => {
      if (timer.id === timerId) {
        return { ...timer, remaining: timer.duration };
      }
      return timer;
    }));
  }, [pauseTimer]);

  const removeTimer = useCallback((timerId: string) => {
    pauseTimer(timerId);
    setTimers(prev => prev.filter(t => t.id !== timerId));
    if (activeTimerId === timerId) {
      setActiveTimerId(null);
    }
  }, [pauseTimer, activeTimerId]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!settings.keyboardShortcuts || !activeTimerId) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const timer = timers.find(t => t.id === activeTimerId);
      if (!timer) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (timer.isRunning) {
            pauseTimer(activeTimerId);
          } else if (timer.remaining > 0) {
            startTimer(activeTimerId);
          }
          break;
        case 'KeyR':
          e.preventDefault();
          resetTimer(activeTimerId);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardShortcuts, activeTimerId, timers, startTimer, pauseTimer, resetTimer]);

  const addTimer = (duration: number, name: string) => {
    if (timers.length >= 5) {
      toast.error('Maximum 5 timers allowed');
      return;
    }
    
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration,
      remaining: duration,
      isRunning: false,
      startTime: null,
    };
    
    setTimers(prev => [...prev, newTimer]);
    setActiveTimerId(newTimer.id);
  };

  const addCustomTimer = () => {
    const duration = (newTimerInput.hours * 3600 + newTimerInput.minutes * 60 + newTimerInput.seconds) * 1000;
    if (duration <= 0) {
      toast.error('Please set a valid time');
      return;
    }
    addTimer(duration, `Timer ${timers.length + 1}`);
  };

  const addPreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }
    
    const duration = (newTimerInput.hours * 3600 + newTimerInput.minutes * 60 + newTimerInput.seconds) * 1000;
    if (duration <= 0) {
      toast.error('Please set a valid time');
      return;
    }
    
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name: newPresetName.trim(),
      duration,
    };
    
    setPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    toast.success('Preset saved!');
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
    toast.success('Preset deleted');
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const exportSettings = () => {
    const data = {
      presets: presets.filter(p => !DEFAULT_PRESETS.find(d => d.id === p.id)),
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timer-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported!');
  };

  const copySettings = () => {
    const data = {
      presets: presets.filter(p => !DEFAULT_PRESETS.find(d => d.id === p.id)),
      settings,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Settings copied to clipboard!');
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success('History cleared');
  };

  const activeTimer = timers.find(t => t.id === activeTimerId);

  // Fullscreen mode
  if (isFullscreen && activeTimer) {
    const progress = ((activeTimer.duration - activeTimer.remaining) / activeTimer.duration) * 100;
    
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8"
      >
        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-medium text-muted-foreground mb-8">{activeTimer.name}</h2>
        
        <div className="relative w-80 h-80 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-secondary"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="text-primary transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-mono font-bold text-foreground">
              {formatTime(activeTimer.remaining)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={() => activeTimer.isRunning ? pauseTimer(activeTimer.id) : startTimer(activeTimer.id)}
            size="lg"
            className={`h-16 w-16 rounded-full ${
              activeTimer.isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {activeTimer.isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
          <Button
            onClick={() => resetTimer(activeTimer.id)}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
        
        {settings.keyboardShortcuts && (
          <p className="mt-8 text-sm text-muted-foreground">
            <Keyboard className="inline h-4 w-4 mr-1" />
            Space: Start/Pause | R: Reset
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Add Timer Section */}
      <div className="p-6 bg-secondary/30 rounded-xl space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" /> Set Timer
        </h3>
        
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Hours</Label>
              <Input
                type="number"
                min="0"
                max="23"
                value={newTimerInput.hours}
                onChange={(e) => setNewTimerInput(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                className="w-16 text-center font-mono"
              />
            </div>
            <span className="text-2xl font-bold mt-5">:</span>
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Minutes</Label>
              <Input
                type="number"
                min="0"
                max="59"
                value={newTimerInput.minutes}
                onChange={(e) => setNewTimerInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                className="w-16 text-center font-mono"
              />
            </div>
            <span className="text-2xl font-bold mt-5">:</span>
            <div className="text-center">
              <Label className="text-xs text-muted-foreground">Seconds</Label>
              <Input
                type="number"
                min="0"
                max="59"
                value={newTimerInput.seconds}
                onChange={(e) => setNewTimerInput(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                className="w-16 text-center font-mono"
              />
            </div>
          </div>
          
          <Button onClick={addCustomTimer} className="gap-2">
            <Plus className="h-4 w-4" /> Add Timer
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <div key={preset.id} className="relative group">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addTimer(preset.duration, preset.name)}
              >
                {preset.name}
              </Button>
              {!DEFAULT_PRESETS.find(d => d.id === preset.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePreset(preset.id);
                  }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Save as Preset */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Input
            placeholder="Preset name"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="max-w-[200px]"
          />
          <Button variant="outline" size="sm" onClick={addPreset}>
            <Save className="h-4 w-4 mr-1" /> Save Preset
          </Button>
        </div>
      </div>

      {/* Active Timers */}
      {timers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Active Timers ({timers.length}/5)</h3>
            {activeTimer && (
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="h-4 w-4 mr-1" /> Fullscreen
              </Button>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timers.map((timer) => {
              const progress = ((timer.duration - timer.remaining) / timer.duration) * 100;
              const isActive = timer.id === activeTimerId;
              
              return (
                <div
                  key={timer.id}
                  onClick={() => setActiveTimerId(timer.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-foreground">{timer.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTimer(timer.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-4xl font-mono font-bold text-center mb-3 text-foreground">
                    {formatTime(timer.remaining)}
                  </div>
                  
                  <Progress value={progress} className="h-2 mb-3" />
                  
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (timer.isRunning) {
                          pauseTimer(timer.id);
                        } else if (timer.remaining > 0) {
                          startTimer(timer.id);
                        }
                      }}
                      disabled={timer.remaining === 0}
                      className={timer.isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
                    >
                      {timer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetTimer(timer.id);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {settings.keyboardShortcuts && activeTimerId && (
        <p className="text-center text-xs text-muted-foreground">
          <Keyboard className="inline h-3 w-3 mr-1" />
          Space: Start/Pause | R: Reset (for selected timer)
        </p>
      )}

      {/* Settings */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="settings">
          <AccordionTrigger className="text-sm">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </span>
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
              
              <div className="flex items-center gap-2">
                <Label>Alarm Tone</Label>
                <Select
                  value={settings.alarmTone}
                  onValueChange={(value: any) => setSettings(prev => ({ ...prev, alarmTone: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beep">Beep</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="alarm">Alarm</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAlarm(settings.alarmTone)}
                >
                  Test
                </Button>
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
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Browser Notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notificationsEnabled: checked }))}
                />
              </div>
              
              <div className="sm:col-span-2 flex gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={copySettings}>
                  <Copy className="h-4 w-4 mr-1" /> Copy Settings
                </Button>
                <Button variant="outline" size="sm" onClick={exportSettings}>
                  <Download className="h-4 w-4 mr-1" /> Export JSON
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Timer History */}
        <AccordionItem value="history">
          <AccordionTrigger className="text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Timer History ({history.length})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {history.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <Trash2 className="h-4 w-4 mr-1" /> Clear History
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(item.duration)} • {item.completedAt.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addTimer(item.duration, item.name)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No timer history yet. Complete a timer to see it here.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>How many timers can I run at once?</AccordionTrigger>
            <AccordionContent>
              You can run up to 5 timers simultaneously. Each timer operates independently 
              with its own controls. Click on a timer to select it for keyboard shortcuts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Are my presets saved?</AccordionTrigger>
            <AccordionContent>
              Yes! Custom presets are automatically saved to your browser's local storage. 
              They'll be available even after you close the browser. You can also export 
              your settings as a JSON file for backup.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>How do browser notifications work?</AccordionTrigger>
            <AccordionContent>
              When enabled, you'll receive a browser notification when any timer completes. 
              You'll need to grant notification permission when prompted. This works even 
              if you're in another tab or the browser is minimized.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>What keyboard shortcuts are available?</AccordionTrigger>
            <AccordionContent>
              Press Space to start or pause the selected timer, and R to reset it. 
              Click on a timer to select it first. You can disable keyboard shortcuts 
              in the Settings section.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5">
            <AccordionTrigger>Does this timer work offline?</AccordionTrigger>
            <AccordionContent>
              Yes! Once the page is loaded, the timer works entirely in your browser 
              without needing an internet connection. Your presets and history are 
              stored locally on your device.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

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
                "name": "How many timers can I run at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can run up to 5 timers simultaneously. Each timer operates independently with its own controls."
                }
              },
              {
                "@type": "Question",
                "name": "Are my presets saved?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Custom presets are automatically saved to local storage and persist across browser sessions."
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
            "name": "How to Use the Countdown Timer",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Set the time",
                "text": "Enter hours, minutes, and seconds or select a preset"
              },
              {
                "@type": "HowToStep",
                "name": "Add the timer",
                "text": "Click 'Add Timer' to create a new countdown"
              },
              {
                "@type": "HowToStep",
                "name": "Start the countdown",
                "text": "Click the play button or press Space to start"
              },
              {
                "@type": "HowToStep",
                "name": "Get notified",
                "text": "Receive sound and browser notifications when complete"
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
            "name": "Countdown Timer - AnyFile Flow",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any (Web-based)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free online countdown timer with multiple simultaneous timers, custom presets, alarm sounds, browser notifications, and fullscreen mode.",
            "featureList": [
              "Multiple simultaneous timers",
              "Custom time presets",
              "Alarm sound options",
              "Browser notifications",
              "Fullscreen focus mode",
              "Keyboard shortcuts",
              "Timer history",
              "Export settings",
              "Offline support"
            ]
          })
        }}
      />
    </div>
  );
};

export default CountdownTimerTool;
