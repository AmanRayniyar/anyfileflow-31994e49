import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Trash2, 
  CheckCircle2, Circle, Settings, Timer, List, BarChart3,
  Sun, Moon, Palette, Bell, Keyboard, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface DailyStats {
  date: string;
  workSessions: number;
  shortBreaks: number;
  longBreaks: number;
  totalWorkMinutes: number;
  tasksCompleted: number;
}

interface Settings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
  autoSwitch: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: string;
  language: string;
}

type SessionType = 'work' | 'shortBreak' | 'longBreak';

// Translations
const translations: Record<string, Record<string, string>> = {
  en: {
    work: "Work",
    shortBreak: "Short Break",
    longBreak: "Long Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    settings: "Settings",
    tasks: "Tasks",
    stats: "Stats",
    addTask: "Add Task",
    workTime: "Work Time (min)",
    shortBreakTime: "Short Break (min)",
    longBreakTime: "Long Break (min)",
    sessionsBeforeLong: "Sessions before long break",
    autoSwitch: "Auto-switch sessions",
    sound: "Sound",
    notifications: "Notifications",
    theme: "Theme",
    language: "Language",
    cycles: "Cycles Today",
    completed: "Completed",
    totalWork: "Total Work",
    minutes: "min",
    tasksCompleted: "Tasks Done",
    keyboard: "Keyboard Shortcuts",
    spaceToToggle: "Space - Start/Pause",
    rToReset: "R - Reset Timer",
    sToSkip: "S - Skip to next session",
    noTasks: "No tasks yet. Add one above!",
    sessionComplete: "Session Complete!",
    timeForBreak: "Time for a break!",
    timeToWork: "Time to focus!",
    offline: "Offline mode available",
    default: "Default",
    forest: "Forest",
    ocean: "Ocean",
    sunset: "Sunset",
    midnight: "Midnight",
  },
  es: {
    work: "Trabajo",
    shortBreak: "Descanso Corto",
    longBreak: "Descanso Largo",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    settings: "Ajustes",
    tasks: "Tareas",
    stats: "Estadísticas",
    addTask: "Agregar Tarea",
    workTime: "Tiempo de Trabajo (min)",
    shortBreakTime: "Descanso Corto (min)",
    longBreakTime: "Descanso Largo (min)",
    sessionsBeforeLong: "Sesiones antes de descanso largo",
    autoSwitch: "Cambio automático",
    sound: "Sonido",
    notifications: "Notificaciones",
    theme: "Tema",
    language: "Idioma",
    cycles: "Ciclos Hoy",
    completed: "Completados",
    totalWork: "Trabajo Total",
    minutes: "min",
    tasksCompleted: "Tareas Hechas",
    keyboard: "Atajos de Teclado",
    spaceToToggle: "Espacio - Iniciar/Pausar",
    rToReset: "R - Reiniciar Temporizador",
    sToSkip: "S - Saltar a siguiente sesión",
    noTasks: "Sin tareas. ¡Agrega una arriba!",
    sessionComplete: "¡Sesión Completada!",
    timeForBreak: "¡Hora de descansar!",
    timeToWork: "¡Hora de enfocarse!",
    offline: "Modo sin conexión disponible",
    default: "Predeterminado",
    forest: "Bosque",
    ocean: "Océano",
    sunset: "Atardecer",
    midnight: "Medianoche",
  },
  fr: {
    work: "Travail",
    shortBreak: "Pause Courte",
    longBreak: "Pause Longue",
    start: "Démarrer",
    pause: "Pause",
    reset: "Réinitialiser",
    settings: "Paramètres",
    tasks: "Tâches",
    stats: "Statistiques",
    addTask: "Ajouter une Tâche",
    workTime: "Temps de Travail (min)",
    shortBreakTime: "Pause Courte (min)",
    longBreakTime: "Pause Longue (min)",
    sessionsBeforeLong: "Sessions avant pause longue",
    autoSwitch: "Changement automatique",
    sound: "Son",
    notifications: "Notifications",
    theme: "Thème",
    language: "Langue",
    cycles: "Cycles Aujourd'hui",
    completed: "Complétés",
    totalWork: "Travail Total",
    minutes: "min",
    tasksCompleted: "Tâches Terminées",
    keyboard: "Raccourcis Clavier",
    spaceToToggle: "Espace - Démarrer/Pause",
    rToReset: "R - Réinitialiser",
    sToSkip: "S - Passer à la session suivante",
    noTasks: "Pas de tâches. Ajoutez-en une!",
    sessionComplete: "Session Terminée!",
    timeForBreak: "C'est l'heure de la pause!",
    timeToWork: "C'est l'heure de se concentrer!",
    offline: "Mode hors ligne disponible",
    default: "Défaut",
    forest: "Forêt",
    ocean: "Océan",
    sunset: "Coucher de Soleil",
    midnight: "Minuit",
  },
  hi: {
    work: "काम",
    shortBreak: "छोटा ब्रेक",
    longBreak: "लंबा ब्रेक",
    start: "शुरू",
    pause: "रुकें",
    reset: "रीसेट",
    settings: "सेटिंग्स",
    tasks: "कार्य",
    stats: "आंकड़े",
    addTask: "कार्य जोड़ें",
    workTime: "काम का समय (मिनट)",
    shortBreakTime: "छोटा ब्रेक (मिनट)",
    longBreakTime: "लंबा ब्रेक (मिनट)",
    sessionsBeforeLong: "लंबे ब्रेक से पहले सत्र",
    autoSwitch: "स्वचालित बदलाव",
    sound: "ध्वनि",
    notifications: "सूचनाएं",
    theme: "थीम",
    language: "भाषा",
    cycles: "आज के चक्र",
    completed: "पूर्ण",
    totalWork: "कुल काम",
    minutes: "मिनट",
    tasksCompleted: "पूर्ण कार्य",
    keyboard: "कीबोर्ड शॉर्टकट",
    spaceToToggle: "स्पेस - शुरू/रुकें",
    rToReset: "R - रीसेट करें",
    sToSkip: "S - अगले सत्र पर जाएं",
    noTasks: "कोई कार्य नहीं। ऊपर एक जोड़ें!",
    sessionComplete: "सत्र पूर्ण!",
    timeForBreak: "ब्रेक का समय!",
    timeToWork: "फोकस करने का समय!",
    offline: "ऑफलाइन मोड उपलब्ध",
    default: "डिफ़ॉल्ट",
    forest: "जंगल",
    ocean: "समुद्र",
    sunset: "सूर्यास्त",
    midnight: "मध्यरात्रि",
  },
};

