import { useEffect, useRef, useState } from "react";

const HomeAdBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded || !containerRef.current) return;

    // Create the ad container div with specific ID
    const adContainer = document.createElement('div');
    adContainer.id = 'container-c716bd39c57b2028b56b7a3d6f29c01c';
    containerRef.current.appendChild(adContainer);

    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl28208125.effectivegatecpm.com/c716bd39c57b2028b56b7a3d6f29c01c/invoke.js';
    containerRef.current.appendChild(script);

    setIsLoaded(true);
  }, [isLoaded]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div 
        ref={containerRef}
        className="flex items-center justify-center"
      >
        {!isLoaded && (
          <span className="text-xs text-muted-foreground">Advertisement</span>
        )}
      </div>
    </div>
  );
};

export default HomeAdBanner;
