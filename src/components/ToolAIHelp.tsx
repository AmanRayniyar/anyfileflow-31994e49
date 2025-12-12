import { Bot, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnyFlowAI } from "@/hooks/useAnyFlowAI";

interface ToolAIHelpProps {
  toolName: string;
  toolDescription: string;
}

const ToolAIHelp = ({ toolName, toolDescription }: ToolAIHelpProps) => {
  const { open } = useAnyFlowAI();

  const handleAskAI = () => {
    open();
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
            Need Help with {toolName}?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
            Ask AnyFlow AI for assistance with this tool, tips for best results, or questions about {toolDescription.toLowerCase()}.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleAskAI}
              size="sm"
              className="gap-1.5 text-xs"
            >
              <MessageCircleQuestion className="h-3.5 w-3.5" aria-hidden="true" />
              Ask AnyFlow AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolAIHelp;
