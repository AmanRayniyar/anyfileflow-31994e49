import { memo } from "react";
import { Shield, Zap, Globe, Lock, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process files instantly in your browser"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Files never leave your device"
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "No download or installation required"
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Zero data collection or tracking"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Smart tools with AI assistance"
  },
  {
    icon: Users,
    title: "Free Forever",
    description: "No limits, no registration needed"
  }
];

const WhyAnyFileFlow = memo(() => {
  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="why-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="why-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Why Choose AnyFile Flow?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by millions worldwide for fast, secure, and free file conversions
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

WhyAnyFileFlow.displayName = "WhyAnyFileFlow";

export default WhyAnyFileFlow;
