import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Upload, Unlock, Download, FileText, X, AlertCircle, 
  Eye, EyeOff, CheckCircle, RefreshCw, Shield, Info,
  AlertTriangle, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type UnlockStatus = 'idle' | 'processing' | 'success' | 'failed' | 'needs-password';

// QPDF module interface - using any to avoid complex Emscripten types
type QpdfModule = any;

const PDFUnlockTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<UnlockStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [unlockedPdf, setUnlockedPdf] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pdfInfo, setPdfInfo] = useState<{
    pageCount: number;
    isEncrypted: boolean;
    title?: string;
  } | null>(null);
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
        toast.error('Failed to load PDF unlock engine');
      }
    };
    loadQpdf();
  }, []);

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
    setUnlockedPdf(null);
    setStatus('idle');
    setErrorMessage('');
    setPassword('');

    if (!qpdfRef.current) {
      toast.error('PDF engine not loaded yet. Please wait.');
      return;
    }

    try {
      const qpdf = qpdfRef.current;
      const arrayBuffer = await selectedFile.arrayBuffer();
      const inputData = new Uint8Array(arrayBuffer);
      
      // Write file to check if it's encrypted
      const inputPath = '/check.pdf';
      qpdf.FS.writeFile(inputPath, inputData);
      
      // Try to check if encrypted using --check
      const result = qpdf.callMain(['--check', inputPath]);
      
      // Clean up
      try {
        qpdf.FS.unlink(inputPath);
      } catch (e) {}
      
      // If check fails, it might be encrypted
      if (result !== 0) {
        setStatus('needs-password');
        setPdfInfo({
          pageCount: 0,
          isEncrypted: true,
          title: selectedFile.name.replace('.pdf', '')
        });
        toast.info('This PDF appears to be password protected. Enter the password to unlock.');
      } else {
        setPdfInfo({
          pageCount: 0,
          isEncrypted: false,
          title: selectedFile.name.replace('.pdf', '')
        });
        toast.success('PDF loaded. You can try to remove restrictions if any.');
      }
    } catch (error) {
      console.error('Error checking PDF:', error);
      setPdfInfo({
        pageCount: 0,
        isEncrypted: true,
        title: selectedFile.name.replace('.pdf', '')
      });
      setStatus('needs-password');
      toast.info('Enter the password to unlock this PDF.');
    }
  };

  const unlockPdf = async () => {
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    if (!qpdfRef.current) {
      toast.error('PDF engine not loaded. Please wait or refresh the page.');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      const qpdf = qpdfRef.current;
      
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      const inputData = new Uint8Array(arrayBuffer);
      
      setProgress(20);
      
      // Write input file
      const inputPath = '/input.pdf';
      const outputPath = '/output.pdf';
      qpdf.FS.writeFile(inputPath, inputData);
      
      setProgress(40);
      
      // Build QPDF decrypt command
      const args: string[] = [];
      
      if (password) {
        args.push('--password=' + password);
      }
      
      args.push('--decrypt');
      args.push(inputPath);
      args.push(outputPath);
      
      setProgress(60);
      
      // Execute QPDF
      const result = qpdf.callMain(args);
      
      if (result !== 0) {
        // Try without --decrypt flag (just copy)
        const args2 = password 
          ? ['--password=' + password, inputPath, outputPath]
          : [inputPath, outputPath];
        
        const result2 = qpdf.callMain(args2);
        
        if (result2 !== 0) {
          throw new Error('QPDF decryption failed - incorrect password or unsupported encryption');
        }
      }
      
      setProgress(80);
      
      // Read decrypted file
      const outputData = qpdf.FS.readFile(outputPath);
      
      // Cleanup
      try {
        qpdf.FS.unlink(inputPath);
        qpdf.FS.unlink(outputPath);
      } catch (e) {}
      
      setProgress(90);
      
      const blob = new Blob([outputData], { type: 'application/pdf' });
      
      setProgress(100);
      setUnlockedPdf(blob);
      setStatus('success');
      setPdfInfo(prev => prev ? { ...prev, isEncrypted: false } : null);
      toast.success('PDF unlocked successfully! All restrictions removed.');
      
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      setStatus('needs-password');
      
      if (error.message?.includes('password') || error.message?.includes('incorrect')) {
        setErrorMessage('Incorrect password. Please try again.');
        toast.error('Incorrect password. Please try again.');
      } else {
        setErrorMessage('Failed to unlock PDF. The password may be incorrect or the file uses unsupported encryption.');
        toast.error('Failed to unlock PDF. Check password and try again.');
      }
    }
  };

  const downloadUnlockedPdf = () => {
    if (unlockedPdf && file) {
      const url = URL.createObjectURL(unlockedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unlocked_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Unlocked PDF downloaded!');
    }
  };

  const resetTool = () => {
    setFile(null);
    setUnlockedPdf(null);
    setPassword('');
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
    setPdfInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading PDF unlock engine...</p>
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
            ? status === 'success' 
              ? 'border-green-500 bg-green-500/5' 
              : status === 'needs-password'
                ? 'border-yellow-500 bg-yellow-500/5'
                : 'border-primary bg-primary/5'
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
            <div className={`p-3 rounded-full ${
              status === 'success' 
                ? 'bg-green-500/10' 
                : status === 'needs-password'
                  ? 'bg-yellow-500/10'
                  : 'bg-primary/10'
            }`}>
              <FileText className={`h-8 w-8 ${
                status === 'success' 
                  ? 'text-green-500' 
                  : status === 'needs-password'
                    ? 'text-yellow-500'
                    : 'text-primary'
              }`} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {pdfInfo?.isEncrypted && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1 mt-1">
                  <Shield className="h-3 w-3" />
                  Password protected
                </p>
              )}
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
                Drop your protected PDF here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports password-protected PDF files up to 100MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Password Input & Actions */}
      {file && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Password Field */}
          <div className="space-y-3">
            <Label htmlFor="pdfPassword" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              PDF Password {status === 'needs-password' ? '(Required)' : '(if protected)'}
            </Label>
            <div className="relative">
              <Input
                id="pdfPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {status === 'needs-password' && !errorMessage && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                This PDF requires a password to unlock
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
            </div>
          )}

          {/* Progress Bar */}
          {status === 'processing' && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Removing PDF protection... {progress}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={unlockPdf}
              disabled={status === 'processing'}
              className="flex-1 min-w-[150px]"
            >
              {status === 'processing' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock PDF
                </>
              )}
            </Button>
            
            {unlockedPdf && (
              <Button
                onClick={downloadUnlockedPdf}
                variant="outline"
                className="flex-1 min-w-[150px] border-green-500 text-green-600 hover:bg-green-500/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Unlocked PDF
              </Button>
            )}
          </div>

          {/* Success Message */}
          {status === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  PDF Unlocked Successfully!
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  All password protection and restrictions have been removed.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal Notice */}
      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-1">
            Legal Notice
          </p>
          <p>
            Only use this tool to unlock PDFs that you own or have explicit permission to unlock. 
            Unauthorized removal of password protection may violate copyright laws.
          </p>
        </div>
      </div>

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

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the PDF Unlocker work?</AccordionTrigger>
            <AccordionContent>
              Our PDF Unlocker uses QPDF, a trusted open-source tool compiled to WebAssembly, 
              to decrypt your PDF files directly in your browser. When you provide the correct 
              password, it creates a new copy without any encryption or restrictions.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I unlock a PDF without the password?</AccordionTrigger>
            <AccordionContent>
              For PDFs with owner password only (restrictions on printing/copying), you may 
              be able to remove restrictions without the password. However, for user-password 
              protected PDFs (password required to open), you must provide the correct password.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it legal to unlock PDFs?</AccordionTrigger>
            <AccordionContent>
              It is legal to unlock PDFs that you own or have permission to unlock. However, 
              removing protection from copyrighted materials without authorization may violate 
              copyright laws. Always ensure you have the right to unlock the PDF.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What types of PDF protection can be removed?</AccordionTrigger>
            <AccordionContent>
              This tool can remove both user passwords (required to open) and owner passwords 
              (used to restrict printing, copying, and editing). It supports PDF encryption 
              up to 256-bit AES, the strongest encryption standard used in PDFs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Is my data safe? Do you store my files?</AccordionTrigger>
            <AccordionContent>
              Absolutely! All PDF processing happens entirely in your browser using client-side 
              WebAssembly technology. Your files and passwords are never uploaded to any server. 
              Everything stays on your device for maximum privacy and security.
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
                "name": "How does the PDF Unlocker work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our PDF Unlocker uses QPDF, a trusted open-source tool compiled to WebAssembly, to decrypt your PDF files directly in your browser. When you provide the correct password, it creates a new copy without any encryption or restrictions."
                }
              },
              {
                "@type": "Question",
                "name": "Can I unlock a PDF without the password?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For PDFs with owner password only (restrictions on printing/copying), you may be able to remove restrictions without the password. For user-password protected PDFs, you must provide the correct password."
                }
              },
              {
                "@type": "Question",
                "name": "Is my data safe? Do you store my files?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All PDF processing happens entirely in your browser using client-side WebAssembly technology. Your files never touch our servers."
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
            "name": "How to Unlock a Password Protected PDF",
            "description": "Learn how to remove password protection from PDF files",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Upload your protected PDF",
                "text": "Drag and drop your password-protected PDF file or click to browse"
              },
              {
                "@type": "HowToStep",
                "name": "Enter the password",
                "text": "Type the password that was used to protect the PDF"
              },
              {
                "@type": "HowToStep",
                "name": "Click Unlock PDF",
                "text": "Press the Unlock PDF button to remove the encryption"
              },
              {
                "@type": "HowToStep",
                "name": "Download unlocked PDF",
                "text": "Download your unlocked PDF file without any restrictions"
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
            "name": "PDF Unlock Tool - AnyFile Flow",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "Any (Web-based)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free online tool to unlock password-protected PDF files. Remove encryption and restrictions from PDFs. All processing happens in your browser.",
            "featureList": [
              "Remove user passwords",
              "Remove owner passwords",
              "Remove printing restrictions",
              "Remove copy restrictions",
              "Client-side processing",
              "No file uploads required"
            ]
          })
        }}
      />
    </div>
  );
};

export default PDFUnlockTool;
