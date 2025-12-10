import { Zap, Shield, Clock } from "lucide-react";
import { tools } from "@/data/tools";
import { memo } from "react";
const Hero = memo(() => {
  return <section className="relative overflow-hidden py-16 md:py-24" aria-labelledby="hero-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl animate-float" style={{
        animationDelay: "-3s"
      }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - no animation delay */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">
              {tools.length}+ Free Tools Available
            </span>
          </div>

          {/* Heading - removed animation delay for faster LCP */}
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Convert Any File with{" "}
            <span className="flow-text">AnyFile Flow</span>
          </h1>

          {/* Description - LCP element, no delay */}
          

          {/* Features */}
          
        </div>
      </div>
    </section>;
});
Hero.displayName = "Hero";
export default Hero;