// Types for Advanced JPG to PNG Converter

export interface ConvertedImage {
  id: string;
  originalName: string;
  originalSize: number;
  originalUrl: string;
  convertedName: string;
  convertedSize: number;
  convertedUrl: string;
  compressionPercent: number;
  conversionTime: number;
  pngType: 'png-8' | 'png-24' | 'png-32';
  hasTransparency: boolean;
  timestamp: number;
  width: number;
  height: number;
  dpi: number;
  metadataRemoved: boolean;
}

export interface ConversionSettings {
  pngType: 'png-8' | 'png-24' | 'png-32';
  compression: 'normal' | 'ultra';
  removeBackground: boolean;
  keepMetadata: boolean;
  dpi: 72 | 150 | 300;
  aiEnhance: boolean;
  addWatermark: boolean;
}

export interface ConversionHistory {
  images: ConvertedImage[];
  totalConverted: number;
  lastConvertedAt: number;
}

export const defaultSettings: ConversionSettings = {
  pngType: 'png-32',
  compression: 'normal',
  removeBackground: false,
  keepMetadata: false,
  dpi: 72,
  aiEnhance: false,
  addWatermark: false,
};

export const PNG_TYPE_INFO = {
  'png-8': {
    name: 'PNG-8',
    description: 'Smallest file size, 256 colors max',
    colors: 256,
    alpha: false,
  },
  'png-24': {
    name: 'PNG-24',
    description: 'True color (16M colors), no transparency',
    colors: 16777216,
    alpha: false,
  },
  'png-32': {
    name: 'PNG-32',
    description: 'True color with full transparency (alpha)',
    colors: 16777216,
    alpha: true,
  },
};
