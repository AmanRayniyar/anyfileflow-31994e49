import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb, { generateSimpleBreadcrumbs } from "@/components/SEOBreadcrumb";

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy - AnyFile Flow | AnyFileFlow"
        description="Read AnyFile Flow's privacy policy. Learn how we handle cookies, Google AdSense ads, analytics, and protect your data. Your files never leave your device."
        keywords="AnyFile Flow privacy policy, AnyFileFlow privacy, data protection, cookie policy, GDPR"
      />

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12" role="main">
          <SEOBreadcrumb items={generateSimpleBreadcrumbs("Privacy Policy")} />
          
          <article className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to AnyFile Flow ("we," "our," or "us"), also known as AnyFileFlow or Any File Flow. 
              We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website anyfileflow.com (the "Site").
              By using our Site, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Files You Process</h3>
            <p>
              All file processing is done directly in your browser using client-side JavaScript and WebAssembly.
              <strong> We do not upload your files to any server.</strong> Your files never leave your device, 
              ensuring complete privacy and security. Once you close the browser tab, all processed data is 
              automatically removed from memory.
            </p>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our Site, we may automatically collect certain information, including:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website or source</li>
              <li>IP address (anonymized for analytics)</li>
              <li>Device type (mobile, tablet, desktop)</li>
              <li>Screen resolution and viewport size</li>
            </ul>

            <h3>2.3 Information You Provide</h3>
            <p>
              When you contact us via email or through the contact form, we collect the information you provide, 
              such as your name, email address, and message content. This information is used solely to respond 
              to your inquiry and is not shared with third parties.
            </p>

            <h2>3. Use of Cookies & Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our Site. 
              When you first visit our Site, you will see a cookie consent banner allowing you to accept 
              or reject non-essential cookies. The types of cookies we use include:
            </p>
            
            <h3>3.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the Site to function properly. They include cookies for 
              remembering your theme preference (dark/light mode), language selection, and cookie consent status.
              These cannot be disabled.
            </p>
            
            <h3>3.2 Analytics Cookies</h3>
            <p>
              We use Google Analytics to understand how visitors use our Site. These cookies collect 
              aggregated, anonymized data about page views, session duration, and user demographics. 
              You can opt out of analytics cookies through our cookie consent banner or by installing 
              the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics Opt-out Browser Add-on</a>.
            </p>
            
            <h3>3.3 Advertising Cookies</h3>
            <p>
              We use Google AdSense to display advertisements on our Site. Google and its partners may 
              use cookies to serve ads based on your prior visits to our Site or other websites. These 
              cookies enable Google to display personalized advertising content. You can manage your 
              ad personalization preferences at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ads Settings</a>.
            </p>

            <h3>3.4 Managing Cookies</h3>
            <p>
              You can control cookies through our cookie consent banner, your browser settings, or 
              third-party opt-out tools. Please note that disabling certain cookies may affect your 
              experience on our Site. Most browsers allow you to block or delete cookies through 
              their settings menu.
            </p>

            <h2>4. Advertising</h2>
            
            <h3>4.1 Google AdSense</h3>
            <p>
              We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies 
              and web beacons to serve ads based on your interests. Google's use of advertising cookies 
              enables it and its partners to serve ads based on your visit to our Site and/or other sites 
              on the Internet. For more information about how Google uses data when you use our partners' 
              sites, please visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              Google's Privacy & Terms</a>.
            </p>
            
            <h3>4.2 Personalized vs Non-Personalized Ads</h3>
            <p>
              If you have accepted advertising cookies through our consent banner, you may see personalized 
              ads based on your browsing history. If you reject advertising cookies, you will still see 
              ads, but they will be non-personalized and not based on your interests or browsing behavior.
            </p>

            <h3>4.3 Ad Revenue</h3>
            <p>
              Revenue from advertising helps us maintain our platform and keep all 1000+ tools completely 
              free for all users. We carefully select ad placements to ensure they do not interfere with 
              your user experience.
            </p>

            <h2>5. Third-Party Services</h2>
            
            <h3>5.1 Google Analytics</h3>
            <p>
              We use Google Analytics to analyze website traffic and usage patterns. This service uses 
              cookies to collect anonymized data that helps us improve our Site and services. Google 
              Analytics data is retained for 26 months.
            </p>

            <h3>5.2 Google Tag Manager</h3>
            <p>
              We use Google Tag Manager to manage analytics and advertising tags on our Site. Google Tag 
              Manager does not collect personal information directly but facilitates the loading of other 
              third-party scripts.
            </p>

            <h3>5.3 Content Delivery Networks</h3>
            <p>
              We use content delivery networks (CDNs) to serve fonts, images, and other static assets 
              efficiently. These services may log access data such as IP addresses for security and 
              performance monitoring purposes.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your 
              information. Since all file processing happens in your browser, your files are never 
              transmitted over the internet, providing the highest level of data security. However, 
              no method of electronic transmission or storage is 100% secure, and we cannot guarantee 
              absolute security of data transmitted to or from our Site.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain automatically collected data (analytics) for a period of 26 months. Contact form 
              submissions are retained for as long as necessary to address your inquiry. Since we do not 
              collect or store your files, there is no file data to retain.
            </p>

            <h2>8. Your Rights (GDPR & CCPA)</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restriction:</strong> Request restriction of processing your data</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data for marketing purposes</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time through the cookie consent banner</li>
              <li><strong>Do Not Sell (CCPA):</strong> We do not sell personal information to third parties</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at the email address provided below.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Our Site is accessible globally. If you access our Site from outside the country where our 
              servers are located, your information may be transferred to, stored, and processed in a 
              different country. By using our Site, you consent to such transfers. We ensure appropriate 
              safeguards are in place to protect your data in accordance with applicable laws.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our Site is not intended for children under 13 (or under 16 in the European Economic Area). 
              We do not knowingly collect personal information from children. If we become aware that we 
              have collected personal information from a child, we will take steps to delete it promptly.
            </p>

            <h2>11. California Privacy Rights (CCPA)</h2>
            <p>
              California residents have additional rights under the California Consumer Privacy Act (CCPA). 
              We do not sell personal information. You have the right to know what personal information we 
              collect, request deletion, and not be discriminated against for exercising your privacy rights.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, and other factors. We will post the updated policy on this 
              page with a revised "Last updated" date. We encourage you to review this page periodically 
              for the latest information on our privacy practices.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, your data, or our privacy practices, 
              please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> anyfileflow@gmail.com</li>
              <li><strong>Website:</strong> <a href="https://anyfileflow.com/contact">anyfileflow.com/contact</a></li>
              <li><strong>Founder:</strong> Aman Rauniyar</li>
            </ul>
            <p>
              We aim to respond to all privacy-related inquiries within 30 days.
            </p>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
