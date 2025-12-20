import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// Supported languages configuration
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];
const LANGUAGE_STORAGE_KEY = "anyfileflow-preferred-language";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language, toolId?: string) => void;
  getLocalizedPath: (path: string, langCode?: string) => string;
  isRTL: boolean;
  suggestedLanguage: Language | null;
  dismissSuggestion: () => void;
  showSuggestion: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Detects the user's preferred language based on browser settings
 * Returns a supported language or null if no match
 */
function detectBrowserLanguage(): Language | null {
  const browserLang = navigator.language || (navigator as any).userLanguage || "";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  return SUPPORTED_LANGUAGES.find(lang => lang.code === langCode) || null;
}

/**
 * Gets the saved language preference from localStorage
 */
function getSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return SUPPORTED_LANGUAGES.find(lang => lang.code === parsed.code) || null;
    }
  } catch (e) {
    console.error("Error reading language preference:", e);
  }
  return null;
}

/**
 * Saves language preference to localStorage
 */
function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify({ code: lang.code }));
  } catch (e) {
    console.error("Error saving language preference:", e);
  }
}

/**
 * Extracts language code from URL path if present
 */
function getLanguageFromPath(pathname: string): Language | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const potentialLang = segments[0].toLowerCase();
    return SUPPORTED_LANGUAGES.find(lang => lang.code === potentialLang) || null;
  }
  return null;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine initial language from URL, localStorage, or default
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const urlLang = getLanguageFromPath(location.pathname);
    if (urlLang) return urlLang;
    
    const savedLang = getSavedLanguage();
    if (savedLang) return savedLang;
    
    return DEFAULT_LANGUAGE;
  });
  
  // Language suggestion state (for first-time visitors)
  const [suggestedLanguage, setSuggestedLanguage] = useState<Language | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  // Check for browser language suggestion on mount
  useEffect(() => {
    const savedLang = getSavedLanguage();
    const urlLang = getLanguageFromPath(location.pathname);
    
    // Only suggest if user hasn't set a preference and URL doesn't specify language
    if (!savedLang && !urlLang) {
      const browserLang = detectBrowserLanguage();
      if (browserLang && browserLang.code !== DEFAULT_LANGUAGE.code) {
        setSuggestedLanguage(browserLang);
        setShowSuggestion(true);
      }
    }
  }, []);
  
  // Sync language from URL changes
  useEffect(() => {
    const urlLang = getLanguageFromPath(location.pathname);
    if (urlLang && urlLang.code !== currentLanguage.code) {
      setCurrentLanguage(urlLang);
      saveLanguage(urlLang);
    }
  }, [location.pathname]);
  
  // Update document direction for RTL languages
  useEffect(() => {
    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);
  
  /**
   * Generates a localized path for the given route
   * For default language (en), returns path without prefix
   * For other languages, adds language prefix
   */
  const getLocalizedPath = useCallback((path: string, langCode?: string): string => {
    const lang = langCode || currentLanguage.code;
    
    // Remove any existing language prefix
    let cleanPath = path;
    for (const supportedLang of SUPPORTED_LANGUAGES) {
      if (path.startsWith(`/${supportedLang.code}/`)) {
        cleanPath = path.substring(supportedLang.code.length + 1);
        break;
      } else if (path === `/${supportedLang.code}`) {
        cleanPath = "/";
        break;
      }
    }
    
    // For default language, return clean path (no prefix)
    if (lang === DEFAULT_LANGUAGE.code) {
      return cleanPath;
    }
    
    // For other languages, add prefix
    if (cleanPath === "/") {
      return `/${lang}`;
    }
    return `/${lang}${cleanPath}`;
  }, [currentLanguage.code]);
  
  /**
   * Changes the current language and navigates to the localized URL
   */
  const setLanguage = useCallback((lang: Language, toolId?: string) => {
    if (lang.code === currentLanguage.code) return;
    
    setCurrentLanguage(lang);
    saveLanguage(lang);
    setShowSuggestion(false);
    
    // Build the new path
    let newPath: string;
    if (toolId) {
      // If toolId is provided, navigate to that tool in new language
      newPath = getLocalizedPath(`/tool/${toolId}`, lang.code);
    } else {
      // Otherwise, navigate current path in new language
      newPath = getLocalizedPath(location.pathname, lang.code);
    }
    
    navigate(newPath);
  }, [currentLanguage.code, getLocalizedPath, location.pathname, navigate]);
  
  const dismissSuggestion = useCallback(() => {
    setShowSuggestion(false);
    saveLanguage(currentLanguage); // Save current preference to prevent future suggestions
  }, [currentLanguage]);
  
  return (
    <LanguageContext.Provider 
      value={{
        currentLanguage,
        setLanguage,
        getLocalizedPath,
        isRTL: currentLanguage.dir === "rtl",
        suggestedLanguage,
        showSuggestion,
        dismissSuggestion,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Export supported language codes for route matching
export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(l => l.code);
