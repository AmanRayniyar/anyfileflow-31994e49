import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

interface HealthToolProps {
  tool: Tool;
}

const HealthTool = ({ tool }: HealthToolProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ value: string; label: string; description: string; category?: string } | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const calculateResult = () => {
    const numValues: Record<string, number> = {};
    Object.entries(values).forEach(([key, val]) => {
      numValues[key] = parseFloat(val) || 0;
    });

    let resultValue = "";
    let resultLabel = "";
    let resultDescription = "";
    let category = "";

    switch (tool.id) {
      case "bmi-calculator": {
        const { height, weight } = numValues;
        if (height > 0 && weight > 0) {
          const heightM = height / 100;
          const bmi = weight / (heightM * heightM);
          resultValue = bmi.toFixed(1);
          resultLabel = "BMI";
          if (bmi < 18.5) {
            category = "Underweight";
            resultDescription = "Your BMI indicates you are underweight. Consider consulting a healthcare provider.";
          } else if (bmi < 25) {
            category = "Normal weight";
            resultDescription = "Your BMI is within the normal range. Keep up the healthy lifestyle!";
          } else if (bmi < 30) {
            category = "Overweight";
            resultDescription = "Your BMI indicates you are overweight. Consider lifestyle changes.";
          } else {
            category = "Obese";
            resultDescription = "Your BMI indicates obesity. Please consult a healthcare provider.";
          }
        }
        break;
      }

      case "calorie-calculator": {
        const { age, weight, height, activity } = numValues;
        if (age > 0 && weight > 0 && height > 0) {
          // Mifflin-St Jeor Equation (assuming male, add gender option for accuracy)
          let bmr = 10 * weight + 6.25 * height - 5 * age + 5;
          const multipliers: Record<number, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
          const calories = bmr * (multipliers[activity] || 1.55);
          resultValue = Math.round(calories).toString();
          resultLabel = "Daily Calories";
          resultDescription = "This is your estimated daily calorie needs based on your activity level.";
        }
        break;
      }

      case "bmr-calculator": {
        const { age, weight, height } = numValues;
        if (age > 0 && weight > 0 && height > 0) {
          const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
          resultValue = Math.round(bmr).toString();
          resultLabel = "BMR (kcal/day)";
          resultDescription = "Your Basal Metabolic Rate - calories burned at complete rest.";
        }
        break;
      }

      case "water-intake": {
        const { weight } = numValues;
        if (weight > 0) {
          const liters = (weight * 0.033).toFixed(1);
          resultValue = liters;
          resultLabel = "Daily Water (Liters)";
          resultDescription = "Recommended daily water intake based on your body weight.";
        }
        break;
      }

      case "ideal-weight": {
        const { height } = numValues;
        if (height > 0) {
          // Using Devine formula
          const idealWeight = 50 + 0.91 * (height - 152.4);
          resultValue = Math.round(idealWeight).toString();
          resultLabel = "Ideal Weight (kg)";
          resultDescription = "Your ideal body weight based on your height using the Devine formula.";
        }
        break;
      }

      case "tdee-calculator": {
        const { age, weight, height, activity } = numValues;
        if (age > 0 && weight > 0 && height > 0) {
          let bmr = 10 * weight + 6.25 * height - 5 * age + 5;
          const multipliers: Record<number, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
          const tdee = bmr * (multipliers[activity] || 1.55);
          resultValue = Math.round(tdee).toString();
          resultLabel = "TDEE (kcal/day)";
          resultDescription = "Your Total Daily Energy Expenditure including physical activity.";
        }
        break;
      }

      case "heart-rate-zone": {
        const { age } = numValues;
        if (age > 0) {
          const maxHR = 220 - age;
          const zones = [
            { name: "Zone 1 (Recovery)", min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
            { name: "Zone 2 (Fat Burn)", min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
            { name: "Zone 3 (Cardio)", min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
            { name: "Zone 4 (Threshold)", min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
            { name: "Zone 5 (Maximum)", min: Math.round(maxHR * 0.9), max: maxHR },
          ];
          resultValue = zones.map(z => `${z.name}: ${z.min}-${z.max} BPM`).join("\n");
          resultLabel = `Max HR: ${maxHR} BPM`;
          resultDescription = "Heart rate training zones based on your age.";
        }
        break;
      }

      case "body-fat": {
        const { waist, neck, height } = numValues;
        if (waist > 0 && neck > 0 && height > 0) {
          // US Navy method for men
          const bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
          resultValue = bf.toFixed(1) + "%";
          resultLabel = "Body Fat";
          resultDescription = "Estimated body fat percentage using the US Navy method.";
        }
        break;
      }

      case "waist-height": {
        const { waist, height } = numValues;
        if (waist > 0 && height > 0) {
          const ratio = waist / height;
          resultValue = ratio.toFixed(2);
          resultLabel = "Waist-to-Height Ratio";
          if (ratio < 0.5) {
            category = "Healthy";
            resultDescription = "Your ratio indicates low health risk.";
          } else {
            category = "At Risk";
            resultDescription = "Your ratio indicates increased health risk. Consider consulting a healthcare provider.";
          }
        }
        break;
      }

      case "step-calorie": {
        const { steps, weight } = numValues;
        if (steps > 0 && weight > 0) {
          // Approximate: 0.04 calories per step per kg
          const calories = steps * 0.04 * (weight / 70);
          resultValue = Math.round(calories).toString();
          resultLabel = "Calories Burned";
          resultDescription = "Estimated calories burned from walking.";
        }
        break;
      }

      case "sleep-calculator": {
        const { wakeHour } = numValues;
        if (wakeHour >= 0 && wakeHour <= 24) {
          const sleepCycles = [6, 5, 4, 3]; // 90-minute cycles
          const times = sleepCycles.map((cycles) => {
            let sleepMinutes = wakeHour * 60 - cycles * 90 - 15; // 15 min to fall asleep
            if (sleepMinutes < 0) sleepMinutes += 24 * 60;
            const h = Math.floor(sleepMinutes / 60) % 24;
            const m = sleepMinutes % 60;
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
          });
          resultValue = times.join(" or ");
          resultLabel = "Suggested Bedtimes";
          resultDescription = "These times let you wake up at the end of a sleep cycle, feeling more rested.";
        }
        break;
      }

      default:
        resultValue = "Calculation not implemented";
        resultLabel = "Result";
        resultDescription = "This calculator is coming soon.";
    }

    if (resultValue) {
      setResult({ value: resultValue, label: resultLabel, description: resultDescription, category });
      toast({ title: "Calculated!", description: "Your result is ready." });
    } else {
      toast({ title: "Missing values", description: "Please fill in all required fields.", variant: "destructive" });
    }
  };

  // Define inputs based on tool type
  const getInputs = () => {
    switch (tool.id) {
      case "bmi-calculator":
        return [
          { key: "height", label: "Height (cm)", placeholder: "170" },
          { key: "weight", label: "Weight (kg)", placeholder: "70" },
        ];
      case "calorie-calculator":
      case "bmr-calculator":
      case "tdee-calculator":
        return [
          { key: "age", label: "Age (years)", placeholder: "30" },
          { key: "height", label: "Height (cm)", placeholder: "170" },
          { key: "weight", label: "Weight (kg)", placeholder: "70" },
          { key: "activity", label: "Activity Level (1-5)", placeholder: "3" },
        ];
      case "water-intake":
        return [{ key: "weight", label: "Weight (kg)", placeholder: "70" }];
      case "ideal-weight":
        return [{ key: "height", label: "Height (cm)", placeholder: "170" }];
      case "heart-rate-zone":
        return [{ key: "age", label: "Age (years)", placeholder: "30" }];
      case "body-fat":
        return [
          { key: "waist", label: "Waist (cm)", placeholder: "85" },
          { key: "neck", label: "Neck (cm)", placeholder: "38" },
          { key: "height", label: "Height (cm)", placeholder: "170" },
        ];
      case "waist-height":
        return [
          { key: "waist", label: "Waist (cm)", placeholder: "85" },
          { key: "height", label: "Height (cm)", placeholder: "170" },
        ];
      case "step-calorie":
        return [
          { key: "steps", label: "Steps", placeholder: "10000" },
          { key: "weight", label: "Weight (kg)", placeholder: "70" },
        ];
      case "sleep-calculator":
        return [{ key: "wakeHour", label: "Wake Up Time (24h)", placeholder: "7" }];
      default:
        return [{ key: "value", label: "Enter value", placeholder: "Enter value" }];
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label={`${tool.name} calculator`}>
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {getInputs().map((input) => (
          <div key={input.key}>
            <Label htmlFor={input.key} className="text-sm font-medium">
              {input.label}
            </Label>
            <Input
              id={input.key}
              type="number"
              placeholder={input.placeholder}
              value={values[input.key] || ""}
              onChange={(e) => handleInputChange(input.key, e.target.value)}
              className="mt-1"
              aria-describedby={`${input.key}-hint`}
            />
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <Button variant="hero" onClick={calculateResult} className="w-full sm:w-auto">
        <Calculator className="h-4 w-4" aria-hidden="true" />
        Calculate
      </Button>

      {/* Result */}
      {result && (
        <div
          className={cn(
            "p-6 rounded-xl border",
            result.category === "Healthy" || result.category === "Normal weight"
              ? "bg-tool-archive/10 border-tool-archive/30"
              : result.category
                ? "bg-destructive/10 border-destructive/30"
                : "bg-primary/10 border-primary/30"
          )}
          role="status"
          aria-live="polite"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{result.label}</p>
            <p className="text-4xl font-bold text-foreground my-2 whitespace-pre-line">{result.value}</p>
            {result.category && (
              <span
                className={cn(
                  "inline-block px-3 py-1 rounded-full text-sm font-medium mb-2",
                  result.category === "Healthy" || result.category === "Normal weight"
                    ? "bg-tool-archive/20 text-tool-archive"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {result.category}
              </span>
            )}
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Info className="h-4 w-4" aria-hidden="true" />
              {result.description}
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        This calculator provides estimates for informational purposes only. Consult a healthcare provider for medical advice.
      </p>
    </div>
  );
};

export default HealthTool;
