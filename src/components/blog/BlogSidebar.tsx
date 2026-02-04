import { Link } from "react-router-dom";
import { useAllEnabledTools } from "@/hooks/useAllEnabledTools";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Image, Music, Video, Type, Database, Heart, Wrench } from "lucide-react";
import { useMemo } from "react";

const categoryIcons: Record<string, React.ElementType> = {
  image: Image,
  audio: Music,
  video: Video,
  text: Type,
  data: Database,
  health: Heart,
};

const categoryLabels: Record<string, string> = {
  image: "Image & PDF Tools",
  audio: "Audio Tools",
  video: "Video Tools",
  text: "Text Tools",
  data: "Data & Developer Tools",
  health: "Health & Fitness Tools",
};

export function BlogSidebar() {
  const { tools, loading, error } = useAllEnabledTools();

  // Group tools by category
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof tools> = {};
    tools.forEach((tool) => {
      const category = tool.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tool);
    });
    return groups;
  }, [tools]);

  const categoryOrder = ["image", "audio", "video", "text", "data", "health"];

  if (loading) {
    return (
      <aside className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (error || tools.length === 0) {
    return null;
  }

  return (
    <aside className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">All Tools</h3>
        </div>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {categoryOrder.map((category) => {
            const categoryTools = groupedTools[category];
            if (!categoryTools || categoryTools.length === 0) return null;

            const IconComponent = categoryIcons[category] || FileText;

            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {categoryLabels[category] || category}
                  </h4>
                </div>
                <ul className="space-y-1 pl-6">
                  {categoryTools.slice(0, 10).map((tool) => (
                    <li key={tool.id}>
                      <Link
                        to={`/tools/${tool.id}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block py-0.5 truncate"
                        title={tool.name}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  {categoryTools.length > 10 && (
                    <li>
                      <Link
                        to="/tools"
                        className="text-sm text-primary hover:underline block py-0.5"
                      >
                        +{categoryTools.length - 10} more...
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Link
            to="/tools"
            className="block w-full text-center text-sm font-medium text-primary hover:underline"
          >
            View All {tools.length} Tools →
          </Link>
        </div>
      </div>
    </aside>
  );
}
