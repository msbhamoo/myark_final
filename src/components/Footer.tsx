import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MascotBurst } from '@/components/MascotBurst';

const STUDENT_LINKS = [
  { label: 'Explore Opportunities', href: '/opportunities' },
  { label: 'Scholarships & Grants', href: '/opportunities?category=scholarships' },
  { label: 'Olympiads & Exams', href: '/opportunities?category=olympiad' },
  { label: 'Skill Labs & Clubs', href: '/opportunities?mode=online' },
] as const;

const PARENT_LINKS = [
  { label: 'Parent Guide', href: '/opportunities?view=parents' },
  { label: 'Planning Toolkit', href: '/resources?type=toolkit' },
  { label: 'Success Stories', href: '/resources?type=stories' },
  { label: 'Ask an Advisor', href: '/contact' },
] as const;

const COMPANY_LINKS = [
  { label: 'About Myark', href: '/about' },
  { label: 'Our Mission', href: '/mission' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

const SOCIAL_BUTTONS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Twitter, label: 'X' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
] as const;

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl border border-orange-300/20 bg-white/10 px-3 py-2 text-white shadow-sm shadow-orange-400/20 transition hover:-translate-y-[1px] hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 text-lg font-semibold text-white shadow-inner shadow-orange-500/40">
                M
              </div>
              <span className="text-xl font-semibold">Myark</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-slate-300">
              Helping Grade 4-12 learners across India discover competitions, scholarships, and
              skill-building journeys that fit their dreams. Parents get the clarity they need to
              cheer them on.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_BUTTONS.map((item) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-10 w-10 rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:-translate-y-[1px] hover:border-orange-300 hover:text-orange-200',
                    'focus-visible:ring-2 focus-visible:ring-orange-400/50',
                  )}
                  aria-label={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-200">
                Stay in the loop
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Monthly round-up of new programs and parent resources. No spam, promise.
              </p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 flex-1 rounded-xl border border-white/20 bg-white/10 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-orange-300/40"
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-200">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-200">
                ✶
              </span>
              For Students
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {STUDENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-200">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                ♡
              </span>
              For Parents
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {PARENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                About Myark
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-300">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 text-sm text-slate-300 lg:grid-cols-2">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Mail className="h-4 w-4 text-orange-300" aria-hidden="true" />
              <span>support@myark.com</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Phone className="h-4 w-4 text-orange-300" aria-hidden="true" />
              <span>+91 (555) 123-4567</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <MapPin className="h-4 w-4 text-orange-300" aria-hidden="true" />
              <span>Jaipur, Rajasthan</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-end sm:text-right">
            <span>© {new Date().getFullYear()} Myark. All rights reserved.</span>
            <span className="inline-flex items-center gap-2 text-slate-300">
              <MascotBurst size="sm" className="h-8 w-8 text-base" />
              <span>Myark mascot is cheering you on!</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
