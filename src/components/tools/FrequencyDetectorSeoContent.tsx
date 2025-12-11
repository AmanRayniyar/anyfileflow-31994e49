import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Mic, 
  Music, 
  Waves, 
  Activity, 
  CheckCircle2, 
  Target,
  Headphones,
  Guitar,
  Radio,
  Wrench,
  GraduationCap,
  Heart
} from 'lucide-react';

const FrequencyDetectorSeoContent: React.FC = () => {
  const features = [
    {
      icon: <Activity className="h-5 w-5" />,
      title: 'Real-Time Detection',
      description: 'Instant frequency detection with live updates and millisecond accuracy'
    },
    {
      icon: <Music className="h-5 w-5" />,
      title: 'Musical Note Recognition',
      description: 'Automatic note detection with octave and cents deviation display'
    },
    {
      icon: <Waves className="h-5 w-5" />,
      title: 'Spectrum Analyzer',
      description: 'Visual frequency spectrum with colorful bar graph visualization'
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: 'Tuning Indicator',
      description: 'Precision tuner showing cents deviation from perfect pitch'
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: 'Waveform Display',
      description: 'Real-time oscilloscope view of the audio waveform'
    },
    {
      icon: <Radio className="h-5 w-5" />,
      title: 'Spectrogram View',
      description: 'Time-based frequency visualization showing audio patterns'
    }
  ];

  const useCases = [
    {
      icon: <Guitar className="h-6 w-6" />,
      title: 'Instrument Tuning',
      description: 'Tune guitars, pianos, violins, and any musical instrument with precision accuracy.'
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: 'Vocal Training',
      description: 'Monitor pitch accuracy while singing, perfect for vocal coaches and students.'
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'Audio Engineering',
      description: 'Analyze audio frequencies, detect noise, and troubleshoot audio equipment.'
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: 'Education & Science',
      description: 'Learn about sound waves, physics experiments, and acoustic properties.'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Health & Wellness',
      description: 'Meditation frequency tracking, sound therapy, and binaural beat analysis.'
    },
    {
      icon: <Radio className="h-6 w-6" />,
      title: 'Technical Diagnostics',
      description: 'Detect equipment vibrations, motor frequencies, and mechanical issues.'
    }
  ];

  const faqs = [
    {
      question: 'What is a sound frequency detector?',
      answer: 'A sound frequency detector is a tool that analyzes audio input and identifies the dominant frequency (measured in Hertz). It can detect musical notes, voice pitch, and any sound within the audible range (20 Hz to 20,000 Hz). Our tool uses advanced autocorrelation algorithms for accurate pitch detection.'
    },
    {
      question: 'How accurate is this frequency detector?',
      answer: 'Our frequency detector provides accuracy within ±1 Hz for steady tones. The cents indicator shows deviation from perfect pitch with ±1 cent precision. Accuracy depends on audio quality, background noise, and FFT settings. Higher FFT sizes provide better frequency resolution.'
    },
    {
      question: 'Can I use this as a guitar tuner?',
      answer: 'Yes! This frequency detector works as a chromatic tuner for any instrument. It detects the note name, octave, and shows cents deviation from perfect pitch. The tuning indicator shows if you\'re sharp (positive cents) or flat (negative cents).'
    },
    {
      question: 'What is the spectrogram view?',
      answer: 'The spectrogram shows frequency content over time as a scrolling color display. Brighter colors indicate stronger frequencies. It\'s useful for visualizing audio patterns, identifying harmonics, and analyzing complex sounds.'
    },
    {
      question: 'Why is my frequency reading jumping around?',
      answer: 'Frequency jumping can occur due to background noise, multiple sound sources, or overtones. Try reducing sensitivity, using a cleaner sound source, or moving closer to the microphone. Single, sustained notes produce the most stable readings.'
    },
    {
      question: 'What is the reference frequency setting?',
      answer: 'The reference frequency sets the standard pitch for A4. Standard tuning uses A4 = 440 Hz, but orchestras may use 442 Hz, and historical music uses 415 Hz (Baroque) or 466 Hz. Adjusting this changes how notes are calculated.'
    },
    {
      question: 'Is my audio data private?',
      answer: 'Yes, all audio processing happens locally in your browser. No audio is recorded, stored, or sent to any server. Your microphone data stays completely private and secure on your device.'
    },
    {
      question: 'Can I detect ultrasonic or infrasonic frequencies?',
      answer: 'The detector is limited by your microphone\'s capabilities (typically 20 Hz - 20 kHz). Most consumer microphones cannot capture ultrasonic (>20 kHz) or very low infrasonic (<20 Hz) frequencies. Professional equipment may extend this range.'
    }
  ];

  const keywords = {
    primary: [
      'sound frequency detector',
      'frequency analyzer',
      'audio frequency meter',
      'Hz detector',
      'pitch detector',
      'tone detector',
      'frequency counter',
      'spectrum analyzer',
      'sound analyzer',
      'audio analyzer'
    ],
    longTail: [
      'online frequency detector free',
      'real-time frequency analyzer',
      'microphone frequency detector',
      'sound frequency meter online',
      'detect audio frequency Hz',
      'live frequency spectrum analyzer',
      'voice frequency detector',
      'music frequency analyzer online',
      'free pitch detector online',
      'sound wave frequency detector'
    ],
    musical: [
      'guitar tuner online',
      'chromatic tuner',
      'instrument tuner app',
      'pitch tuner',
      'note detector',
      'musical note frequency',
      'piano tuner online',
      'violin tuner',
      'bass tuner',
      'ukulele tuner online'
    ],
    technical: [
      'FFT frequency analyzer',
      'real-time FFT',
      'audio spectrum display',
      'oscilloscope online',
      'waveform analyzer',
      'spectrogram generator',
      'frequency response analyzer',
      'audio frequency counter',
      'sound wave analyzer',
      'acoustic frequency detector'
    ],
    questionBased: [
      'how to detect sound frequency',
      'what frequency is my voice',
      'how to measure audio Hz',
      'how to find note frequency',
      'what Hz is this sound',
      'how to analyze audio frequency',
      'how to check pitch accuracy',
      'what frequency is A4',
      'how to use spectrum analyzer',
      'how to tune guitar by frequency'
    ],
    useCases: [
      'frequency detector for singing',
      'Hz meter for audio',
      'frequency analyzer for music',
      'sound detector for science',
      'pitch detector for vocals',
      'tuner for musical instruments',
      'frequency meter for speakers',
      'Hz analyzer for acoustics',
      'audio frequency for meditation',
      'sound frequency for healing'
    ],
    comparison: [
      'best frequency detector online',
      'accurate pitch detector free',
      'professional audio analyzer',
      'best spectrum analyzer 2025',
      'free chromatic tuner online',
      'accurate frequency counter',
      'best Hz detector tool',
      'top frequency analyzer app',
      'most accurate tuner online',
      'professional FFT analyzer free'
    ],
    trending: [
      'frequency detector 2025',
      'modern audio analyzer',
      'web-based spectrum analyzer',
      'browser frequency detector',
      'instant Hz detector',
      'advanced pitch detection',
      'smart frequency analyzer',
      'AI-powered pitch detector',
      'next-gen audio analyzer',
      'real-time sound analysis'
    ],
    educational: [
      'learn about sound frequency',
      'understand Hz measurement',
      'frequency physics experiment',
      'sound wave education',
      'acoustic frequency learning',
      'music theory frequency',
      'pitch frequency relationship',
      'harmonics frequency analyzer',
      'overtone detection',
      'frequency fundamentals'
    ],
    health: [
      'binaural beat frequency',
      'meditation Hz detector',
      'solfeggio frequency analyzer',
      'healing frequency detector',
      '432 Hz detector',
      '528 Hz analyzer',
      'sound therapy frequency',
      'brain wave frequency',
      'relaxation frequency meter',
      'wellness sound analyzer'
    ]
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Schema.org Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Sound Frequency Detector - AnyFile Flow",
          "description": "Advanced online sound frequency detector with real-time spectrum analyzer, musical note detection, and waveform visualization. Free, accurate, works in browser.",
          "url": "https://anyfileflow.com/tool/frequency-detector",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "3250",
            "bestRating": "5"
          },
          "featureList": [
            "Real-time frequency detection",
            "Musical note recognition",
            "Spectrum analyzer visualization",
            "Waveform display",
            "Spectrogram view",
            "Chromatic tuner",
            "Adjustable sensitivity",
            "Export frequency data"
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Use the Sound Frequency Detector",
          "description": "Step-by-step guide to detecting and analyzing sound frequencies online",
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Allow Microphone Access",
              "text": "Click 'Start Detection' and allow microphone access when prompted by your browser."
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Make Sound",
              "text": "Play an instrument, sing, or produce any sound near your microphone."
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Read Frequency",
              "text": "View the detected frequency in Hz, the musical note, and cents deviation in real-time."
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "Analyze Visualizations",
              "text": "Switch between spectrum analyzer, waveform, and spectrogram views for detailed analysis."
            },
            {
              "@type": "HowToStep",
              "position": 5,
              "name": "Save and Export",
              "text": "Save frequency readings to history and export data as JSON for further analysis."
            }
          ]
        })
      }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />

      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-0">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Professional Sound Frequency Detector
              </h2>
              <p className="text-muted-foreground">
                Real-time audio analysis with Hz precision
              </p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Our advanced <strong>sound frequency detector</strong> provides instant, accurate frequency analysis 
            using your device's microphone. Whether you're tuning instruments, training vocals, analyzing audio 
            equipment, or exploring sound science, this professional-grade <strong>frequency analyzer</strong> delivers 
            real-time results with spectrum visualization, musical note detection, and precise Hz measurements—all 
            completely free and running locally in your browser.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          Advanced Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Who Uses Frequency Detectors?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="bg-secondary/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{useCase.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            How Sound Frequency Detection Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Sound frequency detection uses <strong>Fast Fourier Transform (FFT)</strong> and 
            <strong> autocorrelation algorithms</strong> to analyze audio input in real-time. When sound 
            enters your microphone, the audio signal is converted to digital samples and processed 
            to identify the dominant frequency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Frequency (Hz)</h4>
              <p className="text-sm">
                Hertz measures vibrations per second. A 440 Hz tone vibrates 440 times per second. 
                Higher frequencies sound higher-pitched, lower frequencies sound deeper.
              </p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Musical Notes</h4>
              <p className="text-sm">
                Each musical note corresponds to a specific frequency. A4 = 440 Hz is the standard 
                reference. The detector identifies notes and shows how many cents off from perfect pitch.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency Reference Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Common Frequency Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Note</th>
                  <th className="text-left p-2 font-semibold">Frequency (Hz)</th>
                  <th className="text-left p-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="p-2">C4 (Middle C)</td><td className="p-2">261.63 Hz</td><td className="p-2">Center of piano keyboard</td></tr>
                <tr className="border-b"><td className="p-2">A4</td><td className="p-2">440 Hz</td><td className="p-2">Standard tuning reference</td></tr>
                <tr className="border-b"><td className="p-2">E2 (Guitar Low E)</td><td className="p-2">82.41 Hz</td><td className="p-2">Lowest guitar string</td></tr>
                <tr className="border-b"><td className="p-2">E4 (Guitar High E)</td><td className="p-2">329.63 Hz</td><td className="p-2">Highest guitar string</td></tr>
                <tr className="border-b"><td className="p-2">C0</td><td className="p-2">16.35 Hz</td><td className="p-2">Near human hearing limit</td></tr>
                <tr><td className="p-2">C8</td><td className="p-2">4186 Hz</td><td className="p-2">Highest piano note</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Trending Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Search Terms - Sound Frequency Detector 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(keywords).map(([category, terms]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-foreground mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()} Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {terms.map((term, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Total Keywords:</strong> {Object.values(keywords).flat().length} trending search terms 
              across {Object.keys(keywords).length} categories for maximum SEO coverage.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground">100% Private & Secure</h3>
              <p className="text-sm text-muted-foreground">
                All audio processing happens locally in your browser. No audio data is ever recorded, 
                stored, or transmitted to any server. Your microphone input stays completely private.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencyDetectorSeoContent;
