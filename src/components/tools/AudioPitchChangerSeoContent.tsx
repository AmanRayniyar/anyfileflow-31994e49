import React from 'react';
import { Helmet } from 'react-helmet-async';

const AudioPitchChangerSeoContent: React.FC = () => {
  const keywords = {
    primary: [
      'audio pitch changer', 'change audio pitch', 'pitch changer online', 'change pitch of audio',
      'audio pitch editor', 'pitch shift audio', 'pitch changer free', 'online pitch changer',
      'audio pitch changer online', 'pitch changer tool'
    ],
    musicVocal: [
      'change song pitch', 'vocal pitch changer', 'music pitch changer', 'pitch shift music',
      'change pitch of song online', 'pitch correct audio', 'tune audio pitch', 'audio key changer',
      'change song key', 'pitch changer for music'
    ],
    voice: [
      'voice pitch changer', 'change voice pitch', 'deep voice changer', 'high pitch voice changer',
      'male to female voice pitch', 'female to male pitch changer', 'cartoon voice pitch',
      'chipmunk voice changer', 'pitch changer for voice', 'voice pitch editor'
    ],
    freeOnline: [
      'free audio pitch changer', 'pitch changer no signup', 'pitch changer without watermark',
      'pitch changer browser based', 'pitch changer without download', 'instant pitch changer',
      'pitch changer web app', 'pitch changer free online', 'online audio pitch tool',
      'pitch changer no registration'
    ],
    musician: [
      'change pitch without changing speed', 'pitch shift without tempo change',
      'audio pitch semitone changer', 'musical key changer', 'change key of song online',
      'pitch changer for singers', 'pitch changer for musicians', 'pitch shift wav',
      'pitch shift mp3', 'pitch changer flac'
    ],
    platform: [
      'pitch changer for mobile', 'pitch changer android web', 'pitch changer iphone online',
      'pitch changer mac', 'pitch changer windows', 'pitch changer chrome',
      'pitch changer safari', 'pitch changer firefox', 'pitch changer ios', 'pitch changer web'
    ],
    fileFormat: [
      'mp3 pitch changer', 'wav pitch changer', 'm4a pitch changer', 'ogg pitch changer',
      'aac pitch changer', 'flac pitch changer online', 'change pitch mp3 free',
      'change pitch wav online', 'audio pitch converter', 'pitch shift audio file'
    ],
    longTail: [
      'how to change audio pitch online', 'best audio pitch changer free',
      'change pitch of audio without quality loss', 'pitch changer without distortion',
      'real time audio pitch changer', 'high quality pitch changer', 'fast audio pitch changer',
      'professional pitch changer online', 'pitch changer for youtube audio',
      'pitch changer for podcast'
    ],
    trending: [
      'pitch changer tool free', 'online audio editor pitch', 'audio pitch modifier',
      'pitch changer sound', 'sound pitch changer', 'pitch shifter online',
      'change audio frequency online', 'audio hz changer', 'pitch changer 432hz',
      'pitch changer 440hz'
    ],
    brand: [
      'anyfile flow audio pitch changer', 'anyfile flow pitch changer',
      'audio pitch changer anyfile flow', 'free pitch changer anyfile flow',
      'online pitch changer anyfile flow', 'pitch changer no ai', 'pitch changer privacy safe',
      'pitch changer fast processing', 'pitch changer browser audio', 'pitch changer unlimited free'
    ]
  };

  const allKeywords = Object.values(keywords).flat();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I change audio pitch online for free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload your audio file to our free pitch changer, adjust the semitone slider from -12 to +12, and download the result. No signup or payment required. Processing happens in your browser for complete privacy.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I change pitch without changing speed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Enable the "Keep Original Tempo" option to change pitch without affecting playback speed. This preserves the original duration while shifting the pitch up or down.'
        }
      },
      {
        '@type': 'Question',
        name: 'What audio formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our pitch changer supports MP3, WAV, AAC, OGG, FLAC, and M4A formats. You can export in high-quality WAV format with 44.1kHz or 48kHz sample rates.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do voice presets like Male to Female work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Voice presets apply specific semitone shifts to transform voice characteristics. Male to Female raises pitch by +4 semitones, while Female to Male lowers it by -4 semitones. Chipmunk effect uses +8 semitones for a high-pitched cartoon voice.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my audio file uploaded to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, all processing happens locally in your browser using Web Audio API. Your audio files never leave your device, ensuring complete privacy and security.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I change the musical key of a song?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Use the Musical tab to select original and target keys (C, D, E, etc.). The tool automatically calculates the correct semitone shift to transpose your song to the new key.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the cents fine-tuning feature?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cents allow precise pitch adjustment in 1/100th of a semitone. This is useful for exact tuning, correcting slightly off-pitch recordings, or matching specific frequency requirements.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I preview changes before downloading?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Use the play button to preview your audio with pitch changes applied in real-time. Adjust settings while listening and enable loop mode for continuous preview.'
        }
      }
    ]
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Audio Pitch Changer - AnyFile Flow',
    description: 'Free online audio pitch changer tool. Change pitch without changing speed, apply voice presets, transpose musical keys, and export high-quality audio.',
    url: 'https://anyfileflow.lovable.app/tool/pitch-changer',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Pitch shift ±12 semitones',
      'Fine tuning in cents',
      'Keep tempo option',
      'Voice presets (Male/Female/Chipmunk/Deep)',
      'Musical key transposition',
      'Real-time preview',
      'Multiple format support',
      'Browser-based processing',
      'No signup required'
    ]
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Change Audio Pitch Online',
    description: 'Step-by-step guide to changing audio pitch using AnyFile Flow free pitch changer',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Upload Audio',
        text: 'Drag and drop or click to upload your MP3, WAV, or other audio file'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Adjust Pitch',
        text: 'Use the semitone slider to shift pitch up or down, or apply a voice preset'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Preview Changes',
        text: 'Click play to hear your audio with the new pitch in real-time'
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Download Result',
        text: 'Click download to save your pitch-shifted audio in high quality'
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>

      <div className="mt-12 space-y-8">
        {/* SEO Content */}
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">Free Online Audio Pitch Changer - No Signup Required</h2>
          <p>
            Change the pitch of any audio file instantly with our professional-grade pitch changer tool. 
            Whether you need to transpose a song to a different key, create voice effects like chipmunk or deep voice, 
            or fine-tune audio for perfect pitch - our free online tool handles it all without any software installation.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pitch Shift ±12 Semitones:</strong> Full octave range up or down with precision control</li>
            <li><strong>Keep Original Tempo:</strong> Change pitch without affecting playback speed</li>
            <li><strong>Voice Presets:</strong> One-click Male→Female, Female→Male, Chipmunk, Deep Voice effects</li>
            <li><strong>Musical Key Change:</strong> Transpose songs between any musical keys (C, D, E, F, G, A, B)</li>
            <li><strong>Fine Tuning:</strong> Adjust in cents (1/100th semitone) for exact pitch matching</li>
            <li><strong>Real-Time Preview:</strong> Hear changes instantly while adjusting settings</li>
            <li><strong>Multiple Formats:</strong> Support for MP3, WAV, AAC, OGG, FLAC, M4A</li>
            <li><strong>High-Quality Export:</strong> 44.1kHz and 48kHz sample rates, stereo or mono</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">How to Change Audio Pitch</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Upload your audio file by dragging and dropping or clicking the upload area</li>
            <li>Use the semitone slider to shift pitch up (+) or down (-)</li>
            <li>Enable "Keep Original Tempo" to change pitch without speed change</li>
            <li>Preview your changes in real-time using the play button</li>
            <li>Adjust fade in/out effects if needed</li>
            <li>Click download to save your pitch-shifted audio</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Why Use Our Pitch Changer?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">🔒 100% Private</h4>
              <p className="text-sm text-muted-foreground">All processing in your browser - files never uploaded</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">⚡ Instant Processing</h4>
              <p className="text-sm text-muted-foreground">No waiting - real-time preview and fast export</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">🎵 Professional Quality</h4>
              <p className="text-sm text-muted-foreground">High-quality audio processing without distortion</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">🆓 Completely Free</h4>
              <p className="text-sm text-muted-foreground">No signup, no watermark, no limits</p>
            </div>
          </div>
        </section>

        {/* Keywords Section */}
        <section className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">
            🔍 SEO Keywords ({allKeywords.length} Total)
          </h3>
          <div className="space-y-4">
            {Object.entries(keywords).map(([category, words]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()} ({words.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {words.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AudioPitchChangerSeoContent;
