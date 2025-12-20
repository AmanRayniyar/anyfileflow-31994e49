import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { tools, categories } from "@/data/tools";
import { Button } from "@/components/ui/button";
import { useAnyFlowAI } from "@/hooks/useAnyFlowAI";

const suggestions = [
  { query: "I need to convert a photo for social media", toolIds: ["image-compressor", "image-cropper", "jpg-to-png"] },
  { query: "I want to edit my podcast audio", toolIds: ["audio-cutter", "noise-removal", "volume-booster"] },
  { query: "I need to work with PDF documents", toolIds: ["pdf-merger", "pdf-compressor", "pdf-splitter"] },
  { query: "I want to create marketing materials", toolIds: ["qr-generator", "meme-generator", "watermark-image"] }
];

const AIToolRecommender = memo(() => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const { open } = useAnyFlowAI();

  const recommendedTools = selectedSuggestion !== null 
    ? suggestions[selectedSuggestion].toolIds
        .map(id => tools.find(t => t.id === id))
        .filter(Boolean)
    : [];

  return (
    <section className="py-10" aria-labelledby="ai-recommender-heading">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 shrink-0" aria-hidden="true">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 id="ai-recommender-heading" className="text-xl md:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                AI Tool Recommender
                <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              </h2>
              <p className="text-muted-foreground">
                Tell us what you need, and we'll find the perfect tool for you
              </p>
            </div>
          </div>
          
          {/* Quick suggestions */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" aria-hidden="true" />
              Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSuggestion(selectedSuggestion === index ? null : index)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all min-h-[44px] ${
                    selectedSuggestion === index
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/50'
                  }`}
                  aria-pressed={selectedSuggestion === index}
                >
                  {suggestion.query}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended tools */}
          {recommendedTools.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-3">
                Recommended tools for you:
              </p>
              <div className="flex flex-wrap gap-3">
                {recommendedTools.map((tool) => {
                  if (!tool) return null;
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={`/tool/${tool.id}`}
                      className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:border-primary/50 transition-all"
                      aria-label={`Use ${tool.name}`}
                    >
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span className="text-sm font-medium">{tool.name}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ask AI button */}
          <div className="space-y-2">
            <Button 
              onClick={open}
              className="gap-2"
              size="lg"
            >
              <Bot className="h-4 w-4" aria-hidden="true" />
              Ask AnyFlow AI (Free Tool Assistant)
            </Button>
            <p className="text-sm text-muted-foreground">
              Describe your task in plain English.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

AIToolRecommender.displayName = "AIToolRecommender";

export default AIToolRecommender;
