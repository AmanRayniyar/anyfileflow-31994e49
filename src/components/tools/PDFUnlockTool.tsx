import React, { useState, useCallback, useRef } from 'react';
import { PDFDocument } from '@pdfme/pdf-lib';
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

const PDFUnlockTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<UnlockStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [unlockedPdf, setUnlockedPdf] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfInfo, setPdfInfo] = useState<{
    pageCount: number;
    isEncrypted: boolean;
    title?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Try to load without password first
      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        setPdfInfo({
          pageCount: pdfDoc.getPageCount(),
          isEncrypted: false,
          title: pdfDoc.getTitle() || undefined
        });
        
        toast.info('PDF loaded. This PDF does not appear to be password protected.');
        
      } catch (error: any) {
        // PDF is encrypted and needs password
        if (error.message?.includes('encrypted') || error.message?.includes('password')) {
          setStatus('needs-password');
          setPdfInfo({
            pageCount: 0,
            isEncrypted: true
          });
          toast.info('This PDF is password protected. Enter the password to unlock.');
        } else {
          // Try with ignoreEncryption
          try {
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            setPdfInfo({
              pageCount: pdfDoc.getPageCount(),
              isEncrypted: true,
              title: pdfDoc.getTitle() || undefined
            });
            setStatus('needs-password');
            toast.info('This PDF has restrictions. You can try to remove them.');
          } catch {
            toast.error('Failed to load PDF file');
          }
        }
      }
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error('Failed to load PDF file');
    }
  };

  const unlockPdf = async () => {
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    try {
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      
      // Try to load with password
      let pdfDoc;
      try {
        if (password) {
          pdfDoc = await PDFDocument.load(arrayBuffer, { 
            password: password,
            ignoreEncryption: true 
          });
        } else {
          pdfDoc = await PDFDocument.load(arrayBuffer, { 
            ignoreEncryption: true 
          });
        }
      } catch (error: any) {
        if (error.message?.includes('password') || error.message?.includes('encrypted')) {
          setStatus('needs-password');
          setErrorMessage('Incorrect password. Please try again.');
          toast.error('Incorrect password. Please try again.');
          return;
        }
        throw error;
      }
      
      setProgress(50);
      
      // Create a new PDF without encryption
      const newPdfDoc = await PDFDocument.create();
      
      // Copy all pages
      const pageCount = pdfDoc.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });
      
      setProgress(70);
      
      // Copy metadata
      newPdfDoc.setTitle(pdfDoc.getTitle() || file.name.replace('.pdf', ''));
      newPdfDoc.setAuthor(pdfDoc.getAuthor() || '');
      newPdfDoc.setSubject(pdfDoc.getSubject() || '');
      newPdfDoc.setCreator('AnyFile Flow PDF Unlocker');
      newPdfDoc.setProducer('AnyFile Flow - anyfileflow.com');
      
      setProgress(85);
      
      // Save WITHOUT encryption (no passwords = unprotected)
      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      
      setProgress(100);
      setUnlockedPdf(blob);
      setStatus('success');
      setPdfInfo({
        pageCount: pageCount,
        isEncrypted: false,
        title: pdfDoc.getTitle() || undefined
      });
      toast.success('PDF unlocked successfully! All restrictions removed.');
      
    } catch (error: any) {
      console.error('Error unlocking PDF:', error);
      setStatus('failed');
      
      if (error.message?.includes('password') || error.message?.includes('encrypted')) {
        setStatus('needs-password');
        setErrorMessage('This PDF requires the correct password to unlock.');
        toast.error('Password required or incorrect.');
      } else {
        setErrorMessage('Failed to unlock PDF. The file might be corrupted or use unsupported encryption.');
        toast.error('Failed to unlock PDF');
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
                {pdfInfo && pdfInfo.pageCount > 0 && ` • ${pdfInfo.pageCount} pages`}
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
            All processing happens locally in your browser. Your files and passwords are never 
            uploaded to any server, ensuring complete privacy and security.
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
              Our PDF Unlocker works by decrypting the PDF using the password you provide, 
              then creating a new copy without any encryption or restrictions. The result 
              is a clean PDF that can be opened, printed, and edited freely.
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
              Our tool can remove: open passwords (user password), permission passwords 
              (owner password), and restrictions on printing, copying, editing, and annotations. 
              Some advanced DRM protection may not be removable.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Is my password stored or transmitted?</AccordionTrigger>
            <AccordionContent>
              No! Your password is never stored or transmitted anywhere. All processing happens 
              entirely in your browser. The password is only used locally to decrypt the PDF 
              and is immediately discarded after processing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>What if I forgot my PDF password?</AccordionTrigger>
            <AccordionContent>
              Unfortunately, if you forgot the password for a user-protected PDF, recovery is 
              extremely difficult due to strong encryption. You may need to contact the original 
              creator of the document to obtain the password.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PDF Unlocker Tool",
          "description": "Free online tool to remove password protection from PDF files securely in your browser",
          "url": "https://anyfileflow.com/tool/pdf-unlocker",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Remove PDF password protection",
            "Remove printing restrictions",
            "Remove copying restrictions",
            "Remove editing restrictions",
            "Client-side processing",
            "No file upload required",
            "Complete privacy"
          ]
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Unlock a Password Protected PDF",
          "description": "Step-by-step guide to remove password protection from PDF files",
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Upload Protected PDF",
              "text": "Drag and drop your password-protected PDF file or click to browse and select the file."
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Enter Password",
              "text": "If the PDF requires a password to open, enter the correct password in the password field."
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Unlock PDF",
              "text": "Click the Unlock PDF button to remove the password protection and all restrictions."
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "Download Unlocked PDF",
              "text": "Once unlocked, download your PDF file which can now be opened, printed, and edited freely."
            }
          ]
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How does the PDF Unlocker work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our PDF Unlocker works by decrypting the PDF using the password you provide, then creating a new copy without any encryption or restrictions."
              }
            },
            {
              "@type": "Question",
              "name": "Can I unlock a PDF without the password?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For PDFs with owner password only (restrictions on printing/copying), you may be able to remove restrictions. For user-password protected PDFs, you must provide the correct password."
              }
            },
            {
              "@type": "Question",
              "name": "Is it legal to unlock PDFs?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "It is legal to unlock PDFs that you own or have permission to unlock. Removing protection from copyrighted materials without authorization may violate copyright laws."
              }
            },
            {
              "@type": "Question",
              "name": "Is my password stored or transmitted?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No! Your password is never stored or transmitted anywhere. All processing happens entirely in your browser."
              }
            }
          ]
        })
      }} />
    </div>
  );
};

export default PDFUnlockTool;
