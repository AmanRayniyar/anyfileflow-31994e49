import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, Baby, Clock, Download, Printer, RotateCcw, Shield, Globe, CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MilestoneData {
  week: number;
  title: string;
  description: string;
  trimester: number;
}

const milestones: MilestoneData[] = [
  { week: 4, title: "Implantation Complete", description: "Embryo implants in uterine wall", trimester: 1 },
  { week: 5, title: "Heart Begins Forming", description: "Tiny heart starts to develop", trimester: 1 },
  { week: 8, title: "Embryo Becomes Fetus", description: "Major organs are forming", trimester: 1 },
  { week: 10, title: "Fingers & Toes Form", description: "Limbs are developing", trimester: 1 },
  { week: 12, title: "First Trimester Ends", description: "Risk of miscarriage decreases", trimester: 1 },
  { week: 14, title: "Second Trimester Begins", description: "Baby can make facial expressions", trimester: 2 },
  { week: 16, title: "Baby Can Hear", description: "Hearing is developing", trimester: 2 },
  { week: 18, title: "Movement Felt", description: "You may feel baby move (quickening)", trimester: 2 },
  { week: 20, title: "Anatomy Scan", description: "Detailed ultrasound often done", trimester: 2 },
  { week: 24, title: "Viability Milestone", description: "Baby could survive outside womb with care", trimester: 2 },
  { week: 27, title: "Third Trimester Begins", description: "Baby opens eyes", trimester: 3 },
  { week: 28, title: "Brain Developing Rapidly", description: "Rapid brain development", trimester: 3 },
  { week: 32, title: "Lungs Maturing", description: "Lungs are almost fully developed", trimester: 3 },
  { week: 36, title: "Baby Drops", description: "Baby moves lower into pelvis", trimester: 3 },
  { week: 37, title: "Full Term", description: "Considered early full term", trimester: 3 },
  { week: 40, title: "Due Date", description: "Estimated delivery date", trimester: 3 },
];

