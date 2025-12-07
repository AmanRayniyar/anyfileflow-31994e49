import { useEffect, useRef, useId } from "react";

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
  const uniqueId = useId().replace(/:/g, '_');

  useEffect(() => {
    if (!adRef.current) return;

    // Clear previous content
    adRef.current.innerHTML = '';

    // Create container div with unique ID
    const containerId = `ad_container_${uniqueId}_${adKey.substring(0, 8)}`;
    const containerDiv = document.createElement('div');
    containerDiv.id = containerId;
    adRef.current.appendChild(containerDiv);

    // Create and inject the ad scripts
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.textContent = `
      window.atOptions = {
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
    invokeScript.async = true;
    containerDiv.appendChild(invokeScript);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adKey, width, height, uniqueId]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div 
        ref={adRef} 
        style={{ minHeight: height, width, maxWidth: '100%' }} 
        className="flex items-center justify-center"
      >
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner;
