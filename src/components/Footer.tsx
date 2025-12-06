import { Link } from "react-router-dom";
import { Droplet, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flow-gradient rounded-lg p-2">
                <Droplet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="flow-text">AnyFile</span>
                <span className="text-foreground"> Flow</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              100+ free online tools for all your file conversion needs. Fast, secure, and easy to use.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Image Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Image Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/jpg-to-png" className="text-sm text-muted-foreground hover:text-foreground transition-colors">JPG to PNG</Link></li>
              <li><Link to="/tool/png-to-jpg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">PNG to JPG</Link></li>
              <li><Link to="/tool/image-compress" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Image Compressor</Link></li>
              <li><Link to="/tool/remove-bg" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Remove Background</Link></li>
            </ul>
          </div>

          {/* Document Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Document Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tool/pdf-to-word" className="text-sm text-muted-foreground hover:text-foreground transition-colors">PDF to Word</Link></li>
              <li><Link to="/tool/word-to-pdf" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Word to PDF</Link></li>
              <li><Link to="/tool/pdf-merge" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Merge PDF</Link></li>
              <li><Link to="/tool/pdf-compress" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compress PDF</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Tools</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} AnyFile Flow. All rights reserved. Made with ❤️ for the web.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;