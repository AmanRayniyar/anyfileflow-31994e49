import { memo } from "react";
import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Free to use", anyfile: true, others: "Limited" },
  { feature: "No registration", anyfile: true, others: false },
  { feature: "Unlimited conversions", anyfile: true, others: false },
  { feature: "200+ tools", anyfile: true, others: false },
  { feature: "AI-powered features", anyfile: true, others: "Paid" },
  { feature: "Files stay on device", anyfile: true, others: false },
  { feature: "No ads interruption", anyfile: true, others: false },
  { feature: "Mobile friendly", anyfile: true, others: "Limited" }
];

const ComparisonSection = memo(() => {
  return (
    <section className="py-12 bg-background" aria-labelledby="comparison-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="comparison-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            AnyFile Flow vs Competitors
          </h2>
          <p className="text-muted-foreground">See why users choose AnyFile Flow</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 border-b border-border">
              <div className="font-semibold text-foreground text-sm">Feature</div>
              <div className="text-center font-bold text-primary text-sm">AnyFile Flow</div>
              <div className="text-center font-semibold text-muted-foreground text-sm">Others</div>
            </div>
            
            {/* Rows */}
            <div className="divide-y divide-border">
              {comparisons.map((row) => (
                <div key={row.feature} className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <div className="text-foreground text-sm">{row.feature}</div>
                  <div className="flex justify-center">
                    {row.anyfile === true ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" aria-label="Yes" />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">{String(row.anyfile)}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.others === false ? (
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <X className="h-4 w-4 text-red-500" aria-label="No" />
                      </div>
                    ) : row.others === true ? (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-500" aria-label="Yes" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{row.others}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ComparisonSection.displayName = "ComparisonSection";

export default ComparisonSection;