const PregnancyDueDateTool = () => {
  // State for calculation method
  const [method, setMethod] = useState<"lmp" | "conception" | "ivf">("lmp");
  
  // LMP method states
  const [lmpDate, setLmpDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [irregularCycle, setIrregularCycle] = useState<boolean>(false);
  
  // Conception/IVF method states
  const [conceptionDate, setConceptionDate] = useState<string>("");
  const [ivfDate, setIvfDate] = useState<string>("");
  const [embryoAge, setEmbryoAge] = useState<"3" | "5">("5");
  
  // Results
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [gestationalAge, setGestationalAge] = useState<{ weeks: number; days: number } | null>(null);
  const [trimester, setTrimester] = useState<number>(0);
  const [conceptionEstimate, setConceptionEstimate] = useState<Date | null>(null);
  
  // UI States
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [showTimeline, setShowTimeline] = useState<boolean>(true);
  
  const printRef = useRef<HTMLDivElement>(null);

  // Calculate due date based on method
  const calculateDueDate = useCallback(() => {
    let calculatedDueDate: Date | null = null;
    let calculatedConception: Date | null = null;

    if (method === "lmp" && lmpDate) {
      const lmp = new Date(lmpDate);
      // Naegele's Rule with cycle adjustment
      const cycleAdjustment = cycleLength - 28;
      calculatedDueDate = new Date(lmp);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 280 + cycleAdjustment);
      
      // Estimate conception (usually around day 14 of cycle)
      calculatedConception = new Date(lmp);
      calculatedConception.setDate(calculatedConception.getDate() + Math.round(cycleLength / 2));
    } else if (method === "conception" && conceptionDate) {
      const conception = new Date(conceptionDate);
      calculatedConception = conception;
      // 266 days from conception
      calculatedDueDate = new Date(conception);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 266);
    } else if (method === "ivf" && ivfDate) {
      const ivf = new Date(ivfDate);
      const embryoDays = embryoAge === "5" ? 5 : 3;
      // Calculate conception date (embryo age days before transfer)
      calculatedConception = new Date(ivf);
      calculatedConception.setDate(calculatedConception.getDate() - embryoDays);
      // 266 days from conception
      calculatedDueDate = new Date(calculatedConception);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 266);
    }

    if (calculatedDueDate) {
      setDueDate(calculatedDueDate);
      setConceptionEstimate(calculatedConception);
      
      // Calculate gestational age
      const today = new Date();
      const startDate = method === "lmp" && lmpDate ? new Date(lmpDate) : 
                        calculatedConception ? new Date(calculatedConception.getTime() - 14 * 24 * 60 * 60 * 1000) : null;
      
      if (startDate) {
        const diffTime = today.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;
        
        if (weeks >= 0 && weeks <= 42) {
          setGestationalAge({ weeks, days });
          
          // Determine trimester
          if (weeks < 13) setTrimester(1);
          else if (weeks < 27) setTrimester(2);
          else setTrimester(3);
        } else {
          setGestationalAge(null);
          setTrimester(0);
        }
      }
      
      setCalendarMonth(new Date(calculatedDueDate.getFullYear(), calculatedDueDate.getMonth(), 1));
    }
  }, [method, lmpDate, cycleLength, conceptionDate, ivfDate, embryoAge]);

  useEffect(() => {
    calculateDueDate();
  }, [calculateDueDate]);

  const resetForm = () => {
    setLmpDate("");
    setCycleLength(28);
    setIrregularCycle(false);
    setConceptionDate("");
    setIvfDate("");
    setEmbryoAge("5");
    setDueDate(null);
    setGestationalAge(null);
    setTrimester(0);
    setConceptionEstimate(null);
    toast.success("Form reset successfully");
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getDateRange = (date: Date, daysBefore: number, daysAfter: number): { start: Date; end: Date } => {
    const start = new Date(date);
    start.setDate(start.getDate() - daysBefore);
    const end = new Date(date);
    end.setDate(end.getDate() + daysAfter);
    return { start, end };
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  const exportAsPDF = () => {
    // Generate text summary for download
    if (!dueDate) return;
    
    const summary = `
PREGNANCY DUE DATE CALCULATOR RESULTS
=====================================
Generated: ${new Date().toLocaleDateString()}

ESTIMATED DUE DATE: ${formatDate(dueDate)}
Due Date Window: ${formatDate(getDateRange(dueDate, 14, 14).start)} to ${formatDate(getDateRange(dueDate, 14, 14).end)}

${gestationalAge ? `CURRENT GESTATIONAL AGE: ${gestationalAge.weeks} weeks and ${gestationalAge.days} days` : ""}
${trimester ? `CURRENT TRIMESTER: ${trimester}` : ""}
${conceptionEstimate ? `ESTIMATED CONCEPTION: ${formatDate(conceptionEstimate)}` : ""}

Calculation Method: ${method === "lmp" ? "Last Menstrual Period (LMP)" : method === "conception" ? "Conception Date" : "IVF Transfer Date"}
${method === "lmp" ? `Cycle Length: ${cycleLength} days` : ""}

TRIMESTER BREAKDOWN:
- First Trimester: Weeks 1-12
- Second Trimester: Weeks 13-26
- Third Trimester: Weeks 27-40

DISCLAIMER: This calculator provides estimates for informational purposes only. It is not medical advice. Please consult your healthcare provider for accurate pregnancy dating and medical guidance.

Calculated using WHO/ACOG standard methods.
Generated by AnyFile Flow - anyfileflow.lovable.app
    `;
    
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pregnancy-due-date-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };

  // Calendar rendering
  const renderCalendar = () => {
    if (!dueDate) return null;
    
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const dueRange = getDateRange(dueDate, 14, 14);
    const weeks = [];
    let days = [];
    
    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      days.push(<td key={`empty-${i}`} className="p-1 sm:p-2"></td>);
    }
    
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(year, month, day);
      const isDueDate = dueDate.toDateString() === currentDate.toDateString();
      const isInRange = currentDate >= dueRange.start && currentDate <= dueRange.end;
      const isToday = new Date().toDateString() === currentDate.toDateString();
      
      days.push(
        <td key={day} className="p-0.5 sm:p-1">
          <div
            className={cn(
              "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm transition-colors",
              isDueDate && "bg-primary text-primary-foreground font-bold",
              isInRange && !isDueDate && "bg-primary/20 text-primary",
              isToday && !isDueDate && !isInRange && "ring-2 ring-primary",
              !isDueDate && !isInRange && !isToday && "text-foreground"
            )}
          >
            {day}
          </div>
        </td>
      );
      
      if ((startingDay + day) % 7 === 0 || day === totalDays) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }
    }
    
    return weeks;
  };

  const navigateMonth = (direction: number) => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + direction, 1));
  };

  const getProgressPercentage = (): number => {
    if (!gestationalAge) return 0;
    return Math.min(((gestationalAge.weeks * 7 + gestationalAge.days) / 280) * 100, 100);
  };

  const getCurrentMilestone = (): MilestoneData | null => {
    if (!gestationalAge) return null;
    const currentWeek = gestationalAge.weeks;
    return milestones.filter(m => m.week <= currentWeek).pop() || null;
  };

  const getNextMilestone = (): MilestoneData | null => {
    if (!gestationalAge) return null;
    const currentWeek = gestationalAge.weeks;
    return milestones.find(m => m.week > currentWeek) || null;
  };

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2 justify-center print:hidden">
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
          No Data Storage
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          WHO/ACOG Method
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Instant Results
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
          No Signup • Private • Free
        </Badge>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            Calculate Your Due Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Selection */}
          <Tabs value={method} onValueChange={(v) => setMethod(v as typeof method)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lmp" className="text-xs sm:text-sm">By LMP</TabsTrigger>
              <TabsTrigger value="conception" className="text-xs sm:text-sm">By Conception</TabsTrigger>
              <TabsTrigger value="ivf" className="text-xs sm:text-sm">By IVF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lmp" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="lmp-date" className="text-sm font-medium">
                  First Day of Last Menstrual Period (LMP)
                </Label>
                <Input
                  id="lmp-date"
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="max-w-xs"
                  aria-describedby="lmp-hint"
                />
                <p id="lmp-hint" className="text-xs text-muted-foreground">
                  Enter the first day of your last period
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="irregular-toggle" className="text-sm font-medium">
                    I have irregular cycles
                  </Label>
                  <Switch
                    id="irregular-toggle"
                    checked={irregularCycle}
                    onCheckedChange={setIrregularCycle}
                    aria-label="Toggle irregular cycle input"
                  />
                </div>
                
                {irregularCycle && (
                  <div className="space-y-2">
                    <Label htmlFor="cycle-length" className="text-sm">
                      Average Cycle Length: <span className="font-bold text-primary">{cycleLength} days</span>
                    </Label>
                    <Slider
                      id="cycle-length"
                      value={[cycleLength]}
                      onValueChange={([v]) => setCycleLength(v)}
                      min={21}
                      max={45}
                      step={1}
                      className="max-w-xs"
                      aria-label="Cycle length in days"
                    />
                    <p className="text-xs text-muted-foreground">
                      Standard cycle is 28 days. Adjust for irregular cycles (21-45 days).
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="conception" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="conception-date" className="text-sm font-medium">
                  Conception Date (if known)
                </Label>
                <Input
                  id="conception-date"
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="max-w-xs"
                  aria-describedby="conception-hint"
                />
                <p id="conception-hint" className="text-xs text-muted-foreground">
                  Enter the date you believe conception occurred (e.g., ovulation day)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="ivf" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ivf-date" className="text-sm font-medium">
                  Embryo Transfer Date
                </Label>
                <Input
                  id="ivf-date"
                  type="date"
                  value={ivfDate}
                  onChange={(e) => setIvfDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="max-w-xs"
                  aria-describedby="ivf-hint"
                />
                <p id="ivf-hint" className="text-xs text-muted-foreground">
                  Enter the date of your embryo transfer
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="embryo-age" className="text-sm font-medium">
                  Embryo Age at Transfer
                </Label>
                <Select value={embryoAge} onValueChange={(v) => setEmbryoAge(v as "3" | "5")}>
                  <SelectTrigger id="embryo-age" className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Day 3 Embryo (Cleavage)</SelectItem>
                    <SelectItem value="5">Day 5 Embryo (Blastocyst)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" onClick={resetForm} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
            {dueDate && (
              <>
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print
                </Button>
                <Button variant="outline" onClick={exportAsPDF} className="gap-2">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {dueDate && (
        <div className="space-y-6">
          {/* Main Result Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                  <Baby className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Estimated Due Date</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {formatDate(dueDate)}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Due window: {formatDate(getDateRange(dueDate, 14, 14).start)} – {formatDate(getDateRange(dueDate, 14, 14).end)}
                  </p>
                </div>
                
                {gestationalAge && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Current Gestational Age</p>
                    <p className="text-xl font-bold text-foreground">
                      {gestationalAge.weeks} weeks and {gestationalAge.days} days
                    </p>
                    <Badge className="mt-2" variant={trimester === 1 ? "default" : trimester === 2 ? "secondary" : "outline"}>
                      Trimester {trimester}
                    </Badge>
                  </div>
                )}

                {/* Progress Bar */}
                {gestationalAge && (
                  <div className="pt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Week 0</span>
                      <span>Week 40</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 rounded-full"
                        style={{ width: `${getProgressPercentage()}%` }}
                        role="progressbar"
                        aria-valuenow={getProgressPercentage()}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Pregnancy progress: ${Math.round(getProgressPercentage())}%`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(getProgressPercentage())}% complete
                    </p>
                  </div>
                )}

                {conceptionEstimate && (
                  <p className="text-sm text-muted-foreground">
                    Estimated conception: {formatDate(conceptionEstimate)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Days Until Due</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.max(0, Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Weeks Until Due</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.max(0, Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)))}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Trimester</p>
                <p className="text-2xl font-bold text-foreground">{trimester || "-"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(getProgressPercentage())}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <Card className="print:hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
                  Due Date Calendar
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full" role="grid" aria-label="Due date calendar">
                  <thead>
                    <tr>
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <th key={day} className="p-1 sm:p-2 text-xs text-muted-foreground font-medium">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderCalendar()}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Due Date</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <span className="text-muted-foreground">±2 Week Window</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Toggle */}
          <div className="flex items-center justify-between print:hidden">
            <Label htmlFor="timeline-toggle" className="text-sm font-medium">
              Show Pregnancy Timeline
            </Label>
            <Switch
              id="timeline-toggle"
              checked={showTimeline}
              onCheckedChange={setShowTimeline}
              aria-label="Toggle pregnancy timeline"
            />
          </div>

          {/* Timeline */}
          {showTimeline && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pregnancy Timeline & Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Current & Next Milestone */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {getCurrentMilestone() && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Current Milestone</p>
                      <p className="font-bold text-foreground">{getCurrentMilestone()?.title}</p>
                      <p className="text-sm text-muted-foreground">{getCurrentMilestone()?.description}</p>
                    </div>
                  )}
                  {getNextMilestone() && (
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Next Milestone (Week {getNextMilestone()?.week})</p>
                      <p className="font-bold text-foreground">{getNextMilestone()?.title}</p>
                      <p className="text-sm text-muted-foreground">{getNextMilestone()?.description}</p>
                    </div>
                  )}
                </div>

                {/* Trimester Breakdown */}
                <div className="space-y-4">
                  {[1, 2, 3].map(t => (
                    <div key={t}>
                      <h4 className={cn(
                        "font-semibold mb-2 flex items-center gap-2",
                        t === trimester && "text-primary"
                      )}>
                        Trimester {t}
                        {t === trimester && <Badge variant="secondary" className="text-xs">Current</Badge>}
                      </h4>
                      <div className="grid gap-2 pl-4 border-l-2 border-border">
                        {milestones.filter(m => m.trimester === t).map(milestone => (
                          <div 
                            key={milestone.week}
                            className={cn(
                              "p-2 rounded-lg text-sm transition-colors",
                              gestationalAge && milestone.week <= gestationalAge.weeks
                                ? "bg-primary/10 text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="font-medium">Week {milestone.week}:</span> {milestone.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Medical Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Medical Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This calculator provides estimates for <strong>informational purposes only</strong>. It is not intended as medical advice, diagnosis, or treatment. 
                Only about 5% of babies are born on their exact due date. Your actual delivery date may vary.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Always consult your healthcare provider</strong> for accurate pregnancy dating, prenatal care, and medical guidance. 
                This calculator uses the WHO/ACOG Naegele's Rule method.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PregnancyDueDateTool;
