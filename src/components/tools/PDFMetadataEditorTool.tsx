import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, FileText, Download, Trash2, Plus, X, RefreshCw, 
  Calendar, Building, Tag, FileType, Info, Settings, 
  Copy, Check, File, Layers, Hash, Clock, Edit3, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  customFields: { key: string; value: string }[];
}

interface PDFInfo {
  pageCount: number;
  fileSize: number;
  fileName: string;
}

const PDFMetadataEditorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadata>({
    title: '',
    author: '',
    subject: '',
    keywords: [],
    creator: '',
    producer: '',
    creationDate: '',
    modificationDate: '',
    customFields: []
  });
  const [originalMetadata, setOriginalMetadata] = useState<PDFMetadata | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateForInput = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      if (dateStr.startsWith('D:')) {
        const d = dateStr.substring(2);
        const year = d.substring(0, 4);
        const month = d.substring(4, 6) || '01';
        const day = d.substring(6, 8) || '01';
        const hour = d.substring(8, 10) || '00';
        const min = d.substring(10, 12) || '00';
        return `${year}-${month}-${day}T${hour}:${min}`;
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 16);
      }
    } catch {
      return '';
    }
    return '';
  };

  const loadPDF = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      setPdfBytes(arrayBuffer);
      setFile(selectedFile);

      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('latin1').decode(uint8Array);
      
      const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
      const pageCount = pageMatches ? pageMatches.length : 1;
      
      let title = '', author = '', subject = '', keywords = '', creator = '', producer = '';
      let creationDate = '', modDate = '';
      
      const titleMatch = text.match(/\/Title\s*\(([^)]*)\)/);
      if (titleMatch) title = titleMatch[1];
      
      const authorMatch = text.match(/\/Author\s*\(([^)]*)\)/);
      if (authorMatch) author = authorMatch[1];
      
      const subjectMatch = text.match(/\/Subject\s*\(([^)]*)\)/);
      if (subjectMatch) subject = subjectMatch[1];
      
      const keywordsMatch = text.match(/\/Keywords\s*\(([^)]*)\)/);
      if (keywordsMatch) keywords = keywordsMatch[1];
      
      const creatorMatch = text.match(/\/Creator\s*\(([^)]*)\)/);
      if (creatorMatch) creator = creatorMatch[1];
      
      const producerMatch = text.match(/\/Producer\s*\(([^)]*)\)/);
      if (producerMatch) producer = producerMatch[1];
      
      const creationMatch = text.match(/\/CreationDate\s*\(([^)]*)\)/);
      if (creationMatch) creationDate = creationMatch[1];
      
      const modMatch = text.match(/\/ModDate\s*\(([^)]*)\)/);
      if (modMatch) modDate = modMatch[1];

      const newMetadata: PDFMetadata = {
        title: title || '',
        author: author || '',
        subject: subject || '',
        keywords: keywords ? keywords.split(/[,;]/).map(k => k.trim()).filter(k => k) : [],
        creator: creator || '',
        producer: producer || '',
        creationDate: formatDateForInput(creationDate),
        modificationDate: formatDateForInput(modDate),
        customFields: []
      };

      setMetadata(newMetadata);
      setOriginalMetadata(JSON.parse(JSON.stringify(newMetadata)));
      setHasChanges(false);
      setPdfInfo({ pageCount, fileSize: selectedFile.size, fileName: selectedFile.name });

      toast.success('PDF loaded successfully!');
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error('Failed to load PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please select a PDF file');
      return;
    }
    loadPDF(selectedFile);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const updateMetadata = (field: keyof PDFMetadata, value: unknown) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !metadata.keywords.includes(newKeyword.trim())) {
      updateMetadata('keywords', [...metadata.keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    updateMetadata('keywords', metadata.keywords.filter(k => k !== keyword));
  };

  const addCustomField = () => {
    updateMetadata('customFields', [...metadata.customFields, { key: '', value: '' }]);
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const newFields = [...metadata.customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    updateMetadata('customFields', newFields);
  };

  const removeCustomField = (index: number) => {
    updateMetadata('customFields', metadata.customFields.filter((_, i) => i !== index));
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success(`${fieldName} copied!`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const clearAllMetadata = () => {
    setMetadata({
      title: '', author: '', subject: '', keywords: [],
      creator: '', producer: '', creationDate: '', modificationDate: '', customFields: []
    });
    setHasChanges(true);
    toast.success('All metadata cleared');
  };

  const resetToOriginal = () => {
    if (originalMetadata) {
      setMetadata(JSON.parse(JSON.stringify(originalMetadata)));
      setHasChanges(false);
      toast.success('Reset to original');
    }
  };

  const formatPdfDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `D:${y}${m}${d}${h}${min}${s}`;
    } catch {
      return '';
    }
  };

  const savePDF = async () => {
    if (!pdfBytes || !file) {
      toast.error('No PDF loaded');
      return;
    }

    setIsLoading(true);
    try {
      const uint8Array = new Uint8Array(pdfBytes);
      let pdfText = new TextDecoder('latin1').decode(uint8Array);
      
      const escapeStr = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      
      const infoDict = [
        metadata.title ? `/Title (${escapeStr(metadata.title)})` : '',
        metadata.author ? `/Author (${escapeStr(metadata.author)})` : '',
        metadata.subject ? `/Subject (${escapeStr(metadata.subject)})` : '',
        metadata.keywords.length > 0 ? `/Keywords (${escapeStr(metadata.keywords.join(', '))})` : '',
        metadata.creator ? `/Creator (${escapeStr(metadata.creator)})` : '',
        `/Producer (AnyFile Flow PDF Editor)`,
        metadata.creationDate ? `/CreationDate (${formatPdfDate(metadata.creationDate)})` : '',
        `/ModDate (${formatPdfDate(new Date().toISOString())})`
      ].filter(Boolean).join('\n');

      const newInfoObj = `\n999 0 obj\n<<\n${infoDict}\n>>\nendobj\n`;
      
      const eofIndex = pdfText.lastIndexOf('%%EOF');
      if (eofIndex > -1) {
        pdfText = pdfText.slice(0, eofIndex) + newInfoObj + '%%EOF';
      } else {
        pdfText += newInfoObj + '%%EOF';
      }
      
      const modifiedBytes = new Uint8Array(pdfText.length);
      for (let i = 0; i < pdfText.length; i++) {
        modifiedBytes[i] = pdfText.charCodeAt(i) & 0xFF;
      }
      
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, '')}_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasChanges(false);
      toast.success('PDF saved!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setPdfBytes(null);
    setPdfInfo(null);
    setOriginalMetadata(null);
    setHasChanges(false);
    setMetadata({
      title: '', author: '', subject: '', keywords: [],
      creator: '', producer: '', creationDate: '', modificationDate: '', customFields: []
    });
  };

  const CopyBtn = ({ text, name }: { text: string; name: string }) => (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(text, name)} disabled={!text}>
      {copiedField === name ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );

  if (!file) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-all">
          <CardContent className="p-8">
            <div
              className={`flex flex-col items-center justify-center py-16 cursor-pointer rounded-xl transition-all ${
                isDragging ? 'bg-primary/10 scale-[1.02]' : 'hover:bg-muted/50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Upload PDF Document</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Drag and drop your PDF here or click to browse. Edit title, author, keywords, and all document properties like MS Word.
              </p>
              <Button size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Select PDF File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supports all PDF versions • Secure local processing
              </p>
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Toolbar */}
      <Card className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-sm truncate max-w-[150px] sm:max-w-[250px]">{pdfInfo?.fileName}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(pdfInfo?.fileSize || 0)}</span>
                  <span>•</span>
                  <span>{pdfInfo?.pageCount} pages</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Edit3 className="w-3 h-3" />
                  Unsaved
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={resetToOriginal} disabled={!hasChanges}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={resetFile}>
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
              <Button onClick={savePDF} disabled={isLoading}>
                <Download className="w-4 h-4 mr-1" />
                Save PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileType className="w-4 h-4" />
                Document Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <div className="flex gap-1">
                    <Input id="title" value={metadata.title} onChange={(e) => updateMetadata('title', e.target.value)} placeholder="Document title" />
                    <CopyBtn text={metadata.title} name="Title" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <div className="flex gap-1">
                    <Input id="author" value={metadata.author} onChange={(e) => updateMetadata('author', e.target.value)} placeholder="Author name" />
                    <CopyBtn text={metadata.author} name="Author" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Description</Label>
                <Textarea id="subject" value={metadata.subject} onChange={(e) => updateMetadata('subject', e.target.value)} placeholder="Brief description" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Keywords & Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="Add keyword" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())} />
                <Button onClick={addKeyword} disabled={!newKeyword.trim()} size="sm"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/30 rounded-lg">
                {metadata.keywords.length === 0 ? (
                  <p className="text-muted-foreground text-sm italic">No keywords added</p>
                ) : (
                  metadata.keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 gap-1.5 cursor-pointer hover:bg-destructive/80 hover:text-destructive-foreground" onClick={() => removeKeyword(kw)}>
                      <Hash className="w-3 h-3" />{kw}<X className="w-3 h-3" />
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-4 h-4" />
                Application Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creator">Created With</Label>
                  <Input id="creator" value={metadata.creator} onChange={(e) => updateMetadata('creator', e.target.value)} placeholder="e.g., Microsoft Word" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="producer">PDF Producer</Label>
                  <Input id="producer" value={metadata.producer} onChange={(e) => updateMetadata('producer', e.target.value)} placeholder="e.g., Adobe PDF Library" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creationDate" className="flex items-center gap-1"><Calendar className="w-3 h-3" />Created Date</Label>
                  <Input id="creationDate" type="datetime-local" value={metadata.creationDate} onChange={(e) => updateMetadata('creationDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modificationDate" className="flex items-center gap-1"><Clock className="w-3 h-3" />Modified Date</Label>
                  <Input id="modificationDate" type="datetime-local" value={metadata.modificationDate} onChange={(e) => updateMetadata('modificationDate', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4" />Custom Metadata</CardTitle>
                <Button variant="outline" size="sm" onClick={addCustomField}><Plus className="w-4 h-4 mr-1" />Add</Button>
              </div>
            </CardHeader>
            <CardContent>
              {metadata.customFields.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No custom fields</p>
              ) : (
                <div className="space-y-3">
                  {metadata.customFields.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input value={f.key} onChange={(e) => updateCustomField(i, 'key', e.target.value)} placeholder="Field name" className="flex-1" />
                      <Input value={f.value} onChange={(e) => updateCustomField(i, 'value', e.target.value)} placeholder="Value" className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => removeCustomField(i)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Info className="w-4 h-4" />Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <Layers className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">{pdfInfo?.pageCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Pages</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <File className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">{formatFileSize(pdfInfo?.fileSize || 0)}</div>
                  <div className="text-xs text-muted-foreground">Size</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Keywords</span><span className="font-medium">{metadata.keywords.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Custom Fields</span><span className="font-medium">{metadata.customFields.length}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { updateMetadata('modificationDate', new Date().toISOString().slice(0, 16)); toast.success('Date updated'); }}>
                <Clock className="w-4 h-4" />Set Modified to Now
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                const text = `Title: ${metadata.title}\nAuthor: ${metadata.author}\nSubject: ${metadata.subject}\nKeywords: ${metadata.keywords.join(', ')}`;
                copyToClipboard(text, 'All');
              }}>
                <Copy className="w-4 h-4" />Copy All Metadata
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={clearAllMetadata}>
                <Trash2 className="w-4 h-4" />Clear All
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">About PDF Metadata</p>
                  <p className="text-muted-foreground text-xs">Edit title, author, keywords to improve document organization and searchability.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-64">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-medium">Processing...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PDFMetadataEditorTool;