// Theme colors
const themes: Record<string, { work: string; shortBreak: string; longBreak: string; accent: string }> = {
  default: { work: "hsl(var(--primary))", shortBreak: "hsl(142, 76%, 36%)", longBreak: "hsl(217, 91%, 60%)", accent: "hsl(var(--primary))" },
  forest: { work: "hsl(142, 76%, 36%)", shortBreak: "hsl(150, 80%, 30%)", longBreak: "hsl(120, 60%, 25%)", accent: "hsl(142, 76%, 36%)" },
  ocean: { work: "hsl(200, 80%, 50%)", shortBreak: "hsl(180, 70%, 45%)", longBreak: "hsl(220, 70%, 55%)", accent: "hsl(200, 80%, 50%)" },
  sunset: { work: "hsl(25, 95%, 53%)", shortBreak: "hsl(340, 80%, 55%)", longBreak: "hsl(280, 60%, 50%)", accent: "hsl(25, 95%, 53%)" },
  midnight: { work: "hsl(260, 60%, 50%)", shortBreak: "hsl(230, 50%, 45%)", longBreak: "hsl(200, 60%, 40%)", accent: "hsl(260, 60%, 50%)" },
};

// Default settings
const defaultSettings: Settings = {
  workTime: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
  autoSwitch: true,
  soundEnabled: true,
  notificationsEnabled: false,
  theme: 'default',
  language: 'en',
};

