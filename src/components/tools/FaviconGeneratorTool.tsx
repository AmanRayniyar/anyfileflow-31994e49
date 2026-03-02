import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// ── Constants ──────────────────────────────────────────────
const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];
const PRESET_SHAPES = ['square', 'rounded', 'circle'] as const;
type Shape = typeof PRESET_SHAPES[number];

const FONT_OPTIONS = [
  { id: 'sans', label: 'Sans-serif', value: 'system-ui, -apple-system, sans-serif' },
  { id: 'serif', label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', label: 'Monospace', value: '"Courier New", monospace' },
  { id: 'impact', label: 'Impact', value: 'Impact, sans-serif' },
  { id: 'cursive', label: 'Cursive', value: '"Comic Sans MS", cursive' },
];

const GRADIENT_PRESETS = [
  { id: 'none', label: 'Solid', colors: [] },
  { id: 'sunset', label: 'Sunset', colors: ['#f97316', '#ec4899'] },
  { id: 'ocean', label: 'Ocean', colors: ['#06b6d4', '#3b82f6'] },
  { id: 'forest', label: 'Forest', colors: ['#22c55e', '#14b8a6'] },
  { id: 'purple', label: 'Purple', colors: ['#a855f7', '#6366f1'] },
  { id: 'fire', label: 'Fire', colors: ['#ef4444', '#f59e0b'] },
  { id: 'dark', label: 'Dark', colors: ['#1e293b', '#475569'] },
  { id: 'candy', label: 'Candy', colors: ['#ec4899', '#f472b6'] },
];

const EMOJI_PRESETS = ['🚀', '⚡', '🎯', '💎', '🔥', '⭐', '🌈', '🎨', '💡', '🛡️', '🏆', '📦', '🧩', '🔧', '🎮', '📱', '💻', '🌍', '❤️', '✨'];

// ── Component ──────────────────────────────────────────────
const FaviconGeneratorTool: React.FC = () => {
  // Source mode
  const [mode, setMode] = useState<'text' | 'emoji' | 'upload'>('text');

  // Text / emoji state
  const [text, setText] = useState('A');
  const [emoji, setEmoji] = useState('🚀');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [bold, setBold] = useState(true);

  // Upload state
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Style
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [gradientPreset, setGradientPreset] = useState('none');
  const [shape, setShape] = useState<Shape>('rounded');
  const [borderRadius, setBorderRadius] = useState(20);
  const [fontSize, setFontSize] = useState(64);
  const [shadow, setShadow] = useState(false);
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [borderWidth, setBorderWidth] = useState(4);

  // Export
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 180, 192, 512]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Draw ──────────────────────────────────────────────
  const draw = useCallback((canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Clip shape
    const r = shape === 'circle' ? size / 2 : shape === 'rounded' ? (size * borderRadius) / 100 : 0;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Background
    const grad = GRADIENT_PRESETS.find(g => g.id === gradientPreset);
    if (grad && grad.colors.length === 2) {
      const lg = ctx.createLinearGradient(0, 0, size, size);
      lg.addColorStop(0, grad.colors[0]);
      lg.addColorStop(1, grad.colors[1]);
      ctx.fillStyle = lg;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, size, size);

    // Border
    if (border) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = (borderWidth / 100) * size;
      ctx.stroke();
    }

    // Content
    if (mode === 'upload' && uploadedImage) {
      const aspect = uploadedImage.width / uploadedImage.height;
      let dw = size * 0.8, dh = size * 0.8;
      if (aspect > 1) dh = dw / aspect;
      else dw = dh * aspect;
      const dx = (size - dw) / 2;
      const dy = (size - dh) / 2;
      ctx.drawImage(uploadedImage, dx, dy, dw, dh);
    } else {
      const content = mode === 'emoji' ? emoji : text.slice(0, 3);
      const fSize = (fontSize / 100) * size;
      const weight = bold ? 'bold ' : '';
      const family = mode === 'emoji' ? 'system-ui, sans-serif' : fontFamily;
      ctx.font = `${weight}${fSize}px ${family}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = size * 0.06;
        ctx.shadowOffsetX = size * 0.02;
        ctx.shadowOffsetY = size * 0.02;
      }

      ctx.fillStyle = mode === 'emoji' ? '#000000' : fgColor;
      if (mode !== 'emoji') ctx.fillStyle = fgColor;
      ctx.fillText(content, size / 2, size / 2 + fSize * 0.04);
      ctx.shadowColor = 'transparent';
    }
  }, [mode, text, emoji, fontFamily, bold, bgColor, fgColor, gradientPreset, shape, borderRadius, fontSize, shadow, border, borderColor, borderWidth, uploadedImage]);

  // Preview render
  useEffect(() => {
    const c = canvasRef.current;
    if (c) draw(c, 256);
  }, [draw]);

  // ── Upload handler ──────────────────────────────────
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { setUploadedImage(img); setMode('upload'); };
    img.src = URL.createObjectURL(file);
  };

  // ── Export helpers ──────────────────────────────────
  const downloadPNG = (size: number) => {
    const c = document.createElement('canvas');
    draw(c, size);
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = c.toDataURL('image/png');
    link.click();
  };

  const downloadAllPNG = () => {
    selectedSizes.forEach(s => downloadPNG(s));
    toast.success(`Downloaded ${selectedSizes.length} favicon(s)`);
  };

  const downloadICO = () => {
    // Generate 16, 32, 48 as ICO (simplified: just the 32px PNG)
    const c = document.createElement('canvas');
    draw(c, 32);
    const link = document.createElement('a');
    link.download = 'favicon.ico';
    link.href = c.toDataURL('image/png');
    link.click();
    toast.success('Downloaded favicon.ico (32×32)');
  };

  const downloadSVG = () => {
    const size = 256;
    const r = shape === 'circle' ? size / 2 : shape === 'rounded' ? (size * borderRadius) / 100 : 0;
    const grad = GRADIENT_PRESETS.find(g => g.id === gradientPreset);
    const content = mode === 'emoji' ? emoji : text.slice(0, 3);
    const fSize = (fontSize / 100) * size;
    const weight = bold ? 'font-weight="bold"' : '';
    const family = mode === 'emoji' ? 'system-ui' : fontFamily.split(',')[0].replace(/"/g, '');

    let fillDef = '';
    let fill = bgColor;
    if (grad && grad.colors.length === 2) {
      fillDef = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${grad.colors[0]}"/><stop offset="100%" stop-color="${grad.colors[1]}"/></linearGradient></defs>`;
      fill = 'url(#bg)';
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
${fillDef}
<rect width="${size}" height="${size}" rx="${r}" fill="${fill}" ${border ? `stroke="${borderColor}" stroke-width="${borderWidth}"` : ''}/>
<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="${fSize}" font-family="${family}" fill="${mode === 'emoji' ? 'currentColor' : fgColor}" ${weight}>${content}</text>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'favicon.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
    toast.success('Downloaded favicon.svg');
  };

  const copyHTMLSnippet = () => {
    const html = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="manifest" href="/site.webmanifest">`;
    navigator.clipboard.writeText(html);
    toast.success('HTML snippet copied!');
  };

  const toggleSize = (s: number) => {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div className="space-y-6">
      {/* Source Tabs */}
      <Tabs value={mode} onValueChange={v => setMode(v as 'text' | 'emoji' | 'upload')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text / Letter</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-4 space-y-3">
          <div>
            <Label htmlFor="favicon-text">Text (1–3 characters)</Label>
            <Input id="favicon-text" value={text} onChange={e => setText(e.target.value.slice(0, 3))} maxLength={3} className="text-2xl text-center font-bold mt-1" />
          </div>
          <div>
            <Label htmlFor="favicon-font">Font</Label>
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger id="favicon-font" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map(f => <SelectItem key={f.id} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="bold-toggle" checked={bold} onCheckedChange={setBold} />
            <Label htmlFor="bold-toggle">Bold</Label>
          </div>
        </TabsContent>

        <TabsContent value="emoji" className="mt-4 space-y-3">
          <Label>Pick an Emoji</Label>
          <div className="grid grid-cols-10 gap-2">
            {EMOJI_PRESETS.map(e => (
              <button key={e} onClick={() => setEmoji(e)} className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${emoji === e ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}`} aria-label={`Select emoji ${e}`}>{e}</button>
            ))}
          </div>
          <div>
            <Label htmlFor="custom-emoji">Or type any emoji</Label>
            <Input id="custom-emoji" value={emoji} onChange={e => setEmoji(e.target.value)} className="text-2xl text-center mt-1" />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer border-border hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-lg font-medium mb-1">Click to upload an image</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, SVG – will be centered on the background</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" aria-label="Upload image for favicon" />
          </div>
          {uploadedImage && <p className="text-sm text-muted-foreground mt-2">✓ Image loaded ({uploadedImage.width}×{uploadedImage.height})</p>}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-muted-foreground">Live Preview (256×256)</p>
              <div className="bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] rounded-xl p-2">
                <canvas ref={canvasRef} className="rounded-lg" width={256} height={256} style={{ width: 192, height: 192 }} />
              </div>
              {/* Size previews */}
              <div className="flex items-end gap-4">
                {[16, 32, 48, 64].map(s => {
                  const c = document.createElement('canvas');
                  // We'll use inline preview via the main canvas scaled
                  return (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className="bg-muted rounded p-1" style={{ width: s + 8, height: s + 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <canvas ref={el => { if (el) draw(el, s); }} width={s} height={s} style={{ width: s, height: s }} className="rounded-sm" />
                      </div>
                      <span className="text-xs text-muted-foreground">{s}px</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Shape */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Shape</Label>
              <div className="flex gap-2">
                {PRESET_SHAPES.map(s => (
                  <button key={s} onClick={() => setShape(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border-2 transition-colors ${shape === s ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>{s}</button>
                ))}
              </div>
              {shape === 'rounded' && (
                <div>
                  <Label>Corner Radius: {borderRadius}%</Label>
                  <Slider value={[borderRadius]} onValueChange={([v]) => setBorderRadius(v)} min={0} max={50} step={1} className="mt-1" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Background</Label>
              <div className="flex gap-2 flex-wrap">
                {GRADIENT_PRESETS.map(g => (
                  <button key={g.id} onClick={() => setGradientPreset(g.id)} className={`w-10 h-10 rounded-lg border-2 transition-all ${gradientPreset === g.id ? 'border-primary scale-110' : 'border-border'}`} style={{ background: g.colors.length === 2 ? `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` : bgColor }} aria-label={g.label} title={g.label} />
                ))}
              </div>
              {gradientPreset === 'none' && (
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" aria-label="Background color" />
                  <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 font-mono text-sm" />
                </div>
              )}

              {mode !== 'upload' && mode !== 'emoji' && (
                <>
                  <Label>Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" aria-label="Text color" />
                    <Input value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 font-mono text-sm" />
                  </div>
                </>
              )}

              <Label>Text Size: {fontSize}%</Label>
              <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={30} max={95} step={1} />
            </CardContent>
          </Card>

          {/* Effects */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-base font-semibold">Effects</Label>
              <div className="flex items-center gap-2">
                <Switch id="shadow-sw" checked={shadow} onCheckedChange={setShadow} />
                <Label htmlFor="shadow-sw">Drop Shadow</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="border-sw" checked={border} onCheckedChange={setBorder} />
                <Label htmlFor="border-sw">Border</Label>
              </div>
              {border && (
                <div className="flex items-center gap-2">
                  <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" aria-label="Border color" />
                  <Slider value={[borderWidth]} onValueChange={([v]) => setBorderWidth(v)} min={1} max={12} step={1} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8">{borderWidth}px</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Section */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Export Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {FAVICON_SIZES.map(s => (
              <button key={s} onClick={() => toggleSize(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedSizes.includes(s) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`} aria-pressed={selectedSizes.includes(s)}>{s}px</button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button onClick={downloadAllPNG} disabled={selectedSizes.length === 0}>
              Download PNGs
            </Button>
            <Button variant="outline" onClick={downloadICO}>
              Download .ICO
            </Button>
            <Button variant="outline" onClick={downloadSVG} disabled={mode === 'upload'}>
              Download SVG
            </Button>
            <Button variant="outline" onClick={copyHTMLSnippet}>
              Copy HTML
            </Button>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">`}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaviconGeneratorTool;
