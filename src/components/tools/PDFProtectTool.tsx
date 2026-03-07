import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, Lock, Download, FileText, X, 
  Eye, EyeOff, Shield, CheckCircle, Copy, RefreshCw,
  Settings, Info, ChevronDown, ChevronUp, AlertTriangle,
  Zap, Users, Printer, PenTool, FileWarning, Clock,
  ShieldCheck, ShieldAlert, Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface ProtectionSettings {
  userPassword: string;
  ownerPassword: string;
  keyLength: '128' | '256';
  allowPrinting: boolean;
  allowModifying: boolean;
  allowCopying: boolean;
  allowAnnotations: boolean;
  allowFormFilling: boolean;
  allowAssembly: boolean;
}

interface BatchFile {
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: Blob;
  error?: string;
}

type SecurityPreset = 'maximum' | 'standard' | 'view-only' | 'custom';

type QpdfModule = any;

const PRESETS: Record<Exclude<SecurityPreset, 'custom'>, { label: string; description: string; icon: React.ReactNode; settings: Partial<ProtectionSettings> }> = {
  'maximum': {
    label: 'Maximum Security',
    description: '256-bit AES, no printing, no copying, no modifications',
    icon: <ShieldAlert className="h-5 w-5" />,
    settings: {
      keyLength: '256',
      allowPrinting: false,
      allowModifying: false,
      allowCopying: false,
      allowAnnotations: false,
      allowFormFilling: false,
      allowAssembly: false,
    }
  },
  'standard': {
    label: 'Standard Protection',
    description: '256-bit AES, allow printing, block copying & editing',
    icon: <ShieldCheck className="h-5 w-5" />,
    settings: {
      keyLength: '256',
      allowPrinting: true,
      allowModifying: false,
      allowCopying: false,
      allowAnnotations: true,
      allowFormFilling: true,
      allowAssembly: false,
    }
  },
  'view-only': {
    label: 'View Only',
    description: '256-bit AES, no printing, no copying, annotations only',
    icon: <Eye className="h-5 w-5" />,
    settings: {
      keyLength: '256',
      allowPrinting: false,
      allowModifying: false,
      allowCopying: false,
      allowAnnotations: true,
      allowFormFilling: false,
      allowAssembly: false,
    }
  },
};

