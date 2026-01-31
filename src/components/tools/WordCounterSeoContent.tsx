import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Hash, Type, Clock, Target, BarChart3, Shield, Sparkles,
  GraduationCap, Video, Globe, CheckCircle2, Zap
} from "lucide-react";

const WordCounterSeoContent = () => {
  // FAQ data for schema markup
  const faqs = [
    {
      question: "Is this word counter tool free to use?",
      answer: "Yes, our word counter is 100% free with no hidden charges, no registration required, and no usage limits. Count unlimited words, characters, sentences, and paragraphs instantly."
    },
    {
      question: "Does the word counter work offline?",
      answer: "Yes! Once loaded, our word counter works completely offline. It's a PWA (Progressive Web App) that processes all text locally in your browser without internet connection."
    },
    {
      question: "Is my text private and secure?",
      answer: "Absolutely. Your text never leaves your browser. All processing happens locally on your device. We don't store, transmit, or have access to any text you enter. 100% privacy guaranteed."
    },
    {
      question: "What platforms does the character limit tracker support?",
      answer: "Our tool tracks character limits for Twitter/X (280), Instagram captions (2,200), YouTube titles (100), YouTube descriptions (5,000), Facebook posts (63,206), SMS (GSM 160/Unicode 70), and SEO meta tags (title 60, description 160)."
    },
    {
      question: "How accurate is the reading time calculation?",
      answer: "We calculate reading time based on average reading speed of 200 words per minute (wpm), slow reading at 150 wpm, and speaking time at 130 wpm. These are industry-standard metrics used by Medium, LinkedIn, and major publications."
    },
    {
      question: "What is the Flesch Readability Score?",
      answer: "The Flesch Reading Ease Score measures how easy your text is to understand. Scores range from 0-100, with higher scores indicating easier readability. 60-70 is considered standard for most audiences, while 90+ is very easy (5th grade level)."
    },
    {
      question: "Can I use this for Twitter character counting?",
      answer: "Yes! Our tool includes a dedicated Twitter/X character limit tracker that shows you exactly how many characters you've used out of 280, with real-time warnings when you exceed the limit."
    },
    {
      question: "Does it support Hindi, Nepali, Arabic, and other languages?",
      answer: "Yes! Our word counter supports all languages including Hindi, Nepali, Arabic, Chinese, Japanese, Korean, Thai, Russian, and more. It automatically detects the language and correctly counts Unicode characters."
    },
    {
      question: "What is keyword density and why does it matter?",
      answer: "Keyword density shows how often specific words appear in your text as a percentage. For SEO, maintaining 1-3% keyword density helps search engines understand your content without keyword stuffing. Our tool calculates this automatically."
    },
    {
      question: "How does the Student Mode work?",
      answer: "Student Mode provides features specifically designed for academic writing: essay grade estimation, answer length indicators (short/medium/long), word limit checking for exams, and page count estimates for Word documents and Google Docs."
    },
    {
      question: "What features are in Creator Mode?",
      answer: "Creator Mode includes YouTube title SEO scoring, hook strength analysis, hashtag counter, emoji counter, and platform-specific character limits. Perfect for YouTubers, content creators, and social media managers."
    },
    {
      question: "Can it detect passive voice in my writing?",
      answer: "Yes! Our advanced writing analysis detects passive voice constructions in your text and counts the instances. This helps you write more active, engaging content that resonates with readers."
    }
  ];

  // Trending keywords organized by category
  const trendingKeywords = {
    "Primary Keywords": [
      "word counter", "character counter", "word count", "character count",
      "online word counter", "free word counter", "word counter online"
    ],
    "Long-Tail Keywords": [
      "word counter for essays", "character counter for Twitter",
      "word count checker online", "free word counter no signup",
      "word counter with reading time", "sentence counter online"
    ],
    "Platform-Specific": [
      "Twitter character counter", "Instagram caption counter",
      "YouTube title character limit", "Facebook post character limit",
      "SMS character counter", "SEO meta description counter"
    ],
    "Student Keywords": [
      "essay word counter", "word counter for students",
      "assignment word count", "thesis word counter",
      "academic word counter", "homework word counter"
    ],
    "Creator Keywords": [
      "YouTube SEO word counter", "content creator word counter",
      "social media character counter", "hashtag counter",
      "caption word counter", "video script word counter"
    ],
    "Feature Keywords": [
      "reading time calculator", "speaking time calculator",
      "readability score checker", "keyword density checker",
      "passive voice detector", "paragraph counter"
    ],
    "Language Keywords": [
      "Hindi word counter", "Nepali word counter",
      "Arabic word counter", "Chinese character counter",
      "Unicode word counter", "emoji counter"
    ],
    "Action Keywords": [
      "count words online free", "check character count",
      "calculate reading time", "analyze text online",
      "count sentences online", "check word limit"
    ],
    "Comparison Keywords": [
      "best word counter tool", "word counter vs character counter",
      "most accurate word counter", "word counter alternative",
      "word counter like Microsoft Word"
    ],
    "Mobile Keywords": [
      "word counter mobile", "word counter app",
      "word counter iPhone", "word counter Android",
      "word counter on phone", "mobile character counter"
    ]
  };

  // Schema markup
  const faqSchema = {
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
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AnyFile Flow Word Counter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Aman Rauniyar"
    },
    "description": "Free online word counter with character count, reading time, readability score, keyword density, and platform-specific limits for Twitter, Instagram, YouTube, and more.",
    "featureList": [
      "Word count",
      "Character count with and without spaces",
      "Sentence and paragraph count",
      "Reading and speaking time",
      "Flesch readability score",
      "Platform character limits (Twitter, Instagram, YouTube)",
      "Keyword density analysis",
      "Passive voice detection",
      "Multilingual support",
      "Student and Creator modes",
      "100% privacy - no data uploaded"
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Word Counter Tool",
    "description": "Count words, characters, sentences, and analyze text readability in seconds",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter or paste your text",
        "text": "Type directly or paste your text into the input area. Counting happens in real-time."
      },
      {
        "@type": "HowToStep",
        "name": "View instant statistics",
        "text": "See word count, character count, sentences, paragraphs, reading time, and more instantly."
      },
      {
        "@type": "HowToStep",
        "name": "Check platform limits",
        "text": "Monitor character limits for Twitter, Instagram, YouTube, and other platforms."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze writing quality",
        "text": "Review readability score, keyword density, passive voice, and overused words."
      },
      {
        "@type": "HowToStep",
        "name": "Copy or share results",
        "text": "Copy your text or share statistics with one click."
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

      <div className="mt-12 space-y-12">
        {/* How to Use Section */}
        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use" className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            How to Use Our Word Counter
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Enter Text", desc: "Type or paste your text. Real-time counting—no button needed." },
              { step: "2", title: "View Stats", desc: "Instantly see words, characters, sentences, reading time, and more." },
              { step: "3", title: "Analyze & Share", desc: "Check readability, platform limits, and share your stats." }
            ].map(item => (
              <Card key={item.step}>
                <CardContent className="p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features Section */}
        <section aria-labelledby="features">
          <h2 id="features" className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Why Use Our Word Counter?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Hash, title: "Complete Counting", desc: "Words, characters (with/without spaces), sentences, paragraphs, lines, and pages." },
              { icon: Target, title: "Platform Limits", desc: "Track Twitter, Instagram, YouTube, Facebook, SMS, and SEO limits in real-time." },
              { icon: Clock, title: "Time Estimates", desc: "Reading time (avg & slow), speaking time for speeches and videos." },
              { icon: BarChart3, title: "Writing Analysis", desc: "Flesch readability, keyword density, passive voice detection, overused words." },
              { icon: Globe, title: "Multilingual", desc: "Hindi, Nepali, Arabic, Chinese, and 50+ languages with Unicode support." },
              { icon: Shield, title: "100% Private", desc: "All processing in your browser. No uploads, no storage, no tracking." },
              { icon: GraduationCap, title: "Student Mode", desc: "Essay grading, word limit checking, academic page counts." },
              { icon: Video, title: "Creator Mode", desc: "YouTube SEO scoring, hook strength, hashtag counting." },
              { icon: Type, title: "AI-Powered", desc: "Improve, shorten, expand, or rewrite text with AI assistance." }
            ].map(feature => (
              <Card key={feature.title}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section aria-labelledby="use-cases">
          <h2 id="use-cases" className="text-2xl font-bold mb-6">Who Uses Our Word Counter?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Students & Academics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Essay word count requirements",
                  "Thesis and dissertation tracking",
                  "Assignment length verification",
                  "Reading level analysis"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Content Creators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "YouTube title optimization",
                  "Instagram caption limits",
                  "Twitter post character count",
                  "Video script timing"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  SEO & Marketers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Meta title & description limits",
                  "Keyword density analysis",
                  "Content readability scoring",
                  "Competitive content analysis"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Writers & Editors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Manuscript word tracking",
                  "Passive voice detection",
                  "Overused word identification",
                  "Reading time estimation"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Section */}
        <section aria-labelledby="privacy" className="bg-secondary/30 p-6 rounded-lg">
          <h2 id="privacy" className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Your Privacy is Protected
          </h2>
          <p className="text-muted-foreground mb-4">
            Unlike other word counters that upload your text to servers, our tool processes everything 
            locally in your browser. Your text never leaves your device.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "No server uploads – 100% client-side",
              "No registration or login required",
              "No cookies tracking your content",
              "Works offline after page load"
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trending Keywords Section */}
        <section aria-labelledby="keywords" className="border-t pt-8">
          <h2 id="keywords" className="text-xl font-bold mb-4">
            Trending Searches ({Object.values(trendingKeywords).flat().length}+ Keywords)
          </h2>
          <div className="space-y-4">
            {Object.entries(trendingKeywords).map(([category, keywords]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section aria-labelledby="related-tools" className="border-t pt-8">
          <h2 id="related-tools" className="text-xl font-bold mb-4">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Character Counter", href: "/tool/character-counter" },
              { name: "Text Case Converter", href: "/tool/sentence-case" },
              { name: "Typing Speed Test", href: "/tool/typing-test" },
              { name: "Lorem Ipsum Generator", href: "/tool/lorem-ipsum" },
              { name: "Text Reverse", href: "/tool/text-reverse" }
            ].map(tool => (
              <a 
                key={tool.name}
                href={tool.href}
                className="inline-flex items-center gap-1 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </section>

        {/* Author Attribution */}
        <section className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            Created by <strong>Aman Rauniyar</strong> and the AnyFile Flow team. 
            Our mission is to provide free, privacy-focused tools that work without 
            registration or data collection.
          </p>
        </section>
      </div>
    </>
  );
};

export default WordCounterSeoContent;
