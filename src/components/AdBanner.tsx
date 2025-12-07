import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  adKey?: string;
  delay?: number;
}

const AdBanner = ({ 
  adKey = '204ac3e1d66348d2a6d3c4f02054516d', 
  delay = 0
}: AdBannerProps) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const timer = setTimeout(() => {
      if (!adContainerRef.current) return;

      // Set atOptions before loading invoke script - responsive sizing
      (window as any).atOptions = {
        'key': adKey,
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      
      // Append to the container
      adContainerRef.current.appendChild(invokeScript);
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [adKey, delay, isLoaded]);

  return (
    <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 overflow-hidden">
      <p className="text-xs text-muted-foreground text-center mb-2 sm:mb-3">
        To keep this site 100% free, a small ad is shown below
      </p>
      <div 
        ref={adContainerRef}
        className="flex items-center justify-center w-full min-h-[250px] max-w-full overflow-hidden"
      >
        {!isLoaded && (
          <span className="text-xs text-muted-foreground">Advertisement</span>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