const PomodoroTimerTool: React.FC = () => {
  // Load settings from localStorage
  const loadSettings = (): Settings => {
    try {
      const saved = localStorage.getItem('pomodoro-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  };

  // Load tasks from localStorage
  const loadTasks = (): Task[] => {
    try {
      const saved = localStorage.getItem('pomodoro-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Load stats from localStorage
  const loadStats = (): DailyStats => {
    try {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('pomodoro-stats');
      const stats = saved ? JSON.parse(saved) : null;
      if (stats && stats.date === today) {
        return stats;
      }
      return { date: today, workSessions: 0, shortBreaks: 0, longBreaks: 0, totalWorkMinutes: 0, tasksCompleted: 0 };
    } catch {
      return { date: new Date().toDateString(), workSessions: 0, shortBreaks: 0, longBreaks: 0, totalWorkMinutes: 0, tasksCompleted: 0 };
    }
  };

  // State
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [stats, setStats] = useState<DailyStats>(loadStats);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [newTaskText, setNewTaskText] = useState('');
  const [activeTab, setActiveTab] = useState('timer');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[settings.language] || translations.en;
  const currentTheme = themes[settings.theme] || themes.default;

  // Get session duration
  const getSessionDuration = useCallback((type: SessionType): number => {
    switch (type) {
      case 'work': return settings.workTime * 60;
      case 'shortBreak': return settings.shortBreak * 60;
      case 'longBreak': return settings.longBreak * 60;
    }
  }, [settings]);

  // Get current color based on session type
  const getCurrentColor = useCallback((): string => {
    switch (sessionType) {
      case 'work': return currentTheme.work;
      case 'shortBreak': return currentTheme.shortBreak;
      case 'longBreak': return currentTheme.longBreak;
    }
  }, [sessionType, currentTheme]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
  }, [stats]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  // Play alarm sound
  const playAlarm = useCallback(() => {
    if (!settings.soundEnabled) return;
    
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Play 3 beeps
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 800;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 600);
      
      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.value = 1000;
        osc3.type = 'sine';
        gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        osc3.start();
        osc3.stop(audioContext.currentTime + 0.8);
      }, 1200);
    } catch (error) {
      console.log('Audio not available');
    }
  }, [settings.soundEnabled]);

  // Show notification
  const showNotification = useCallback((title: string, body: string) => {
    if (!settings.notificationsEnabled) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, [settings.notificationsEnabled]);

  // Handle session complete
  const handleSessionComplete = useCallback(() => {
    playAlarm();
    setIsRunning(false);
    
    if (sessionType === 'work') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      setStats(prev => ({
        ...prev,
        workSessions: prev.workSessions + 1,
        totalWorkMinutes: prev.totalWorkMinutes + settings.workTime,
      }));
      
      showNotification(t.sessionComplete, t.timeForBreak);
      toast({ title: t.sessionComplete, description: t.timeForBreak });
      
      if (settings.autoSwitch) {
        const isLongBreak = newCompleted % settings.sessionsBeforeLongBreak === 0;
        const nextType = isLongBreak ? 'longBreak' : 'shortBreak';
        setSessionType(nextType);
        setTimeLeft(getSessionDuration(nextType));
      }
    } else {
      setStats(prev => ({
        ...prev,
        [sessionType === 'shortBreak' ? 'shortBreaks' : 'longBreaks']: 
          prev[sessionType === 'shortBreak' ? 'shortBreaks' : 'longBreaks'] + 1,
      }));
      
      showNotification(t.sessionComplete, t.timeToWork);
      toast({ title: t.sessionComplete, description: t.timeToWork });
      
      if (settings.autoSwitch) {
        setSessionType('work');
        setTimeLeft(getSessionDuration('work'));
      }
    }
  }, [sessionType, completedSessions, settings, playAlarm, showNotification, getSessionDuration, t]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleSessionComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsRunning(prev => !prev);
          break;
        case 'r':
          handleReset();
          break;
        case 's':
          handleSkip();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle start/pause
  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  // Handle reset
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getSessionDuration(sessionType));
  };

  // Handle skip to next session
  const handleSkip = () => {
    setIsRunning(false);
    let nextType: SessionType;
    if (sessionType === 'work') {
      const isLongBreak = (completedSessions + 1) % settings.sessionsBeforeLongBreak === 0;
      nextType = isLongBreak ? 'longBreak' : 'shortBreak';
    } else {
      nextType = 'work';
    }
    setSessionType(nextType);
    setTimeLeft(getSessionDuration(nextType));
  };

  // Handle session type change
  const handleSessionTypeChange = (type: SessionType) => {
    setIsRunning(false);
    setSessionType(type);
    setTimeLeft(getSessionDuration(type));
  };

  // Handle add task
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  // Handle toggle task
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!task.completed) {
          setStats(s => ({ ...s, tasksCompleted: s.tasksCompleted + 1 }));
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  // Handle delete task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = 1 - (timeLeft / getSessionDuration(sessionType));
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="space-y-6">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-600 dark:text-yellow-400">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">{t.offline}</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timer" className="gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">{t.work}</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tasks}</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">{t.stats}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings}</span>
          </TabsTrigger>
        </TabsList>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6 mt-6">
          {/* Session Type Buttons */}
          <div className="flex justify-center gap-2 sm:gap-4">
            {(['work', 'shortBreak', 'longBreak'] as SessionType[]).map(type => (
              <Button
                key={type}
                variant={sessionType === type ? 'default' : 'outline'}
                onClick={() => handleSessionTypeChange(type)}
                className={cn(
                  "text-xs sm:text-sm px-3 sm:px-6",
                  sessionType === type && "shadow-lg"
                )}
                style={sessionType === type ? { backgroundColor: getCurrentColor() } : undefined}
              >
                {t[type]}
              </Button>
            ))}
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke={getCurrentColor()}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl font-mono font-bold text-foreground">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {t[sessionType]}
                </span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-12 w-12"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleToggle}
              className="h-14 w-32 text-lg font-semibold"
              style={{ backgroundColor: getCurrentColor() }}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  {t.pause}
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  {t.start}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className="h-12 w-12"
            >
              {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>

          {/* Cycle Counter */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">{t.cycles}:</span>
              <div className="flex gap-1">
                {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      i < (completedSessions % settings.sessionsBeforeLongBreak || (completedSessions > 0 ? settings.sessionsBeforeLongBreak : 0))
                        ? "bg-primary"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground">{completedSessions}</span>
            </div>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="h-5 w-5" />
                {t.tasks}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Task */}
              <div className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder={t.addTask}
                  className="flex-1"
                />
                <Button onClick={handleAddTask} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Task List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {tasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t.noTasks}</p>
                ) : (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        task.completed ? "bg-muted/50 opacity-60" : "bg-card"
                      )}
                    >
                      <button onClick={() => handleToggleTask(task.id)}>
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <span className={cn("flex-1", task.completed && "line-through")}>
                        {task.text}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t.stats} - {new Date().toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <div className="text-3xl font-bold text-primary">{stats.workSessions}</div>
                  <div className="text-sm text-muted-foreground">{t.work}</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-green-500">{stats.totalWorkMinutes}</div>
                  <div className="text-sm text-muted-foreground">{t.totalWork} ({t.minutes})</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-blue-500">{stats.shortBreaks + stats.longBreaks}</div>
                  <div className="text-sm text-muted-foreground">{t.shortBreak}</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-purple-500">{stats.tasksCompleted}</div>
                  <div className="text-sm text-muted-foreground">{t.tasksCompleted}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t.workTime}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={settings.workTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 25;
                      setSettings(s => ({ ...s, workTime: val }));
                      if (sessionType === 'work' && !isRunning) {
                        setTimeLeft(val * 60);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.shortBreakTime}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={settings.shortBreak}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 5;
                      setSettings(s => ({ ...s, shortBreak: val }));
                      if (sessionType === 'shortBreak' && !isRunning) {
                        setTimeLeft(val * 60);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.longBreakTime}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={settings.longBreak}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 15;
                      setSettings(s => ({ ...s, longBreak: val }));
                      if (sessionType === 'longBreak' && !isRunning) {
                        setTimeLeft(val * 60);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.sessionsBeforeLong}</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.sessionsBeforeLongBreak}
                  onChange={(e) => setSettings(s => ({ ...s, sessionsBeforeLongBreak: parseInt(e.target.value) || 4 }))}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    {t.autoSwitch}
                  </Label>
                  <Switch
                    checked={settings.autoSwitch}
                    onCheckedChange={(checked) => setSettings(s => ({ ...s, autoSwitch: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    {t.sound}
                  </Label>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings(s => ({ ...s, soundEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {t.notifications}
                  </Label>
                  <Switch
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => {
                      if (checked && 'Notification' in window && Notification.permission === 'default') {
                        Notification.requestPermission().then(perm => {
                          setSettings(s => ({ ...s, notificationsEnabled: perm === 'granted' }));
                        });
                      } else {
                        setSettings(s => ({ ...s, notificationsEnabled: checked }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  {t.theme}
                </Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings(s => ({ ...s, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(themes).map(theme => (
                      <SelectItem key={theme} value={theme}>
                        {t[theme] || theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label>{t.language}</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings(s => ({ ...s, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                {t.keyboard}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.spaceToToggle}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.rToReset}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.sToSkip}</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">S</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <Accordion type="single" collapsible className="mt-8">
        <AccordionItem value="what-is">
          <AccordionTrigger>What is the Pomodoro Technique?</AccordionTrigger>
          <AccordionContent>
            The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a "pomodoro."
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="how-works">
          <AccordionTrigger>How does this timer work?</AccordionTrigger>
          <AccordionContent>
            Set your work duration (default 25 min), short break (5 min), and long break (15 min). Start the timer and focus on your task. After 4 work sessions, you get a long break. The timer can auto-switch between sessions and plays an alarm when each session ends.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="offline">
          <AccordionTrigger>Does it work offline?</AccordionTrigger>
          <AccordionContent>
            Yes! All your settings, tasks, and statistics are saved locally in your browser. The timer works completely offline once the page is loaded.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="notifications">
          <AccordionTrigger>How do I enable notifications?</AccordionTrigger>
          <AccordionContent>
            Go to Settings tab and toggle on "Notifications". Your browser will ask for permission. Once enabled, you'll receive a notification when each session ends, even if you're in another tab.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PomodoroTimerTool;
