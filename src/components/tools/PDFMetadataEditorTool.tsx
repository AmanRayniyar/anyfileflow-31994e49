import React, { useState, useCallback } from 'react';
import { Upload, FileText, Save, Download, Trash2, Plus, X, RefreshCw, Eye, EyeOff, Calendar, User, Building, Tag, FileType, Lock, Unlock, Info, Settings, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PDFDocument } from '@pdfme/pdf-lib';

interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  // Custom metadata
  customFields: { key: string; value: string }[];
}

interface PDFInfo {
  pageCount: number;
  fileSize: number;
  fileName: string;
  pdfVersion: string;
  isEncrypted: boolean;
  permissions: {
    printing: boolean;
    modifying: boolean;
    copying: boolean;
    annotating: boolean;
  };
}

const PDFMetadataEditorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
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
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preserveOriginalDates, setPreserveOriginalDates] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    try {
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };

  const loadPDF = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      setPdfDoc(pdf);
      setFile(selectedFile);

      // Extract metadata
      const title = pdf.getTitle() || '';
      const author = pdf.getAuthor() || '';
      const subject = pdf.getSubject() || '';
      const keywordsStr = pdf.getKeywords() || '';
      const creator = pdf.getCreator() || '';
      const producer = pdf.getProducer() || '';
      const creationDate = pdf.getCreationDate();
      const modificationDate = pdf.getModificationDate();

      setMetadata({
        title,
        author,
        subject,
        keywords: keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : [],
        creator,
        producer,
        creationDate: formatDate(creationDate),
        modificationDate: formatDate(modificationDate),
        customFields: []
      });

      // Get PDF info
      const pageCount = pdf.getPageCount();
      
      setPdfInfo({
        pageCount,
        fileSize: selectedFile.size,
        fileName: selectedFile.name,
        pdfVersion: '1.7',
        isEncrypted: false,
        permissions: {
          printing: true,
          modifying: true,
          copying: true,
          annotating: true
        }
      });

      toast.success('PDF loaded successfully!');
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error('Failed to load PDF. The file may be corrupted or password-protected.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    loadPDF(selectedFile);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !metadata.keywords.includes(newKeyword.trim())) {
      setMetadata(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setMetadata(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addCustomField = () => {
    setMetadata(prev => ({
      ...prev,
      customFields: [...prev.customFields, { key: '', value: '' }]
    }));
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    setMetadata(prev => ({
      ...prev,
      customFields: prev.customFields.map((f, i) => 
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const removeCustomField = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success(`${fieldName} copied to clipboard`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const clearAllMetadata = () => {
    setMetadata({
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
    toast.success('All metadata cleared');
  };

  const savePDF = async () => {
    if (!pdfDoc || !file) {
      toast.error('No PDF loaded');
      return;
    }

    setIsLoading(true);
    try {
      // Set metadata
      if (metadata.title) pdfDoc.setTitle(metadata.title);
      if (metadata.author) pdfDoc.setAuthor(metadata.author);
      if (metadata.subject) pdfDoc.setSubject(metadata.subject);
      if (metadata.keywords.length > 0) pdfDoc.setKeywords(metadata.keywords);
      if (metadata.creator) pdfDoc.setCreator(metadata.creator);
      if (metadata.producer) pdfDoc.setProducer(metadata.producer);
      
      if (!preserveOriginalDates) {
        if (metadata.creationDate) {
          const creationDate = parseDate(metadata.creationDate);
          if (creationDate) pdfDoc.setCreationDate(creationDate);
        }
        pdfDoc.setModificationDate(new Date());
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const baseName = file.name.replace('.pdf', '');
      link.download = `${baseName}_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF saved with updated metadata!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('Failed to save PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setPdfDoc(null);
    setPdfInfo(null);
    setMetadata({
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Upload Area */}
      {!file ? (
        <Card className="border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <div
              className={`flex flex-col items-center justify-center py-12 cursor-pointer rounded-lg transition-all ${
                isDragging ? 'bg-primary/10 scale-[1.02]' : 'hover:bg-muted/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('pdf-upload')?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload PDF File</h3>
              <p className="text-muted-foreground text-center mb-4">
                Drag and drop your PDF here or click to browse
              </p>
              <Button variant="outline" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Select PDF
              </Button>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* File Info Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {pdfInfo?.fileName}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(pdfInfo?.fileSize || 0)}</span>
                      <span>•</span>
                      <span>{pdfInfo?.pageCount} pages</span>
                      {pdfInfo?.isEncrypted && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Encrypted
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetFile}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New File
                  </Button>
                  <Button onClick={savePDF} disabled={isLoading}>
                    <Download className="w-4 h-4 mr-2" />
                    Save PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Editor */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Document Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <FileType className="w-4 h-4" />
                        Title
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="title"
                          value={metadata.title}
                          onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Document title"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(metadata.title, 'Title')}
                          disabled={!metadata.title}
                        >
                          {copiedField === 'Title' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Author
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="author"
                          value={metadata.author}
                          onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Author name"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(metadata.author, 'Author')}
                          disabled={!metadata.author}
                        >
                          {copiedField === 'Author' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Subject
                    </Label>
                    <Textarea
                      id="subject"
                      value={metadata.subject}
                      onChange={(e) => setMetadata(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Document subject or description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creator">Creator Application</Label>
                      <Input
                        id="creator"
                        value={metadata.creator}
                        onChange={(e) => setMetadata(prev => ({ ...prev, creator: e.target.value }))}
                        placeholder="e.g., Microsoft Word, Adobe InDesign"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="producer">PDF Producer</Label>
                      <Input
                        id="producer"
                        value={metadata.producer}
                        onChange={(e) => setMetadata(prev => ({ ...prev, producer: e.target.value }))}
                        placeholder="e.g., Adobe PDF Library"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creationDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Creation Date
                      </Label>
                      <Input
                        id="creationDate"
                        type="datetime-local"
                        value={metadata.creationDate}
                        onChange={(e) => setMetadata(prev => ({ ...prev, creationDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modificationDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Modification Date
                      </Label>
                      <Input
                        id="modificationDate"
                        type="datetime-local"
                        value={metadata.modificationDate}
                        onChange={(e) => setMetadata(prev => ({ ...prev, modificationDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="preserve-dates"
                      checked={preserveOriginalDates}
                      onCheckedChange={setPreserveOriginalDates}
                    />
                    <Label htmlFor="preserve-dates" className="text-sm">
                      Preserve original dates on save
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Keywords Tab */}
            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Keywords & Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add a keyword"
                      onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-muted/30 rounded-lg">
                    {metadata.keywords.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No keywords added yet</p>
                    ) : (
                      metadata.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => removeKeyword(keyword)}
                        >
                          {keyword}
                          <X className="w-3 h-3 ml-2" />
                        </Badge>
                      ))
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Click on a keyword to remove it. Keywords help with document searchability.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Custom Metadata Fields
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Add custom metadata fields for specialized workflows and document management systems.
                  </p>

                  {metadata.customFields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          value={field.key}
                          onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                          placeholder="Field name"
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                          placeholder="Field value"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomField(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" onClick={addCustomField} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Field
                  </Button>
                </CardContent>
              </Card>

              {/* Document Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Document Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{pdfInfo?.pageCount || 0}</div>
                      <div className="text-sm text-muted-foreground">Pages</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{formatFileSize(pdfInfo?.fileSize || 0)}</div>
                      <div className="text-sm text-muted-foreground">File Size</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{metadata.keywords.length}</div>
                      <div className="text-sm text-muted-foreground">Keywords</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{metadata.customFields.length}</div>
                      <div className="text-sm text-muted-foreground">Custom Fields</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={clearAllMetadata}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Metadata
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMetadata(prev => ({
                          ...prev,
                          modificationDate: new Date().toISOString().slice(0, 16)
                        }));
                        toast.success('Modification date updated');
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Update Mod Date
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const metadataText = `Title: ${metadata.title}\nAuthor: ${metadata.author}\nSubject: ${metadata.subject}\nKeywords: ${metadata.keywords.join(', ')}\nCreator: ${metadata.creator}\nProducer: ${metadata.producer}\nCreated: ${metadata.creationDate}\nModified: ${metadata.modificationDate}`;
                        copyToClipboard(metadataText, 'All metadata');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Metadata
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Processing PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFMetadataEditorTool;
