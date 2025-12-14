import { memo } from "react";
import { Users, ShieldCheck, Zap, Search } from "lucide-react";

const badges = [
  {
    icon: Users,
    label: "Trusted by users worldwide",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    icon: ShieldCheck,
    label: "No File Storage",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Zap,
    label: "Fast WebAssembly Engine",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    icon: Search,
    label: "Google Search Optimized",
    color: "text-red-500",
    bg: "bg-red-500/10"
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
                <badge.icon className={`h-4 w-4 ${badge.color}`} aria-hidden="true" />
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
