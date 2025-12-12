import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Crown, ArrowRight, Star } from "lucide-react";
import { tools } from "@/data/tools";

const MostPopularToday = memo(() => {
  const popularTools = useMemo(() => 
    tools.filter(t => t.popular).slice(0, 6),
    []
  );

  return (
    <section className="py-10 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" aria-labelledby="popular-today-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10" aria-hidden="true">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 id="popular-today-heading" className="text-xl font-bold text-foreground">
                Most Popular Today
              </h2>
              <p className="text-sm text-muted-foreground">Top-rated tools by our users</p>
            </div>
          </div>
          <Link 
            to="/tools" 
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            aria-label="View all tools"
          >
            View All <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all overflow-hidden"
                aria-label={`${tool.name} - popular tool`}
              >
                {index < 3 && (
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      index === 0 ? 'bg-yellow-500 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      'bg-amber-600 text-amber-100'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                            aria-hidden="true" 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(4.{8 + index % 2})</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

MostPopularToday.displayName = "MostPopularToday";

export default MostPopularToday;
