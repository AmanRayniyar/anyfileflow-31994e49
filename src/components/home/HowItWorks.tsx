import { memo } from "react";
import { Search, Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: 1,
    title: "Choose a Tool",
    description: "Select from 1000+ available online tools"
  },
  {
    icon: Upload,
    step: 2,
    title: "Upload Your File",
    description: "Drag and drop or click to upload your file"
  },
  {
    icon: Cpu,
    step: 3,
    title: "Instant Processing",
    description: "Files are processed instantly in your browser"
  },
  {
    icon: Download,
    step: 4,
    title: "Download Result",
    description: "Download the converted or processed file"
  }
];

const HowItWorks = memo(() => {
  return (
    <section className="py-12 bg-background" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Simple, fast, and secure file conversion in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.step}
                  className="relative bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-4 mt-2 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Connector lines for desktop */}
          <div className="hidden lg:block relative -mt-24 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-[12.5%] w-[25%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
            <div className="absolute top-1/2 left-[37.5%] w-[25%] h-0.5 bg-gradient-to-r from-primary/20 to-primary/50" />
            <div className="absolute top-1/2 left-[62.5%] w-[25%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
          </div>
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
