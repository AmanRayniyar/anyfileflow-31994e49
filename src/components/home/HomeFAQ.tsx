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
    answer: "AnyFile Flow is a free online platform offering 200+ file, image, audio, video, and productivity tools. You can convert, compress, edit, and generate files instantly in your browser."
  },
  {
    question: "Is AnyFile Flow free to use?",
    answer: "Yes. Every tool on AnyFile Flow is completely free with no hidden charges, no premium plans, and no registration required."
  },
  {
    question: "Are my files safe and secure?",
    answer: "Absolutely. Your files never leave your device. All conversions happen locally inside your browser, ensuring 100% privacy and security."
  },
  {
    question: "Do you store or save any uploaded files?",
    answer: "No. We do not store, upload, track, or access your files. Everything is processed instantly and deleted automatically after use."
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer: "No signup is required. All tools work instantly for everyone without login."
  },
  {
    question: "How many tools does AnyFile Flow offer?",
    answer: "We currently offer 200+ free tools, including image converters, PDF tools, text utilities, audio/video processors, AI tools, and productivity tools — with new tools added every week."
  },
  {
    question: "Does AnyFile Flow work on mobile devices?",
    answer: "Yes. All tools are mobile-friendly and optimized for Android, iPhone, and tablets. No app installation needed."
  },
  {
    question: "Are there any usage limits?",
    answer: "No limits. You can use AnyFile Flow as many times as you want with unlimited conversions."
  },
  {
    question: "What types of files can I convert?",
    answer: "You can convert images (JPG, PNG, WebP, HEIC), PDFs, documents, audio, video, text formats, and more. The platform supports hundreds of file types."
  },
  {
    question: "How fast are file conversions?",
    answer: "Conversions happen instantly thanks to WebAssembly-powered processing. Most tasks finish in less than one second."
  },
  {
    question: "Does AnyFile Flow add watermarks to files?",
    answer: "No. All outputs are watermark-free unless you intentionally add a watermark using the watermark tool."
  },
  {
    question: "Can I use AnyFile Flow for commercial or professional work?",
    answer: "Yes. All tools are free for personal, professional, commercial, school, and corporate use."
  },
  {
    question: "How often are new tools added?",
    answer: "New tools are added every week, based on user requests and trending needs."
  },
  {
    question: "Why should I choose AnyFile Flow over other sites?",
    answer: "Because you get: 200+ tools in one place, Free forever, No login, No ads that interrupt work, Instant secure device-side processing, AI-powered assistance, and a Modern clean UI."
  },
  {
    question: "Who is the founder of AnyFile Flow?",
    answer: "AnyFile Flow is founded by Aman Rauniyar, a developer building global tools for everyone."
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
                Everything you need to know about AnyFile Flow and our 200+ free online tools
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
