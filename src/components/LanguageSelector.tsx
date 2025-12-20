import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage, SUPPORTED_LANGUAGES, Language } from "@/contexts/LanguageContext";
import { useParams } from "react-router-dom";

interface LanguageSelectorProps {
  /** Optional: specify the tool ID to navigate to when changing language */
  toolId?: string;
}

export function LanguageSelector({ toolId }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const params = useParams();
  
  // Use provided toolId or get from URL params
  const activeToolId = toolId || params.toolId;

  const handleLanguageChange = (language: Language) => {
    setLanguage(language, activeToolId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-card border-border hover:bg-accent min-w-[120px] justify-between"
          aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
            <span className="sm:hidden">{currentLanguage.flag}</span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-popover border-border z-50 min-w-[180px]"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`cursor-pointer gap-3 ${
              currentLanguage.code === language.code 
                ? "bg-accent text-accent-foreground" 
                : "hover:bg-accent/50"
            }`}
            aria-current={currentLanguage.code === language.code ? "true" : undefined}
          >
            <span className="text-lg" aria-hidden="true">{language.flag}</span>
            <div className="flex flex-col flex-1">
              <span className="font-medium">{language.name}</span>
              <span className="text-xs text-muted-foreground">{language.nativeName}</span>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Language suggestion banner for first-time visitors
 * Shows when browser language differs from current language
 */
export function LanguageSuggestionBanner() {
  const { suggestedLanguage, showSuggestion, setLanguage, dismissSuggestion } = useLanguage();
  const params = useParams();
  
  if (!showSuggestion || !suggestedLanguage) return null;
  
  return (
    <div 
      className="bg-primary/10 border-b border-primary/20 px-4 py-3"
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
        <span className="text-foreground">
          {suggestedLanguage.flag} Would you like to view this page in {suggestedLanguage.name} ({suggestedLanguage.nativeName})?
        </span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => setLanguage(suggestedLanguage, params.toolId)}
            className="h-7"
          >
            Yes, switch to {suggestedLanguage.name}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={dismissSuggestion}
            className="h-7"
          >
            No, keep English
          </Button>
        </div>
      </div>
    </div>
  );
}
