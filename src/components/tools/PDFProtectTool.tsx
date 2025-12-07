import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, Lock, Download, FileText, X, 
  Eye, EyeOff, Shield, CheckCircle, Copy, RefreshCw,
  Settings, Info, ChevronDown, ChevronUp, AlertTriangle
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

interface ProtectionSettings {
  userPassword: string;
  ownerPassword: string;
  keyLength: '128' | '256';
  allowPrinting: boolean;
  allowModifying: boolean;
  allowCopying: boolean;
  allowAnnotations: boolean;
}

// QPDF module interface - using any to avoid complex Emscripten types
type QpdfModule = any;

const PDFProtectTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [protectedPdf, setProtectedPdf] = useState<Blob | null>(null);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState<ProtectionSettings>({
    userPassword: '',
    ownerPassword: '',
    keyLength: '256',
    allowPrinting: true,
    allowModifying: false,
    allowCopying: false,
    allowAnnotations: true,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [pdfInfo, setPdfInfo] = useState<{ pageCount: number; title?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const qpdfRef = useRef<QpdfModule | null>(null);

  // Load QPDF WASM module
  useEffect(() => {
    const loadQpdf = async () => {
      try {
        const createModule = (await import('@neslinesli93/qpdf-wasm')).default;
        const qpdf = await createModule({
          locateFile: () => `https://unpkg.com/@neslinesli93/qpdf-wasm@0.3.0/dist/qpdf.wasm`,
          noInitialRun: true,
          print: () => {},
          printErr: () => {},
        });
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
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    return Math.min(100, strength);
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSettings(prev => ({ ...prev, userPassword: password }));
    setPasswordStrength(calculatePasswordStrength(password));
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileLoad(droppedFile);
    } else {
      toast.error('Please upload a valid PDF file');
    }
  }, []);

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

  const handleFileLoad = async (selectedFile: File) => {
    setFile(selectedFile);
    setProtectedPdf(null);
    
    // Estimate page count from file size (rough approximation)
    const estimatedPages = Math.max(1, Math.ceil(selectedFile.size / 50000));
    setPdfInfo({
      pageCount: estimatedPages,
      title: selectedFile.name.replace('.pdf', '')
    });
    toast.success('PDF loaded successfully!');
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
      toast.error('PDF engine not loaded. Please wait or refresh the page.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const qpdf = qpdfRef.current;
      
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      const inputData = new Uint8Array(arrayBuffer);
      
      setProgress(20);
      
      // Write input file to virtual filesystem
      const inputPath = '/input.pdf';
      const outputPath = '/output.pdf';
      qpdf.FS.writeFile(inputPath, inputData);
      
      setProgress(40);
      
      // Build QPDF encryption command
      const ownerPass = settings.ownerPassword || settings.userPassword;
      const args: string[] = [
        inputPath,
        '--encrypt',
        settings.userPassword,
        ownerPass,
        settings.keyLength,
        '--'
      ];
      
      // Add permission restrictions
      if (!settings.allowPrinting) {
        args.push('--print=none');
      }
      if (!settings.allowModifying) {
        args.push('--modify=none');
      }
      if (!settings.allowCopying) {
        args.push('--extract=n');
      }
      if (!settings.allowAnnotations) {
        args.push('--annotate=n');
      }
      
      args.push(outputPath);
      
      setProgress(60);
      
      // Execute QPDF
      const result = qpdf.callMain(args);
      
      if (result !== 0) {
        throw new Error('QPDF encryption failed');
      }
      
      setProgress(80);
      
      // Read encrypted file
      const outputData = qpdf.FS.readFile(outputPath);
      
      // Cleanup virtual filesystem
      try {
        qpdf.FS.unlink(inputPath);
        qpdf.FS.unlink(outputPath);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      setProgress(90);
      
      const blob = new Blob([outputData], { type: 'application/pdf' });
      
      setProgress(100);
      setProtectedPdf(blob);
      toast.success(`PDF encrypted with ${settings.keyLength}-bit AES encryption!`);
      
    } catch (error) {
      console.error('Error encrypting PDF:', error);
      toast.error('Failed to encrypt PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

  const resetTool = () => {
    setFile(null);
    setProtectedPdf(null);
    setPdfInfo(null);
    setSettings({
      userPassword: '',
      ownerPassword: '',
      keyLength: '256',
      allowPrinting: true,
      allowModifying: false,
      allowCopying: false,
      allowAnnotations: true,
    });
    setPasswordStrength(0);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading PDF encryption engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          file 
            ? 'border-green-500 bg-green-500/5' 
            : 'border-border hover:border-primary hover:bg-primary/5'
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
        
        {file ? (
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                resetTool();
              }}
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
                Supports PDF files up to 100MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Password Settings */}
      {file && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* User Password */}
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
              <Button
                type="button"
                variant="outline"
                onClick={generateStrongPassword}
                title="Generate strong password"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={copyPassword}
                disabled={!settings.userPassword}
                title="Copy password"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {settings.userPassword && (
              <div className="space-y-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password strength: <span className="font-medium">{getStrengthText()}</span>
                </p>
              </div>
            )}
          </div>

          {/* Encryption Level */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Encryption Level
            </Label>
            <Select
              value={settings.keyLength}
              onValueChange={(value: '128' | '256') => 
                setSettings(prev => ({ ...prev, keyLength: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select encryption level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128-bit AES (Compatible)</SelectItem>
                <SelectItem value="256">256-bit AES (Maximum Security)</SelectItem>
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
              <Settings className="h-4 w-4" />
              Advanced Options
            </span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Owner Password */}
              <div className="space-y-2">
                <Label htmlFor="ownerPassword" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Owner Password (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="ownerPassword"
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
                  Owner password allows changing permissions even when user password is set
                </p>
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={settings.allowPrinting}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allowPrinting: checked as boolean }))
                      }
                    />
                    <span className="text-sm">Allow Printing</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={settings.allowCopying}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allowCopying: checked as boolean }))
                      }
                    />
                    <span className="text-sm">Allow Copying Text</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={settings.allowModifying}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allowModifying: checked as boolean }))
                      }
                    />
                    <span className="text-sm">Allow Modifying</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={settings.allowAnnotations}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, allowAnnotations: checked as boolean }))
                      }
                    />
                    <span className="text-sm">Allow Annotations</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Encrypting PDF with {settings.keyLength}-bit AES... {progress}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={protectPdf}
              disabled={isProcessing || !settings.userPassword}
              className="flex-1 min-w-[150px]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Protect PDF
                </>
              )}
            </Button>
            
            {protectedPdf && (
              <Button
                onClick={downloadProtectedPdf}
                variant="outline"
                className="flex-1 min-w-[150px] border-green-500 text-green-600 hover:bg-green-500/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Protected PDF
              </Button>
            )}
          </div>

          {/* Success Message */}
          {protectedPdf && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  PDF Protected Successfully!
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Your PDF is now encrypted with {settings.keyLength}-bit AES encryption.
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
          <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">
            Privacy & Security
          </p>
          <p>
            All processing happens locally in your browser using WebAssembly technology. 
            Your files and passwords are never uploaded to any server, ensuring complete privacy.
          </p>
        </div>
      </div>

      {/* FAQ Section with Schema */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does PDF encryption work?</AccordionTrigger>
            <AccordionContent>
              PDF encryption uses AES (Advanced Encryption Standard) to scramble the content of 
              your PDF file. We use QPDF, a trusted open-source tool, compiled to run directly in 
              your browser using WebAssembly. This means your files never leave your computer - 
              all encryption happens locally for maximum privacy.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What's the difference between 128-bit and 256-bit encryption?</AccordionTrigger>
            <AccordionContent>
              256-bit AES encryption is more secure than 128-bit and is considered virtually 
              unbreakable with current technology. However, 128-bit offers better compatibility 
              with older PDF readers. For maximum security, choose 256-bit encryption.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What's the difference between user and owner passwords?</AccordionTrigger>
            <AccordionContent>
              The user password is required to open and view the PDF. The owner password allows 
              changing the document's security settings and permissions. If you only set a user 
              password, anyone with that password can open the document.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I control what users can do with the protected PDF?</AccordionTrigger>
            <AccordionContent>
              Yes! You can restrict printing, copying text, modifying content, and adding 
              annotations. These restrictions are enforced by PDF readers that respect the 
              document's security settings.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Is my data safe? Do you store my files?</AccordionTrigger>
            <AccordionContent>
              Your data is completely safe. All PDF processing happens entirely in your browser 
              using client-side WebAssembly technology. Your files, passwords, and encrypted 
              PDFs never touch our servers. Everything stays on your device.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does PDF encryption work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PDF encryption uses AES (Advanced Encryption Standard) to scramble the content of your PDF file. We use QPDF, a trusted open-source tool, compiled to run directly in your browser using WebAssembly. Your files never leave your computer."
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between 128-bit and 256-bit encryption?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "256-bit AES encryption is more secure than 128-bit and is considered virtually unbreakable with current technology. 128-bit offers better compatibility with older PDF readers."
                }
              },
              {
                "@type": "Question",
                "name": "Is my data safe? Do you store my files?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Your data is completely safe. All PDF processing happens entirely in your browser using client-side WebAssembly technology. Your files never touch our servers."
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Password Protect a PDF",
            "description": "Learn how to add password protection to your PDF files using AES encryption",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Upload your PDF",
                "text": "Drag and drop your PDF file or click to browse and select it"
              },
              {
                "@type": "HowToStep",
                "name": "Set a password",
                "text": "Enter a strong password to protect your PDF. Use the generator for a secure random password."
              },
              {
                "@type": "HowToStep",
                "name": "Choose encryption level",
                "text": "Select 128-bit or 256-bit AES encryption based on your security needs"
              },
              {
                "@type": "HowToStep",
                "name": "Set permissions",
                "text": "Optionally configure what users can do with the PDF (print, copy, modify)"
              },
              {
                "@type": "HowToStep",
                "name": "Download protected PDF",
                "text": "Click 'Protect PDF' and download your encrypted file"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PDF Protect Tool - AnyFile Flow",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "Any (Web-based)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free online tool to password protect and encrypt PDF files with 128-bit or 256-bit AES encryption. All processing happens in your browser.",
            "featureList": [
              "256-bit AES encryption",
              "128-bit AES encryption",
              "User and owner passwords",
              "Permission controls",
              "Client-side processing",
              "No file uploads required"
            ]
          })
        }}
      />
    </div>
  );
};

export default PDFProtectTool;
