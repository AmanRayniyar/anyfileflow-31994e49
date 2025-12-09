import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';
import { 
  Camera, 
  Upload, 
  Copy, 
  ExternalLink, 
  Phone, 
  Mail, 
  Wifi, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Flashlight, 
  FlashlightOff,
  RotateCcw,
  History,
  Trash2,
  X,
  SwitchCamera,
  Shield,
  Smartphone,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface ScanResult {
  id: string;
  content: string;
  type: QRType;
  timestamp: Date;
  parsedData?: ParsedQRData;
}

type QRType = 'url' | 'text' | 'email' | 'phone' | 'vcard' | 'wifi' | 'event' | 'geo' | 'sms';

interface ParsedQRData {
  type: QRType;
  raw: string;
  url?: string;
  email?: string;
  subject?: string;
  body?: string;
  phoneNumber?: string;
  ssid?: string;
  password?: string;
  security?: string;
  name?: string;
  organization?: string;
  title?: string;
  phone?: string;
  emailAddress?: string;
  address?: string;
  eventTitle?: string;
  eventStart?: string;
  eventEnd?: string;
  eventLocation?: string;
  eventDescription?: string;
  latitude?: string;
  longitude?: string;
  smsNumber?: string;
  smsBody?: string;
}

// Translations
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'QR Code Scanner',
    camera: 'Camera',
    upload: 'Upload',
    history: 'History',
    startScanning: 'Start Camera',
    stopScanning: 'Stop Camera',
    switchCamera: 'Switch Camera',
    flashlight: 'Flashlight',
    uploadImage: 'Upload QR Image',
    dragDrop: 'Drag & drop image here or click to browse',
    scanResult: 'Scan Result',
    openLink: 'Open Link',
    copyText: 'Copy Text',
    saveContact: 'Save Contact',
    connectWifi: 'Connect WiFi',
    call: 'Call',
    sendEmail: 'Send Email',
    openMap: 'Open Map',
    addToCalendar: 'Add to Calendar',
    sendSMS: 'Send SMS',
    clearHistory: 'Clear History',
    noHistory: 'No scan history yet',
    copied: 'Copied to clipboard!',
    secureProcessing: 'Secure On-Device Processing',
    noDataStored: 'No data is sent to servers - all processing happens locally',
    selectLanguage: 'Language',
    initializing: 'Initializing camera...',
    scanning: 'Point camera at QR code'
  },
  es: {
    title: 'Escáner de Código QR',
    camera: 'Cámara',
    upload: 'Subir',
    history: 'Historial',
    startScanning: 'Iniciar Cámara',
    stopScanning: 'Detener Cámara',
    switchCamera: 'Cambiar Cámara',
    flashlight: 'Linterna',
    uploadImage: 'Subir Imagen QR',
    dragDrop: 'Arrastra y suelta aquí o haz clic para buscar',
    scanResult: 'Resultado del Escaneo',
    openLink: 'Abrir Enlace',
    copyText: 'Copiar Texto',
    saveContact: 'Guardar Contacto',
    connectWifi: 'Conectar WiFi',
    call: 'Llamar',
    sendEmail: 'Enviar Email',
    openMap: 'Abrir Mapa',
    addToCalendar: 'Agregar al Calendario',
    sendSMS: 'Enviar SMS',
    clearHistory: 'Borrar Historial',
    noHistory: 'Sin historial de escaneos',
    copied: '¡Copiado al portapapeles!',
    secureProcessing: 'Procesamiento Seguro en Dispositivo',
    noDataStored: 'No se envían datos a servidores - todo se procesa localmente',
    selectLanguage: 'Idioma',
    initializing: 'Inicializando cámara...',
    scanning: 'Apunta la cámara al código QR'
  },
  fr: {
    title: 'Scanner de Code QR',
    camera: 'Caméra',
    upload: 'Télécharger',
    history: 'Historique',
    startScanning: 'Démarrer Caméra',
    stopScanning: 'Arrêter Caméra',
    switchCamera: 'Changer de Caméra',
    flashlight: 'Lampe Torche',
    uploadImage: 'Télécharger Image QR',
    dragDrop: 'Glissez-déposez ici ou cliquez pour parcourir',
    scanResult: 'Résultat du Scan',
    openLink: 'Ouvrir le Lien',
    copyText: 'Copier le Texte',
    saveContact: 'Enregistrer Contact',
    connectWifi: 'Connecter WiFi',
    call: 'Appeler',
    sendEmail: 'Envoyer Email',
    openMap: 'Ouvrir Carte',
    addToCalendar: 'Ajouter au Calendrier',
    sendSMS: 'Envoyer SMS',
    clearHistory: 'Effacer Historique',
    noHistory: 'Pas encore d\'historique',
    copied: 'Copié dans le presse-papiers!',
    secureProcessing: 'Traitement Sécurisé sur Appareil',
    noDataStored: 'Aucune donnée envoyée aux serveurs - tout est traité localement',
    selectLanguage: 'Langue',
    initializing: 'Initialisation de la caméra...',
    scanning: 'Pointez la caméra vers le code QR'
  },
  hi: {
    title: 'QR कोड स्कैनर',
    camera: 'कैमरा',
    upload: 'अपलोड',
    history: 'इतिहास',
    startScanning: 'कैमरा शुरू करें',
    stopScanning: 'कैमरा बंद करें',
    switchCamera: 'कैमरा बदलें',
    flashlight: 'फ्लैशलाइट',
    uploadImage: 'QR इमेज अपलोड करें',
    dragDrop: 'यहां ड्रैग और ड्रॉप करें या ब्राउज़ करने के लिए क्लिक करें',
    scanResult: 'स्कैन परिणाम',
    openLink: 'लिंक खोलें',
    copyText: 'टेक्स्ट कॉपी करें',
    saveContact: 'संपर्क सहेजें',
    connectWifi: 'WiFi कनेक्ट करें',
    call: 'कॉल करें',
    sendEmail: 'ईमेल भेजें',
    openMap: 'मैप खोलें',
    addToCalendar: 'कैलेंडर में जोड़ें',
    sendSMS: 'SMS भेजें',
    clearHistory: 'इतिहास साफ़ करें',
    noHistory: 'अभी तक कोई स्कैन इतिहास नहीं',
    copied: 'क्लिपबोर्ड पर कॉपी किया गया!',
    secureProcessing: 'डिवाइस पर सुरक्षित प्रोसेसिंग',
    noDataStored: 'सर्वर पर कोई डेटा नहीं भेजा जाता - सब कुछ स्थानीय रूप से प्रोसेस होता है',
    selectLanguage: 'भाषा',
    initializing: 'कैमरा प्रारंभ हो रहा है...',
    scanning: 'कैमरे को QR कोड की ओर इंगित करें'
  },
  ar: {
    title: 'ماسح رمز QR',
    camera: 'الكاميرا',
    upload: 'رفع',
    history: 'السجل',
    startScanning: 'بدء الكاميرا',
    stopScanning: 'إيقاف الكاميرا',
    switchCamera: 'تبديل الكاميرا',
    flashlight: 'الفلاش',
    uploadImage: 'رفع صورة QR',
    dragDrop: 'اسحب وأفلت هنا أو انقر للتصفح',
    scanResult: 'نتيجة المسح',
    openLink: 'فتح الرابط',
    copyText: 'نسخ النص',
    saveContact: 'حفظ جهة الاتصال',
    connectWifi: 'اتصال WiFi',
    call: 'اتصال',
    sendEmail: 'إرسال بريد',
    openMap: 'فتح الخريطة',
    addToCalendar: 'إضافة للتقويم',
    sendSMS: 'إرسال SMS',
    clearHistory: 'مسح السجل',
    noHistory: 'لا يوجد سجل مسح بعد',
    copied: 'تم النسخ!',
    secureProcessing: 'معالجة آمنة على الجهاز',
    noDataStored: 'لا يتم إرسال بيانات للخوادم - كل المعالجة تتم محليًا',
    selectLanguage: 'اللغة',
    initializing: 'جاري تهيئة الكاميرا...',
    scanning: 'وجه الكاميرا نحو رمز QR'
  }
};

