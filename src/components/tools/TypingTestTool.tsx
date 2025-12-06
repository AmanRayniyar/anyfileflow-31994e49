import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  RotateCcw, 
  Clock, 
  Target, 
  Keyboard, 
  Zap,
  CheckCircle,
  XCircle,
  Trophy
} from "lucide-react";
import { Tool } from "@/data/tools";

interface TypingTestToolProps {
  tool: Tool;
}

const passages = {
  beginner: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "A simple day at the park can be very relaxing. Birds sing and children play happily.",
    "Learning to type fast takes practice. Start slow and build your speed over time.",
    "The sun rises in the east and sets in the west. Nature follows its own rhythm.",
    "Good food and good friends make life wonderful. Sharing meals brings people together.",
  ],
  intermediate: [
    "Technology continues to evolve at an unprecedented pace, transforming how we live, work, and communicate with each other across the globe.",
    "The importance of continuous learning cannot be overstated in today's rapidly changing world. Those who adapt thrive in new environments.",
    "Climate change represents one of the most significant challenges facing humanity, requiring collective action and innovative solutions.",
    "Effective communication skills are essential for success in both personal and professional relationships, enabling better understanding.",
    "The digital age has revolutionized the way we access and share information, making knowledge more accessible than ever before.",
  ],
  advanced: [
    "Quantum computing represents a paradigm shift in computational capabilities, leveraging quantum mechanical phenomena such as superposition and entanglement to process information in ways that classical computers fundamentally cannot achieve.",
    "The philosophical implications of artificial intelligence raise profound questions about consciousness, free will, and the nature of human cognition, challenging our understanding of what it means to be truly intelligent.",
    "Biodiversity conservation requires a multifaceted approach that addresses habitat destruction, climate change, pollution, and overexploitation while balancing economic development with environmental sustainability.",
    "Neuroscience research has revealed the remarkable plasticity of the human brain, demonstrating its ability to reorganize neural pathways, create new connections, and adapt to changing circumstances throughout life.",
    "The intersection of biotechnology and ethical considerations presents complex dilemmas regarding genetic modification, synthetic biology, and the boundaries of human intervention in natural biological processes.",
  ],
};

const timeOptions = [15, 30, 60, 120];

