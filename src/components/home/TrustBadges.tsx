import { memo } from "react";

// Inline SVG icons for performance (no lucide-react import)
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const badges = [
  {
    icon: UsersIcon,
    label: "Trusted by users worldwide",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: ShieldCheckIcon,
    label: "No File Storage",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: ZapIcon,
    label: "Fast WebAssembly Engine",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: SearchIcon,
    label: "Google Search Optimized",
    color: "text-destructive",
    bg: "bg-destructive/10"
  }
];

const TrustBadges = memo(() => {
  return (
    <section className="py-6 bg-gradient-to-r from-muted/50 via-muted to-muted/50" aria-label="Trust indicators">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-1.5 rounded-full ${badge.bg}`}>
                <badge.icon className={`h-4 w-4 ${badge.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustBadges.displayName = "TrustBadges";

export default TrustBadges;
