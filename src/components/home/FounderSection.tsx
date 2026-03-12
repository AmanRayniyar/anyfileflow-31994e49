import { memo } from "react";
import { User, ExternalLink } from "lucide-react";

// Optimized: use lazy-loaded smaller image instead of 522KB founder.png
const founderImg = "https://storage.googleapis.com/gpt-engineer-file-uploads/nFHi4tXsNpTAZh1K4XzsCObEP113/uploads/1769377488356-1000077412.webp";

const FounderSection = memo(() => {
  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="founder-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <User className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-primary">Who Built AnyFile Flow?</span>
            </div>
            <h2 id="founder-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Meet the Founder
            </h2>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Founder Image - optimized with small webp */}
              <div className="relative flex-shrink-0">
                <img 
                  src={founderImg} 
                  alt="Aman Rauniyar - Founder of AnyFile Flow" 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                  width="128"
                  height="128"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#1DA1F2] rounded-full p-1.5 shadow-lg border-2 border-background">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">Aman Rauniyar</h3>
                <p className="text-sm text-primary font-medium mb-3">Founder & Developer</p>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AnyFile Flow was founded by Aman Rauniyar, an educator and developer focused on 
                  building free, accessible, privacy-first tools for students, creators, 
                  educators, and professionals worldwide.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The platform is built with a mission to remove paywalls and privacy risks 
                  from everyday digital tools, making powerful file conversion accessible to everyone.
                </p>

                <div className="flex items-center justify-center md:justify-start gap-3">
                  <a href="https://www.facebook.com/aman.rauniyar.980" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Aman Rauniyar on Facebook">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />Facebook
                  </a>
                  <a href="https://github.com/AmanRayniyar" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Aman Rauniyar on GitHub">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />GitHub
                  </a>
                  <a href="https://www.instagram.com/amanrauniyar2064/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Aman Rauniyar on Instagram">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FounderSection.displayName = "FounderSection";

export default FounderSection;