const TypingTestTool = ({ tool }: TypingTestToolProps) => {
  const [selectedTime, setSelectedTime] = useState(60);
  const [customTime, setCustomTime] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [currentPassage, setCurrentPassage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  
  // Stats
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [wrongChars, setWrongChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random passage
  const generatePassage = useCallback(() => {
    const passageList = passages[difficulty];
    const randomIndex = Math.floor(Math.random() * passageList.length);
    setCurrentPassage(passageList[randomIndex]);
  }, [difficulty]);

  // Initialize passage
  useEffect(() => {
    generatePassage();
  }, [generatePassage]);

  // Calculate stats in real-time
  const calculateStats = useCallback(() => {
    if (!startTime || userInput.length === 0) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    
    let correct = 0;
    let wrong = 0;
    
    for (let i = 0; i < userInput.length; i++) {
      if (i < currentPassage.length && userInput[i] === currentPassage[i]) {
        correct++;
      } else {
        wrong++;
      }
    }
    
    setCorrectChars(correct);
    setWrongChars(wrong);
    
    // WPM: (correct characters / 5) / time in minutes
    const wordsTyped = correct / 5;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);
    
    // CPM: correct characters per minute
    const currentCpm = timeElapsed > 0 ? Math.round(correct / timeElapsed) : 0;
    setCpm(currentCpm);
    
    // Accuracy
    const totalTyped = userInput.length;
    const currentAccuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;
    setAccuracy(currentAccuracy);
  }, [userInput, currentPassage, startTime]);

  // Update stats when input changes
  useEffect(() => {
    if (isRunning) {
      calculateStats();
    }
  }, [userInput, isRunning, calculateStats]);

  // Timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Check if user completed the passage
  useEffect(() => {
    if (userInput.length >= currentPassage.length && currentPassage.length > 0) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [userInput, currentPassage]);

  const startTest = () => {
    const time = customTime ? parseInt(customTime) : selectedTime;
    if (time < 5 || time > 300) {
      return;
    }
    
    generatePassage();
    setUserInput("");
    setTimeLeft(time);
    setIsRunning(true);
    setIsFinished(false);
    setStartTime(Date.now());
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setWrongChars(0);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const resetTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsFinished(false);
    setUserInput("");
    setTimeLeft(customTime ? parseInt(customTime) : selectedTime);
    setStartTime(null);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setWrongChars(0);
    generatePassage();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRunning) return;
    setUserInput(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderPassage = () => {
    return currentPassage.split("").map((char, index) => {
      let className = "text-muted-foreground";
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = "text-green-500 dark:text-green-400";
        } else {
          className = "text-red-500 dark:text-red-400 underline decoration-2";
        }
      } else if (index === userInput.length) {
        className = "bg-primary text-primary-foreground animate-pulse";
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const getTimeProgress = () => {
    const totalTime = customTime ? parseInt(customTime) : selectedTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Settings Section */}
      {!isRunning && !isFinished && (
        <div className="space-y-4">
          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Time Limit</label>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time && !customTime ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTime(time);
                    setCustomTime("");
                    setTimeLeft(time);
                  }}
                >
                  {time}s
                </Button>
              ))}
              <input
                type="number"
                placeholder="Custom (5-300)"
                className="w-32 px-3 py-1 text-sm border rounded-md bg-background"
                value={customTime}
                onChange={(e) => {
                  setCustomTime(e.target.value);
                  if (e.target.value) {
                    setTimeLeft(parseInt(e.target.value) || 60);
                  }
                }}
                min={5}
                max={300}
              />
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <div className="flex gap-2">
              {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                <Button
                  key={level}
                  variant={difficulty === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setDifficulty(level);
                    generatePassage();
                  }}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={startTest} className="w-full" size="lg">
            <Play className="h-5 w-5 mr-2" />
            Start Typing Test
          </Button>
        </div>
      )}

      {/* Live Stats */}
      {(isRunning || isFinished) && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Clock className="h-3 w-3" />
              Time
            </div>
            <div className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Zap className="h-3 w-3" />
              WPM
            </div>
            <div className="text-2xl font-bold text-green-500">{wpm}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Keyboard className="h-3 w-3" />
              CPM
            </div>
            <div className="text-2xl font-bold text-blue-500">{cpm}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Target className="h-3 w-3" />
              Accuracy
            </div>
            <div className="text-2xl font-bold text-yellow-500">{accuracy}%</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center col-span-2 md:col-span-1">
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-3 w-3" />
                {correctChars}
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="h-3 w-3" />
                {wrongChars}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Correct / Wrong</div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isRunning && (
        <Progress value={getTimeProgress()} className="h-2" />
      )}

      {/* Passage Display */}
      {(isRunning || isFinished) && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div 
            className="font-mono text-lg leading-relaxed select-none"
            onClick={() => inputRef.current?.focus()}
          >
            {renderPassage()}
          </div>
        </div>
      )}

      {/* Hidden Input */}
      {isRunning && (
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="opacity-0 absolute -z-10"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      )}

      {/* Visual Input Display */}
      {isRunning && (
        <div 
          className="bg-secondary/30 border border-border rounded-lg p-4 min-h-[60px] cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="text-sm text-muted-foreground mb-2">Type here (click to focus):</p>
          <p className="font-mono text-lg">{userInput}<span className="animate-pulse">|</span></p>
        </div>
      )}

      {/* Results Section */}
      {isFinished && (
        <div className="bg-gradient-to-br from-primary/10 to-secondary/30 border border-primary/20 rounded-xl p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Test Complete!</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-3xl font-bold text-primary">{wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-500">{cpm}</div>
              <div className="text-sm text-muted-foreground">CPM</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">{correctChars}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
          </div>
          <Button onClick={resetTest} className="mt-6" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Reset Button During Test */}
      {isRunning && (
        <Button onClick={resetTest} variant="outline" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Test
        </Button>
      )}
    </div>
  );
};

export default TypingTestTool;
