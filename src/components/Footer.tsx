import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* AdSense-friendly spacing */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-[90px] bg-secondary/30 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
          Advertisement Space
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="AnyFile Flow Logo" className="h-12 w-12 rounded-lg" />
              <span className="text-xl font-bold">
                <span className="flow-text">AnyFile</span>
                <span className="text-foreground"> Flow</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              200+ free online tools for all your file conversion needs. Fast, secure, and easy to use.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Founded by:</strong> Aman Rauniyar
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@anyfileflow.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Image Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/jpg-to-png" className="text-sm text-muted-foreground hover:text-foreground transition-colors">JPG to PNG</Link></li>
              <li><Link to="/tool/png-to-jpg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">PNG to JPG</Link></li>
              <li><Link to="/tool/image-compressor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Image Compressor</Link></li>
              <li><Link to="/tool/background-remover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Remove Background</Link></li>
              <li><Link to="/tool/image-resizer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Image Resizer</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Tools</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} AnyFile Flow. All rights reserved. Founded by <strong>Aman Rauniyar</strong>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
