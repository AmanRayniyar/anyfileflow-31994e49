import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - AnyFile Flow</title>
        <meta name="description" content="Read our terms of service to understand the rules and guidelines for using AnyFile Flow's online tools." />
        <link rel="canonical" href="https://anyfileflow.com/terms" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
            <h1>Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using AnyFile Flow ("the Service"), you accept and agree to be bound by 
              the terms and provisions of this agreement. If you do not agree to these terms, please 
              do not use our Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              AnyFile Flow provides free online tools for file conversion, image editing, audio processing, 
              video editing, and various other utilities. All processing is done locally in your browser.
            </p>

            <h2>3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Use the Service only for lawful purposes</li>
              <li>Not upload files that contain viruses or malicious code</li>
              <li>Not attempt to circumvent any security features</li>
              <li>Not use the Service to infringe on intellectual property rights</li>
              <li>Not use automated systems to access the Service excessively</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by AnyFile Flow 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>5. User Content</h2>
            <p>
              You retain all rights to files you process using our Service. Since processing happens 
              locally in your browser, your files are never uploaded to our servers.
            </p>

            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" and "as available" without any warranties of any kind, 
              either express or implied, including but not limited to:
            </p>
            <ul>
              <li>Implied warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Uninterrupted or error-free service</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall AnyFile Flow, its directors, employees, partners, agents, suppliers, 
              or affiliates be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including loss of profits, data, or other intangible losses.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility 
              to check the Terms periodically for changes. Your continued use of the Service following 
              the posting of any changes constitutes acceptance of those changes.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to its conflict of law provisions.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@anyfileflow.com</li>
              <li>Founder: Aman Rauniyar</li>
            </ul>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsPage;
