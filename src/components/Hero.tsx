import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { tools } from "@/data/tools";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {tools.length}+ Free Tools Available
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Convert Any File with{" "}
            <span className="flow-text">AnyFile Flow</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The ultimate toolkit for all your file conversions. Fast, free, and secure. 
            No registration required – just drag, drop, and convert.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/tools">
                Explore All Tools
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/tool/jpg-to-png">
                Try JPG to PNG
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-archive/10">
                <Zap className="h-5 w-5 text-tool-archive" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Lightning Fast</p>
                <p className="text-sm text-muted-foreground">Instant conversions</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-audio/10">
                <Shield className="h-5 w-5 text-tool-audio" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">100% Secure</p>
                <p className="text-sm text-muted-foreground">Files stay private</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-code/10">
                <Clock className="h-5 w-5 text-tool-code" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">No Limits</p>
                <p className="text-sm text-muted-foreground">Free unlimited use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;