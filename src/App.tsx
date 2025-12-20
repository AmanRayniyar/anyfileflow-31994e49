import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";

// Lazy load non-critical pages for code splitting
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

// Optimized loading fallback with accessibility
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite" aria-label="Loading page">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// App routes component that uses LanguageProvider (must be inside BrowserRouter)
const AppRoutes = () => (
  <LanguageProvider>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Default language routes (English) */}
        <Route path="/" element={<Index />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/brand" element={<BrandPage />} />
        
        {/* Language-prefixed routes (hi, es, pt, ar) */}
        <Route path="/:lang" element={<Index />} />
        <Route path="/:lang/tools" element={<ToolsPage />} />
        <Route path="/:lang/tool/:toolId" element={<ToolPage />} />
        <Route path="/:lang/about" element={<AboutPage />} />
        <Route path="/:lang/blog" element={<BlogPage />} />
        <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
        <Route path="/:lang/contact" element={<ContactPage />} />
        <Route path="/:lang/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/:lang/terms" element={<TermsPage />} />
        <Route path="/:lang/disclaimer" element={<DisclaimerPage />} />
        <Route path="/:lang/brand" element={<BrandPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </LanguageProvider>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