const PDFProtectTool: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [file, setFile] = useState<File | null>(null);
  const [batchFiles, setBatchFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [protectedPdf, setProtectedPdf] = useState<Blob | null>(null);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preset, setPreset] = useState<SecurityPreset>('standard');
  const [useOwnerPassword, setUseOwnerPassword] = useState(false);
  const [settings, setSettings] = useState<ProtectionSettings>({
    userPassword: '',
    ownerPassword: '',
    keyLength: '256',
    allowPrinting: true,
    allowModifying: false,
    allowCopying: false,
    allowAnnotations: true,
    allowFormFilling: true,
    allowAssembly: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number; fileSize: string; title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const qpdfRef = useRef<QpdfModule | null>(null);

  useEffect(() => {
    const loadQpdf = async () => {
      try {
        const createModule = (await import('@neslinesli93/qpdf-wasm')).default;
        const qpdf = await createModule({
          locateFile: () => `https://unpkg.com/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.wasm`,
          noInitialRun: true,
          print: () => {},
          printErr: () => {},
        } as any);
        qpdfRef.current = qpdf;
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load QPDF:', error);
        setIsLoading(false);
        toast.error('Failed to load PDF encryption engine');
      }
    };
    loadQpdf();
  }, []);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 10;
    if (password.length >= 8) strength += 15;
    if (password.length >= 12) strength += 15;
    if (password.length >= 16) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(100, strength);
  };

  const generateStrongPassword = (length: number = 20) => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*_+-=';
    const all = lower + upper + digits + special;
    // Guarantee at least one of each type
    let password = [
      lower[Math.floor(Math.random() * lower.length)],
      upper[Math.floor(Math.random() * upper.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
    ];
    for (let i = password.length; i < length; i++) {
      password.push(all[Math.floor(Math.random() * all.length)]);
    }
    // Shuffle
    password = password.sort(() => Math.random() - 0.5);
    const pw = password.join('');
    setSettings(prev => ({ ...prev, userPassword: pw }));
    setPasswordStrength(calculatePasswordStrength(pw));
    toast.success('Strong password generated!');
  };

  const copyPassword = () => {
    if (settings.userPassword) {
      navigator.clipboard.writeText(settings.userPassword);
      toast.success('Password copied to clipboard!');
    }
  };

  const handlePasswordChange = (password: string) => {
    setSettings(prev => ({ ...prev, userPassword: password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const applyPreset = (key: SecurityPreset) => {
    setPreset(key);
    if (key !== 'custom') {
      setSettings(prev => ({ ...prev, ...PRESETS[key].settings }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length === 0) {
      toast.error('Please upload valid PDF files');
      return;
    }
    if (mode === 'batch') {
      setBatchFiles(prev => [...prev, ...files.map(f => ({ file: f, status: 'pending' as const }))]);
      toast.success(`${files.length} PDF(s) added to batch`);
    } else {
      handleFileLoad(files[0]);
    }
  }, [mode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      handleFileLoad(selectedFile);
    } else {
      toast.error('Please upload a valid PDF file');
    }
  };

  const handleBatchSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
      setBatchFiles(prev => [...prev, ...files.map(f => ({ file: f, status: 'pending' as const }))]);
      toast.success(`${files.length} PDF(s) added`);
    }
  };

  const handleFileLoad = (selectedFile: File) => {
    setFile(selectedFile);
    setProtectedPdf(null);
    const estimatedPages = Math.max(1, Math.ceil(selectedFile.size / 50000));
    setPdfInfo({
      pageCount: estimatedPages,
      fileSize: formatFileSize(selectedFile.size),
      title: selectedFile.name.replace('.pdf', '')
    });
    toast.success('PDF loaded successfully!');
  };

  const buildQpdfArgs = (inputPath: string, outputPath: string): string[] => {
    const ownerPass = useOwnerPassword && settings.ownerPassword ? settings.ownerPassword : settings.userPassword;
    const args: string[] = [inputPath, '--encrypt', settings.userPassword, ownerPass, settings.keyLength, '--'];
    
    if (!settings.allowPrinting) args.push('--print=none');
    if (!settings.allowModifying) args.push('--modify=none');
    if (!settings.allowCopying) args.push('--extract=n');
    if (!settings.allowAnnotations) args.push('--annotate=n');
    if (!settings.allowFormFilling) args.push('--form=n');
    if (!settings.allowAssembly) args.push('--assemble=n');
    
    args.push(outputPath);
    return args;
  };

  const encryptSingleFile = async (fileToEncrypt: File): Promise<Blob> => {
    const qpdf = qpdfRef.current!;
    const arrayBuffer = await fileToEncrypt.arrayBuffer();
    const inputData = new Uint8Array(arrayBuffer);
    const inputPath = `/input_${Date.now()}.pdf`;
    const outputPath = `/output_${Date.now()}.pdf`;
    
    qpdf.FS.writeFile(inputPath, inputData);
    const args = buildQpdfArgs(inputPath, outputPath);
    const result = qpdf.callMain(args);
    
    if (result !== 0) throw new Error('QPDF encryption failed');
    
    const outputData = qpdf.FS.readFile(outputPath);
    try { qpdf.FS.unlink(inputPath); qpdf.FS.unlink(outputPath); } catch {}
    
    return new Blob([outputData], { type: 'application/pdf' });
  };

  const protectPdf = async () => {
    if (!file || !settings.userPassword) {
      toast.error('Please select a file and enter a password');
      return;
    }
    if (settings.userPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    if (!qpdfRef.current) {
      toast.error('PDF engine not loaded. Please wait or refresh.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      setProgress(15);
      const blob = await encryptSingleFile(file);
      setProgress(100);
      setProtectedPdf(blob);
      toast.success(`PDF encrypted with ${settings.keyLength}-bit AES!`);
    } catch (error) {
      console.error('Error encrypting PDF:', error);
      toast.error('Failed to encrypt PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const protectBatch = async () => {
    if (batchFiles.length === 0 || !settings.userPassword) {
      toast.error('Add files and enter a password first');
      return;
    }
    if (!qpdfRef.current) {
      toast.error('PDF engine not loaded.');
      return;
    }
    setIsProcessing(true);
    setProgress(0);

    const updated = [...batchFiles];
    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: 'processing' };
      setBatchFiles([...updated]);
      try {
        const blob = await encryptSingleFile(updated[i].file);
        updated[i] = { ...updated[i], status: 'done', result: blob };
      } catch (e) {
        updated[i] = { ...updated[i], status: 'error', error: 'Encryption failed' };
      }
      setBatchFiles([...updated]);
      setProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    const successCount = updated.filter(f => f.status === 'done').length;
    toast.success(`${successCount}/${updated.length} PDFs encrypted successfully!`);
    setIsProcessing(false);
  };

  const downloadProtectedPdf = () => {
    if (protectedPdf && file) {
      const url = URL.createObjectURL(protectedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Protected PDF downloaded!');
    }
  };

  const downloadBatchFile = (bf: BatchFile) => {
    if (bf.result) {
      const url = URL.createObjectURL(bf.result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected_${bf.file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const downloadAllBatch = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    batchFiles.forEach(bf => {
      if (bf.result) zip.file(`protected_${bf.file.name}`, bf.result);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'protected_pdfs.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('All protected PDFs downloaded as ZIP!');
  };

  const resetTool = () => {
    setFile(null);
    setProtectedPdf(null);
    setPdfInfo(null);
    setBatchFiles([]);
    setSettings(prev => ({ ...prev, userPassword: '', ownerPassword: '' }));
    setPasswordStrength(0);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (batchInputRef.current) batchInputRef.current.value = '';
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-destructive';
    if (passwordStrength < 50) return 'bg-yellow-500';
    if (passwordStrength < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const permissionItems = [
    { key: 'allowPrinting' as const, label: 'Allow Printing', icon: <Printer className="h-4 w-4" /> },
    { key: 'allowCopying' as const, label: 'Allow Copying Text', icon: <Copy className="h-4 w-4" /> },
    { key: 'allowModifying' as const, label: 'Allow Modifying', icon: <PenTool className="h-4 w-4" /> },
    { key: 'allowAnnotations' as const, label: 'Allow Annotations', icon: <FileText className="h-4 w-4" /> },
    { key: 'allowFormFilling' as const, label: 'Allow Form Filling', icon: <FileWarning className="h-4 w-4" /> },
    { key: 'allowAssembly' as const, label: 'Allow Page Assembly', icon: <Settings className="h-4 w-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading PDF encryption engine...</p>
        <p className="text-xs text-muted-foreground">Powered by WebAssembly — runs 100% in your browser</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <Tabs value={mode} onValueChange={(v) => { setMode(v as 'single' | 'batch'); resetTool(); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Single PDF
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Batch Mode
          </TabsTrigger>
        </TabsList>

        {/* Single Mode Upload */}
        <TabsContent value="single">
          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              file ? 'border-green-500 bg-green-500/5' : 'border-border hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload PDF file"
            />
            
            {file && pdfInfo ? (
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {pdfInfo.fileSize} · ~{pdfInfo.pageCount} pages
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); resetTool(); }}
                  className="ml-4"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-full inline-block">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Drop your PDF here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF files up to 100MB · 100% local processing
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Batch Mode Upload */}
        <TabsContent value="batch">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 border-border hover:border-primary hover:bg-primary/5"
          >
            <input
              ref={batchInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleBatchSelect}
              className="hidden"
            />
            <Button variant="outline" onClick={() => batchInputRef.current?.click()} className="mb-3">
              <Plus className="h-4 w-4 mr-2" /> Add PDFs
            </Button>
            <p className="text-sm text-muted-foreground">Or drag & drop multiple PDFs here</p>
          </div>

          {batchFiles.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {batchFiles.map((bf, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{bf.file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(bf.file.size)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {bf.status === 'done' && (
                      <Button size="sm" variant="ghost" onClick={() => downloadBatchFile(bf)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {bf.status === 'done' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {bf.status === 'processing' && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                    {bf.status === 'error' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <Button size="sm" variant="ghost" onClick={() => setBatchFiles(prev => prev.filter((_, j) => j !== i))} disabled={isProcessing}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Security Presets */}
      {(file || batchFiles.length > 0) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Zap className="h-4 w-4 text-primary" /> Security Preset
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.entries(PRESETS) as [Exclude<SecurityPreset, 'custom'>, typeof PRESETS['maximum']][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    preset === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={preset === key ? 'text-primary' : 'text-muted-foreground'}>{val.icon}</span>
                    <span className="font-medium text-sm text-foreground">{val.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{val.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => { applyPreset('custom'); setShowAdvanced(true); }}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all text-sm ${
                preset === 'custom' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <span className="font-medium text-foreground">Custom Configuration</span>
              <span className="text-xs text-muted-foreground ml-2">— Fine-tune every permission</span>
            </button>
          </div>

          {/* Password Section */}
          <div className="space-y-3">
            <Label htmlFor="userPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password to Open PDF *
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="userPassword"
                  type={showUserPassword ? 'text' : 'password'}
                  value={settings.userPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter a strong password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowUserPassword(!showUserPassword)}
                  aria-label={showUserPassword ? 'Hide password' : 'Show password'}
                >
                  {showUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="button" variant="outline" onClick={() => generateStrongPassword(20)} title="Generate strong password">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={copyPassword} disabled={!settings.userPassword} title="Copy password">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {settings.userPassword && (
              <div className="space-y-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }} />
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium">{getStrengthText()}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{settings.userPassword.length} characters</p>
                </div>
              </div>
            )}
          </div>

          {/* Encryption Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Encryption Level
            </Label>
            <Select
              value={settings.keyLength}
              onValueChange={(value: '128' | '256') => {
                setSettings(prev => ({ ...prev, keyLength: value }));
                setPreset('custom');
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">
                  <span className="flex items-center gap-2">128-bit AES — Good compatibility</span>
                </SelectItem>
                <SelectItem value="256">
                  <span className="flex items-center gap-2">256-bit AES — Maximum security</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options Toggle */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Advanced Options
            </span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showAdvanced && (
            <div className="space-y-5 p-4 bg-secondary/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Owner Password Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="ownerToggle" className="flex items-center gap-2 cursor-pointer">
                  <Shield className="h-4 w-4" /> Separate Owner Password
                </Label>
                <Switch id="ownerToggle" checked={useOwnerPassword} onCheckedChange={setUseOwnerPassword} />
              </div>

              {useOwnerPassword && (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showOwnerPassword ? 'text' : 'password'}
                      value={settings.ownerPassword}
                      onChange={(e) => setSettings(prev => ({ ...prev, ownerPassword: e.target.value }))}
                      placeholder="Password to edit permissions"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                    >
                      {showOwnerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The owner password allows changing permissions even when the user password is set.
                  </p>
                </div>
              )}

              {/* Granular Permissions */}
              <div className="space-y-3">
                <Label>Document Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {permissionItems.map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Checkbox
                        checked={settings[item.key]}
                        onCheckedChange={(checked) => {
                          setSettings(prev => ({ ...prev, [item.key]: checked as boolean }));
                          setPreset('custom');
                        }}
                      />
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Summary */}
          <div className="p-4 bg-secondary/30 rounded-xl">
            <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Security Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Encryption</p>
                <p className="font-medium text-foreground">{settings.keyLength}-bit AES</p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Printing</p>
                <p className={`font-medium ${settings.allowPrinting ? 'text-green-600' : 'text-destructive'}`}>
                  {settings.allowPrinting ? 'Allowed' : 'Blocked'}
                </p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Copying</p>
                <p className={`font-medium ${settings.allowCopying ? 'text-green-600' : 'text-destructive'}`}>
                  {settings.allowCopying ? 'Allowed' : 'Blocked'}
                </p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Editing</p>
                <p className={`font-medium ${settings.allowModifying ? 'text-green-600' : 'text-destructive'}`}>
                  {settings.allowModifying ? 'Allowed' : 'Blocked'}
                </p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Forms</p>
                <p className={`font-medium ${settings.allowFormFilling ? 'text-green-600' : 'text-destructive'}`}>
                  {settings.allowFormFilling ? 'Allowed' : 'Blocked'}
                </p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Assembly</p>
                <p className={`font-medium ${settings.allowAssembly ? 'text-green-600' : 'text-destructive'}`}>
                  {settings.allowAssembly ? 'Allowed' : 'Blocked'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Encrypting with {settings.keyLength}-bit AES... {progress}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {mode === 'single' ? (
              <>
                <Button onClick={protectPdf} disabled={isProcessing || !settings.userPassword || !file} className="flex-1 min-w-[150px]">
                  {isProcessing ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Encrypting...</>
                  ) : (
                    <><Lock className="h-4 w-4 mr-2" /> Protect PDF</>
                  )}
                </Button>
                {protectedPdf && (
                  <Button onClick={downloadProtectedPdf} variant="outline" className="flex-1 min-w-[150px] border-green-500 text-green-600 hover:bg-green-500/10">
                    <Download className="h-4 w-4 mr-2" /> Download Protected PDF
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button onClick={protectBatch} disabled={isProcessing || !settings.userPassword || batchFiles.length === 0} className="flex-1 min-w-[150px]">
                  {isProcessing ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><Lock className="h-4 w-4 mr-2" /> Protect All ({batchFiles.length})</>
                  )}
                </Button>
                {batchFiles.some(f => f.status === 'done') && (
                  <Button onClick={downloadAllBatch} variant="outline" className="flex-1 min-w-[150px] border-green-500 text-green-600 hover:bg-green-500/10">
                    <Download className="h-4 w-4 mr-2" /> Download All (ZIP)
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Success */}
          {protectedPdf && mode === 'single' && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">PDF Protected Successfully!</p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Encrypted with {settings.keyLength}-bit AES. {!settings.allowPrinting && 'Printing disabled. '}{!settings.allowCopying && 'Copying disabled. '}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">100% Local & Private</p>
          <p>
            All processing happens locally in your browser using WebAssembly (QPDF). 
            Your files and passwords are <strong>never uploaded</strong> to any server. Zero data collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFProtectTool;
