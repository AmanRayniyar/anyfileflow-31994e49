import { Link } from "react-router-dom";
import { Mail, MessageSquare, Facebook, Github, Instagram } from "lucide-react";
import founderImg from "@/assets/founder.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3 min-h-0 inline-touch-target" aria-label="AnyFile Flow - Home">
              <img alt="" className="h-10 w-10 rounded-lg" width="40" height="40" loading="lazy" decoding="async" aria-hidden="true" src="/lovable-uploads/33a729e8-7326-4a49-8542-853fcab5bea3.png" />
              <span className="text-lg font-bold" aria-hidden="true">
                <span className="flow-text">AnyFile</span>
                <span className="text-foreground"> Flow</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mb-2">
              <strong>AnyFile Flow</strong> — also known as <strong>AnyFileFlow</strong> / <strong>Any File Flow</strong>. 200+ free online tools for file conversion.
            </p>
            <div className="flex items-center gap-2 mb-1">
              <img src={founderImg} alt="" className="h-8 w-8 rounded-full object-cover" width="32" height="32" loading="lazy" decoding="async" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">
                  <strong>Founder:</strong> Aman Rauniyar
                </p>
                <nav className="flex items-center gap-2 mt-1" aria-label="Founder social links">
                  <a href="https://www.facebook.com/aman.rauniyar.980" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit founder's Facebook profile">
                    <Facebook className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a href="https://github.com/AmanRayniyar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit founder's GitHub profile">
                    <Github className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a href="https://www.instagram.com/amanrauniyar2064/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Visit founder's Instagram profile">
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
            <a href="mailto:anyfileflow@gmail.com" className="text-xs text-primary hover:underline flex items-center gap-1">
              <Mail className="h-3 w-3" aria-hidden="true" /> anyfileflow@gmail.com
            </a>
          </div>

          {/* Tools */}
          <nav aria-label="Popular tools">
            <h2 className="font-semibold text-foreground text-sm mb-2">Popular Tools</h2>
            <ul className="space-y-1 list-none p-0" role="list">
              <li><Link to="/tool/jpg-to-png" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">JPG to PNG</Link></li>
              <li><Link to="/tool/png-to-jpg" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">PNG to JPG</Link></li>
              <li><Link to="/tool/image-compressor" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Image Compressor</Link></li>
              <li><Link to="/tool/word-counter" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Word Counter</Link></li>
              <li><Link to="/tool/bmi-calculator" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">BMI Calculator</Link></li>
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h2 className="font-semibold text-foreground text-sm mb-2">Quick Links</h2>
            <ul className="space-y-1 list-none p-0" role="list">
              <li><Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">All Tools</Link></li>
              <li><Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Blog</Link></li>
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">About Us</Link></li>
              <li><Link to="/brand" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">About Our Brand</Link></li>
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Contact Us</Link></li>
              <li>
                <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 inline-touch-target min-h-0">
                  <MessageSquare className="h-3 w-3" aria-hidden="true" /> Feedback
                </a>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h2 className="font-semibold text-foreground text-sm mb-2">Legal</h2>
            <ul className="space-y-1 list-none p-0" role="list">
              <li><Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-touch-target min-h-0">Disclaimer</Link></li>
            </ul>
          </nav>
        </div>

        {/* Brand SEO Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-center text-xs text-muted-foreground mb-2">
            <strong>AnyFile Flow</strong> is your trusted destination for free online file conversion. Whether you search for <em>AnyFileFlow</em>, <em>Any File Flow</em>, <em>anyfileflow</em>, or <em>any file flow</em> — you'll find the same powerful suite of 200+ tools designed to make file conversion simple and secure.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} <Link to="/brand" className="hover:text-primary transition-colors">AnyFile Flow</Link>. All rights reserved. Founded by Aman Rauniyar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;