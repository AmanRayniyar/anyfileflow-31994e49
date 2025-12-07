import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
}

// Global counter to stagger ad loading
let adLoadCounter = 0;

const AdBanner = ({ 
  adKey = '204ac3e1d66348d2a6d3c4f02054516d', 
  width = 300, 
  height = 250 
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const loadOrderRef = useRef<number>(0);

  useEffect(() => {
    if (!adRef.current || adLoaded) return;

    // Get unique load order
    loadOrderRef.current = adLoadCounter++;
    const delay = loadOrderRef.current * 500; // Stagger by 500ms

    const timeoutId = setTimeout(() => {
      if (!adRef.current) return;

      // Clear previous content
      adRef.current.innerHTML = '';

      // Create container div
      const containerDiv = document.createElement('div');
      containerDiv.style.width = `${width}px`;
      containerDiv.style.minHeight = `${height}px`;
      adRef.current.appendChild(containerDiv);

      // Create and inject the ad scripts
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.textContent = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      containerDiv.appendChild(atOptionsScript);

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      containerDiv.appendChild(invokeScript);

      setAdLoaded(true);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [adKey, width, height, adLoaded]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div 
        ref={adRef} 
        style={{ minHeight: height, width, maxWidth: '100%' }} 
        className="flex items-center justify-center"
      >
        {!adLoaded && (
          <span className="text-xs text-muted-foreground">Advertisement</span>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
