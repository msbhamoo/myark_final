import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const footerSections = [
    {
      title: 'Opportunities',
      links: [
        { label: 'Competitions', href: '/competitions' },
        { label: 'Scholarships', href: '/scholarships' },
        { label: 'Olympiads', href: '/olympiads' },
        { label: 'Workshops', href: '/workshops' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Practice Papers', href: '/practice' },
        { label: 'Study Materials', href: '/resources' },
        { label: 'Video Tutorials', href: '/tutorials' },
        { label: 'Sample Papers', href: '/sample-papers' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Report Issue', href: '/report' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About Myark', href: '/about' },
        { label: 'Our Mission', href: '/mission' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  return (
    <footer className="bg-[#071045] border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white font-bold text-2xl shadow-lg shadow-orange-500/25">
                M
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                MyArk
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your complete hub for K-12 learning, competitions, scholarships, and skill-building opportunities. 
              Empowering students to excel academically and beyond.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-orange-400 hover:text-orange-300 border border-white/10"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-pink-400 hover:text-pink-300 border border-white/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-purple-400 hover:text-purple-300 border border-white/10"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-blue-400 hover:text-blue-300 border border-white/10"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                Stay Updated
              </h3>
              <p className="text-gray-300">
                Subscribe to get notifications about new opportunities, exams, and resources.
              </p>
            </div>
            <div className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10"
              />
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-8 text-gray-300">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Mail className="h-5 w-5 text-orange-400" />
              <span>support@myark.com</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Phone className="h-5 w-5 text-pink-400" />
              <span>+91 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <MapPin className="h-5 w-5 text-purple-400" />
              <span>Jaipur, Rajasthan</span>
            </div>
          </div>
          <p className="text-gray-400">
            © 2024 MyArk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}