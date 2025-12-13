import { memo } from "react";

const comparisons = [
  { feature: "Free to use", anyfile: "✅ Always free", smallpdf: "⚠️ Limited free usage", zamzar: "⚠️ 2 free/day" },
  { feature: "Registration required", anyfile: "❌ No account needed", smallpdf: "✅ Required for full access", zamzar: "✅ Required" },
  { feature: "Conversion limits", anyfile: "♾️ Unlimited", smallpdf: "⛔ Daily limits", zamzar: "⛔ 2 files/day" },
  { feature: "Number of tools", anyfile: "🧰 200+ tools", smallpdf: "🔢 20–60 tools", zamzar: "🔢 30+ formats" },
  { feature: "AI-assisted tools", anyfile: "🤖 Built-in AI", smallpdf: "💰 Paid add-ons", zamzar: "❌ None" },
  { feature: "File processing", anyfile: "🔒 On-device (browser)", smallpdf: "☁️ Server-based", zamzar: "☁️ Server-based" },
  { feature: "Privacy & security", anyfile: "🛡️ Zero file storage", smallpdf: "⚠️ Temporary storage", zamzar: "⚠️ 24hr storage" },
  { feature: "Ads experience", anyfile: "🚫 No intrusive ads", smallpdf: "📢 Ads / paywalls", zamzar: "📢 Ads present" },
  { feature: "Mobile experience", anyfile: "📱 Fully optimized", smallpdf: "⚠️ Limited", zamzar: "⚠️ Basic" },
  { feature: "Speed", anyfile: "⚡ WebAssembly fast", smallpdf: "🐢 Server-dependent", zamzar: "🐢 Queue-based" }
];

const ComparisonSection = memo(() => {
  return (
    <section className="py-16 bg-background" aria-labelledby="comparison-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 id="comparison-heading" className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            AnyFile Flow vs Popular File Tools
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            See how AnyFile Flow compares with other leading platforms
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 p-3 md:p-5 bg-muted/50 border-b border-border">
              <div className="font-semibold text-foreground text-xs md:text-base">Feature</div>
              <div className="text-center font-bold text-primary text-xs md:text-base">AnyFile Flow</div>
              <div className="text-center font-semibold text-muted-foreground text-xs md:text-base leading-tight">
                <span className="hidden lg:inline">SmallPDF / iLovePDF</span>
                <span className="lg:hidden">SmallPDF</span>
              </div>
              <div className="text-center font-semibold text-muted-foreground text-xs md:text-base leading-tight">
                <span className="hidden lg:inline">Zamzar / Convertio</span>
                <span className="lg:hidden">Zamzar</span>
              </div>
            </div>
            
            {/* Rows */}
            <div className="divide-y divide-border">
              {comparisons.map((row) => (
                <div 
                  key={row.feature} 
                  className="grid grid-cols-4 gap-2 md:gap-4 p-3 md:p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="text-foreground text-xs md:text-base font-medium">{row.feature}</div>
                  <div className="text-center text-xs md:text-base text-green-600 dark:text-green-400">
                    {row.anyfile}
                  </div>
                  <div className="text-center text-xs md:text-base text-muted-foreground">
                    {row.smallpdf}
                  </div>
                  <div className="text-center text-xs md:text-base text-muted-foreground">
                    {row.zamzar}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trust line */}
          <p className="text-center text-xs md:text-sm text-muted-foreground/70 mt-6 italic">
            Comparison based on publicly available features of SmallPDF, iLovePDF, Zamzar, and Convertio.
          </p>
        </div>
      </div>
    </section>
  );
});

ComparisonSection.displayName = "ComparisonSection";

export default ComparisonSection;
