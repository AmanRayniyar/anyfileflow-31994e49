import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Upload, Download, Image as ImageIcon, Wand2, Copy, RotateCcw, 
  Type, Palette, Move, ZoomIn, ZoomOut, Sparkles, Loader2, Check,
  AlignLeft, AlignCenter, AlignRight
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
}

const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 'distracted', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 'buttons', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
  { id: 'change', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  { id: 'brain', name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg' },
  { id: 'doge', name: 'Doge', url: 'https://i.imgflip.com/4t0m5.jpg' },
  { id: 'success', name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg' },
  { id: 'bad-luck', name: 'Bad Luck Brian', url: 'https://i.imgflip.com/aagr.jpg' },
  { id: 'one-does-not', name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bij.jpg' },
  { id: 'futurama', name: 'Futurama Fry', url: 'https://i.imgflip.com/1bgw.jpg' },
  { id: 'batman', name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/9ehk.jpg' },
  { id: 'everywhere', name: 'X, X Everywhere', url: 'https://i.imgflip.com/1ihzfe.jpg' },
];

const FONT_FAMILIES = [
  { id: 'impact', name: 'Impact', value: 'Impact, sans-serif' },
  { id: 'arial', name: 'Arial Black', value: '"Arial Black", sans-serif' },
  { id: 'comic', name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { id: 'helvetica', name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { id: 'times', name: 'Times New Roman', value: '"Times New Roman", serif' },
  { id: 'georgia', name: 'Georgia', value: 'Georgia, serif' },
];

const MemeGeneratorTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    { id: '1', text: 'TOP TEXT', x: 50, y: 10, fontSize: 48, color: '#ffffff', strokeColor: '#000000', strokeWidth: 3, fontFamily: 'Impact, sans-serif', align: 'center', bold: true, italic: false },
    { id: '2', text: 'BOTTOM TEXT', x: 50, y: 85, fontSize: 48, color: '#ffffff', strokeColor: '#000000', strokeWidth: 3, fontFamily: 'Impact, sans-serif', align: 'center', bold: true, italic: false },
  ]);
  const [selectedTextId, setSelectedTextId] = useState<string>('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const selectedText = textOverlays.find(t => t.id === selectedTextId) || textOverlays[0];

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImage(src);
      renderCanvas();
    };
    img.onerror = () => {
      toast.error('Failed to load image');
    };
    img.src = src;
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const maxWidth = 800;
    const scale = Math.min(1, maxWidth / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw text overlays
    textOverlays.forEach(overlay => {
      const x = (overlay.x / 100) * canvas.width;
      const y = (overlay.y / 100) * canvas.height;
      
      ctx.font = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${overlay.fontSize * scale}px ${overlay.fontFamily}`;
      ctx.textAlign = overlay.align;
      ctx.textBaseline = 'top';

      // Draw stroke
      if (overlay.strokeWidth > 0) {
        ctx.strokeStyle = overlay.strokeColor;
        ctx.lineWidth = overlay.strokeWidth * scale;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(overlay.text.toUpperCase(), x, y);
      }

      // Draw fill
      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text.toUpperCase(), x, y);
    });
  }, [textOverlays]);

  useEffect(() => {
    if (image) {
      renderCanvas();
    }
  }, [image, textOverlays, renderCanvas]);

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const addTextOverlay = () => {
    const newId = String(Date.now());
    setTextOverlays(prev => [...prev, {
      id: newId,
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 36,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 3,
      fontFamily: 'Impact, sans-serif',
      align: 'center',
      bold: true,
      italic: false,
    }]);
    setSelectedTextId(newId);
  };

  const removeTextOverlay = (id: string) => {
    if (textOverlays.length <= 1) {
      toast.error('At least one text overlay is required');
      return;
    }
    setTextOverlays(prev => prev.filter(t => t.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(textOverlays[0].id);
    }
  };

  const generateAIMeme = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('anyflow-ai', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Generate funny meme text for the following theme: "${aiPrompt}". 
              Respond ONLY with a JSON object in this exact format:
              {"topText": "YOUR TOP TEXT HERE", "bottomText": "YOUR BOTTOM TEXT HERE"}
              Make it funny, witty, and suitable for a meme. Keep each line under 50 characters.`
            }
          ]
        }
      });

      if (error) throw error;

      const content = data?.choices?.[0]?.message?.content || '';
      
      // Parse JSON from response
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
          toast.success('AI generated meme text!');
        }
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI text. Try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Meme downloaded!');
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      setCopied(true);
      toast.success('Meme copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy. Try downloading instead.');
    }
  };

  const resetMeme = () => {
    setImage(null);
    setTextOverlays([
      { id: '1', text: 'TOP TEXT', x: 50, y: 10, fontSize: 48, color: '#ffffff', strokeColor: '#000000', strokeWidth: 3, fontFamily: 'Impact, sans-serif', align: 'center', bold: true, italic: false },
      { id: '2', text: 'BOTTOM TEXT', x: 50, y: 85, fontSize: 48, color: '#ffffff', strokeColor: '#000000', strokeWidth: 3, fontFamily: 'Impact, sans-serif', align: 'center', bold: true, italic: false },
    ]);
    setSelectedTextId('1');
    setAiPrompt('');
    imageRef.current = null;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Templates
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
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop an image here or click to upload</p>
            <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {MEME_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => loadImage(template.url)}
                className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:scale-105"
              >
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Canvas */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-xl p-4 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] rounded-lg shadow-lg"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadMeme} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button onClick={resetMeme} variant="destructive" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* AI Generator */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Meme Generator
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Describe your meme idea... (e.g., 'programmer debugging code at 3am')"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <Button 
                  onClick={generateAIMeme} 
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Text Selection */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <Type className="h-4 w-4" />
                    Text Overlays
                  </Label>
                  <Button size="sm" variant="outline" onClick={addTextOverlay}>
                    Add Text
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {textOverlays.map((overlay, index) => (
                    <button
                      key={overlay.id}
                      onClick={() => setSelectedTextId(overlay.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${selectedTextId === overlay.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted hover:bg-muted/80'}`}
                    >
                      Text {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Text Editor */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <Input
                    value={selectedText.text}
                    onChange={(e) => updateTextOverlay(selectedTextId, { text: e.target.value })}
                    placeholder="Enter your meme text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Move className="h-3 w-3" /> X Position
                    </Label>
                    <Slider
                      value={[selectedText.x]}
                      onValueChange={([v]) => updateTextOverlay(selectedTextId, { x: v })}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Move className="h-3 w-3" /> Y Position
                    </Label>
                    <Slider
                      value={[selectedText.y]}
                      onValueChange={([v]) => updateTextOverlay(selectedTextId, { y: v })}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ZoomIn className="h-3 w-3" /> Font Size: {selectedText.fontSize}px
                  </Label>
                  <Slider
                    value={[selectedText.fontSize]}
                    onValueChange={([v]) => updateTextOverlay(selectedTextId, { fontSize: v })}
                    min={12}
                    max={120}
                    step={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={selectedText.fontFamily}
                    onValueChange={(v) => updateTextOverlay(selectedTextId, { fontFamily: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map(font => (
                        <SelectItem key={font.id} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-3 w-3" /> Text Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedText.color}
                        onChange={(e) => updateTextOverlay(selectedTextId, { color: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={selectedText.color}
                        onChange={(e) => updateTextOverlay(selectedTextId, { color: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-3 w-3" /> Stroke Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedText.strokeColor}
                        onChange={(e) => updateTextOverlay(selectedTextId, { strokeColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={selectedText.strokeColor}
                        onChange={(e) => updateTextOverlay(selectedTextId, { strokeColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Stroke Width: {selectedText.strokeWidth}px</Label>
                  <Slider
                    value={[selectedText.strokeWidth]}
                    onValueChange={([v]) => updateTextOverlay(selectedTextId, { strokeWidth: v })}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedText.align === 'left' ? 'default' : 'outline'}
                    onClick={() => updateTextOverlay(selectedTextId, { align: 'left' })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedText.align === 'center' ? 'default' : 'outline'}
                    onClick={() => updateTextOverlay(selectedTextId, { align: 'center' })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedText.align === 'right' ? 'default' : 'outline'}
                    onClick={() => updateTextOverlay(selectedTextId, { align: 'right' })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedText.bold ? 'default' : 'outline'}
                    onClick={() => updateTextOverlay(selectedTextId, { bold: !selectedText.bold })}
                  >
                    <span className="font-bold">B</span>
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedText.italic ? 'default' : 'outline'}
                    onClick={() => updateTextOverlay(selectedTextId, { italic: !selectedText.italic })}
                  >
                    <span className="italic">I</span>
                  </Button>
                  {textOverlays.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeTextOverlay(selectedTextId)}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-8 p-6 bg-secondary/30 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">How does the AI meme generator work?</h4>
            <p className="text-muted-foreground">Our AI analyzes your prompt and generates witty, relevant top and bottom text for your meme. Just describe the theme or situation, and let AI do the creative work!</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Can I add more than two text layers?</h4>
            <p className="text-muted-foreground">Yes! Click the "Add Text" button to add as many text overlays as you need. Each can be individually positioned and styled.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">What image formats are supported?</h4>
            <p className="text-muted-foreground">You can upload JPG, PNG, GIF, and WebP images. The final meme is exported as a high-quality PNG.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">How do I copy the meme to clipboard?</h4>
            <p className="text-muted-foreground">Click the "Copy" button to copy your meme directly to clipboard. You can then paste it anywhere!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorTool;
