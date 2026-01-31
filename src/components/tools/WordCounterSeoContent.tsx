import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Hash, Type, Clock, Target, BarChart3, Shield, Sparkles,
  GraduationCap, Video, Globe, CheckCircle2, Zap, FileText,
  MessageSquare, Users, Smartphone, Settings, Eye, Mic,
  BookOpen, TrendingUp, AlertTriangle, Languages, Smile,
  Timer, PenTool, Share2, Lock, Wifi, Monitor
} from "lucide-react";

const WordCounterSeoContent = () => {
  // FAQ data for schema markup
  const faqs = [
    {
      question: "Is this word counter tool completely free to use?",
      answer: "Yes, our ultra-advanced word counter is 100% free with no hidden charges, no registration required, and no usage limits. Count unlimited words, characters, sentences, paragraphs, and analyze text quality instantly without any restrictions."
    },
    {
      question: "Does the word counter work offline without internet?",
      answer: "Yes! Once loaded, our word counter works completely offline. It's a PWA (Progressive Web App) that processes all text locally in your browser without requiring an internet connection. Perfect for working on the go."
    },
    {
      question: "Is my text private and secure when using this tool?",
      answer: "Absolutely. Your text never leaves your browser. All processing happens locally on your device using client-side JavaScript. We don't store, transmit, or have access to any text you enter. 100% privacy guaranteed with zero data collection."
    },
    {
      question: "What social media platforms does the character limit tracker support?",
      answer: "Our tool tracks character limits for Twitter/X (280 characters), Instagram captions (2,200 characters), YouTube titles (100 characters), YouTube descriptions (5,000 characters), Facebook posts (63,206 characters), SMS messages (GSM 160/Unicode 70 characters), and SEO meta tags (title 60, description 160 characters)."
    },
    {
      question: "How accurate is the reading time calculation?",
      answer: "We calculate reading time based on average reading speed of 200 words per minute (wpm), slow reading at 150 wpm, and speaking time at 130 wpm. These are industry-standard metrics used by Medium, LinkedIn, and major publications worldwide."
    },
    {
      question: "What is the Flesch Readability Score and how does it help?",
      answer: "The Flesch Reading Ease Score measures how easy your text is to understand on a scale of 0-100. Higher scores indicate easier readability: 90-100 is very easy (5th grade), 60-70 is standard (8th-9th grade), 30-50 is difficult (college level), and 0-30 is very difficult (professional/technical). This helps you write content appropriate for your target audience."
    },
    {
      question: "Can I use this for Twitter character counting?",
      answer: "Yes! Our tool includes a dedicated Twitter/X character limit tracker that shows you exactly how many characters you've used out of 280, with real-time visual warnings and color changes when you approach or exceed the limit. Perfect for crafting the perfect tweet."
    },
    {
      question: "Does it support Hindi, Nepali, Arabic, Chinese, and other languages?",
      answer: "Yes! Our word counter supports all languages including Hindi, Nepali, Arabic, Chinese, Japanese, Korean, Thai, Russian, Hebrew, and 50+ more. It automatically detects the language and correctly counts Unicode characters, emojis, and special characters."
    },
    {
      question: "What is keyword density and why does it matter for SEO?",
      answer: "Keyword density shows how often specific words appear in your text as a percentage. For SEO, maintaining 1-3% keyword density helps search engines understand your content without appearing as keyword stuffing. Our tool calculates this automatically and shows your top keywords with their frequency."
    },
    {
      question: "How does the Student Mode work for academic writing?",
      answer: "Student Mode provides features specifically designed for academic writing: essay grade estimation based on word count (A, B, C, D grades), answer length indicators (short/medium/long), word limit checking for exams and assignments, and page count estimates for Word documents, Google Docs, and A4 paper formats."
    },
    {
      question: "What features are included in Creator Mode for content creators?",
      answer: "Creator Mode includes YouTube title SEO scoring (optimal length analysis), hook strength analysis for engaging introductions, hashtag counter for social media optimization, emoji counter, Instagram caption preview, and platform-specific character limit trackers. Perfect for YouTubers, influencers, and social media managers."
    },
    {
      question: "Can it detect passive voice in my writing?",
      answer: "Yes! Our advanced writing analysis detects passive voice constructions in your text and counts the instances. Passive voice patterns like 'was written', 'is being done', 'were made' are identified. This helps you write more active, engaging, and direct content that resonates better with readers."
    }
  ];

  // Trending keywords organized by category
  const trendingKeywords = {
    "Primary High-Volume Keywords": [
      "word counter", "character counter", "word count", "character count",
      "online word counter", "free word counter", "word counter online",
      "text counter", "letter counter", "word count tool"
    ],
    "Long-Tail Search Keywords": [
      "word counter for essays", "character counter for Twitter",
      "word count checker online free", "free word counter no signup required",
      "word counter with reading time calculator", "sentence counter online free",
      "word counter for students assignments", "professional word counter tool"
    ],
    "Platform-Specific Keywords": [
      "Twitter character counter 280", "Instagram caption character counter",
      "YouTube title character limit checker", "Facebook post character limit counter",
      "SMS character counter GSM Unicode", "SEO meta description character counter",
      "LinkedIn post character counter", "TikTok caption word counter"
    ],
    "Student and Academic Keywords": [
      "essay word counter for college", "word counter for students homework",
      "assignment word count checker", "thesis word counter tool",
      "academic word counter online", "homework word counter free",
      "dissertation word counter", "research paper word counter"
    ],
    "Content Creator Keywords": [
      "YouTube SEO word counter tool", "content creator word counter",
      "social media character counter", "hashtag counter Instagram",
      "video script word counter", "blog post word counter SEO",
      "copywriting word counter", "newsletter word counter"
    ],
    "Feature-Specific Keywords": [
      "reading time calculator online", "speaking time calculator for speeches",
      "readability score checker Flesch", "keyword density checker SEO",
      "passive voice detector online", "paragraph counter tool",
      "sentence counter analyzer", "page count estimator"
    ],
    "Multilingual Support Keywords": [
      "Hindi word counter online", "Nepali word counter tool",
      "Arabic word counter free", "Chinese character counter",
      "Unicode word counter", "emoji counter online",
      "Japanese word counter", "Korean character counter"
    ],
    "Action-Based Keywords": [
      "count words online free instantly", "check character count quickly",
      "calculate reading time online", "analyze text readability free",
      "count sentences paragraphs online", "check word limit for essay",
      "verify word count accuracy", "track character limit"
    ],
    "Comparison and Best Keywords": [
      "best word counter tool 2025", "word counter vs character counter difference",
      "most accurate word counter online", "word counter alternative to Microsoft Word",
      "word counter like Google Docs", "top free word counter websites"
    ],
    "Mobile and Device Keywords": [
      "word counter mobile app free", "word counter for iPhone iPad",
      "word counter Android app", "word counter on phone browser",
      "mobile character counter", "tablet word counter tool"
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
    "name": "AnyFile Flow Ultra Advanced Word Counter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Aman Rauniyar"
    },
    "description": "Ultra-advanced free online word counter with character count, reading time calculator, Flesch readability score, keyword density analyzer, passive voice detector, and platform-specific limits for Twitter, Instagram, YouTube, Facebook, and more. Features Student Mode and Creator Mode.",
    "featureList": [
      "Real-time word counting",
      "Character count with and without spaces",
      "Sentence and paragraph counting",
      "Line and page count estimation",
      "Reading time calculation (average and slow reader)",
      "Speaking time calculation for speeches",
      "Flesch readability score analysis",
      "Platform character limits (Twitter, Instagram, YouTube, Facebook, SMS)",
      "Keyword density analysis with top keywords",
      "Passive voice detection",
      "Multilingual support (Hindi, Nepali, Arabic, Chinese, 50+ languages)",
      "Emoji counter",
      "Student Mode with essay grading",
      "Creator Mode with YouTube SEO scoring",
      "100% privacy - no data uploaded",
      "Works offline (PWA)",
      "Dark mode and light mode",
      "Mobile-responsive design"
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Use the Ultra Advanced Word Counter Tool",
    "description": "Count words, characters, sentences, analyze text readability, check platform limits, and improve your writing in seconds",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter or paste your text into the editor",
        "text": "Type directly or paste your text into the large input area. Word counting and analysis happens in real-time as you type—no button click needed."
      },
      {
        "@type": "HowToStep",
        "name": "View instant comprehensive statistics",
        "text": "See word count, character count (with and without spaces), sentence count, paragraph count, line count, page count, reading time, and speaking time instantly updated."
      },
      {
        "@type": "HowToStep",
        "name": "Check platform-specific character limits",
        "text": "Monitor character limits for Twitter (280), Instagram (2,200), YouTube titles (100), YouTube descriptions (5,000), Facebook, SMS, and SEO meta tags with visual progress bars."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze writing quality and readability",
        "text": "Review Flesch readability score, keyword density with top keywords, passive voice detection count, and overused words warnings to improve your writing quality."
      },
      {
        "@type": "HowToStep",
        "name": "Switch between Standard, Student, and Creator modes",
        "text": "Use Student Mode for academic features like essay grading, or Creator Mode for YouTube SEO scoring and social media optimization features."
      },
      {
        "@type": "HowToStep",
        "name": "Copy text or share your statistics",
        "text": "Copy your text with one click, reset the editor, or share your word statistics with others."
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

      <div className="mt-12 space-y-16">
        {/* Introduction Section */}
        <section aria-labelledby="intro" className="prose prose-lg max-w-none dark:prose-invert">
          <h2 id="intro" className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            The Most Comprehensive Word Counter Tool Available Online
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to AnyFile Flow's <strong>Ultra Advanced Word Counter</strong>—the most feature-rich, privacy-focused, 
            and user-friendly text analysis tool available online in 2025. Whether you're a student working on an essay, 
            a content creator optimizing YouTube titles, a copywriter checking character limits, or a professional writer 
            analyzing readability, our tool provides everything you need in one place.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Unlike basic word counters that only show word and character counts, our ultra-advanced tool provides 
            <strong> real-time analysis</strong> including reading time calculations, Flesch readability scoring, 
            keyword density analysis, passive voice detection, and platform-specific character limit tracking for 
            Twitter, Instagram, YouTube, Facebook, SMS, and SEO meta tags. Plus, specialized <strong>Student Mode</strong> and 
            <strong> Creator Mode</strong> provide tailored features for academic writing and content creation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Best of all, everything runs <strong>100% locally in your browser</strong>. Your text never leaves your device, 
            ensuring complete privacy and security. No registration, no uploads, no tracking—just powerful text analysis 
            at your fingertips, even when you're offline.
          </p>
        </section>

        {/* How to Use Section */}
        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            How to Use the Ultra Advanced Word Counter
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { 
                step: "1", 
                title: "Enter Your Text", 
                desc: "Type directly into the editor or paste your text from any source. The counting and analysis begins instantly in real-time—no button clicks required.",
                icon: PenTool
              },
              { 
                step: "2", 
                title: "View Comprehensive Statistics", 
                desc: "See all your metrics instantly: word count, character count (with and without spaces), sentences, paragraphs, lines, pages, reading time, speaking time, and more.",
                icon: BarChart3
              },
              { 
                step: "3", 
                title: "Analyze, Optimize, and Share", 
                desc: "Check readability scores, review keyword density, monitor platform limits, switch between modes, and copy or share your statistics.",
                icon: Share2
              }
            ].map(item => (
              <Card key={item.step} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mx-auto mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Core Features Section - Detailed */}
        <section aria-labelledby="core-features">
          <h2 id="core-features" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Hash className="h-8 w-8 text-primary" />
            Core Counting Features - Essential Text Metrics
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our word counter provides all the fundamental text metrics you need, calculated in real-time as you type. 
            These core features form the foundation of professional text analysis.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Type className="h-6 w-6 text-primary" />
                  Character Count (With and Without Spaces)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get precise character counts displayed in two formats: total characters including all spaces, 
                  and characters excluding spaces. This dual counting is essential for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Social media platforms that count characters differently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>SEO meta descriptions and title tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>SMS message length calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Academic assignments with character limits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Word Count - Accurate and Instant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our word counting algorithm accurately identifies words across all languages, handling:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Hyphenated words (counted as single words)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Contractions (it's, don't, won't)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Numbers and alphanumeric combinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Unicode characters in all languages</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Sentence and Paragraph Counting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Accurately counts sentences by detecting proper sentence endings (periods, exclamation marks, 
                  question marks) and paragraphs by identifying text blocks separated by line breaks. Useful for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Maintaining consistent paragraph lengths</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Analyzing sentence variety and length</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Meeting academic paragraph requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Line Count and Page Count Estimation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Counts individual lines in your text and estimates page counts based on standard document formats:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Microsoft Word standard (250 words per page)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>A4 paper format estimation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Google Docs standard formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Academic double-spaced format</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Limits Section - Detailed */}
        <section aria-labelledby="platform-limits">
          <h2 id="platform-limits" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Platform-Specific Character Limit Trackers
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            One of our most loved features! Track character limits for all major social media platforms and SEO requirements 
            in real-time. Visual progress bars show your usage, and colors change to warn you when approaching or exceeding limits.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">𝕏</span>
                  Twitter/X Character Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>Limit: 280 characters</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Track every character for your tweets. The progress bar turns yellow when you're at 80% 
                  and red when you exceed 280 characters, helping you craft the perfect tweet.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">📸</span>
                  Instagram Caption Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>Limit: 2,200 characters</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Optimize your Instagram captions with our character tracker. Perfect for influencers, 
                  brands, and anyone who wants to maximize engagement without hitting the limit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">▶️</span>
                  YouTube Title Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>Limit: 100 characters</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Craft SEO-optimized YouTube titles that don't get cut off in search results. 
                  We recommend keeping titles under 60 characters for best visibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">📺</span>
                  YouTube Description Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>Limit: 5,000 characters</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Write comprehensive video descriptions with keywords, timestamps, and links 
                  while staying within YouTube's generous 5,000 character limit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">📱</span>
                  SMS Message Counter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>GSM: 160 chars | Unicode: 70 chars</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Calculates SMS segment counts for both GSM-7 encoding (standard characters) and 
                  Unicode (emojis, special characters). Essential for SMS marketing campaigns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">🔍</span>
                  SEO Meta Tags Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  <strong>Title: 60 chars | Description: 160 chars</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Optimize your meta titles and descriptions for Google search results. 
                  Stay within recommended limits to prevent truncation in SERPs.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Advanced Analysis Section */}
        <section aria-labelledby="advanced-analysis">
          <h2 id="advanced-analysis" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Advanced Text Analysis and Writing Quality Features
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Go beyond basic counting with our advanced text analysis features. These tools help you understand 
            not just how much you've written, but how well you've written it.
          </p>

          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="h-6 w-6 text-primary" />
                  Reading Time and Speaking Time Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Estimate how long it will take someone to read or speak your text aloud. We use industry-standard 
                  rates that match what major platforms like Medium and LinkedIn use:
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">200 WPM</div>
                    <div className="text-sm text-muted-foreground">Average Reading Speed</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">150 WPM</div>
                    <div className="text-sm text-muted-foreground">Slow/Careful Reading</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">130 WPM</div>
                    <div className="text-sm text-muted-foreground">Speaking Time</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Perfect for bloggers estimating article read times, presenters timing speeches, 
                  YouTubers planning video scripts, and podcasters preparing episode content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Eye className="h-6 w-6 text-primary" />
                  Flesch Readability Score Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Flesch Reading Ease Score is a proven formula that measures how easy your text is to understand. 
                  Our tool calculates this score in real-time and provides interpretation:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-center">
                    <div className="font-bold text-green-600 dark:text-green-400">90-100</div>
                    <div className="text-xs text-muted-foreground">Very Easy (5th Grade)</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg text-center">
                    <div className="font-bold text-blue-600 dark:text-blue-400">60-70</div>
                    <div className="text-xs text-muted-foreground">Standard (8th-9th Grade)</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg text-center">
                    <div className="font-bold text-yellow-600 dark:text-yellow-400">30-50</div>
                    <div className="text-xs text-muted-foreground">Difficult (College)</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-center">
                    <div className="font-bold text-red-600 dark:text-red-400">0-30</div>
                    <div className="text-xs text-muted-foreground">Very Difficult (Graduate)</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Use this to ensure your content matches your target audience. Web content typically scores best 
                  between 60-70, while academic writing may be 30-50.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Keyword Density Analyzer for SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our keyword density analyzer identifies your most frequently used words and calculates 
                  their percentage of total content. This is essential for SEO optimization:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span><strong>Top Keywords Display:</strong> See your most used words ranked by frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span><strong>Density Percentage:</strong> Calculate exact keyword density for SEO optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span><strong>Stop Words Filtered:</strong> Common words like "the", "and", "is" are excluded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span><strong>SEO Best Practice:</strong> Aim for 1-3% density to avoid keyword stuffing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Passive Voice Detection and Writing Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Active voice makes your writing more direct, engaging, and easier to read. Our tool 
                  automatically detects passive voice constructions like "was written", "is being done", 
                  "were made" and counts them:
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-destructive mb-2">❌ Passive Voice</div>
                      <p className="text-sm text-muted-foreground italic">"The report was written by the team."</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary mb-2">✅ Active Voice</div>
                      <p className="text-sm text-muted-foreground italic">"The team wrote the report."</p>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Aim to keep passive voice under 10% of your sentences for more engaging, action-oriented writing.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Mode Section */}
        <section aria-labelledby="student-mode">
          <h2 id="student-mode" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Student Mode - Academic Writing Features
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Designed specifically for students, teachers, and academics. Student Mode provides specialized 
            features for essays, assignments, theses, dissertations, and exam preparation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  Essay Grade Estimation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get an approximate grade estimation based on your essay's word count. While actual grades 
                  depend on content quality, meeting word count requirements is often a key criterion:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="font-medium">A Grade</span>
                    <span className="text-muted-foreground">1,000+ words</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="font-medium">B Grade</span>
                    <span className="text-muted-foreground">750-999 words</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="font-medium">C Grade</span>
                    <span className="text-muted-foreground">500-749 words</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="font-medium">D Grade</span>
                    <span className="text-muted-foreground">Under 500 words</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-500" />
                  Answer Length Indicator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Quickly gauge if your answer is short, medium, or long for exam and assignment questions:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">Short</Badge>
                    <span className="text-sm text-muted-foreground">Under 100 words - brief answers, definitions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Medium</Badge>
                    <span className="text-sm text-muted-foreground">100-300 words - paragraph responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">Long</Badge>
                    <span className="text-sm text-muted-foreground">300+ words - essay-style answers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                  Academic Page Count Estimation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Know exactly how many pages your work will be when printed or submitted:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Microsoft Word format (250 words/page, single-spaced)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Google Docs standard formatting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>A4 paper format with standard margins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Double-spaced academic format (125 words/page)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Timer className="h-6 w-6 text-blue-500" />
                  Exam Word Limit Checker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Many exams and assignments have strict word limits. Our tool helps you:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Track progress toward word count requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Get warnings when approaching limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>See exactly how many words over/under you are</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <span>Plan writing based on remaining word budget</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Creator Mode Section */}
        <section aria-labelledby="creator-mode">
          <h2 id="creator-mode" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Creator Mode - Content Creation Features
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Tailored for YouTubers, influencers, content creators, and social media managers. Creator Mode 
            provides specialized features to optimize your content for maximum engagement and reach.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-red-500" />
                  YouTube Title SEO Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get a real-time SEO score for your YouTube video titles based on length optimization. 
                  Titles that are too short miss keywords; too long gets truncated in search results.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Optimal Length</span>
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">50-60 characters</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Maximum Length</span>
                    <Badge variant="outline">100 characters</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  Our score considers character count, word count, and keyword positioning to help you 
                  craft titles that rank higher and get more clicks.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-red-500" />
                  Hook Strength Meter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  The first few words of your content are crucial for grabbing attention. Our Hook Strength 
                  Meter analyzes your opening to predict engagement potential:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Analyzes opening sentence impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Detects power words and emotion triggers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Scores from 0-100% for hook effectiveness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Provides suggestions for stronger hooks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Hash className="h-6 w-6 text-red-500" />
                  Hashtag Counter and Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Automatically counts and tracks hashtags in your content. Essential for Instagram, 
                  Twitter, TikTok, and LinkedIn posts:
                </p>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-500">Instagram</div>
                      <div className="text-sm text-muted-foreground">Max 30 hashtags</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">Twitter</div>
                      <div className="text-sm text-muted-foreground">2-3 optimal</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Smile className="h-6 w-6 text-red-500" />
                  Emoji Counter and Unicode Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track emoji usage in your content. Emojis can boost engagement but overuse can appear 
                  unprofessional:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Counts all emojis accurately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Handles multi-byte Unicode characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Shows emoji percentage of content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <span>Helps balance emoji usage</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Multilingual Support Section */}
        <section aria-labelledby="multilingual">
          <h2 id="multilingual" className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            Multilingual Support - 50+ Languages Worldwide
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our word counter works with any language in the world. Whether you're writing in English, Hindi, 
            Nepali, Arabic, Chinese, Japanese, Korean, Russian, or any other language, our tool accurately 
            counts words and characters.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { lang: "Hindi (हिन्दी)", script: "Devanagari" },
              { lang: "Nepali (नेपाली)", script: "Devanagari" },
              { lang: "Arabic (العربية)", script: "Arabic RTL" },
              { lang: "Chinese (中文)", script: "Hanzi" },
              { lang: "Japanese (日本語)", script: "Hiragana/Kanji" },
              { lang: "Korean (한국어)", script: "Hangul" },
              { lang: "Russian (Русский)", script: "Cyrillic" },
              { lang: "Thai (ไทย)", script: "Thai Script" }
            ].map(item => (
              <Card key={item.lang}>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold mb-1">{item.lang}</div>
                  <div className="text-xs text-muted-foreground">{item.script}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-secondary/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Unicode and Special Character Support
            </h3>
            <p className="text-muted-foreground mb-4">
              Our tool uses advanced Unicode processing to correctly handle:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Right-to-left languages (Arabic, Hebrew)",
                "Complex scripts (Thai, Devanagari, Tamil)",
                "Emoji and emoticons 😀🎉",
                "Mathematical symbols and special characters",
                "Combining characters and diacritics",
                "Zero-width characters and joiners"
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy and Security Section */}
        <section aria-labelledby="privacy" className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 p-8 rounded-xl">
          <h2 id="privacy" className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-500" />
            100% Privacy Protected - Your Text Never Leaves Your Browser
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Unlike many online tools that upload your text to servers for processing, our Ultra Advanced 
            Word Counter runs entirely in your browser. This means complete privacy for sensitive documents, 
            personal writing, and confidential content.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="p-4 text-center">
                <Lock className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Server Uploads</h3>
                <p className="text-xs text-muted-foreground">100% client-side processing</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Registration</h3>
                <p className="text-xs text-muted-foreground">No account or login required</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Tracking</h3>
                <p className="text-xs text-muted-foreground">No cookies tracking your content</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4 text-center">
                <Wifi className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Works Offline</h3>
                <p className="text-xs text-muted-foreground">PWA - works without internet</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-600 dark:text-green-400">
              "100% Privacy Guaranteed – Your text never leaves your browser"
            </span>
          </div>
        </section>

        {/* Use Cases Section */}
        <section aria-labelledby="use-cases">
          <h2 id="use-cases" className="text-3xl font-bold mb-8">Who Uses Our Ultra Advanced Word Counter?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                  Students and Academics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm mb-4">
                  From high school essays to PhD dissertations, students trust our tool for accurate word counts 
                  and academic writing assistance.
                </p>
                {[
                  "Essay and assignment word count tracking",
                  "Thesis and dissertation page estimation",
                  "Exam answer length verification",
                  "Research paper readability analysis",
                  "Academic grade estimation based on length"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-red-500" />
                  Content Creators and YouTubers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm mb-4">
                  Optimize your content for maximum engagement with our Creator Mode features designed for 
                  social media success.
                </p>
                {[
                  "YouTube title SEO optimization",
                  "Instagram caption character limits",
                  "Twitter post character counting",
                  "Video script speaking time estimation",
                  "Hashtag and emoji tracking"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-red-500" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-orange-500" />
                  SEO Specialists and Digital Marketers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm mb-4">
                  Optimize your content for search engines with keyword density analysis and readability scoring.
                </p>
                {[
                  "Meta title and description character limits",
                  "Keyword density analysis for SEO",
                  "Content readability scoring",
                  "Competitive content length analysis",
                  "Blog post optimization"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-500" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <PenTool className="h-6 w-6 text-purple-500" />
                  Professional Writers and Editors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm mb-4">
                  Polish your writing with advanced analysis features that help identify areas for improvement.
                </p>
                {[
                  "Manuscript word tracking",
                  "Passive voice detection and reduction",
                  "Overused word identification",
                  "Reading time estimation for articles",
                  "Readability scoring for target audiences"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq">
          <h2 id="faq" className="text-3xl font-bold mb-8">Frequently Asked Questions About Word Counter</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trending Keywords Section */}
        <section aria-labelledby="keywords" className="bg-secondary/30 p-8 rounded-xl">
          <h2 id="keywords" className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            Trending Search Keywords - Word Counter Tool
          </h2>
          <p className="text-muted-foreground mb-6">
            Discover the most searched terms related to word counting and text analysis. Our tool is optimized 
            for all these search queries:
          </p>
          
          <div className="space-y-6">
            {Object.entries(trendingKeywords).map(([category, keywords]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm text-primary mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="bg-background hover:bg-primary/10 transition-colors"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
            <span className="text-sm font-medium">
              📊 {Object.values(trendingKeywords).flat().length}+ Trending Keywords Across{" "}
              {Object.keys(trendingKeywords).length} Categories
            </span>
          </div>
        </section>

        {/* Final CTA Section */}
        <section aria-labelledby="cta" className="text-center py-8">
          <h2 id="cta" className="text-2xl font-bold mb-4">
            Start Using the Ultra Advanced Word Counter Now
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join millions of users worldwide who trust AnyFile Flow for accurate word counting and advanced 
            text analysis. Free forever, no registration required, 100% private.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Zap className="h-4 w-4 mr-2" />
              Real-Time Counting
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Shield className="h-4 w-4 mr-2" />
              100% Private
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Globe className="h-4 w-4 mr-2" />
              50+ Languages
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Monitor className="h-4 w-4 mr-2" />
              Works Offline
            </Badge>
          </div>
        </section>
      </div>
    </>
  );
};

export default WordCounterSeoContent;
