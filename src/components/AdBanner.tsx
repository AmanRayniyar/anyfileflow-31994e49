import { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current || !containerRef.current) return;
    isMountedRef.current = true;

    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      // Create iframe directly instead of using script injection
      const iframe = document.createElement('iframe');
      iframe.src = `//www.highperformanceformat.com/watchnew?key=${adKey}`;
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.border = 'none';
      iframe.style.display = 'block';
      
      // Clear and append
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(iframe);
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [adKey, width, height, delay]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center overflow-hidden">
      <div 
        ref={containerRef}
        style={{ minHeight: height, width, maxWidth: '100%' }} 
        className="flex items-center justify-center"
      >
        <span className="text-xs text-muted-foreground">Advertisement</span>
      </div>
    </div>
  );
};

export default AdBanner;
