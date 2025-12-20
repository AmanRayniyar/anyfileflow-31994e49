// Translation types and utilities for multi-language support

export interface ToolTranslation {
  // Page meta
  pageTitle: string;
  pageDescription: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // Feature badges
  features: {
    free: string;
    noSignup: string;
    instant: string;
    secure: string;
  };
  
  // How to use section
  howToUse: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
  };
  
  // Benefits section
  benefits: {
    title: string;
    items: string[];
  };
  
  // Comparison section
  comparison: {
    title: string;
    feature: string;
    transparency: string;
    compression: string;
    fileSize: string;
    bestFor: string;
    jpgTransparency: string;
    pngTransparency: string;
    jpgCompression: string;
    pngCompression: string;
    jpgFileSize: string;
    pngFileSize: string;
    jpgBestFor: string;
    pngBestFor: string;
  };
  
  // Security section
  security: {
    title: string;
    description: string;
    points: string[];
  };
  
  // FAQ section
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  
  // CTA section
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  
  // Common UI
  ui: {
    uploadFiles: string;
    dragDrop: string;
    convert: string;
    download: string;
    processing: string;
    complete: string;
    error: string;
    tryAgain: string;
  };
}

export type SupportedLanguage = "en" | "hi" | "es" | "pt" | "ar";

// Import translations
import { enTranslation } from "./en";
import { hiTranslation } from "./hi";
import { esTranslation } from "./es";
import { ptTranslation } from "./pt";
import { arTranslation } from "./ar";

export const translations: Record<SupportedLanguage, ToolTranslation> = {
  en: enTranslation,
  hi: hiTranslation,
  es: esTranslation,
  pt: ptTranslation,
  ar: arTranslation,
};

export function getTranslation(langCode: string): ToolTranslation {
  const lang = langCode as SupportedLanguage;
  return translations[lang] || translations.en;
}
