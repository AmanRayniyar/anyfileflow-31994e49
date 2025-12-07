import { useEffect, useRef } from "react";

const AdBanner = () => {
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
        'key' : '204ac3e1d66348d2a6d3c4f02054516d',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    adRef.current.appendChild(atOptionsScript);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/204ac3e1d66348d2a6d3c4f02054516d/invoke.js';
    adRef.current.appendChild(invokeScript);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div ref={adRef} className="min-h-[250px] w-[300px] flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner;
