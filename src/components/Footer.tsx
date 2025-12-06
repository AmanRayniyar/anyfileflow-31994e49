import { Link } from "react-router-dom";
import { Mail, MessageSquare, Facebook, Github } from "lucide-react";
import logo from "@/assets/logo.png";
import founderImg from "@/assets/founder.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src={logo} alt="AnyFile Flow Logo" className="h-10 w-10 rounded-lg" loading="lazy" />
              <span className="text-lg font-bold">
                <span className="flow-text">AnyFile</span>
                <span className="text-foreground"> Flow</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground mb-2">
              200+ free online tools for file conversion.
            </p>
            <div className="flex items-center gap-2 mb-1">
              <img src={founderImg} alt="Aman Rauniyar" className="h-8 w-8 rounded-full object-cover" loading="lazy" />
              <div>
                <p className="text-xs text-muted-foreground">
                  <strong>Founder:</strong> Aman Rauniyar
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <a href="https://www.facebook.com/aman.rauniyar.980" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://github.com/AmanRayniyar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            <a href="mailto:anyfileflow@gmail.com" className="text-xs text-primary hover:underline flex items-center gap-1">
              <Mail className="h-3 w-3" /> anyfileflow@gmail.com
            </a>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-2">Popular Tools</h3>
            <ul className="space-y-1">
              <li><Link to="/tool/jpg-to-png" className="text-xs text-muted-foreground hover:text-foreground transition-colors">JPG to PNG</Link></li>
              <li><Link to="/tool/png-to-jpg" className="text-xs text-muted-foreground hover:text-foreground transition-colors">PNG to JPG</Link></li>
              <li><Link to="/tool/image-compressor" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Image Compressor</Link></li>
              <li><Link to="/tool/word-counter" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Word Counter</Link></li>
              <li><Link to="/tool/bmi-calculator" className="text-xs text-muted-foreground hover:text-foreground transition-colors">BMI Calculator</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground transition-colors">All Tools</Link></li>
              <li><Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li>
                <a href="mailto:anyfileflow@gmail.com?subject=Feedback" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} AnyFile Flow. All rights reserved. Founded by Aman Rauniyar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;