const QRScannerTool: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('camera');
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{id: string, label: string}[]>([]);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const scannerContainerId = 'qr-reader-container';
  
  const t = translations[language] || translations.en;

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-scan-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setScanHistory(parsed.map((item: ScanResult) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
    
    const savedLang = localStorage.getItem('qr-scanner-language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }

    // Get available cameras
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setAvailableCameras(devices);
        // Prefer back camera
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
        setCameraId(backCamera?.id || devices[0].id);
      }
    }).catch(err => {
      console.log('Camera enumeration failed:', err);
    });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem('qr-scan-history', JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  // Parse QR content
  const parseQRContent = useCallback((content: string): ParsedQRData => {
    const data: ParsedQRData = { type: 'text', raw: content };

    if (/^https?:\/\//i.test(content)) {
      data.type = 'url';
      data.url = content;
      return data;
    }

    if (/^mailto:/i.test(content)) {
      data.type = 'email';
      const emailMatch = content.match(/^mailto:([^?]+)(\?(.*))?$/i);
      if (emailMatch) {
        data.email = emailMatch[1];
        if (emailMatch[3]) {
          const params = new URLSearchParams(emailMatch[3]);
          data.subject = params.get('subject') || undefined;
          data.body = params.get('body') || undefined;
        }
      }
      return data;
    }

    if (/^tel:/i.test(content)) {
      data.type = 'phone';
      data.phoneNumber = content.replace(/^tel:/i, '');
      return data;
    }

    if (/^sms:/i.test(content) || /^smsto:/i.test(content)) {
      data.type = 'sms';
      const smsMatch = content.match(/^(?:sms|smsto):([^?:]+)(?:[?:](.*))?$/i);
      if (smsMatch) {
        data.smsNumber = smsMatch[1];
        if (smsMatch[2]) {
          const params = new URLSearchParams(smsMatch[2].replace(/^body=/i, 'body='));
          data.smsBody = params.get('body') || smsMatch[2];
        }
      }
      return data;
    }

    if (/^WIFI:/i.test(content)) {
      data.type = 'wifi';
      const ssidMatch = content.match(/S:([^;]*)/);
      const passMatch = content.match(/P:([^;]*)/);
      const secMatch = content.match(/T:([^;]*)/);
      data.ssid = ssidMatch?.[1] || '';
      data.password = passMatch?.[1] || '';
      data.security = secMatch?.[1] || 'WPA';
      return data;
    }

    if (/^BEGIN:VCARD/i.test(content)) {
      data.type = 'vcard';
      const nameMatch = content.match(/FN:(.+)/i);
      const orgMatch = content.match(/ORG:(.+)/i);
      const telMatch = content.match(/TEL[^:]*:(.+)/i);
      const emailVcardMatch = content.match(/EMAIL[^:]*:(.+)/i);
      const adrMatch = content.match(/ADR[^:]*:(.+)/i);
      const titleMatch = content.match(/TITLE:(.+)/i);
      
      data.name = nameMatch?.[1]?.trim();
      data.organization = orgMatch?.[1]?.trim();
      data.phone = telMatch?.[1]?.trim();
      data.emailAddress = emailVcardMatch?.[1]?.trim();
      data.address = adrMatch?.[1]?.replace(/;/g, ', ').trim();
      data.title = titleMatch?.[1]?.trim();
      return data;
    }

    if (/BEGIN:VEVENT/i.test(content) || /BEGIN:VCALENDAR/i.test(content)) {
      data.type = 'event';
      const summaryMatch = content.match(/SUMMARY:(.+)/i);
      const dtstartMatch = content.match(/DTSTART[^:]*:(\d+)/i);
      const dtendMatch = content.match(/DTEND[^:]*:(\d+)/i);
      const locationMatch = content.match(/LOCATION:(.+)/i);
      const descMatch = content.match(/DESCRIPTION:(.+)/i);
      
      data.eventTitle = summaryMatch?.[1]?.trim();
      data.eventStart = dtstartMatch?.[1];
      data.eventEnd = dtendMatch?.[1];
      data.eventLocation = locationMatch?.[1]?.trim();
      data.eventDescription = descMatch?.[1]?.trim();
      return data;
    }

    if (/^geo:/i.test(content)) {
      data.type = 'geo';
      const geoMatch = content.match(/^geo:(-?\d+\.?\d*),(-?\d+\.?\d*)/i);
      if (geoMatch) {
        data.latitude = geoMatch[1];
        data.longitude = geoMatch[2];
      }
      return data;
    }

    data.type = 'text';
    return data;
  }, []);

  const getTypeIcon = (type: QRType) => {
    switch (type) {
      case 'url': return ExternalLink;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'wifi': return Wifi;
      case 'vcard': return User;
      case 'event': return Calendar;
      case 'geo': return MapPin;
      case 'sms': return Smartphone;
      default: return FileText;
    }
  };

  const handleScanSuccess = useCallback((decodedText: string) => {
    const parsedData = parseQRContent(decodedText);
    const result: ScanResult = {
      id: Date.now().toString(),
      content: decodedText,
      type: parsedData.type,
      timestamp: new Date(),
      parsedData
    };
    
    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 49)]);
    
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    toast.success('QR Code Scanned!');
  }, [parseQRContent]);

  // Stop scanning safely
  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING state
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (error) {
        console.log('Scanner cleanup:', error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    setIsInitializing(false);
    setFlashlightOn(false);
  }, []);

  // Start camera scanning
  const startScanning = useCallback(async () => {
    // Ensure previous instance is cleaned up
    await stopScanning();
    
    setIsInitializing(true);
    
    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const container = document.getElementById(scannerContainerId);
    if (!container) {
      toast.error('Scanner container not found');
      setIsInitializing(false);
      return;
    }

    try {
      const scanner = new Html5Qrcode(scannerContainerId);
      scannerRef.current = scanner;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        disableFlip: false
      };

      // Use camera ID if available, otherwise use facing mode
      const cameraConfig = cameraId 
        ? cameraId 
        : { facingMode: facingMode };

      await scanner.start(
        cameraConfig,
        config,
        handleScanSuccess,
        () => {} // Ignore scan errors
      );
      
      if (isMountedRef.current) {
        setIsScanning(true);
        setIsInitializing(false);
      }
    } catch (error: any) {
      console.error('Failed to start scanner:', error);
      if (isMountedRef.current) {
        setIsInitializing(false);
        if (error?.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera permissions.');
        } else if (error?.name === 'NotFoundError') {
          toast.error('No camera found on this device.');
        } else {
          toast.error('Failed to access camera. Please try again.');
        }
      }
    }
  }, [stopScanning, cameraId, facingMode, handleScanSuccess]);

  // Toggle flashlight
  const toggleFlashlight = async () => {
    if (!scannerRef.current || !isScanning) return;
    
    try {
      const newState = !flashlightOn;
      await scannerRef.current.applyVideoConstraints({
        // @ts-ignore
        advanced: [{ torch: newState }]
      });
      setFlashlightOn(newState);
    } catch (error) {
      toast.error('Flashlight not supported on this device');
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (!isScanning) return;
    
    const currentIndex = availableCameras.findIndex(c => c.id === cameraId);
    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];
    
    if (nextCamera) {
      setCameraId(nextCamera.id);
      await stopScanning();
      // Delay to let state update
      setTimeout(() => {
        startScanning();
      }, 200);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    try {
      const scanner = new Html5Qrcode('qr-file-reader');
      const result = await scanner.scanFile(file, true);
      handleScanSuccess(result);
      await scanner.clear();
    } catch (error) {
      toast.error('No QR code found in image');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copied);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const downloadVCard = (data: ParsedQRData) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name || ''}
ORG:${data.organization || ''}
TITLE:${data.title || ''}
TEL:${data.phone || ''}
EMAIL:${data.emailAddress || ''}
ADR:${data.address || ''}
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('qr-scan-history');
    toast.success('History cleared');
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('qr-scanner-language', lang);
  };

  // Stop scanning when switching tabs
  useEffect(() => {
    if (activeTab !== 'camera' && isScanning) {
      stopScanning();
    }
  }, [activeTab, isScanning, stopScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        try {
          scannerRef.current.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const renderActionButtons = (result: ScanResult) => {
    const { parsedData } = result;
    if (!parsedData) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(result.content)}
        >
          <Copy className="h-4 w-4 mr-2" />
          {t.copyText}
        </Button>

        {parsedData.type === 'url' && (
          <Button
            size="sm"
            onClick={() => window.open(parsedData.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t.openLink}
          </Button>
        )}

        {parsedData.type === 'phone' && (
          <Button
            size="sm"
            onClick={() => window.open(`tel:${parsedData.phoneNumber}`, '_self')}
          >
            <Phone className="h-4 w-4 mr-2" />
            {t.call}
          </Button>
        )}

        {parsedData.type === 'email' && (
          <Button
            size="sm"
            onClick={() => {
              let mailtoUrl = `mailto:${parsedData.email}`;
              const params = [];
              if (parsedData.subject) params.push(`subject=${encodeURIComponent(parsedData.subject)}`);
              if (parsedData.body) params.push(`body=${encodeURIComponent(parsedData.body)}`);
              if (params.length) mailtoUrl += `?${params.join('&')}`;
              window.open(mailtoUrl, '_self');
            }}
          >
            <Mail className="h-4 w-4 mr-2" />
            {t.sendEmail}
          </Button>
        )}

        {parsedData.type === 'sms' && (
          <Button
            size="sm"
            onClick={() => {
              let smsUrl = `sms:${parsedData.smsNumber}`;
              if (parsedData.smsBody) smsUrl += `?body=${encodeURIComponent(parsedData.smsBody)}`;
              window.open(smsUrl, '_self');
            }}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {t.sendSMS}
          </Button>
        )}

        {parsedData.type === 'wifi' && (
          <Button
            size="sm"
            onClick={() => {
              copyToClipboard(parsedData.password || '');
              toast.success(`WiFi: ${parsedData.ssid}\nPassword copied!`);
            }}
          >
            <Wifi className="h-4 w-4 mr-2" />
            {t.connectWifi}
          </Button>
        )}

        {parsedData.type === 'vcard' && (
          <Button
            size="sm"
            onClick={() => downloadVCard(parsedData)}
          >
            <User className="h-4 w-4 mr-2" />
            {t.saveContact}
          </Button>
        )}

        {parsedData.type === 'geo' && (
          <Button
            size="sm"
            onClick={() => window.open(`https://maps.google.com/?q=${parsedData.latitude},${parsedData.longitude}`, '_blank')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t.openMap}
          </Button>
        )}

        {parsedData.type === 'event' && (
          <Button
            size="sm"
            onClick={() => {
              const blob = new Blob([result.content], { type: 'text/calendar' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${parsedData.eventTitle || 'event'}.ics`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t.addToCalendar}
          </Button>
        )}
      </div>
    );
  };

  const renderParsedDetails = (data: ParsedQRData) => {
    switch (data.type) {
      case 'wifi':
        return (
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Network:</span> {data.ssid}</p>
            <p><span className="text-muted-foreground">Password:</span> {data.password || 'None'}</p>
            <p><span className="text-muted-foreground">Security:</span> {data.security}</p>
          </div>
        );
      case 'vcard':
        return (
          <div className="space-y-1 text-sm">
            {data.name && <p><span className="text-muted-foreground">Name:</span> {data.name}</p>}
            {data.organization && <p><span className="text-muted-foreground">Organization:</span> {data.organization}</p>}
            {data.title && <p><span className="text-muted-foreground">Title:</span> {data.title}</p>}
            {data.phone && <p><span className="text-muted-foreground">Phone:</span> {data.phone}</p>}
            {data.emailAddress && <p><span className="text-muted-foreground">Email:</span> {data.emailAddress}</p>}
            {data.address && <p><span className="text-muted-foreground">Address:</span> {data.address}</p>}
          </div>
        );
      case 'event':
        return (
          <div className="space-y-1 text-sm">
            {data.eventTitle && <p><span className="text-muted-foreground">Event:</span> {data.eventTitle}</p>}
            {data.eventLocation && <p><span className="text-muted-foreground">Location:</span> {data.eventLocation}</p>}
            {data.eventDescription && <p><span className="text-muted-foreground">Description:</span> {data.eventDescription}</p>}
          </div>
        );
      case 'geo':
        return (
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Latitude:</span> {data.latitude}</p>
            <p><span className="text-muted-foreground">Longitude:</span> {data.longitude}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const TypeIcon = scanResult?.parsedData ? getTypeIcon(scanResult.parsedData.type) : FileText;

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex justify-end">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
          aria-label={t.selectLanguage}
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="ar">🇸🇦 العربية</option>
        </select>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
        <Shield className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{t.secureProcessing}</p>
          <p className="text-xs text-muted-foreground">{t.noDataStored}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            {t.camera}
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t.upload}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t.history}
            {scanHistory.length > 0 && (
              <Badge variant="secondary" className="ml-1">{scanHistory.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Camera Tab */}
        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              {/* Scanner Container */}
              <div 
                id={scannerContainerId}
                className={cn(
                  "w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden bg-muted relative",
                  !isScanning && !isInitializing && "flex items-center justify-center"
                )}
              >
                {!isScanning && !isInitializing && (
                  <div className="text-center text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click start to scan</p>
                  </div>
                )}
                {isInitializing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                    <div className="text-center text-muted-foreground">
                      <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin" />
                      <p className="text-sm">{t.initializing}</p>
                    </div>
                  </div>
                )}
              </div>

              {isScanning && (
                <p className="text-center text-sm text-muted-foreground mt-2">{t.scanning}</p>
              )}

              {/* Controls */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {!isScanning && !isInitializing ? (
                  <Button onClick={startScanning} size="lg">
                    <Camera className="h-5 w-5 mr-2" />
                    {t.startScanning}
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopScanning} variant="destructive" disabled={isInitializing}>
                      <X className="h-4 w-4 mr-2" />
                      {t.stopScanning}
                    </Button>
                    {availableCameras.length > 1 && (
                      <Button onClick={switchCamera} variant="outline" disabled={isInitializing}>
                        <SwitchCamera className="h-4 w-4 mr-2" />
                        {t.switchCamera}
                      </Button>
                    )}
                    <Button 
                      onClick={toggleFlashlight} 
                      variant={flashlightOn ? "default" : "outline"}
                      disabled={isInitializing}
                    >
                      {flashlightOn ? (
                        <FlashlightOff className="h-4 w-4 mr-2" />
                      ) : (
                        <Flashlight className="h-4 w-4 mr-2" />
                      )}
                      {t.flashlight}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground font-medium mb-2">{t.uploadImage}</p>
                <p className="text-sm text-muted-foreground">{t.dragDrop}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = '';
                  }}
                />
              </div>
              {/* Hidden element for file scanning */}
              <div id="qr-file-reader" className="hidden" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {scanHistory.length > 0 ? (
            <>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.clearHistory}
                </Button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scanHistory.map((item) => {
                  const HistoryIcon = getTypeIcon(item.type);
                  return (
                    <Card 
                      key={item.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setScanResult(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <HistoryIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {item.content.slice(0, 50)}{item.content.length > 50 ? '...' : ''}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">{t.noHistory}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Scan Result Display */}
      {scanResult && (
        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              {t.scanResult}
              <Badge variant="secondary" className="ml-auto capitalize">{scanResult.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/50 rounded-lg break-all">
              <code className="text-sm">{scanResult.content}</code>
            </div>
            
            {scanResult.parsedData && renderParsedDetails(scanResult.parsedData)}
            {renderActionButtons(scanResult)}
            
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setScanResult(null)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Scan Another
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground">What QR code types are supported?</h4>
            <p className="text-sm text-muted-foreground">
              Our scanner supports URLs, plain text, emails, phone numbers, WiFi credentials, vCards (contacts), 
              calendar events, geographic locations, and SMS messages.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Is my data secure?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! All scanning happens directly on your device. No images or scan data are ever sent to any server. 
              Your scan history is stored locally in your browser only.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Can I scan from screenshots?</h4>
            <p className="text-sm text-muted-foreground">
              Absolutely! Use the Upload tab to select any image containing a QR code, including screenshots 
              from your gallery or downloaded images.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Why isn't the flashlight working?</h4>
            <p className="text-sm text-muted-foreground">
              Flashlight (torch) functionality depends on your device and browser. It works best on mobile devices 
              with compatible browsers like Chrome. Some devices may not support this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScannerTool;
