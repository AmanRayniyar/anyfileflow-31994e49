import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Download, Upload, Trash2, Copy, Check, Plus, Minus,
  Wifi, Phone, Mail, MessageSquare, User, Link, Type,
  QrCode, Palette, Square, RotateCcw, Eye, Package, Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import * as QRCodeLib from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type QRContentType = 'url' | 'text' | 'phone' | 'email' | 'sms' | 'wifi' | 'vcard';
type ExportFormat = 'png' | 'jpeg' | 'svg';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface BatchItem {
  id: string;
  content: string;
  type: QRContentType;
}

const defaultVCard: VCardData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  company: '',
  title: '',
  website: '',
  address: ''
};

const defaultWifi: WifiData = {
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false
};

const AdvancedQRGenerator = () => {
  // Content state
  const [contentType, setContentType] = useState<QRContentType>('url');
  const [content, setContent] = useState('https://anyfileflow.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [smsNumber, setSmsNumber] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [wifiData, setWifiData] = useState<WifiData>(defaultWifi);
  const [vcardData, setVcardData] = useState<VCardData>(defaultVCard);
  
  // Style state
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [transparentBg, setTransparentBg] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [margin, setMargin] = useState(4);
  
  // Logo state
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.25);
  
  // Frame state
  const [showFrame, setShowFrame] = useState(false);
  const [frameColor, setFrameColor] = useState('#000000');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameTextColor, setFrameTextColor] = useState('#FFFFFF');
  
  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [exportSize, setExportSize] = useState(1024);
  
  // Batch state
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchInput, setBatchInput] = useState('');
  
  // QR state
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  // Generate QR data based on content type
  const getQRData = useCallback(() => {
    switch (contentType) {
      case 'url':
      case 'text':
        return content;
      case 'phone':
        return `tel:${phoneNumber}`;
      case 'email':
        let emailUrl = `mailto:${email}`;
        const emailParams = [];
        if (emailSubject) emailParams.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) emailParams.push(`body=${encodeURIComponent(emailBody)}`);
        if (emailParams.length) emailUrl += `?${emailParams.join('&')}`;
        return emailUrl;
      case 'sms':
        return `sms:${smsNumber}${smsBody ? `?body=${encodeURIComponent(smsBody)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardData.lastName};${vcardData.firstName}
FN:${vcardData.firstName} ${vcardData.lastName}
ORG:${vcardData.company}
TITLE:${vcardData.title}
TEL:${vcardData.phone}
EMAIL:${vcardData.email}
URL:${vcardData.website}
ADR:;;${vcardData.address};;;;
END:VCARD`;
      default:
        return content;
    }
  }, [contentType, content, phoneNumber, email, emailSubject, emailBody, smsNumber, smsBody, wifiData, vcardData]);

  // Generate QR code
  const generateQR = useCallback(async () => {
    const data = getQRData();
    if (!data) return;

    try {
      const options = {
        errorCorrectionLevel: errorCorrection,
        margin: margin,
        width: size,
        color: {
          dark: fgColor,
          light: transparentBg ? '#00000000' : bgColor
        }
      };

      // Generate as data URL for preview
      const dataUrl = await QRCodeLib.toDataURL(data, options);
      
      // If logo is present, overlay it
      if (logoImage) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw QR code
          const qrImg = new window.Image();
          qrImg.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            qrImg.onload = () => {
              ctx.drawImage(qrImg, 0, 0, size, size);
              resolve();
            };
            qrImg.src = dataUrl;
          });
          
          // Draw logo
          const logoImg = new window.Image();
          logoImg.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            logoImg.onload = () => {
              const logoWidth = size * logoSize;
              const logoHeight = size * logoSize;
              const x = (size - logoWidth) / 2;
              const y = (size - logoHeight) / 2;
              
              // White background for logo
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(x - 5, y - 5, logoWidth + 10, logoHeight + 10);
              
              ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
              resolve();
            };
            logoImg.src = logoImage;
          });
          
          setQrDataUrl(canvas.toDataURL('image/png'));
        }
      } else {
        setQrDataUrl(dataUrl);
      }

      // Generate SVG for vector export
      const svg = await QRCodeLib.toString(data, { ...options, type: 'svg' });
      setQrSvg(svg);
      
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate QR code",
        variant: "destructive"
      });
    }
  }, [getQRData, errorCorrection, margin, size, fgColor, bgColor, transparentBg, logoImage, logoSize]);

  // Generate QR on settings change
  useEffect(() => {
    generateQR();
  }, [generateQR]);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo drop
  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download QR code
  const downloadQR = async (format?: ExportFormat, customSize?: number) => {
    const data = getQRData();
    if (!data) return;
    
    const fmt = format || exportFormat;
    const downloadSize = customSize || exportSize;
    
    try {
      if (fmt === 'svg') {
        const svg = await QRCodeLib.toString(data, {
          errorCorrectionLevel: errorCorrection,
          margin: margin,
          width: downloadSize,
          color: { dark: fgColor, light: transparentBg ? '#00000000' : bgColor },
          type: 'svg'
        });
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        saveAs(blob, `qrcode-${Date.now()}.svg`);
      } else {
        const options = {
          errorCorrectionLevel: errorCorrection,
          margin: margin,
          width: downloadSize,
          color: { dark: fgColor, light: transparentBg ? '#00000000' : bgColor }
        };
        
        let dataUrl = await QRCodeLib.toDataURL(data, options);
        
        // Add logo if present
        if (logoImage) {
          const canvas = document.createElement('canvas');
          canvas.width = downloadSize;
          canvas.height = downloadSize;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const qrImg = new window.Image();
            qrImg.crossOrigin = 'anonymous';
            await new Promise<void>((resolve) => {
              qrImg.onload = () => {
                ctx.drawImage(qrImg, 0, 0, downloadSize, downloadSize);
                resolve();
              };
              qrImg.src = dataUrl;
            });
            
            const logoImg = new window.Image();
            logoImg.crossOrigin = 'anonymous';
            await new Promise<void>((resolve) => {
              logoImg.onload = () => {
                const logoWidth = downloadSize * logoSize;
                const logoHeight = downloadSize * logoSize;
                const x = (downloadSize - logoWidth) / 2;
                const y = (downloadSize - logoHeight) / 2;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x - 5, y - 5, logoWidth + 10, logoHeight + 10);
                ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
                resolve();
              };
              logoImg.src = logoImage;
            });
            
            dataUrl = canvas.toDataURL(fmt === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
          }
        }
        
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.${fmt}`;
        link.href = dataUrl;
        link.click();
      }
      
      toast({ title: "Downloaded!", description: `QR code saved as ${fmt.toUpperCase()}` });
    } catch (error) {
      toast({ 
        title: "Download failed", 
        description: "Could not download QR code",
        variant: "destructive" 
      });
    }
  };

  // Copy QR code to clipboard
  const copyToClipboard = async () => {
    if (!qrDataUrl) return;
    
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied!", description: "QR code copied to clipboard" });
    } catch (error) {
      toast({ 
        title: "Copy failed", 
        description: "Could not copy QR code to clipboard",
        variant: "destructive" 
      });
    }
  };

  // Add to batch
  const addToBatch = () => {
    if (batchInput.trim()) {
      const lines = batchInput.split('\n').filter(line => line.trim());
      const newItems = lines.map(line => ({
        id: crypto.randomUUID(),
        content: line.trim(),
        type: contentType
      }));
      setBatchItems([...batchItems, ...newItems]);
      setBatchInput('');
      toast({ title: "Added!", description: `${newItems.length} items added to batch` });
    }
  };

  // Download batch as ZIP
  const downloadBatch = async () => {
    if (batchItems.length === 0) {
      toast({ 
        title: "No items", 
        description: "Add items to batch first",
        variant: "destructive" 
      });
      return;
    }

    const zip = new JSZip();
    
    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      try {
        const options = {
          errorCorrectionLevel: errorCorrection,
          margin: margin,
          width: exportSize,
          color: { dark: fgColor, light: transparentBg ? '#00000000' : bgColor }
        };
        
        if (exportFormat === 'svg') {
          const svg = await QRCodeLib.toString(item.content, { ...options, type: 'svg' });
          zip.file(`qr-${i + 1}.svg`, svg);
        } else {
          const dataUrl = await QRCodeLib.toDataURL(item.content, options);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`qr-${i + 1}.png`, base64Data, { base64: true });
        }
      } catch (error) {
        console.error('Error generating QR for batch:', error);
      }
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `qrcodes-batch-${Date.now()}.zip`);
      toast({ title: "Downloaded!", description: `${batchItems.length} QR codes saved as ZIP` });
    } catch (error) {
      toast({ 
        title: "Download failed", 
        description: "Could not create ZIP file",
        variant: "destructive" 
      });
    }
  };

  // Reset all settings
  const resetSettings = () => {
    setContent('https://anyfileflow.com');
    setSize(300);
    setFgColor('#000000');
    setBgColor('#FFFFFF');
    setTransparentBg(false);
    setErrorCorrection('M');
    setMargin(4);
    setLogoImage(null);
    setShowFrame(false);
    setBatchItems([]);
    toast({ title: "Reset!", description: "All settings restored to default" });
  };

  const contentTypeIcons = {
    url: Link,
    text: Type,
    phone: Phone,
    email: Mail,
    sms: MessageSquare,
    wifi: Wifi,
    vcard: User,
  };

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Content Type Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Content Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {(Object.keys(contentTypeIcons) as QRContentType[]).map((type) => {
                  const Icon = contentTypeIcons[type];
                  return (
                    <Button
                      key={type}
                      variant={contentType === type ? "default" : "outline"}
                      size="sm"
                      className="flex flex-col h-auto py-2 gap-1"
                      onClick={() => setContentType(type)}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs capitalize">{type}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Content Input based on type */}
              <div className="mt-4 space-y-3">
                {contentType === 'url' && (
                  <div>
                    <Label htmlFor="url-input">URL</Label>
                    <Input
                      id="url-input"
                      type="url"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {contentType === 'text' && (
                  <div>
                    <Label htmlFor="text-input">Text</Label>
                    <Textarea
                      id="text-input"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your text here..."
                      rows={3}
                    />
                  </div>
                )}

                {contentType === 'phone' && (
                  <div>
                    <Label htmlFor="phone-input">Phone Number</Label>
                    <Input
                      id="phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                )}

                {contentType === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email-input">Email Address</Label>
                      <Input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-subject">Subject (Optional)</Label>
                      <Input
                        id="email-subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Email subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-body">Body (Optional)</Label>
                      <Textarea
                        id="email-body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Email body text..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {contentType === 'sms' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="sms-number">Phone Number</Label>
                      <Input
                        id="sms-number"
                        type="tel"
                        value={smsNumber}
                        onChange={(e) => setSmsNumber(e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sms-body">Message (Optional)</Label>
                      <Textarea
                        id="sms-body"
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        placeholder="Your message..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {contentType === 'wifi' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        value={wifiData.ssid}
                        onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                        placeholder="My WiFi Network"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        value={wifiData.password}
                        onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                        placeholder="WiFi password"
                      />
                    </div>
                    <div>
                      <Label>Encryption</Label>
                      <Select 
                        value={wifiData.encryption} 
                        onValueChange={(v) => setWifiData({ ...wifiData, encryption: v as 'WPA' | 'WEP' | 'nopass' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={wifiData.hidden}
                        onCheckedChange={(c) => setWifiData({ ...wifiData, hidden: c })}
                      />
                      <Label>Hidden Network</Label>
                    </div>
                  </div>
                )}

                {contentType === 'vcard' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="vcard-fname">First Name</Label>
                      <Input
                        id="vcard-fname"
                        value={vcardData.firstName}
                        onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vcard-lname">Last Name</Label>
                      <Input
                        id="vcard-lname"
                        value={vcardData.lastName}
                        onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vcard-phone">Phone</Label>
                      <Input
                        id="vcard-phone"
                        type="tel"
                        value={vcardData.phone}
                        onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vcard-email">Email</Label>
                      <Input
                        id="vcard-email"
                        type="email"
                        value={vcardData.email}
                        onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vcard-company">Company</Label>
                      <Input
                        id="vcard-company"
                        value={vcardData.company}
                        onChange={(e) => setVcardData({ ...vcardData, company: e.target.value })}
                        placeholder="Company Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="vcard-title">Job Title</Label>
                      <Input
                        id="vcard-title"
                        value={vcardData.title}
                        onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                        placeholder="Manager"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="vcard-website">Website</Label>
                      <Input
                        id="vcard-website"
                        type="url"
                        value={vcardData.website}
                        onChange={(e) => setVcardData({ ...vcardData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="vcard-address">Address</Label>
                      <Input
                        id="vcard-address"
                        value={vcardData.address}
                        onChange={(e) => setVcardData({ ...vcardData, address: e.target.value })}
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customization Accordion */}
          <Accordion type="multiple" defaultValue={["colors", "style"]} className="space-y-2">
            {/* Colors */}
            <AccordionItem value="colors" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors & Background
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Foreground Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <Input
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                        disabled={transparentBg}
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1"
                        disabled={transparentBg}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={transparentBg}
                    onCheckedChange={setTransparentBg}
                  />
                  <Label>Transparent Background</Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Style */}
            <AccordionItem value="style" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Style & Quality
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Label>Margin: {margin}</Label>
                  <Slider
                    value={[margin]}
                    onValueChange={([v]) => setMargin(v)}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Error Correction Level</Label>
                  <Select value={errorCorrection} onValueChange={(v) => setErrorCorrection(v as ErrorCorrectionLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher levels allow more damage but create larger codes
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Logo */}
            <AccordionItem value="logo" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Logo / Image
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => logoInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleLogoDrop}
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {logoImage ? (
                    <div className="space-y-2">
                      <img src={logoImage} alt="Logo" className="w-16 h-16 mx-auto object-contain" />
                      <p className="text-sm text-muted-foreground">Click or drop to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop logo or click to upload
                      </p>
                    </div>
                  )}
                </div>

                {logoImage && (
                  <>
                    <div>
                      <Label>Logo Size: {Math.round(logoSize * 100)}%</Label>
                      <Slider
                        value={[logoSize]}
                        onValueChange={([v]) => setLogoSize(v)}
                        min={0.1}
                        max={0.4}
                        step={0.05}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLogoImage(null)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Logo
                    </Button>
                  </>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Use "High" error correction when adding a logo for better scannability.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Export Settings */}
            <AccordionItem value="export" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Label>Format</Label>
                  <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Recommended)</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="svg">SVG (Vector)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Size: {exportSize}px</Label>
                  <Slider
                    value={[exportSize]}
                    onValueChange={([v]) => setExportSize(v)}
                    min={256}
                    max={2000}
                    step={64}
                    className="mt-2"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Batch Generator */}
            <AccordionItem value="batch" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Batch Generator
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div>
                  <Label>Add multiple items (one per line)</Label>
                  <Textarea
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="https://example.com&#10;https://another.com&#10;Some text content"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button onClick={addToBatch} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Batch
                </Button>

                {batchItems.length > 0 && (
                  <>
                    <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium mb-2">
                        {batchItems.length} items in batch
                      </p>
                      {batchItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-1">
                          <span className="truncate flex-1">{item.content}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setBatchItems(batchItems.filter(b => b.id !== item.id))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={downloadBatch} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download ZIP
                      </Button>
                      <Button variant="outline" onClick={() => setBatchItems([])}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </span>
                <Button variant="ghost" size="sm" onClick={resetSettings}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Preview */}
              <div 
                className="flex justify-center p-6 bg-secondary/30 rounded-xl"
                style={{ minHeight: size + 48 }}
              >
                {showFrame ? (
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ backgroundColor: frameColor }}
                  >
                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="QR Code Preview" 
                        className="rounded"
                        style={{ width: size, height: size }}
                      />
                    )}
                    <p 
                      className="mt-2 font-bold text-sm"
                      style={{ color: frameTextColor }}
                    >
                      {frameText}
                    </p>
                  </div>
                ) : (
                  qrDataUrl && (
                    <img 
                      src={qrDataUrl} 
                      alt="QR Code Preview" 
                      className="rounded"
                      style={{ width: size, height: size }}
                    />
                  )
                )}
              </div>

              {/* Preview Size Slider */}
              <div>
                <Label>Preview Size: {size}px</Label>
                <Slider
                  value={[size]}
                  onValueChange={([v]) => setSize(v)}
                  min={150}
                  max={400}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Quick Download Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => downloadQR('png')} className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  PNG
                </Button>
                <Button onClick={() => downloadQR('jpeg')} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  JPG
                </Button>
                <Button onClick={() => downloadQR('svg')} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  SVG
                </Button>
              </div>

              {/* Copy Button */}
              <Button 
                onClick={copyToClipboard} 
                variant="secondary" 
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>

              {/* Frame Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Switch checked={showFrame} onCheckedChange={setShowFrame} />
                  <Label>Add Frame</Label>
                </div>
                {showFrame && (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={frameText}
                      onChange={(e) => setFrameText(e.target.value)}
                      className="w-24"
                      placeholder="SCAN ME"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section for SEO */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>What types of QR codes can I create?</AccordionTrigger>
              <AccordionContent>
                You can create QR codes for URLs, plain text, phone numbers, email addresses, SMS messages, WiFi network credentials, and vCard contact information. Each type is optimized for its specific use case.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>Can I add a logo to my QR code?</AccordionTrigger>
              <AccordionContent>
                Yes! You can upload any image as a logo and it will be placed in the center of your QR code. Use the error correction level "High" for best results with logos, as it allows the QR code to remain scannable even with part of it covered.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>What format should I download for printing?</AccordionTrigger>
              <AccordionContent>
                For printing, we recommend SVG format as it's a vector format that scales to any size without losing quality. Alternatively, use PNG with a larger export size (1024px or higher) for high-quality raster prints.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger>What is error correction level?</AccordionTrigger>
              <AccordionContent>
                Error correction allows a QR code to be scanned even if part of it is damaged or obscured. Level L (Low) allows 7% damage, M (Medium) 15%, Q (Quartile) 25%, and H (High) 30%. Use higher levels when adding logos or for outdoor use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-5">
              <AccordionTrigger>Can I generate multiple QR codes at once?</AccordionTrigger>
              <AccordionContent>
                Yes! Use the Batch Generator feature to create multiple QR codes at once. Add one item per line, and download all codes as a ZIP file. This is perfect for creating QR codes for inventory, marketing materials, or event tickets.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedQRGenerator;
