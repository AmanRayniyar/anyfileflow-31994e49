import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolFAQSectionProps {
  toolName: string;
  toolFrom: string;
  toolTo: string;
  toolDescription: string;
  customFAQs?: FAQItem[];
}

const generateFAQs = (
  toolName: string, 
  toolFrom: string, 
  toolTo: string, 
  toolDescription: string, 
  customFAQs?: FAQItem[]
): FAQItem[] => {
  const baseFAQs: FAQItem[] = [
    {
      question: `What is ${toolName} and how does it work?`,
      answer: `${toolName} is a free online tool by AnyFile Flow that ${toolDescription.toLowerCase()}. It works entirely in your browser using advanced algorithms, meaning your files never leave your device. Simply upload your file, adjust any settings if needed, and download the result instantly. No registration, no software installation required.`
    },
    {
      question: `Is ${toolName} completely free to use?`,
      answer: `Yes, ${toolName} is 100% free with no hidden costs, subscriptions, or premium features locked behind a paywall. You can use it unlimited times without creating an account. AnyFile Flow provides all 200+ tools completely free as part of our mission to make file conversion accessible to everyone.`
    },
    {
      question: `Is my data safe when using ${toolName}?`,
      answer: `Absolutely. Your privacy and security are our top priorities. All file processing happens locally in your browser - your files are never uploaded to our servers. Once you close the browser tab, all data is automatically deleted. We don't store, share, or have access to any of your files.`
    },
    {
      question: `What file types does ${toolName} support?`,
      answer: `${toolName} supports ${toolFrom.toUpperCase()} files as input and produces ${toolTo.toUpperCase()} output. The tool handles various file sizes and maintains optimal quality during the conversion process. For best results, ensure your source files are not corrupted and are in a standard format.`
    },
    {
      question: `Can I use ${toolName} on my mobile device?`,
      answer: `Yes! ${toolName} is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Whether you're using iOS, Android, Windows, Mac, or Linux, you can access and use this tool through any modern web browser without downloading any apps.`
    },
    {
      question: `How long does the conversion process take?`,
      answer: `The conversion speed depends on your file size and device processing power. Most files are processed within seconds. Larger files may take a bit longer. Since everything happens locally in your browser, faster devices will complete the process more quickly.`
    },
    {
      question: `Is there a file size limit for ${toolName}?`,
      answer: `There's no strict server-side file size limit since processing happens in your browser. However, very large files (over 50MB) may take longer to process depending on your device's memory and processing capabilities. For optimal performance, we recommend files under 20MB.`
    },
    {
      question: `Do I need to install any software to use ${toolName}?`,
      answer: `No installation required! ${toolName} runs entirely in your web browser. You don't need to download any software, plugins, or extensions. Just visit AnyFile Flow, select the tool, and start converting immediately. It works on Chrome, Firefox, Safari, Edge, and other modern browsers.`
    },
    {
      question: `Can I convert multiple files at once with ${toolName}?`,
      answer: `Yes, ${toolName} supports batch processing! You can upload and convert multiple files simultaneously, saving you time when working with many files. After processing, you can download all converted files individually or as a convenient ZIP archive.`
    },
    {
      question: `What if my conversion fails or produces unexpected results?`,
      answer: `If you encounter any issues, try these steps: 1) Ensure your source file isn't corrupted, 2) Try a smaller file size, 3) Clear your browser cache and try again, 4) Use a different browser. If problems persist, you can ask our AnyFlow AI assistant for help or contact us for support.`
    },
    {
      question: `Why should I choose AnyFile Flow over other online converters?`,
      answer: `AnyFile Flow offers several advantages: 100% free with no hidden fees, browser-based processing for maximum privacy, no account required, support for 200+ file conversion tools, fast processing speeds, mobile-friendly design, and our helpful AnyFlow AI assistant. We're committed to providing the best free file conversion experience.`
    },
    {
      question: `Does ${toolName} work offline?`,
      answer: `While you need an internet connection to initially load the page, once loaded, the core processing happens locally in your browser. However, for the best experience and to access all features including our AI assistant, we recommend staying online.`
    }
  ];

  return customFAQs ? [...baseFAQs, ...customFAQs] : baseFAQs;
};

const ToolFAQSection = ({ toolName, toolFrom, toolTo, toolDescription, customFAQs }: ToolFAQSectionProps) => {
  const faqs = generateFAQs(toolName, toolFrom, toolTo, toolDescription, customFAQs);

  return (
    <section className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mt-6" aria-labelledby="faq-section">
      <h2 id="faq-section" className="text-lg sm:text-xl font-bold text-foreground mb-4">
        Frequently Asked Questions about {toolName}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Find answers to common questions about using {toolName}. Can't find what you're looking for? Ask our AnyFlow AI assistant for help!
      </p>
      
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`}
            className="border border-border rounded-lg px-4 data-[state=open]:bg-secondary/30"
          >
            <AccordionTrigger className="text-sm sm:text-base font-medium text-left hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export { generateFAQs };
export type { FAQItem };
export default ToolFAQSection;
