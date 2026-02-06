import React from 'react';
import { Settings, Sparkles, Shield, Image, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ConversionSettings, PNG_TYPE_INFO } from './types';

interface ConversionSettingsPanelProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
}

const ConversionSettingsPanel: React.FC<ConversionSettingsPanelProps> = ({
  settings,
  onChange,
}) => {
  const updateSetting = <K extends keyof ConversionSettings>(
    key: K,
    value: ConversionSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <TooltipProvider>
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 text-foreground">
          <Settings className="h-5 w-5" />
          <h3 className="font-semibold">Conversion Settings</h3>
        </div>

        {/* PNG Type Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">PNG Type</Label>
          </div>
          <RadioGroup
            value={settings.pngType}
            onValueChange={(v) => updateSetting('pngType', v as ConversionSettings['pngType'])}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2"
          >
            {Object.entries(PNG_TYPE_INFO).map(([type, info]) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type}
                      className="flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="font-semibold text-sm">{info.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {info.alpha ? 'With alpha' : 'No alpha'}
                      </span>
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium">{info.name}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                  <p className="text-xs">Colors: {info.colors.toLocaleString()}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </RadioGroup>
        </div>

        {/* Compression Level */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Compression</Label>
          </div>
          <RadioGroup
            value={settings.compression}
            onValueChange={(v) => updateSetting('compression', v as 'normal' | 'ultra')}
            className="grid grid-cols-2 gap-2"
          >
            <div className="relative">
              <RadioGroupItem value="normal" id="comp-normal" className="peer sr-only" />
              <Label
                htmlFor="comp-normal"
                className="flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <span className="font-semibold text-sm">Normal PNG</span>
                <span className="text-xs text-muted-foreground">Standard lossless</span>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="ultra" id="comp-ultra" className="peer sr-only" />
              <Label
                htmlFor="comp-ultra"
                className="flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <span className="font-semibold text-sm flex items-center gap-1">
                  Ultra Compress
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">NEW</Badge>
                </span>
                <span className="text-xs text-muted-foreground">Optimized size</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* DPI Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">DPI (Print Resolution)</Label>
          <RadioGroup
            value={settings.dpi.toString()}
            onValueChange={(v) => updateSetting('dpi', parseInt(v) as 72 | 150 | 300)}
            className="grid grid-cols-3 gap-2"
          >
            {[72, 150, 300].map((dpi) => (
              <div key={dpi} className="relative">
                <RadioGroupItem value={dpi.toString()} id={`dpi-${dpi}`} className="peer sr-only" />
                <Label
                  htmlFor={`dpi-${dpi}`}
                  className="flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                >
                  <span className="font-semibold text-sm">{dpi}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {dpi === 72 ? 'Web' : dpi === 150 ? 'Print' : 'HD Print'}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          {/* Remove Background */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-tool-image" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">
                  AI Remove Background
                </Label>
                <p className="text-xs text-muted-foreground">Auto transparent background</p>
              </div>
            </div>
            <Switch
              checked={settings.removeBackground}
              onCheckedChange={(v) => updateSetting('removeBackground', v)}
              aria-label="Remove background"
            />
          </div>

          {/* AI Enhance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div>
                <Label className="text-sm font-medium cursor-pointer flex items-center gap-1">
                  AI Enhance
                  <Badge variant="outline" className="text-[10px] px-1 py-0">BETA</Badge>
                </Label>
                <p className="text-xs text-muted-foreground">Fix artifacts, sharpen edges</p>
              </div>
            </div>
            <Switch
              checked={settings.aiEnhance}
              onCheckedChange={(v) => updateSetting('aiEnhance', v)}
              aria-label="AI enhance"
            />
          </div>

          {/* Privacy Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-tool-archive" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">
                  Remove Metadata
                </Label>
                <p className="text-xs text-muted-foreground">Strip EXIF data (privacy)</p>
              </div>
            </div>
            <Switch
              checked={!settings.keepMetadata}
              onCheckedChange={(v) => updateSetting('keepMetadata', !v)}
              aria-label="Remove metadata"
            />
          </div>

          {/* Watermark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium cursor-pointer">
                  Add Watermark
                </Label>
                <p className="text-xs text-muted-foreground">"Converted by AnyFileFlow"</p>
              </div>
            </div>
            <Switch
              checked={settings.addWatermark}
              onCheckedChange={(v) => updateSetting('addWatermark', v)}
              aria-label="Add watermark"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ConversionSettingsPanel;
