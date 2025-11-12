'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  MessageCircle
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your queries',
      contact: 'support@myark.com',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri, 9AM-6PM',
      contact: '+1 (555) 123-4567',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our office location',
      contact: '123 Education St, San Francisco, CA',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'Available to help',
      contact: 'Mon-Fri: 9AM-6PM PST',
      color: 'from-orange-400 to-orange-600',
    },
  ];

  const quickLinks = [
    { icon: HelpCircle, title: 'FAQs', description: 'Find quick answers', href: '/faq' },
    { icon: FileQuestion, title: 'Help Center', description: 'Browse help articles', href: '/help' },
    { icon: MessageCircle, title: 'Live Chat', description: 'Chat with support', href: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 border-b">
          <div className="container mx-auto px-4 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help! Reach out to us through any of these channels.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you within 24 hours
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 font-medium">
                    Message sent successfully! We'll respond soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="opportunity">Opportunity Related</SelectItem>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-foreground dark:text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{method.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                          <p className="text-sm font-medium">{method.contact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm">{link.title}</h4>
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Check our FAQ section for instant answers to common questions.
                </p>
                <Button variant="outline" className="w-full">
                  Visit FAQ
                </Button>
              </Card>
            </div>
          </div>

          {/* Map Section (Placeholder) */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Our Location</h3>
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground">Map placeholder</p>
                <p className="text-sm text-muted-foreground">123 Education Street, San Francisco, CA 94102</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
