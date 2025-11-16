'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Target, 
  Sparkles, 
  Users, 
  Globe,
  Rocket,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Student-Centric',
      description: 'Every decision we make is focused on empowering students to discover and pursue their passions.',
    },
    {
      icon: Target,
      title: 'Inclusive Access',
      description: 'We believe every student, regardless of background, deserves access to quality opportunities.',
    },
    {
      icon: Sparkles,
      title: 'Quality Curation',
      description: 'We handpick and verify every opportunity to ensure students access only the best programs.',
    },
    {
      icon: Users,
      title: 'Parental Support',
      description: 'Parents are partners in education. We provide them with clarity and guidance every step.',
    },
  ];

  const team = [
    {
      role: 'Founded by educators and parents',
      description: 'Our team understands the challenges students and parents face in finding the right opportunities.',
    },
    {
      role: 'Powered by technology',
      description: 'We use smart algorithms to match students with opportunities aligned to their interests and goals.',
    },
    {
      role: 'Backed by partners',
      description: 'We work with leading organizations, schools, and educators to curate the best programs.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '2.5K+', label: 'Partner Organizations' },
    { number: '120+', label: 'Verified Schools' },
    { number: '500+', label: 'Opportunities' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm ring-1 ring-purple-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-purple-200 dark:ring-purple-300/40">
              <Sparkles className="h-4 w-4" />
              About Myark
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Empowering Every Student's Journey
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              Myark is a platform that helps Grade 4-12 students discover competitions, scholarships, and skill-building programs while giving parents the clarity they need to support their children's dreams.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400">
                    {stat.number}
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>

                <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
                  Discover. Learn. Grow.
                </h2>

                <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">
                  We believe every student has unique talents and dreams. Our mission is to connect them with opportunities that help them discover their passions, develop valuable skills, and build a brighter future.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Opportunity Discovery</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Access hundreds of curated competitions, scholarships, workshops, and internships.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Skill Building</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Develop critical skills through workshops, bootcamps, and hands-on learning programs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Parental Guidance</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Parents get clear insights, career paths, and resources to guide their children's journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 p-8 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex h-full items-center justify-center">
                    <Rocket className="h-32 w-32 text-purple-600 dark:text-purple-400 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Our Core Values
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Everything we do is guided by these principles
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800/50 hover:shadow-lg transition"
                  >
                    <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Our Team
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Built by people who are passionate about student success
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {member.role}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Join thousands of students discovering opportunities that match their dreams.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/opportunities">
                <Button className="w-full sm:w-auto rounded-full bg-purple-600 px-8 py-3 text-base font-semibold text-white hover:bg-purple-700">
                  Explore Opportunities
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/parent-guide">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-2 border-purple-200 px-8 py-3 text-base font-semibold text-purple-600 hover:bg-purple-50 dark:border-purple-400/30 dark:text-purple-300 dark:hover:bg-purple-950/30"
                >
                  Parent Guide
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
