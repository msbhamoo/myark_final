'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  Search,
  BookOpen,
  Trophy,
  Award,
  FileText,
  User,
  CreditCard,
  Mail
} from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    { id: 'general', name: 'General', icon: HelpCircle, color: 'text-blue-500' },
    { id: 'opportunities', name: 'Opportunities', icon: Trophy, color: 'text-primary' },
    { id: 'practice', name: 'Practice & Papers', icon: FileText, color: 'text-green-500' },
    { id: 'scholarships', name: 'Scholarships', icon: Award, color: 'text-purple-500' },
    { id: 'account', name: 'Account', icon: User, color: 'text-pink-500' },
    { id: 'payment', name: 'Payment', icon: CreditCard, color: 'text-yellow-500' },
  ];

  const faqs = {
    general: [
      {
        question: 'What is Myark?',
        answer: 'Myark is a comprehensive learning platform for K-12 students that connects them with competitions, scholarships, practice resources, and skill-building opportunities. We help students discover and apply for opportunities that match their interests and academic goals.',
      },
      {
        question: 'Is Myark free to use?',
        answer: 'Yes, creating an account and browsing opportunities on Myark is completely free. Some competitions or events listed on our platform may have their own registration fees, which are clearly mentioned in the opportunity details.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign In" button in the top right corner, then select "Create Account". Fill in your details including name, email, grade, and password. You\'ll receive a verification email to activate your account.',
      },
      {
        question: 'Which grades can use Myark?',
        answer: 'Myark is designed for students in grades 6-12 (K-12). We have opportunities suitable for different grade levels, and you can filter by your grade to find relevant competitions and resources.',
      },
    ],
    opportunities: [
      {
        question: 'How do I find opportunities that match my interests?',
        answer: 'Use our search and filter features on the homepage or browse by category (Competitions, Scholarships, Olympiads, Workshops). You can filter by grade, subject, mode (online/offline), and deadline to find opportunities that fit your profile.',
      },
      {
        question: 'How do I register for an opportunity?',
        answer: 'Click on any opportunity card to view full details. On the opportunity detail page, you\'ll find a "Register Now" button that will guide you through the registration process. Some opportunities may redirect you to external registration portals.',
      },
      {
        question: 'Can I bookmark opportunities for later?',
        answer: 'Yes! Click the bookmark icon on any opportunity card or detail page to save it to your bookmarks. You can access all your bookmarked opportunities from your dashboard.',
      },
      {
        question: 'How are deadlines displayed?',
        answer: 'Each opportunity shows a registration deadline with a countdown timer. We also send reminder notifications for opportunities you\'ve bookmarked as their deadlines approach.',
      },
    ],
    practice: [
      {
        question: 'What practice resources are available?',
        answer: 'We offer past papers from various competitions and exams, model test papers (both solved and unsolved), interactive quizzes, and downloadable PDFs. You can filter by subject, grade, and difficulty level.',
      },
      {
        question: 'How does progress tracking work?',
        answer: 'When you complete practice papers or quizzes, your scores are automatically recorded. You can view your performance analytics, subject-wise progress, and completion statistics in your dashboard.',
      },
      {
        question: 'What are achievement badges?',
        answer: 'Badges are rewards earned by completing milestones like finishing your first practice paper, maintaining a study streak, or achieving high scores. Check the Badges section in Practice to see all available achievements.',
      },
      {
        question: 'Can I download past papers?',
        answer: 'Yes, all past papers and study materials are available for download as PDFs. Simply click the download button on any resource card.',
      },
    ],
    scholarships: [
      {
        question: 'What types of scholarships are available?',
        answer: 'We list merit-based scholarships (based on academic performance), need-based scholarships (financial assistance), talent-based scholarships (for specific skills), and research grants. Filter by type to find what suits you best.',
      },
      {
        question: 'How do I apply for scholarships?',
        answer: 'Each scholarship listing contains detailed eligibility criteria, required documents, and application instructions. Follow the "Apply Now" link to be directed to the official application portal.',
      },
      {
        question: 'Are all scholarships on Myark legitimate?',
        answer: 'Yes, we verify all scholarship providers before listing them on our platform. We only feature scholarships from recognized institutions, foundations, and organizations.',
      },
      {
        question: 'When should I start applying for scholarships?',
        answer: 'It\'s best to start early! Many scholarships have deadlines several months before the academic year begins. Use our deadline filter to plan your applications in advance.',
      },
    ],
    account: [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your Dashboard, click on Settings, and you can update your name, email, grade, interests, and other profile details. Don\'t forget to save your changes.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot Password" on the login page. Enter your registered email, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
      },
      {
        question: 'Can I have multiple accounts?',
        answer: 'We recommend maintaining one account per student for better progress tracking and personalized recommendations. However, parents or teachers can create separate guardian accounts.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account, go to Settings > Account > Delete Account. Please note this action is permanent and all your data, progress, and bookmarks will be lost.',
      },
    ],
    payment: [
      {
        question: 'Why do some opportunities require payment?',
        answer: 'Myark itself is free to use. However, some competitions, workshops, or events charge registration or participation fees set by their organizers. These fees are clearly mentioned in the opportunity details.',
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'Payment methods depend on the opportunity organizer. Most accept credit/debit cards, UPI, net banking, and digital wallets. Specific payment options are listed on the registration page.',
      },
      {
        question: 'Can I get a refund?',
        answer: 'Refund policies vary by opportunity. Check the specific opportunity\'s terms and conditions or contact the organizer directly for refund information.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payments are processed through secure, PCI-compliant payment gateways. Myark does not store your payment information. We redirect you to trusted payment processors for transactions.',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 border-b">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions about Myark
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for answers..."
                  className="pl-12 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {faqs[category.id as keyof typeof faqs].length} FAQs
                  </p>
                </Card>
              );
            })}
          </div>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {Object.entries(faqs).map(([categoryId, questions]) => {
              const category = faqCategories.find(c => c.id === categoryId);
              const Icon = category?.icon || HelpCircle;

              return (
                <div key={categoryId} id={categoryId}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`h-6 w-6 ${category?.color || 'text-gray-500'}`} />
                    <h2 className="text-2xl font-bold">{category?.name}</h2>
                    <Badge variant="secondary">{questions.length}</Badge>
                  </div>

                  <Card className="p-2">
                    <Accordion type="single" collapsible className="w-full">
                      {questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${categoryId}-${index}`}>
                          <AccordionTrigger className="text-left px-4">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Still Have Questions */}
          <Card className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline">
                Browse Help Center
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}