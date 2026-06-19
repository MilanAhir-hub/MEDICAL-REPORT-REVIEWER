import Logo from "./Logo";
import { Mail, Shield, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-canvas border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-ink-subtle leading-relaxed max-w-xs">
              An AI-powered platform that helps patients understand medical reports through simplified explanations and clear insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#how-it-works" className="text-sm text-ink-subtle hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-ink-subtle hover:text-primary transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-ink-subtle hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <a href="mailto:support@lablens.com" className="text-sm text-ink-subtle hover:text-primary transition-colors flex items-center gap-2">
                <Mail size={16} />
                support@lablens.com
              </a>
              <p className="text-sm text-ink-subtle">
                We're here to help you understand your health better.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-hairline pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-ink-tertiary">
              &copy; {new Date().getFullYear()} LabLens. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-ink-tertiary hover:text-ink-subtle transition-colors">
                Terms of Service
              </a>
              <div className="h-4 w-px bg-hairline"></div>
              <a href="#" className="text-sm text-ink-tertiary hover:text-ink-subtle transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
