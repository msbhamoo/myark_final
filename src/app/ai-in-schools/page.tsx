'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    BrainCircuit,
    Sparkles,
    Bot,
    ShieldCheck,
    GraduationCap,
    LineChart,
    ArrowRight,
    Check,
    Microscope
} from 'lucide-react';

export default function AIInSchoolsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />
                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.05]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="container relative mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20 backdrop-blur-sm mb-8">
                            <Sparkles className="h-4 w-4" />
                            <span>The New Literacy</span>
                        </div>

                        <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-8">
                            Prepare Students for an <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                AI-Powered World
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
                            Artificial Intelligence isn't just a tool; it's a fundamental shift in how we live and work. Myark helps schools integrate AI responsibly, creatively, and effectively.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                                <Link href="/contact">
                                    Get AI Ready
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">
                                <Link href="#curriculum">
                                    View Curriculum
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* AI in K-12 Section */}
                <section className="py-24 bg-slate-900/50 border-y border-slate-800/50">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    More Than Just Chatbots
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                    AI in education goes beyond generating text. It's about personalized learning paths, intelligent tutoring systems, and giving students the superpowers to solve complex problems.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            title: "Personalized Learning",
                                            desc: "Adaptive algorithms that pace content to each student's needs.",
                                            icon: BrainCircuit
                                        },
                                        {
                                            title: "Smart Assessments",
                                            desc: "Instant feedback loops that help students learn from mistakes in real-time.",
                                            icon: LineChart
                                        },
                                        {
                                            title: "Creative Co-pilot",
                                            desc: "Using AI to brainstorm, design art, and compose music.",
                                            icon: Bot
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                                <item.icon className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                                                <p className="text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-3xl opacity-20 rounded-full" />
                                <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-auto text-xs text-slate-500 font-mono">AI_Tutor_v2.0</span>
                                    </div>
                                    <div className="space-y-4 font-mono text-sm">
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                            <span className="text-emerald-400 mr-2">Student:</span>
                                            <span className="text-slate-300">How does photosynthesis work?</span>
                                        </div>
                                        <div className="bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20">
                                            <span className="text-cyan-400 mr-2">AI Tutor:</span>
                                            <span className="text-slate-300">Imagine a plant as a solar-powered chef! 🌿☀️ It takes sunlight, water, and air to cook up its own food (sugar). Want to try a quick simulation?</span>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">Start Simulation</span>
                                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">Ask another question</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Students & Teachers */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Empowering the Entire Classroom
                            </h2>
                            <p className="text-slate-400 text-lg">
                                AI isn't here to replace teachers; it's here to give them superpowers and help students soar.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* For Students */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GraduationCap className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">S</span>
                                    For Students
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "24/7 Homework Assistance",
                                        "Personalized Study Plans",
                                        "Career Path Discovery",
                                        "Skill-based Learning Modules"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <Check className="h-5 w-5 text-emerald-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* For Teachers */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Microscope className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">T</span>
                                    For Teachers
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Automated Grading & Feedback",
                                        "Lesson Plan Generation",
                                        "Student Performance Analytics",
                                        "Administrative Task Reduction"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <Check className="h-5 w-5 text-cyan-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Safety & Ethics */}
                <section className="py-20 bg-slate-900/30 border-y border-slate-800/30">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50">
                            <div className="shrink-0 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <ShieldCheck className="h-12 w-12 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Safety First Approach</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    We prioritize data privacy, age-appropriate content, and ethical AI use. Our curriculum includes dedicated modules on "AI Ethics" to teach students how to be responsible digital citizens.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Bring the Future to Your School
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            Partner with Myark to implement comprehensive AI literacy programs and tools designed for the modern classroom.
                        </p>
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-emerald-500/20">
                            Get Started Today
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
