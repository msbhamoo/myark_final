"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-white/5 pt-10 md:pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">
                <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-display text-lg font-bold italic">Myark</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students to discover their potential through scholarships, competitions, and career guidance.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Explore', 'Careers', 'Blog', 'Rewards', 'Schools', 'Verify'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item === 'Verify' ? 'Verification Checklist' : item === 'About' ? 'About Us' : item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="font-bold mb-6">Opportunities</h4>
            <ul className="space-y-3">
              {['Scholarships', 'Competitions', 'Workshops', 'Olympiads', 'Internships'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold mb-6">Support</h4>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mt-0.5" />
              <span>support@myark.in</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mt-0.5" />
              <span>+91 (800) 123-4567</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span>Global Business Hub, Pune, Maharashtra</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Myark. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for Students
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
