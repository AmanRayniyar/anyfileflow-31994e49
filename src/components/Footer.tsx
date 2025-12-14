import { Link } from "react-router-dom";
import founderImg from "@/assets/founder.png";

// Inline SVG Icons
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3" aria-label="AnyFile Flow - Home">
              <img alt="" className="h-10 w-10 rounded-lg" width="40" height="40" loading="lazy" decoding="async" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeyiR2Gsfj8ovCgzUdcir5Bklumw5zL3asPJTUmJGDk7giKJ818wLusersNt4aIyF1p3Z7XgLKdqPdDcKF5fm4741RnzRswwFSYZFwhcHrchPB5QNdhyphenhyphenKqkGh0s9v9O4SfUvYkk9Hc0qpJgK0Of27xv7Y76aKEAr046NCaMgcBUb4dzon2VnwmNxnjYBDX/w643-h643-rw/cropped_circle_image.png" />
              <span className="text-lg font-bold">
                <span className="flow-text">AnyFile</span>
                <span className="text-foreground"> Flow</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mb-2">
              <strong>AnyFile Flow</strong> — 200+ free online tools for file conversion.
            </p>
            <div className="flex items-center gap-2 mb-1">
              <img src={founderImg} alt="" className="h-8 w-8 rounded-full object-cover" width="32" height="32" loading="lazy" decoding="async" />
              <div>
                <p className="text-xs text-muted-foreground"><strong>Founder:</strong> Aman Rauniyar</p>
                <nav className="flex items-center gap-1 mt-1" aria-label="Founder social media">
                  <a href="https://www.facebook.com/aman.rauniyar.980" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center inline-touch-target" aria-label="Aman Rauniyar on Facebook">
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                  <a href="https://github.com/AmanRayniyar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center inline-touch-target" aria-label="Aman Rauniyar on GitHub">
                    <GithubIcon className="h-5 w-5" />
                  </a>
                  <a href="https://www.instagram.com/amanrauniyar2064/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center inline-touch-target" aria-label="Aman Rauniyar on Instagram">
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </nav>
              </div>
            </div>
            <a href="mailto:anyfileflow@gmail.com" className="text-xs text-primary hover:underline flex items-center gap-1 py-2" aria-label="Email AnyFile Flow">
              <MailIcon className="h-4 w-4" aria-hidden="true" /> anyfileflow@gmail.com
            </a>
          </div>

          {/* Tools */}
          <nav aria-label="Popular tools">
            <h2 className="font-semibold text-foreground text-sm mb-2">Popular Tools</h2>
            <ul className="space-y-1">
              <li><Link to="/tool/jpg-to-png" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">JPG to PNG</Link></li>
              <li><Link to="/tool/png-to-jpg" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">PNG to JPG</Link></li>
              <li><Link to="/tool/image-compressor" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Image Compressor</Link></li>
              <li><Link to="/tool/word-counter" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Word Counter</Link></li>
              <li><Link to="/tool/bmi-calculator" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">BMI Calculator</Link></li>
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h2 className="font-semibold text-foreground text-sm mb-2">Quick Links</h2>
            <ul className="space-y-1">
              <li><Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">All Tools</Link></li>
              <li><Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Blog</Link></li>
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">About Us</Link></li>
              <li><Link to="/brand" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">About Our Brand</Link></li>
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Contact Us</Link></li>
              <li>
                <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 py-1.5 min-h-[44px]" aria-label="Send feedback email">
                  <MessageIcon className="h-4 w-4" aria-hidden="true" /> Feedback
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h2 className="font-semibold text-foreground text-sm mb-2">Legal</h2>
            <ul className="space-y-1">
              <li><Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-foreground py-1.5 inline-block min-h-[44px] flex items-center">Disclaimer</Link></li>
            </ul>
          </nav>
        </div>

        {/* Brand SEO Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-center text-xs text-muted-foreground mb-2">
            <strong>AnyFile Flow</strong> is your trusted destination for free online file conversion.
          </p>
          <p className="text-center text-xs font-medium text-foreground/80 mb-2">
            Built by developers. Trusted by users worldwide.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} <Link to="/brand" className="hover:text-primary">AnyFile Flow</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
