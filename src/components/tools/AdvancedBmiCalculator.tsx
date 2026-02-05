 import { useState, useMemo, useCallback } from "react";
 import { Calculator, Activity, Target, Heart, Share2, Download, Copy, Info, TrendingDown, TrendingUp, Minus, User, Scale, Ruler, Dumbbell, Brain, Utensils, Footprints, AlertCircle, Check, ChevronDown, ChevronUp } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Progress } from "@/components/ui/progress";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Switch } from "@/components/ui/switch";
 import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
 import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
 import { toast } from "@/hooks/use-toast";
 import { cn } from "@/lib/utils";
 
 // Types
 interface BmiResult {
   bmi: number;
   category: string;
   categoryClass: string;
   healthyWeightRange: { min: number; max: number };
   weightDifference: number;
   riskLevel: "low" | "medium" | "high";
   percentFromHealthy: number;
 }
 
 interface GoalResult {
   targetBmi: number;
   targetWeight: number;
   weeklyChange: number;
   weeksToGoal: number;
   monthsToGoal: number;
 }
 
 // Constants
 const BMI_CATEGORIES = [
   { range: [0, 16], label: "Severe Underweight", class: "text-red-500", bg: "bg-red-500" },
   { range: [16, 17], label: "Moderate Underweight", class: "text-orange-500", bg: "bg-orange-500" },
   { range: [17, 18.5], label: "Mild Underweight", class: "text-yellow-500", bg: "bg-yellow-500" },
   { range: [18.5, 25], label: "Normal Weight", class: "text-green-500", bg: "bg-green-500" },
   { range: [25, 30], label: "Overweight", class: "text-yellow-500", bg: "bg-yellow-500" },
   { range: [30, 35], label: "Obese Class I", class: "text-orange-500", bg: "bg-orange-500" },
   { range: [35, 40], label: "Obese Class II", class: "text-red-500", bg: "bg-red-500" },
   { range: [40, 100], label: "Obese Class III", class: "text-red-600", bg: "bg-red-600" },
 ];
 
 const ACTIVITY_LEVELS = [
   { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
   { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
   { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
   { value: "active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
   { value: "athlete", label: "Athlete", description: "Very hard exercise & physical job" },
 ];
 
 const BODY_TYPES = [
   { value: "slim", label: "Slim/Ectomorph", adjustment: -0.5 },
   { value: "average", label: "Average/Mesomorph", adjustment: 0 },
   { value: "muscular", label: "Muscular/Athletic", adjustment: 1.5 },
   { value: "stocky", label: "Stocky/Endomorph", adjustment: 0.5 },
 ];
 
 const AdvancedBmiCalculator = () => {
   // Unit system
   const [isMetric, setIsMetric] = useState(true);
   
   // Core inputs
   const [height, setHeight] = useState("");
   const [heightFeet, setHeightFeet] = useState("");
   const [heightInches, setHeightInches] = useState("");
   const [weight, setWeight] = useState("");
   
   // Optional personalization
   const [showAdvanced, setShowAdvanced] = useState(false);
   const [age, setAge] = useState("");
   const [gender, setGender] = useState<"male" | "female" | "">("");
   const [activityLevel, setActivityLevel] = useState("");
   const [bodyType, setBodyType] = useState("");
   
   // Goal mode
   const [goalMode, setGoalMode] = useState<"lose" | "gain" | "maintain" | "">("");
   const [targetBmi, setTargetBmi] = useState("22");
   
   // Results
   const [result, setResult] = useState<BmiResult | null>(null);
   const [goalResult, setGoalResult] = useState<GoalResult | null>(null);
 
   // Convert height to cm
   const getHeightInCm = useCallback((): number => {
     if (isMetric) {
       return parseFloat(height) || 0;
     }
     const feet = parseFloat(heightFeet) || 0;
     const inches = parseFloat(heightInches) || 0;
     return (feet * 30.48) + (inches * 2.54);
   }, [isMetric, height, heightFeet, heightInches]);
 
   // Convert weight to kg
   const getWeightInKg = useCallback((): number => {
     const w = parseFloat(weight) || 0;
     return isMetric ? w : w * 0.453592;
   }, [isMetric, weight]);
 
   // Get BMI category
   const getBmiCategory = (bmi: number): { label: string; class: string; bg: string } => {
     for (const cat of BMI_CATEGORIES) {
       if (bmi >= cat.range[0] && bmi < cat.range[1]) {
         return { label: cat.label, class: cat.class, bg: cat.bg };
       }
     }
     return { label: "Unknown", class: "text-muted-foreground", bg: "bg-muted" };
   };
 
   // Adjust BMI interpretation based on personalization
   const getAdjustedInterpretation = (bmi: number): string => {
     const bodyAdj = BODY_TYPES.find(b => b.value === bodyType)?.adjustment || 0;
     
     if (bodyType === "muscular" && bmi >= 25 && bmi < 30) {
       return "Your BMI is in the 'Overweight' range, but for muscular individuals this may not indicate excess fat. Athletes often have higher BMI due to muscle mass.";
     }
     
     if (age && parseInt(age) >= 65 && bmi >= 23 && bmi < 27) {
       return "For adults 65+, a slightly higher BMI (23-27) may be protective. Your BMI is within a healthy range for your age group.";
     }
     
     if (activityLevel === "athlete" && bmi >= 25 && bmi < 28) {
       return "As an athlete, higher BMI due to muscle mass is common. Consider body composition tests for a more accurate assessment.";
     }
     
     return "";
   };
 
   // Calculate BMI
   const calculateBmi = useCallback(() => {
     const heightCm = getHeightInCm();
     const weightKg = getWeightInKg();
     
     if (heightCm <= 0 || weightKg <= 0) {
       toast({ title: "Missing values", description: "Please enter valid height and weight.", variant: "destructive" });
       return;
     }
     
     const heightM = heightCm / 100;
     const bmi = weightKg / (heightM * heightM);
     const category = getBmiCategory(bmi);
     
     // Healthy weight range
     const minHealthy = 18.5 * (heightM * heightM);
     const maxHealthy = 24.9 * (heightM * heightM);
     
     // Weight difference from healthy range
     let weightDiff = 0;
     if (bmi < 18.5) {
       weightDiff = minHealthy - weightKg;
     } else if (bmi > 24.9) {
       weightDiff = weightKg - maxHealthy;
     }
     
     // Percent from healthy midpoint (21.75 BMI)
     const healthyMidpoint = 21.75;
     const percentFromHealthy = ((bmi - healthyMidpoint) / healthyMidpoint) * 100;
     
     // Risk level
     let riskLevel: "low" | "medium" | "high" = "low";
     if (bmi < 17 || bmi >= 35) riskLevel = "high";
     else if (bmi < 18.5 || bmi >= 30) riskLevel = "medium";
     
     const newResult: BmiResult = {
       bmi,
       category: category.label,
       categoryClass: category.class,
       healthyWeightRange: { min: minHealthy, max: maxHealthy },
       weightDifference: Math.abs(weightDiff),
       riskLevel,
       percentFromHealthy,
     };
     
     setResult(newResult);
     
     // Calculate goal if mode selected
     if (goalMode && goalMode !== "maintain") {
       const target = parseFloat(targetBmi) || 22;
       const targetWeight = target * (heightM * heightM);
       const weightToChange = Math.abs(targetWeight - weightKg);
       const safeWeeklyChange = goalMode === "lose" ? 0.5 : 0.25; // kg per week
       const weeksToGoal = Math.ceil(weightToChange / safeWeeklyChange);
       
       setGoalResult({
         targetBmi: target,
         targetWeight,
         weeklyChange: safeWeeklyChange,
         weeksToGoal,
         monthsToGoal: Math.ceil(weeksToGoal / 4),
       });
     }
     
     toast({ title: "BMI Calculated!", description: `Your BMI is ${bmi.toFixed(2)} (${category.label})` });
   }, [getHeightInCm, getWeightInKg, goalMode, targetBmi]);
 
   // BMI Progress visualization (0-50 scale mapped to 0-100%)
   const getBmiProgress = (bmi: number): number => {
     return Math.min((bmi / 40) * 100, 100);
   };
 
   // Get gradient position for BMI meter
   const getBmiMeterPosition = (bmi: number): string => {
     const position = Math.min(Math.max((bmi / 40) * 100, 0), 100);
     return `${position}%`;
   };
 
   // Share result
   const shareResult = async () => {
     if (!result) return;
     
     const text = `My BMI is ${result.bmi.toFixed(2)} (${result.category}). Check yours at AnyFile Flow!`;
     
     if (navigator.share) {
       try {
         await navigator.share({ title: "My BMI Result", text, url: window.location.href });
       } catch (e) {
         copyResult();
       }
     } else {
       copyResult();
     }
   };
 
   // Copy result
   const copyResult = () => {
     if (!result) return;
     const text = `BMI: ${result.bmi.toFixed(2)} | Category: ${result.category} | Healthy Weight Range: ${result.healthyWeightRange.min.toFixed(1)} - ${result.healthyWeightRange.max.toFixed(1)} kg`;
     navigator.clipboard.writeText(text);
     toast({ title: "Copied!", description: "Result copied to clipboard" });
   };
 
   // Get lifestyle tips based on BMI
   const getLifestyleTips = (): { diet: string[]; activity: string[] } => {
     if (!result) return { diet: [], activity: [] };
     
     if (result.bmi < 18.5) {
       return {
         diet: [
           "Focus on nutrient-dense foods with healthy fats",
           "Increase protein intake for muscle building",
           "Eat more frequently with calorie-rich snacks",
           "Include nuts, seeds, and whole grains",
         ],
         activity: [
           "Strength training to build muscle mass",
           "Moderate cardio to boost appetite",
           "Focus on compound exercises",
           "Allow adequate rest for recovery",
         ],
       };
     } else if (result.bmi >= 25) {
       return {
         diet: [
           "Focus on fiber-rich vegetables and fruits",
           "Choose lean proteins and whole grains",
           "Practice portion control at meals",
           "Limit processed foods and added sugars",
         ],
         activity: [
           "Start with 30 min daily walking",
           "Gradually add strength training",
           "Include activities you enjoy",
           "Aim for 150+ minutes moderate activity weekly",
         ],
       };
     }
     
     return {
       diet: [
         "Maintain balanced nutrition",
         "Stay hydrated with water",
         "Include variety in your meals",
         "Practice mindful eating",
       ],
       activity: [
         "Continue regular physical activity",
         "Mix cardio and strength training",
         "Stay active throughout the day",
         "Try new activities to stay motivated",
       ],
     };
   };
 
   const tips = useMemo(() => getLifestyleTips(), [result]);
   const adjustedInterpretation = result ? getAdjustedInterpretation(result.bmi) : "";
 
   return (
     <TooltipProvider>
       <div className="space-y-6" role="region" aria-label="Advanced BMI Calculator">
         {/* Unit Toggle */}
         <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
           <div className="flex items-center gap-3">
             <span className={cn("text-sm font-medium", !isMetric && "text-primary")}>Imperial (ft/lbs)</span>
             <Switch
               checked={isMetric}
               onCheckedChange={setIsMetric}
               aria-label="Toggle unit system"
             />
             <span className={cn("text-sm font-medium", isMetric && "text-primary")}>Metric (cm/kg)</span>
           </div>
         </div>
 
         {/* Core Inputs */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {/* Height */}
           <div className="space-y-2">
             <Label htmlFor="height" className="flex items-center gap-2">
               <Ruler className="h-4 w-4" aria-hidden="true" />
               Height {isMetric ? "(cm)" : "(ft/in)"}
             </Label>
             {isMetric ? (
               <Input
                 id="height"
                 type="number"
                 placeholder="170"
                 value={height}
                 onChange={(e) => setHeight(e.target.value)}
                 className="text-lg"
                 min="50"
                 max="300"
               />
             ) : (
               <div className="flex gap-2">
                 <Input
                   id="height-feet"
                   type="number"
                   placeholder="5"
                   value={heightFeet}
                   onChange={(e) => setHeightFeet(e.target.value)}
                   className="flex-1"
                   min="1"
                   max="9"
                   aria-label="Feet"
                 />
                 <span className="self-center text-muted-foreground">ft</span>
                 <Input
                   id="height-inches"
                   type="number"
                   placeholder="8"
                   value={heightInches}
                   onChange={(e) => setHeightInches(e.target.value)}
                   className="flex-1"
                   min="0"
                   max="11"
                   aria-label="Inches"
                 />
                 <span className="self-center text-muted-foreground">in</span>
               </div>
             )}
           </div>
 
           {/* Weight */}
           <div className="space-y-2">
             <Label htmlFor="weight" className="flex items-center gap-2">
               <Scale className="h-4 w-4" aria-hidden="true" />
               Weight {isMetric ? "(kg)" : "(lbs)"}
             </Label>
             <Input
               id="weight"
               type="number"
               placeholder={isMetric ? "70" : "154"}
               value={weight}
               onChange={(e) => setWeight(e.target.value)}
               className="text-lg"
               min="20"
               max="500"
             />
           </div>
         </div>
 
         {/* Advanced Personalization */}
         <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
           <CollapsibleTrigger asChild>
             <Button variant="outline" className="w-full justify-between">
               <span className="flex items-center gap-2">
                 <Brain className="h-4 w-4" />
                 Smart Personalization (Optional)
               </span>
               {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
             </Button>
           </CollapsibleTrigger>
           <CollapsibleContent className="mt-4 space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Age */}
               <div className="space-y-2">
                 <Label htmlFor="age">Age (years)</Label>
                 <Input
                   id="age"
                   type="number"
                   placeholder="30"
                   value={age}
                   onChange={(e) => setAge(e.target.value)}
                   min="2"
                   max="120"
                 />
               </div>
 
               {/* Gender */}
               <div className="space-y-2">
                 <Label>Gender</Label>
                 <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select gender" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="male">Male</SelectItem>
                     <SelectItem value="female">Female</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
 
               {/* Activity Level */}
               <div className="space-y-2">
                 <Label>Activity Level</Label>
                 <Select value={activityLevel} onValueChange={setActivityLevel}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select level" />
                   </SelectTrigger>
                   <SelectContent>
                     {ACTIVITY_LEVELS.map((level) => (
                       <SelectItem key={level.value} value={level.value}>
                         {level.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
 
               {/* Body Type */}
               <div className="space-y-2">
                 <Label className="flex items-center gap-1">
                   Body Type
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                     </TooltipTrigger>
                     <TooltipContent>
                       <p>Helps adjust BMI interpretation for muscular builds</p>
                     </TooltipContent>
                   </Tooltip>
                 </Label>
                 <Select value={bodyType} onValueChange={setBodyType}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select type" />
                   </SelectTrigger>
                   <SelectContent>
                     {BODY_TYPES.map((type) => (
                       <SelectItem key={type.value} value={type.value}>
                         {type.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>
           </CollapsibleContent>
         </Collapsible>
 
         {/* Goal Mode */}
         <Collapsible>
           <CollapsibleTrigger asChild>
             <Button variant="outline" className="w-full justify-between">
               <span className="flex items-center gap-2">
                 <Target className="h-4 w-4" />
                 Goal-Based Mode (Optional)
               </span>
               <ChevronDown className="h-4 w-4" />
             </Button>
           </CollapsibleTrigger>
           <CollapsibleContent className="mt-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Your Goal</Label>
                 <Select value={goalMode} onValueChange={(v) => setGoalMode(v as "lose" | "gain" | "maintain")}>
                   <SelectTrigger>
                     <SelectValue placeholder="Select goal" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="lose">
                       <span className="flex items-center gap-2">
                         <TrendingDown className="h-4 w-4" /> Lose Weight
                       </span>
                     </SelectItem>
                     <SelectItem value="gain">
                       <span className="flex items-center gap-2">
                         <TrendingUp className="h-4 w-4" /> Gain Weight
                       </span>
                     </SelectItem>
                     <SelectItem value="maintain">
                       <span className="flex items-center gap-2">
                         <Minus className="h-4 w-4" /> Maintain Weight
                       </span>
                     </SelectItem>
                   </SelectContent>
                 </Select>
               </div>
 
               {goalMode && goalMode !== "maintain" && (
                 <div className="space-y-2">
                   <Label>Target BMI</Label>
                   <Input
                     type="number"
                     placeholder="22"
                     value={targetBmi}
                     onChange={(e) => setTargetBmi(e.target.value)}
                     min="18.5"
                     max="30"
                     step="0.1"
                   />
                 </div>
               )}
             </div>
           </CollapsibleContent>
         </Collapsible>
 
         {/* Calculate Button */}
         <Button variant="hero" onClick={calculateBmi} className="w-full" size="lg">
           <Calculator className="h-5 w-5" aria-hidden="true" />
           Calculate BMI
         </Button>
 
         {/* Results Section */}
         {result && (
           <div className="space-y-6 animate-in fade-in-50 duration-300">
             {/* Main Result Card */}
             <Card className="overflow-hidden">
               <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
                 <CardTitle className="flex items-center justify-between">
                   <span className="flex items-center gap-2">
                     <Activity className="h-5 w-5" />
                     Your BMI Result
                   </span>
                   <div className="flex gap-2">
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={copyResult}>
                           <Copy className="h-4 w-4" />
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent>Copy Result</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button variant="outline" size="icon" onClick={shareResult}>
                           <Share2 className="h-4 w-4" />
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent>Share Result</TooltipContent>
                     </Tooltip>
                   </div>
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                 {/* BMI Value & Category */}
                 <div className="text-center mb-6">
                   <div className="text-6xl font-bold text-foreground mb-2">
                     {result.bmi.toFixed(2)}
                   </div>
                   <div className={cn("text-xl font-semibold", result.categoryClass)}>
                     {result.category}
                   </div>
                 </div>
 
                 {/* Visual BMI Meter */}
                 <div className="relative mb-6">
                   <div className="h-4 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-yellow-500 to-red-600" />
                   <div
                     className="absolute top-0 w-1 h-6 bg-foreground rounded-full transform -translate-x-1/2 -translate-y-1"
                     style={{ left: getBmiMeterPosition(result.bmi) }}
                   />
                   <div className="flex justify-between text-xs text-muted-foreground mt-2">
                     <span>15</span>
                     <span>18.5</span>
                     <span>25</span>
                     <span>30</span>
                     <span>40+</span>
                   </div>
                   <div className="flex justify-between text-xs text-muted-foreground mt-1">
                     <span>Underweight</span>
                     <span>Normal</span>
                     <span>Overweight</span>
                     <span>Obese</span>
                   </div>
                 </div>
 
                 {/* Adjusted Interpretation */}
                 {adjustedInterpretation && (
                   <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                     <p className="text-sm flex items-start gap-2">
                       <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                       {adjustedInterpretation}
                     </p>
                   </div>
                 )}
 
                 {/* Health Insights Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="p-4 bg-secondary/30 rounded-lg text-center">
                     <p className="text-sm text-muted-foreground mb-1">Healthy Weight Range</p>
                     <p className="font-semibold">
                       {result.healthyWeightRange.min.toFixed(1)} - {result.healthyWeightRange.max.toFixed(1)} kg
                     </p>
                   </div>
                   <div className="p-4 bg-secondary/30 rounded-lg text-center">
                     <p className="text-sm text-muted-foreground mb-1">From Healthy Range</p>
                     <p className={cn("font-semibold", result.percentFromHealthy > 0 ? "text-orange-500" : result.percentFromHealthy < 0 ? "text-yellow-500" : "text-green-500")}>
                       {result.percentFromHealthy > 0 ? "+" : ""}{result.percentFromHealthy.toFixed(1)}%
                     </p>
                   </div>
                   <div className="p-4 bg-secondary/30 rounded-lg text-center">
                     <p className="text-sm text-muted-foreground mb-1">Health Risk</p>
                     <p className={cn(
                       "font-semibold capitalize",
                       result.riskLevel === "low" ? "text-green-500" : result.riskLevel === "medium" ? "text-yellow-500" : "text-red-500"
                     )}>
                       {result.riskLevel}
                     </p>
                   </div>
                 </div>
 
                 {/* Weight Action Insight */}
                 {result.weightDifference > 0 && (
                   <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                     <p className="text-sm">
                       {result.bmi < 18.5 ? (
                         <>Gaining <strong>{result.weightDifference.toFixed(1)} kg</strong> can help you reach a healthy BMI range.</>
                       ) : (
                         <>Losing <strong>{result.weightDifference.toFixed(1)} kg</strong> can help you reach a healthy BMI range.</>
                       )}
                     </p>
                   </div>
                 )}
               </CardContent>
             </Card>
 
             {/* Goal Results */}
             {goalResult && goalMode !== "maintain" && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Target className="h-5 w-5" />
                     Your Goal Plan
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <div className="text-center p-3 bg-secondary/30 rounded-lg">
                       <p className="text-xs text-muted-foreground">Target BMI</p>
                       <p className="text-xl font-bold">{goalResult.targetBmi}</p>
                     </div>
                     <div className="text-center p-3 bg-secondary/30 rounded-lg">
                       <p className="text-xs text-muted-foreground">Target Weight</p>
                       <p className="text-xl font-bold">{goalResult.targetWeight.toFixed(1)} kg</p>
                     </div>
                     <div className="text-center p-3 bg-secondary/30 rounded-lg">
                       <p className="text-xs text-muted-foreground">Safe Weekly {goalMode === "lose" ? "Loss" : "Gain"}</p>
                       <p className="text-xl font-bold">{goalResult.weeklyChange} kg</p>
                     </div>
                     <div className="text-center p-3 bg-secondary/30 rounded-lg">
                       <p className="text-xs text-muted-foreground">Time to Goal</p>
                       <p className="text-xl font-bold">{goalResult.monthsToGoal} months</p>
                     </div>
                   </div>
 
                   {/* Progress Timeline */}
                   <div className="mt-4">
                     <p className="text-sm text-muted-foreground mb-2">Estimated Progress Timeline</p>
                     <Progress value={0} className="h-2" />
                     <div className="flex justify-between text-xs text-muted-foreground mt-1">
                       <span>Now</span>
                       <span>{Math.ceil(goalResult.weeksToGoal / 2)} weeks</span>
                       <span>{goalResult.weeksToGoal} weeks</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             )}
 
             {/* Lifestyle Suggestions */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Heart className="h-5 w-5" />
                   Personalized Suggestions
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <Tabs defaultValue="diet">
                   <TabsList className="w-full">
                     <TabsTrigger value="diet" className="flex-1">
                       <Utensils className="h-4 w-4 mr-2" /> Nutrition
                     </TabsTrigger>
                     <TabsTrigger value="activity" className="flex-1">
                       <Footprints className="h-4 w-4 mr-2" /> Activity
                     </TabsTrigger>
                   </TabsList>
                   <TabsContent value="diet" className="mt-4">
                     <ul className="space-y-2">
                       {tips.diet.map((tip, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm">
                           <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                           {tip}
                         </li>
                       ))}
                     </ul>
                   </TabsContent>
                   <TabsContent value="activity" className="mt-4">
                     <ul className="space-y-2">
                       {tips.activity.map((tip, i) => (
                         <li key={i} className="flex items-start gap-2 text-sm">
                           <Dumbbell className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                           {tip}
                         </li>
                       ))}
                     </ul>
                   </TabsContent>
                 </Tabs>
               </CardContent>
             </Card>
 
             {/* Comparison Chart */}
             <Card>
               <CardHeader>
                 <CardTitle>BMI Comparison</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3">
                     <span className="w-24 text-sm text-muted-foreground">Your BMI</span>
                     <div className="flex-1 bg-secondary/30 rounded-full h-4 overflow-hidden">
                       <div
                         className={cn("h-full rounded-full transition-all", result.categoryClass.replace("text-", "bg-"))}
                         style={{ width: `${getBmiProgress(result.bmi)}%` }}
                       />
                     </div>
                     <span className="w-12 text-sm font-medium">{result.bmi.toFixed(1)}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="w-24 text-sm text-muted-foreground">Healthy</span>
                     <div className="flex-1 bg-secondary/30 rounded-full h-4 overflow-hidden">
                       <div className="h-full bg-green-500 rounded-full" style={{ width: `${getBmiProgress(21.75)}%` }} />
                     </div>
                     <span className="w-12 text-sm font-medium">21.7</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="w-24 text-sm text-muted-foreground">Global Avg</span>
                     <div className="flex-1 bg-secondary/30 rounded-full h-4 overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${getBmiProgress(25.5)}%` }} />
                     </div>
                     <span className="w-12 text-sm font-medium">25.5</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         )}
 
         {/* Medical Disclaimer */}
         <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
           <p className="text-sm flex items-start gap-2">
             <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500 shrink-0" />
             <span>
               <strong>Medical Disclaimer:</strong> BMI is a screening tool, not a diagnosis. It does not account for muscle mass, bone density, age, or ethnicity.
               For accurate health assessments, consult a healthcare provider. Reference: WHO & CDC BMI standards.
             </span>
           </p>
         </div>
       </div>
     </TooltipProvider>
   );
 };
 
 export default AdvancedBmiCalculator;