import { memo } from "react";
import { Link } from "react-router-dom";
import { Minimize2, RefreshCw, FileText, Scissors, Layers, QrCode } from "lucide-react";

const quickActions = [
  {
    title: "Compress Image",
    description: "Reduce file size instantly",
    icon: Minimize2,
    href: "/tool/image-compressor",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Convert to PNG",
    description: "JPG, WebP to PNG",
    icon: RefreshCw,
    href: "/tool/jpg-to-png",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Merge PDFs",
    description: "Combine multiple PDFs",
    icon: Layers,
    href: "/tool/pdf-merger",
    color: "from-red-500 to-pink-500"
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size",
    icon: FileText,
    href: "/tool/pdf-compressor",
    color: "from-orange-500 to-amber-500"
  },
  {
    title: "Crop Image",
    description: "Trim to any size",
    icon: Scissors,
    href: "/tool/image-cropper",
    color: "from-purple-500 to-violet-500"
  },
  {
    title: "Generate QR",
    description: "Create QR codes",
    icon: QrCode,
    href: "/tool/qr-generator",
    color: "from-indigo-500 to-blue-500"
  }
];

const QuickActionsCTA = memo(() => {
  return (
    <section className="py-10 bg-secondary/30" aria-labelledby="quick-actions-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 id="quick-actions-heading" className="text-xl md:text-2xl font-bold text-foreground mb-1">
            Quick Actions
          </h2>
          <p className="text-sm text-muted-foreground">One-click access to popular tools</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group relative overflow-hidden rounded-xl p-4 bg-card border border-border hover:border-transparent hover:shadow-xl transition-all duration-300"
              aria-label={`${action.title}: ${action.description}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className={`w-10 h-10 mb-3 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

QuickActionsCTA.displayName = "QuickActionsCTA";

export default QuickActionsCTA;
