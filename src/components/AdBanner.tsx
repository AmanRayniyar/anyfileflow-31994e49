import { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey?: string;
  width?: number;
  height?: number;
}

const AdBanner = ({ 
  adKey = '204ac3e1d66348d2a6d3c4f02054516d', 
  width = 300, 
  height = 250 
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous content
    adRef.current.innerHTML = '';

    // Create and inject the ad scripts
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.text = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    adRef.current.appendChild(atOptionsScript);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    adRef.current.appendChild(invokeScript);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adKey, width, height]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div ref={adRef} style={{ minHeight: height, width }} className="flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner;
