import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOBreadcrumb, { generateSimpleBreadcrumbs } from "@/components/SEOBreadcrumb";

const EditorialPolicyPage = () => (
  <>
    <SEOHead
      title="Editorial Policy - AnyFile Flow"
      description="Learn about AnyFile Flow's editorial standards, content review methodology, and commitment to accurate, trustworthy information."
    />
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <SEOBreadcrumb items={generateSimpleBreadcrumbs("Editorial Policy")} />
        
        <h1 className="text-3xl font-bold text-foreground mb-6">Editorial Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: March 1, 2026</p>

        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Our Commitment to Quality</h2>
          <p>
            At AnyFile Flow, we are committed to providing accurate, unbiased, and helpful content. Every tool description, blog post, and guide published on our platform undergoes a rigorous review process to ensure factual accuracy and practical value.
          </p>

          <h2>Content Standards</h2>
          <ul>
            <li><strong>Accuracy:</strong> All technical claims are verified against official documentation and industry standards.</li>
            <li><strong>Objectivity:</strong> We do not accept paid placements or sponsored content that influences our tool recommendations.</li>
            <li><strong>Transparency:</strong> Any affiliate relationships or partnerships are clearly disclosed.</li>
            <li><strong>Timeliness:</strong> Content is regularly reviewed and updated to reflect current best practices.</li>
          </ul>

          <h2>Review Methodology</h2>
          <p>
            Our tool reviews and comparisons are based on hands-on testing by our editorial team. We evaluate tools based on:
          </p>
          <ul>
            <li>Functionality and feature completeness</li>
            <li>User experience and accessibility</li>
            <li>Performance and processing speed</li>
            <li>Privacy and security practices</li>
            <li>Output quality and format support</li>
          </ul>

          <h2>Author Credentials</h2>
          <p>
            Content is created and reviewed by experienced developers and digital media professionals. Our founder, Aman Rauniyar, oversees all editorial decisions and maintains the quality standards described in this policy.
          </p>

          <h2>Corrections Policy</h2>
          <p>
            If you find an error in our content, please contact us at <a href="mailto:anyfileflow@gmail.com" className="text-primary hover:underline">anyfileflow@gmail.com</a>. We take corrections seriously and will update content promptly when errors are identified.
          </p>

          <h2>Independence</h2>
          <p>
            AnyFile Flow operates independently. Our tool ratings are based on real user feedback and our own testing. We do not accept payment to influence ratings, reviews, or tool placements on our platform.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default EditorialPolicyPage;
