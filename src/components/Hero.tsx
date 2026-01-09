import { memo, Suspense, lazy } from "react";

const GlobalUsersCounter = lazy(() => import("@/components/home/GlobalUsersCounter"));

// Inline SVG Icons
const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Hero = memo(() => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" aria-labelledby="hero-heading">
      {/* Background - reduce complexity for performance */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - smaller for mobile */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <ZapIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">1000+ Free Tools</span>
          </div>

          {/* Heading - Critical LCP element */}
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-3 md:mb-4">
            Convert Any File with <span className="flow-text">AnyFile Flow</span>
          </h1>

          {/* Outcome line */}
          <p className="text-base md:text-lg text-foreground font-medium mb-3">
            Convert images, PDFs, audio, and more — directly in your browser.
          </p>

          {/* Description */}
          <p className="text-sm md:text-base text-muted-foreground/70 mb-6 max-w-2xl mx-auto">
            The ultimate toolkit for all your file conversions. Fast, free, and secure. No registration required.
          </p>

          {/* Global Users Counter */}
          <div className="mb-8 md:mb-12">
            <Suspense fallback={<div className="h-16" />}>
              <GlobalUsersCounter />
            </Suspense>
          </div>

          {/* Features */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <li className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-archive/10">
                <ZapIcon className="h-5 w-5 text-tool-archive" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Lightning Fast</p>
                <p className="text-sm text-muted-foreground">Instant conversions</p>
              </div>
            </li>
            <li className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-audio/10">
                <ShieldIcon className="h-5 w-5 text-tool-audio" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">100% Secure</p>
                <p className="text-sm text-muted-foreground">Files stay private</p>
              </div>
            </li>
            <li className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-tool-code/10">
                <ClockIcon className="h-5 w-5 text-tool-code" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">No Limits</p>
                <p className="text-sm text-muted-foreground">Free unlimited use</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
