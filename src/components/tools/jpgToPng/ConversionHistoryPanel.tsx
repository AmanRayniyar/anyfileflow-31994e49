import React from 'react';
import { Clock, Download, Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConvertedImage } from './types';
import { formatDistanceToNow } from 'date-fns';

interface ConversionHistoryPanelProps {
  images: ConvertedImage[];
  onDownload: (image: ConvertedImage) => void;
  onClear: () => void;
  totalConverted: number;
}

const ConversionHistoryPanel: React.FC<ConversionHistoryPanelProps> = ({
  images,
  onDownload,
  onClear,
  totalConverted,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (images.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Conversion History</h3>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <Image className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent conversions</p>
          {totalConverted > 0 && (
            <p className="text-xs mt-1">Total converted: {totalConverted}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Recent Conversions</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Total converted: {totalConverted} • Last 10 shown
      </p>

      <ScrollArea className="h-48">
        <div className="space-y-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              {/* Thumbnail */}
              {image.convertedUrl && (
                <div className="w-10 h-10 rounded bg-background overflow-hidden shrink-0">
                  <img
                    src={image.convertedUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{image.originalName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-tool-archive">-{image.compressionPercent}%</span>
                  <span>•</span>
                  <span>{formatSize(image.convertedSize)}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(image.timestamp, { addSuffix: true })}</span>
                </div>
              </div>

              {image.convertedUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(image)}
                  className="shrink-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversionHistoryPanel;
