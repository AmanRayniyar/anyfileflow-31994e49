import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
  delay?: number;
}

const AdBanner = ({ 
  adKey = '204ac3e1d66348d2a6d3c4f02054516d', 
  width = 300, 
  height = 250,
  delay = 0
}: AdBannerProps) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptIdRef = useRef(`ad_${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    if (isLoaded) return;

    const timer = setTimeout(() => {
      if (!adContainerRef.current) return;

      // Set atOptions before loading invoke script
      (window as any).atOptions = {
        'key': adKey,
        'format': 'iframe',
        'height': height,
        'width': width,
        'params': {}
      };

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.id = scriptIdRef.current;
      
      // Append to the container
      adContainerRef.current.appendChild(invokeScript);
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [adKey, width, height, delay, isLoaded]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div 
        ref={adContainerRef}
        style={{ minHeight: height, width, maxWidth: '100%' }} 
        className="flex items-center justify-center"
      >
        {!isLoaded && (
          <span className="text-xs text-muted-foreground">Advertisement</span>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
