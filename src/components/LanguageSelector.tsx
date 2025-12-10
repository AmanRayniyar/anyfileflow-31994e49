import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const languages = [
  { code: "en", gtCode: "en", name: "English", flag: "🇺🇸" },
  { code: "es", gtCode: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", gtCode: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", gtCode: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", gtCode: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", gtCode: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ru", gtCode: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", gtCode: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ja", gtCode: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", gtCode: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", gtCode: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", gtCode: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ne", gtCode: "ne", name: "नेपाली", flag: "🇳🇵" },
  { code: "th", gtCode: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", gtCode: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", gtCode: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", gtCode: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tr", gtCode: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "pl", gtCode: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "nl", gtCode: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "sv", gtCode: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "da", gtCode: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "no", gtCode: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "fi", gtCode: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "el", gtCode: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", gtCode: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "ro", gtCode: "ro", name: "Română", flag: "🇷🇴" },
  { code: "hu", gtCode: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "uk", gtCode: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "he", gtCode: "he", name: "עברית", flag: "🇮🇱" },
  { code: "bn", gtCode: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "ta", gtCode: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", gtCode: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", gtCode: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", gtCode: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", gtCode: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", gtCode: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", gtCode: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", gtCode: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "fa", gtCode: "fa", name: "فارسی", flag: "🇮🇷" },
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language");
    if (saved) {
      setSelectedLanguage(saved);
      // Auto-translate on page load if language was previously selected
      if (saved !== "en") {
        setTimeout(() => {
          triggerTranslation(saved);
        }, 1000);
      }
    }
  }, []);

  const triggerTranslation = (langCode: string) => {
    const lang = languages.find(l => l.code === langCode);
    if (!lang) return;

    // Find the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (selectElement) {
      if (langCode === "en") {
        // Reset to English - find and click the restore link
        const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
        if (frame && frame.contentDocument) {
          const closeBtn = frame.contentDocument.querySelector('.goog-close-link');
          if (closeBtn) {
            (closeBtn as HTMLElement).click();
          }
        }
        // Alternative: Set cookie to reset
        document.cookie = "googtrans=/en/en; path=/";
        window.location.reload();
      } else {
        selectElement.value = lang.gtCode;
        selectElement.dispatchEvent(new Event('change'));
      }
    } else {
      // If Google Translate not loaded yet, use cookie method
      document.cookie = `googtrans=/en/${lang.gtCode}; path=/`;
      document.cookie = `googtrans=/en/${lang.gtCode}; path=/; domain=${window.location.hostname}`;
      
      // Reload to apply translation
      if (langCode !== "en") {
        window.location.reload();
      }
    }
  };

  const handleLanguageChange = (code: string) => {
    if (code === selectedLanguage) return;
    
    setIsTranslating(true);
    setSelectedLanguage(code);
    localStorage.setItem("preferred-language", code);
    
    const lang = languages.find(l => l.code === code);
    
    if (code === "en") {
      // Reset to English
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      toast.success("Switching to English...");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      toast.success(`Translating to ${lang?.name}...`);
      triggerTranslation(code);
      setTimeout(() => setIsTranslating(false), 2000);
    }
  };

  const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 gap-2 shrink-0"
          aria-label="Select language"
          disabled={isTranslating}
        >
          <span className="text-base">{currentLang.flag}</span>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-52 max-h-[400px] overflow-y-auto bg-popover border border-border z-50"
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
          Select Language
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              selectedLanguage === lang.code ? "bg-accent" : ""
            }`}
          >
            <span className="text-base w-6">{lang.flag}</span>
            <span className="text-sm flex-1">{lang.name}</span>
            {selectedLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
