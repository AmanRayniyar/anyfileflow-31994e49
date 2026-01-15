import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found - AnyFile Flow"
        description="The page you're looking for doesn't exist. Return to AnyFile Flow homepage to explore 1000+ free online tools."
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
            <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
