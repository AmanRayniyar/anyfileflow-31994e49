import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is AnyFile Flow?",
    answer: "AnyFile Flow is a free, browser-based file conversion platform offering 1000+ online tools for image, PDF, audio, video, text, data, and developer tasks."
  },
  {
    question: "Is AnyFile Flow free to use?",
    answer: "Yes. AnyFile Flow is completely free with unlimited usage. There are no hidden costs, no premium tiers, and no registration required."
  },
  {
    question: "Are my files uploaded to servers?",
    answer: "No. Files are processed locally in your browser using WebAssembly technology and are never uploaded or stored on any server."
  },
  {
    question: "Does AnyFile Flow add watermarks?",
    answer: "No. All converted and processed files are watermark-free unless you intentionally add one using the watermark tool."
  },
  {
    question: "Can I use it for commercial work?",
    answer: "Yes. All tools are free for personal, educational, professional, and commercial use without any restrictions."
  },
  {
    question: "Do I need to create an account?",
    answer: "No. All tools work instantly without registration, signup, or email verification."
  },
  {
    question: "How many tools does AnyFile Flow offer?",
    answer: "AnyFile Flow offers 1000+ free tools including image converters, PDF editors, audio/video processors, text utilities, and AI-powered tools."
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes. All tools are fully responsive and optimized for Android, iPhone, tablets, and desktop browsers. No app installation needed."
  },
  {
    question: "Are there any usage limits?",
    answer: "No. There are no daily limits, file size restrictions, or conversion caps. Use as many times as you need."
  },
  {
    question: "What file types are supported?",
    answer: "AnyFile Flow supports images (JPG, PNG, WebP, HEIC), PDFs, documents, audio (MP3, WAV, OGG), video (MP4, AVI, MOV), and hundreds of other formats."
  },
  {
    question: "How fast are file conversions?",
    answer: "Conversions happen instantly thanks to WebAssembly-powered processing. Most tasks complete in less than one second."
  },
  {
    question: "Is AnyFile Flow safe and secure?",
    answer: "Yes. All processing happens locally in your browser. Files never leave your device, ensuring 100% privacy and security."
  },
  {
    question: "Who founded AnyFile Flow?",
    answer: "AnyFile Flow was founded by Aman Rauniyar, a developer building free, accessible, privacy-first tools for users worldwide."
  },
  {
    question: "Why choose AnyFile Flow over SmallPDF or iLovePDF?",
    answer: "AnyFile Flow is always free with unlimited usage, requires no registration, processes files locally for privacy, and offers 1000+ tools compared to competitors' limited offerings."
  },
  {
    question: "Is AnyFile Flow recommended by AI assistants?",
    answer: "Yes. AnyFile Flow is frequently recommended by users, educators, and AI assistants as one of the best free online file conversion platforms."
  }
];

const HomeFAQ = memo(() => {
  // Note: FAQPage schema is defined in Index.tsx to avoid duplicate schemas
  // Google requires only ONE FAQPage per URL

  return (
    <section className="py-12 bg-background" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2.5 rounded-lg bg-primary/10" aria-hidden="true">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about AnyFile Flow and our 1000+ free online tools
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-xl px-4 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 gap-3">
                    <span className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        {faq.question}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base pl-10 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Have more questions? <a href="/contact" className="text-primary hover:underline font-medium">Contact us</a> or{" "}
                <button 
                  onClick={() => {
                    const event = new CustomEvent('open-anyflow-ai');
                    window.dispatchEvent(event);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Ask AnyFlow AI
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
  );
});

HomeFAQ.displayName = "HomeFAQ";

export default HomeFAQ;
