import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DisclaimerPage = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - AnyFile Flow</title>
        <meta name="description" content="Read our disclaimer to understand the limitations and responsibilities when using AnyFile Flow's online tools." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://anyfileflow.com/disclaimer" />
        <meta property="og:title" content="Disclaimer - AnyFile Flow" />
        <meta property="og:description" content="Read our disclaimer for using AnyFile Flow's online tools." />
        <meta property="og:url" content="https://anyfileflow.com/disclaimer" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
            <h1>Disclaimer</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>1. General Information</h2>
            <p>
              The information and tools provided on AnyFile Flow are for general informational and 
              utility purposes only. While we strive to keep the information up to date and accurate, 
              we make no representations or warranties of any kind, express or implied, about the 
              completeness, accuracy, reliability, suitability, or availability of the tools or 
              information contained on the website.
            </p>

            <h2>2. File Processing Disclaimer</h2>
            <p>
              All file processing on AnyFile Flow is performed locally in your web browser using 
              client-side JavaScript. This means:
            </p>
            <ul>
              <li>Your files are not uploaded to any external server</li>
              <li>Processing speed depends on your device's capabilities</li>
              <li>Results may vary based on file type, size, and complexity</li>
              <li>We cannot guarantee specific output quality for all files</li>
            </ul>

            <h2>3. No Professional Advice</h2>
            <p>
              The tools and information on this website do not constitute professional advice. 
              For specific needs regarding file formats, data security, or technical requirements, 
              please consult with appropriate professionals.
            </p>

            <h2>4. Health Calculator Disclaimer</h2>
            <p>
              The health and fitness calculators provided on this website (BMI, BMR, calorie calculators, etc.) 
              are for informational purposes only and are not intended to be a substitute for professional 
              medical advice, diagnosis, or treatment. Always seek the advice of your physician or other 
              qualified health provider with any questions you may have regarding a medical condition.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned or 
              controlled by AnyFile Flow. We have no control over and assume no responsibility for 
              the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event will we be liable for any loss or damage including without limitation, 
              indirect or consequential loss or damage, or any loss or damage whatsoever arising 
              from loss of data or profits arising out of, or in connection with, the use of this website.
            </p>

            <h2>7. Accuracy of Results</h2>
            <p>
              While we strive to provide accurate tools and converters, we cannot guarantee 100% 
              accuracy in all cases. Users should verify critical results independently, especially 
              for professional or commercial use.
            </p>

            <h2>8. Service Availability</h2>
            <p>
              We do not guarantee that the website will be available at all times. We may experience 
              hardware, software, or other problems or need to perform maintenance related to the site, 
              resulting in interruptions, delays, or errors.
            </p>

            <h2>9. Contact</h2>
            <p>
              If you have any questions about this Disclaimer, please contact us at:
            </p>
            <ul>
              <li>Email: info@anyfileflow.com</li>
              <li>Founder: Aman Rauniyar</li>
            </ul>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DisclaimerPage;
