'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Target, Lightbulb, Zap, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MissionPage() {
  const pillars = [
    {
      icon: Lightbulb,
      title: 'Discovery',
      description: 'Help students find opportunities that align with their passions, talents, and career aspirations.',
    },
    {
      icon: Zap,
      title: 'Development',
      description: 'Enable students to build critical 21st-century skills through competitions, workshops, and real-world experiences.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Create a supportive community where students, parents, and educators collaborate and celebrate success.',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Track progress and help students grow into confident, capable individuals ready for the future.',
    },
  ];

  const impact = [
    {
      number: '50K+',
      label: 'Students Empowered',
      description: 'Students discovering opportunities aligned with their dreams',
    },
    {
      number: '500+',
      label: 'Opportunities Listed',
      description: 'Quality programs from verified organizations',
    },
    {
      number: '2.5K+',
      label: 'Partner Organizations',
      description: 'Working together to create transformative experiences',
    },
    {
      number: '120+',
      label: 'Verified Schools',
      description: 'Helping parents make informed educational choices',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm ring-1 ring-orange-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-orange-200 dark:ring-orange-300/40">
              <Target className="h-4 w-4" />
              Our Mission
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Discover. Learn. Grow.
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              Myark empowers every student to discover opportunities, develop skills, and achieve their dreams. We believe that with the right support, every child can shine.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We are on a mission to help Grade 4-12 learners across India discover competitions, scholarships, and skill-building journeys that fit their unique dreams and potential. We empower parents with the clarity and resources they need to guide and support their children effectively.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Why This Matters
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">For Students:</span> Most students don't know what opportunities exist beyond their immediate environment. Many miss chances to develop skills, win scholarships, or discover their true calling. Myark solves this by connecting students with vetted programs that match their interests and aspirations.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">For Parents:</span> Parents want the best for their children but often lack information about available opportunities and their quality. They struggle to navigate the overwhelming choices. Myark provides clarity, guidance, and peace of mind.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">For India:</span> India's future depends on nurturing talent early, providing equal access to opportunities, and unlocking potential across all backgrounds. Myark is democratizing access to transformative experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Four Pillars of Myark
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Everything we do is built on these core principles
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800/50 hover:shadow-lg transition"
                  >
                    <Icon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Our Impact So Far
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Together, we're creating transformative change
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {impact.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-8 dark:border-slate-700 dark:from-orange-950/20 dark:to-yellow-950/20 text-center"
                >
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {item.number}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="py-16 px-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border-2 border-orange-200 bg-white p-8 dark:border-orange-400/30 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Our Vision for the Future
              </h2>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p>
                  We envision a future where every student in India, regardless of their background, has access to quality opportunities that help them discover their potential and build a successful future.
                </p>
                <p>
                  We want Myark to become the go-to platform that:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>✓ Connects millions of students with transformative opportunities</li>
                  <li>✓ Empowers parents with data-driven insights for better decision-making</li>
                  <li>✓ Partners with thousands of organizations to create meaningful experiences</li>
                  <li>✓ Reduces inequality by democratizing access to quality education and development programs</li>
                  <li>✓ Helps shape India's future by nurturing talented, confident, and capable youth</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Join Us on This Journey
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Whether you're a student, parent, educator, or organization, there's a place for you at Myark.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/opportunities">
                <Button className="w-full sm:w-auto rounded-full bg-orange-600 px-8 py-3 text-base font-semibold text-white hover:bg-orange-700">
                  Explore Opportunities
                </Button>
              </Link>

              <Link href="/parent-guide">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-2 border-orange-200 px-8 py-3 text-base font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-400/30 dark:text-orange-300 dark:hover:bg-orange-950/30"
                >
                  Parent Resources
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
