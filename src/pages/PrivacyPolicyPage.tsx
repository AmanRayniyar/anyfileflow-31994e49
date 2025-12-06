import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - AnyFile Flow</title>
        <meta name="description" content="Read our privacy policy to understand how AnyFile Flow collects, uses, and protects your personal information." />
        <link rel="canonical" href="https://anyfileflow.com/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2024</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to AnyFile Flow ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website anyfileflow.com.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Files You Upload</h3>
            <p>
              All file processing is done directly in your browser using client-side JavaScript. 
              <strong> We do not upload your files to any server.</strong> Your files never leave your device, 
              ensuring complete privacy and security.
            </p>

            <h3>2.2 Automatically Collected Information</h3>
            <p>We may automatically collect certain information when you visit our website, including:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>IP address (anonymized)</li>
            </ul>

            <h2>3. Use of Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              These may include:
            </p>
            <ul>
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to understand how visitors use our site</li>
              <li>Preference cookies to remember your settings</li>
            </ul>

            <h2>4. Third-Party Services</h2>
            <h3>4.1 Google AdSense</h3>
            <p>
              We use Google AdSense to display advertisements. Google may use cookies to serve ads based 
              on your prior visits to our website or other websites.
            </p>

            <h3>4.2 Google Analytics</h3>
            <p>
              We use Google Analytics to analyze website traffic and usage patterns. This helps us 
              improve our services.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your 
              information. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Disable cookies through your browser settings</li>
            </ul>

            <h2>7. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13. We do not knowingly collect personal 
              information from children under 13.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@anyfileflow.com</li>
              <li>Founder: Aman Rauniyar</li>
            </ul>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
