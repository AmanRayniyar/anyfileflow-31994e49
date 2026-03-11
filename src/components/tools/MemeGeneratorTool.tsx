import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Upload, Download, Image as ImageIcon, Wand2, Copy, RotateCcw, 
  Type, Palette, Move, ZoomIn, Sparkles, Loader2, Check,
  AlignLeft, AlignCenter, AlignRight, Trash2, Plus, RotateCw,
  FlipHorizontal, FlipVertical, Layers, Eye, EyeOff, Lock, Unlock,
  Undo2, Redo2, ImagePlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  opacity: number;
  rotation: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  visible: boolean;
  locked: boolean;
  lineHeight: number;
  letterSpacing: number;
  curve: number;
}

interface ImageFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

interface HistoryState {
  textOverlays: TextOverlay[];
  filter: ImageFilter;
}

const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg', category: 'classic' },
  { id: 'distracted', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', category: 'classic' },
  { id: 'buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', category: 'classic' },
  { id: 'change', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg', category: 'classic' },
  { id: 'brain', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg', category: 'classic' },
  { id: 'doge', name: 'Doge', url: 'https://i.imgflip.com/4t0m5.jpg', category: 'classic' },
  { id: 'success', name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg', category: 'reactions' },
  { id: 'bad-luck', name: 'Bad Luck Brian', url: 'https://i.imgflip.com/aagr.jpg', category: 'reactions' },
  { id: 'one-does-not', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg', category: 'reactions' },
  { id: 'futurama', name: 'Futurama Fry', url: 'https://i.imgflip.com/1bgw.jpg', category: 'reactions' },
  { id: 'batman', name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/9ehk.jpg', category: 'reactions' },
  { id: 'everywhere', name: 'X, X Everywhere', url: 'https://i.imgflip.com/1ihzfe.jpg', category: 'reactions' },
  { id: 'ancient', name: 'Ancient Aliens', url: 'https://i.imgflip.com/26am.jpg', category: 'classic' },
  { id: 'grumpy', name: 'Grumpy Cat', url: 'https://i.imgflip.com/8p0a.jpg', category: 'animals' },
  { id: 'roll', name: 'Roll Safe', url: 'https://i.imgflip.com/1h7in3.jpg', category: 'reactions' },
  { id: 'picard', name: 'Captain Picard', url: 'https://i.imgflip.com/xakf.jpg', category: 'reactions' },
  { id: 'spongebob', name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg', category: 'classic' },
  { id: 'bernie', name: 'Bernie Sanders', url: 'https://i.imgflip.com/4rdfql.jpg', category: 'trending' },
  { id: 'disaster', name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg', category: 'classic' },
  { id: 'buzz', name: 'X Everywhere Buzz', url: 'https://i.imgflip.com/1ihzfe.jpg', category: 'classic' },
];

const FONT_FAMILIES = [
  { id: 'impact', name: 'Impact', value: 'Impact, sans-serif' },
  { id: 'arial', name: 'Arial Black', value: '"Arial Black", sans-serif' },
  { id: 'comic', name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { id: 'helvetica', name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { id: 'times', name: 'Times New Roman', value: '"Times New Roman", serif' },
  { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
  { id: 'courier', name: 'Courier New', value: '"Courier New", monospace' },
  { id: 'verdana', name: 'Verdana', value: 'Verdana, sans-serif' },
  { id: 'trebuchet', name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { id: 'palatino', name: 'Palatino', value: '"Palatino Linotype", serif' },
];

const FILTER_PRESETS: { name: string; filter: ImageFilter }[] = [
  { name: 'None', filter: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 } },
  { name: 'Vintage', filter: { brightness: 110, contrast: 90, saturation: 70, blur: 0, grayscale: 0, sepia: 40, hueRotate: 0, invert: 0 } },
  { name: 'B&W', filter: { brightness: 100, contrast: 120, saturation: 0, blur: 0, grayscale: 100, sepia: 0, hueRotate: 0, invert: 0 } },
  { name: 'Dramatic', filter: { brightness: 90, contrast: 150, saturation: 130, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 } },
  { name: 'Warm', filter: { brightness: 105, contrast: 105, saturation: 110, blur: 0, grayscale: 0, sepia: 20, hueRotate: -10, invert: 0 } },
  { name: 'Cool', filter: { brightness: 100, contrast: 110, saturation: 90, blur: 0, grayscale: 0, sepia: 0, hueRotate: 20, invert: 0 } },
  { name: 'Faded', filter: { brightness: 120, contrast: 80, saturation: 60, blur: 0, grayscale: 20, sepia: 10, hueRotate: 0, invert: 0 } },
  { name: 'Deep Fried', filter: { brightness: 130, contrast: 200, saturation: 200, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 } },
  { name: 'Inverted', filter: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 100 } },
];

const DEFAULT_FILTER: ImageFilter = { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 };

const createDefaultOverlay = (id: string, text: string, y: number): TextOverlay => ({
  id, text, x: 50, y, fontSize: 48, color: '#ffffff', strokeColor: '#000000',
  strokeWidth: 3, fontFamily: 'Impact, sans-serif', align: 'center', bold: true,
  italic: false, uppercase: true, opacity: 100, rotation: 0, shadow: true,
  shadowColor: '#000000', shadowBlur: 4, visible: true, locked: false,
  lineHeight: 1.2, letterSpacing: 0, curve: 0,
});

const MemeGeneratorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    createDefaultOverlay('1', 'TOP TEXT', 8),
    createDefaultOverlay('2', 'BOTTOM TEXT', 85),
  ]);
  const [selectedTextId, setSelectedTextId] = useState<string>('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState<ImageFilter>(DEFAULT_FILTER);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState(92);
  const [canvasSize, setCanvasSize] = useState<'auto' | '1080' | '1200' | '500'>('auto');
  const [templateCategory, setTemplateCategory] = useState<'all' | 'classic' | 'reactions' | 'animals' | 'trending'>('all');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const selectedText = textOverlays.find(t => t.id === selectedTextId) || textOverlays[0];

  // Save history
  const saveHistory = useCallback(() => {
    const state: HistoryState = { textOverlays: JSON.parse(JSON.stringify(textOverlays)), filter: { ...filter } };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
    setHistoryIndex(prev => prev + 1);
  }, [textOverlays, filter, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setTextOverlays(prev.textOverlays);
      setFilter(prev.filter);
      setHistoryIndex(i => i - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setTextOverlays(next.textOverlays);
      setFilter(next.filter);
      setHistoryIndex(i => i + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImage(src);
    };
    img.onerror = () => toast.error('Failed to load image');
    img.src = src;
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
      if (file.size > 20 * 1024 * 1024) { toast.error('File too large (max 20MB)'); return; }
      const reader = new FileReader();
      reader.onload = (event) => { if (event.target?.result) loadImage(event.target.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => { if (event.target?.result) loadImage(event.target.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth: number;
    if (canvasSize === 'auto') {
      targetWidth = Math.min(800, img.width);
    } else {
      targetWidth = parseInt(canvasSize);
    }
    const scale = targetWidth / img.width;
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Apply filters
    ctx.filter = `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) blur(${filter.blur}px) grayscale(${filter.grayscale}%) sepia(${filter.sepia}%) hue-rotate(${filter.hueRotate}deg) invert(${filter.invert}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    // Draw text overlays
    textOverlays.filter(o => o.visible).forEach(overlay => {
      const x = (overlay.x / 100) * canvas.width;
      const y = (overlay.y / 100) * canvas.height;
      const displayText = overlay.uppercase ? overlay.text.toUpperCase() : overlay.text;
      const fontSize = overlay.fontSize * scale;
      
      ctx.save();
      ctx.globalAlpha = overlay.opacity / 100;
      ctx.translate(x, y);
      if (overlay.rotation) ctx.rotate((overlay.rotation * Math.PI) / 180);

      ctx.font = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${fontSize}px ${overlay.fontFamily}`;
      ctx.textAlign = overlay.align;
      ctx.textBaseline = 'top';

      // Word wrap
      const maxWidth = canvas.width * 0.9;
      const lines = wrapText(ctx, displayText, maxWidth);
      const lineHeightPx = fontSize * overlay.lineHeight;

      lines.forEach((line, i) => {
        const ly = i * lineHeightPx;

        // Shadow
        if (overlay.shadow) {
          ctx.shadowColor = overlay.shadowColor;
          ctx.shadowBlur = overlay.shadowBlur * scale;
          ctx.shadowOffsetX = 2 * scale;
          ctx.shadowOffsetY = 2 * scale;
        }

        // Stroke
        if (overlay.strokeWidth > 0) {
          ctx.strokeStyle = overlay.strokeColor;
          ctx.lineWidth = overlay.strokeWidth * scale;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, 0, ly);
        }

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = overlay.color;
        ctx.fillText(line, 0, ly);
      });

      ctx.restore();
    });
  }, [textOverlays, filter, canvasSize]);

  useEffect(() => { if (image) renderCanvas(); }, [image, textOverlays, renderCanvas, filter, canvasSize]);

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    const overlay = textOverlays.find(t => t.id === id);
    if (overlay?.locked) { toast.error('Layer is locked'); return; }
    setTextOverlays(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addTextOverlay = () => {
    const newId = String(Date.now());
    const newOverlay = createDefaultOverlay(newId, 'NEW TEXT', 50);
    newOverlay.fontSize = 36;
    setTextOverlays(prev => [...prev, newOverlay]);
    setSelectedTextId(newId);
    saveHistory();
    toast.success('Text layer added');
  };

  const removeTextOverlay = (id: string) => {
    if (textOverlays.length <= 1) { toast.error('At least one text layer required'); return; }
    setTextOverlays(prev => prev.filter(t => t.id !== id));
    if (selectedTextId === id) setSelectedTextId(textOverlays[0].id);
    saveHistory();
  };

  const duplicateTextOverlay = (id: string) => {
    const source = textOverlays.find(t => t.id === id);
    if (!source) return;
    const newId = String(Date.now());
    setTextOverlays(prev => [...prev, { ...source, id: newId, y: Math.min(source.y + 10, 95) }]);
    setSelectedTextId(newId);
    saveHistory();
    toast.success('Layer duplicated');
  };

  // Canvas click-to-position text
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedText || selectedText.locked) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = ((e.clientX - rect.left) * scaleX / canvas.width) * 100;
    const y = ((e.clientY - rect.top) * scaleY / canvas.height) * 100;
    updateTextOverlay(selectedTextId, { x: Math.round(x), y: Math.round(y) });
  };

  // Drag text on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDraggingTextId(selectedTextId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingTextId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    updateTextOverlay(draggingTextId, { x: Math.max(0, Math.min(100, Math.round(x))), y: Math.max(0, Math.min(100, Math.round(y))) });
  };

  const handleCanvasMouseUp = () => {
    if (draggingTextId) {
      setDraggingTextId(null);
      saveHistory();
    }
  };

  const generateAIMeme = async () => {
    if (!aiPrompt.trim()) { toast.error('Please enter a prompt'); return; }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('anyflow-ai', {
        body: {
          messages: [{
            role: 'user',
            content: `Generate funny meme text for: "${aiPrompt}". 
            Respond ONLY with JSON: {"topText": "...", "bottomText": "..."}
            Make it funny and witty. Keep each line under 50 characters.`
          }]
        }
      });
      if (error) throw error;
      const content = data?.choices?.[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.topText && parsed.bottomText) {
          setTextOverlays(prev => {
            const updated = [...prev];
            if (updated[0]) updated[0] = { ...updated[0], text: parsed.topText };
            if (updated[1]) updated[1] = { ...updated[1], text: parsed.bottomText };
            return updated;
          });
          saveHistory();
          toast.success('AI generated meme text!');
        }
      } else throw new Error('Invalid response');
    } catch {
      toast.error('AI generation failed. Try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
    const quality = exportFormat === 'png' ? undefined : exportQuality / 100;
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.${exportFormat}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
    toast.success(`Meme downloaded as ${exportFormat.toUpperCase()}!`);
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), 'image/png');
      });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed. Try downloading instead.');
    }
  };

  const resetMeme = () => {
    setImage(null);
    setTextOverlays([createDefaultOverlay('1', 'TOP TEXT', 8), createDefaultOverlay('2', 'BOTTOM TEXT', 85)]);
    setSelectedTextId('1');
    setAiPrompt('');
    setFilter(DEFAULT_FILTER);
    setHistory([]);
    setHistoryIndex(-1);
    imageRef.current = null;
  };

  const filteredTemplates = templateCategory === 'all' 
    ? MEME_TEMPLATES 
    : MEME_TEMPLATES.filter(t => t.category === templateCategory);

  return (
    <div className="space-y-6" role="region" aria-label="Meme Generator Tool">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
            Templates ({MEME_TEMPLATES.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop an image here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP • Max 20MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload image for meme"
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'classic', 'reactions', 'animals', 'trending'] as const).map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={templateCategory === cat ? 'default' : 'outline'}
                onClick={() => setTemplateCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => loadImage(template.url)}
                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:scale-105"
                title={template.name}
              >
                <img src={template.url} alt={template.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium leading-tight">{template.name}</span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Canvas */}
          <div className="space-y-4">
            <div 
              ref={canvasContainerRef}
              className="relative bg-muted rounded-xl p-4 flex items-center justify-center overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] rounded-lg shadow-lg cursor-crosshair"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onClick={handleCanvasClick}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={undo} variant="outline" size="icon" disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button onClick={redo} variant="outline" size="icon" disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Y)">
                <Redo2 className="h-4 w-4" />
              </Button>
              <div className="flex-1" />
              <Button onClick={downloadMeme} className="flex-1 max-w-[200px]">
                <Download className="h-4 w-4 mr-2" />
                Download {exportFormat.toUpperCase()}
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button onClick={resetMeme} variant="destructive" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Export Settings */}
            <Card>
              <CardContent className="p-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs whitespace-nowrap">Format:</Label>
                  <Select value={exportFormat} onValueChange={(v: 'png' | 'jpg' | 'webp') => setExportFormat(v)}>
                    <SelectTrigger className="h-8 w-20 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {exportFormat !== 'png' && (
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <Label className="text-xs">Quality: {exportQuality}%</Label>
                    <Slider value={[exportQuality]} onValueChange={([v]) => setExportQuality(v)} min={10} max={100} step={5} className="flex-1" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Size:</Label>
                  <Select value={canvasSize} onValueChange={(v: typeof canvasSize) => setCanvasSize(v)}>
                    <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="500">500px</SelectItem>
                      <SelectItem value="1080">1080px</SelectItem>
                      <SelectItem value="1200">1200px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* AI Generator */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  AI Meme Text Generator
                </Label>
                <Textarea
                  placeholder="Describe your meme idea... (e.g., 'programmer debugging at 3am')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[60px]"
                />
                <Button onClick={generateAIMeme} disabled={isGenerating || !aiPrompt.trim()} className="w-full">
                  {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Wand2 className="h-4 w-4 mr-2" />Generate with AI</>}
                </Button>
              </CardContent>
            </Card>

            {/* Editor Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text"><Type className="h-3.5 w-3.5 mr-1" />Text</TabsTrigger>
                <TabsTrigger value="style"><Palette className="h-3.5 w-3.5 mr-1" />Style</TabsTrigger>
                <TabsTrigger value="filters"><Layers className="h-3.5 w-3.5 mr-1" />Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-3 mt-3">
                {/* Layer list */}
                <Card>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Text Layers</Label>
                      <Button size="sm" variant="outline" onClick={addTextOverlay}><Plus className="h-3 w-3 mr-1" />Add</Button>
                    </div>
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                      {textOverlays.map((overlay, idx) => (
                        <div
                          key={overlay.id}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm cursor-pointer transition-colors
                            ${selectedTextId === overlay.id ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 hover:bg-muted'}`}
                          onClick={() => setSelectedTextId(overlay.id)}
                        >
                          <button onClick={(e) => { e.stopPropagation(); updateTextOverlay(overlay.id, { visible: !overlay.visible }); }} className="text-muted-foreground hover:text-foreground">
                            {overlay.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); updateTextOverlay(overlay.id, { locked: !overlay.locked }); }} className="text-muted-foreground hover:text-foreground">
                            {overlay.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                          </button>
                          <span className="flex-1 truncate font-medium">{overlay.text || `Layer ${idx + 1}`}</span>
                          <button onClick={(e) => { e.stopPropagation(); duplicateTextOverlay(overlay.id); }} className="text-muted-foreground hover:text-foreground" title="Duplicate">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          {textOverlays.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); removeTextOverlay(overlay.id); }} className="text-destructive hover:text-destructive/80" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Text content */}
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Text Content</Label>
                      <Input value={selectedText.text} onChange={(e) => updateTextOverlay(selectedTextId, { text: e.target.value })} placeholder="Enter meme text..." />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Uppercase</Label>
                      <Switch checked={selectedText.uppercase} onCheckedChange={(v) => updateTextOverlay(selectedTextId, { uppercase: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs flex items-center gap-1"><Move className="h-3 w-3" />X: {selectedText.x}%</Label>
                        <Slider value={[selectedText.x]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { x: v })} min={0} max={100} step={1} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs flex items-center gap-1"><Move className="h-3 w-3" />Y: {selectedText.y}%</Label>
                        <Slider value={[selectedText.y]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { y: v })} min={0} max={100} step={1} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs"><RotateCw className="h-3 w-3 inline mr-1" />Rotation: {selectedText.rotation}°</Label>
                      <Slider value={[selectedText.rotation]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { rotation: v })} min={-180} max={180} step={1} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">💡 Tip: Click on the canvas to position text, or drag to move it</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-3 mt-3">
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs"><ZoomIn className="h-3 w-3 inline mr-1" />Font Size: {selectedText.fontSize}px</Label>
                      <Slider value={[selectedText.fontSize]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { fontSize: v })} min={12} max={120} step={2} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Font Family</Label>
                      <Select value={selectedText.fontFamily} onValueChange={(v) => updateTextOverlay(selectedTextId, { fontFamily: v })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map(font => (
                            <SelectItem key={font.id} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Text Color</Label>
                        <div className="flex gap-1.5">
                          <input type="color" value={selectedText.color} onChange={(e) => updateTextOverlay(selectedTextId, { color: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-border" />
                          <Input value={selectedText.color} onChange={(e) => updateTextOverlay(selectedTextId, { color: e.target.value })} className="h-8 text-xs flex-1" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Stroke Color</Label>
                        <div className="flex gap-1.5">
                          <input type="color" value={selectedText.strokeColor} onChange={(e) => updateTextOverlay(selectedTextId, { strokeColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-border" />
                          <Input value={selectedText.strokeColor} onChange={(e) => updateTextOverlay(selectedTextId, { strokeColor: e.target.value })} className="h-8 text-xs flex-1" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Stroke: {selectedText.strokeWidth}px</Label>
                        <Slider value={[selectedText.strokeWidth]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { strokeWidth: v })} min={0} max={10} step={0.5} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Opacity: {selectedText.opacity}%</Label>
                        <Slider value={[selectedText.opacity]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { opacity: v })} min={0} max={100} step={5} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Line Height: {selectedText.lineHeight}</Label>
                      <Slider value={[selectedText.lineHeight * 10]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { lineHeight: v / 10 })} min={8} max={25} step={1} />
                    </div>
                    
                    {/* Alignment & Style */}
                    <div className="flex gap-1.5 flex-wrap">
                      {(['left', 'center', 'right'] as const).map(align => (
                        <Button key={align} size="sm" variant={selectedText.align === align ? 'default' : 'outline'}
                          onClick={() => updateTextOverlay(selectedTextId, { align })} className="h-7 w-7 p-0">
                          {align === 'left' ? <AlignLeft className="h-3.5 w-3.5" /> : align === 'center' ? <AlignCenter className="h-3.5 w-3.5" /> : <AlignRight className="h-3.5 w-3.5" />}
                        </Button>
                      ))}
                      <Button size="sm" variant={selectedText.bold ? 'default' : 'outline'}
                        onClick={() => updateTextOverlay(selectedTextId, { bold: !selectedText.bold })} className="h-7 w-7 p-0">
                        <span className="font-bold text-xs">B</span>
                      </Button>
                      <Button size="sm" variant={selectedText.italic ? 'default' : 'outline'}
                        onClick={() => updateTextOverlay(selectedTextId, { italic: !selectedText.italic })} className="h-7 w-7 p-0">
                        <span className="italic text-xs">I</span>
                      </Button>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Label className="text-xs">Shadow</Label>
                        <Switch checked={selectedText.shadow} onCheckedChange={(v) => updateTextOverlay(selectedTextId, { shadow: v })} />
                      </div>
                    </div>
                    {selectedText.shadow && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Shadow Color</Label>
                          <input type="color" value={selectedText.shadowColor} onChange={(e) => updateTextOverlay(selectedTextId, { shadowColor: e.target.value })} className="w-full h-7 rounded cursor-pointer border border-border" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Blur: {selectedText.shadowBlur}px</Label>
                          <Slider value={[selectedText.shadowBlur]} onValueChange={([v]) => updateTextOverlay(selectedTextId, { shadowBlur: v })} min={0} max={20} step={1} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="filters" className="space-y-3 mt-3">
                <Card>
                  <CardContent className="p-3 space-y-3">
                    <Label className="text-sm font-semibold">Filter Presets</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {FILTER_PRESETS.map(preset => (
                        <Button key={preset.name} size="sm" variant="outline"
                          className="text-xs h-7"
                          onClick={() => { setFilter(preset.filter); saveHistory(); }}>
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {([
                        { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
                        { key: 'contrast', label: 'Contrast', min: 0, max: 200 },
                        { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
                        { key: 'grayscale', label: 'Grayscale', min: 0, max: 100 },
                        { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
                        { key: 'hueRotate', label: 'Hue Rotate', min: -180, max: 180 },
                        { key: 'blur', label: 'Blur', min: 0, max: 10 },
                      ] as const).map(({ key, label, min, max }) => (
                        <div key={key} className="space-y-0.5">
                          <Label className="text-xs">{label}: {filter[key]}{key === 'hueRotate' ? '°' : key === 'blur' ? 'px' : '%'}</Label>
                          <Slider value={[filter[key]]} onValueChange={([v]) => setFilter(f => ({ ...f, [key]: v }))} min={min} max={max} step={1} />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setFilter(DEFAULT_FILTER); saveHistory(); }}>
                      <RotateCcw className="h-3 w-3 mr-1" />Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGeneratorTool;
