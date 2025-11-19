import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, BookOpen, Target, Users, Lightbulb, Search, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CareerToolkitPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-32">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

                    <div className="container relative mx-auto px-4 text-center">
                        <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-300 backdrop-blur-sm mb-6">
                            <Compass className="mr-2 h-4 w-4" />
                            Navigate Your Future
                        </div>
                        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Career Toolkit</span> for Students & Parents
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            Discover interests, explore pathways, and build a roadmap to success together. A comprehensive guide to making informed career decisions.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                                Start Exploring
                            </Button>
                            <Link href="#tools" className="text-sm font-semibold leading-6 text-white hover:text-orange-300 transition-colors">
                                View Tools <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* For Parents Section */}
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                                    alt="Parent helping child"
                                    className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-300">
                                    <Users className="mr-2 h-4 w-4" />
                                    For Parents
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    How to Guide Your Child's Journey
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-lg">
                                    Support your child without overwhelming them. Learn how to identify their strengths, encourage their passions, and provide the right resources at the right time.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Observe their natural interests and hobbies",
                                        "Encourage exploration of diverse subjects",
                                        "Facilitate conversations with professionals",
                                        "Focus on skills and adaptability, not just job titles"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-0.5">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Students Section */}
                <section className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                            <div className="order-2 md:order-1 space-y-6">
                                <div className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-300">
                                    <Lightbulb className="mr-2 h-4 w-4" />
                                    For Students
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Discover What Moves You
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-lg">
                                    Your career path isn't just about a job—it's about finding where your passion meets the world's needs. Start exploring today.
                                </p>
                                <div className="grid gap-4">
                                    <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Search className="h-4 w-4 text-purple-500" />
                                            Self-Discovery
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Take personality tests and skills assessments to understand yourself better.
                                        </p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-pink-500 hover:shadow-md transition-shadow">
                                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Map className="h-4 w-4 text-pink-500" />
                                            Market Research
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Look up emerging industries and future job trends.
                                        </p>
                                    </Card>
                                    <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                                        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Target className="h-4 w-4 text-blue-500" />
                                            Set Goals
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Create short-term and long-term goals to guide your learning journey.
                                        </p>
                                    </Card>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 relative">
                                <div className="absolute -inset-4 bg-gradient-to-l from-purple-500 to-blue-500 rounded-2xl opacity-20 blur-xl"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                    alt="Student exploring"
                                    className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tools Section */}
                <section id="tools" className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Essential Tools & Resources</h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                Curated resources to help you plan, research, and succeed.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Career Assessment",
                                    desc: "A comprehensive test to match your personality with potential careers.",
                                    icon: Target,
                                    color: "text-red-500",
                                    bg: "bg-red-50 dark:bg-red-900/20"
                                },
                                {
                                    title: "College Planner",
                                    desc: "Timeline and checklist for college applications and preparation.",
                                    icon: BookOpen,
                                    color: "text-blue-500",
                                    bg: "bg-blue-50 dark:bg-blue-900/20"
                                },
                                {
                                    title: "Skill Builder",
                                    desc: "Library of courses and workshops to develop essential life skills.",
                                    icon: Lightbulb,
                                    color: "text-yellow-500",
                                    bg: "bg-yellow-50 dark:bg-yellow-900/20"
                                }
                            ].map((tool, i) => (
                                <Card key={i} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200 dark:border-slate-800">
                                    <div className={`h-12 w-12 rounded-xl ${tool.bg} ${tool.color} flex items-center justify-center mb-4`}>
                                        <tool.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tool.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">{tool.desc}</p>
                                    <Button variant="outline" className="w-full group">
                                        Access Tool
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
