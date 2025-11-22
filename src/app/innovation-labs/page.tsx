'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Cpu,
    Code,
    PenTool,
    Lightbulb,
    Rocket,
    Users,
    ArrowRight,
    CheckCircle2,
    Box,
    Zap
} from 'lucide-react';

export default function InnovationLabsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-sky-100 selection:text-sky-900">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.02]" />

                    {/* Floating Elements */}
                    <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

                    <div className="container relative mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/50 px-4 py-1.5 text-sm font-semibold text-sky-700 ring-1 ring-sky-200/50 backdrop-blur-sm dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-700/30 mb-8">
                            <Rocket className="h-4 w-4" />
                            <span>Future-Ready Learning</span>
                        </div>

                        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white mb-6">
                            Building the Future, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">
                                One Lab at a Time
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                            Empower students to think, create, and innovate. Our Innovation Labs provide the tools, technology, and curriculum to turn classrooms into creative powerhouses.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200 dark:shadow-none">
                                <Link href="/contact">
                                    Partner with Myark
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
                                <Link href="#modules">
                                    Explore Modules
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* What is an Innovation Lab? */}
                <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 p-8 relative">
                                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
                                    <div className="grid grid-cols-2 gap-4 h-full">
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 transform translate-y-8">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
                                                <Cpu className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Robotics</h3>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400">
                                                <Code className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Coding</h3>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 transform translate-y-8">
                                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center dark:bg-amber-900/30 dark:text-amber-400">
                                                <Box className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">3D Printing</h3>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <PenTool className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Design</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                    More Than Just a Classroom
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    An Innovation Lab is a dedicated space where students move from passive learning to active creation. It's a playground for the mind, equipped with cutting-edge technology and hands-on tools.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Hands-on experimentation with STEM concepts",
                                        "Real-world problem solving and prototyping",
                                        "Collaborative projects that build teamwork",
                                        "Safe environment to fail, learn, and iterate"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-6 w-6 text-sky-500 shrink-0" />
                                            <span className="text-slate-700 dark:text-slate-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why it Matters */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Why Schools Need Innovation Labs
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                Preparing students for a future where adaptability and creativity are the most valuable skills.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Lightbulb,
                                    title: "Critical Thinking",
                                    desc: "Students learn to analyze problems and develop logical solutions through coding and engineering challenges.",
                                    color: "text-amber-500",
                                    bg: "bg-amber-50 dark:bg-amber-900/20"
                                },
                                {
                                    icon: Zap,
                                    title: "Creativity Unleashed",
                                    desc: "From 3D modeling to app design, students are given the freedom to bring their wildest ideas to life.",
                                    color: "text-purple-500",
                                    bg: "bg-purple-50 dark:bg-purple-900/20"
                                },
                                {
                                    icon: Users,
                                    title: "Future Readiness",
                                    desc: "Exposure to robotics, IoT, and AI ensures students are comfortable with the technologies shaping tomorrow.",
                                    color: "text-sky-500",
                                    bg: "bg-sky-50 dark:bg-sky-900/20"
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
                                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modules Section */}
                <section id="modules" className="py-20 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div>
                                <span className="text-sky-400 font-semibold tracking-wide uppercase text-sm">Curriculum</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-2">What Happens Inside?</h2>
                            </div>
                            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 hover:text-white rounded-full">
                                Download Full Syllabus
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Build a Drone",
                                    desc: "Aerodynamics & Electronics",
                                    image: "linear-gradient(to bottom right, #3b82f6, #1d4ed8)"
                                },
                                {
                                    title: "Smart Home IoT",
                                    desc: "Sensors & Automation",
                                    image: "linear-gradient(to bottom right, #8b5cf6, #6d28d9)"
                                },
                                {
                                    title: "Battle Bots",
                                    desc: "Mechanical Engineering",
                                    image: "linear-gradient(to bottom right, #f59e0b, #b45309)"
                                },
                                {
                                    title: "App Development",
                                    desc: "UI/UX & Logic",
                                    image: "linear-gradient(to bottom right, #10b981, #047857)"
                                }
                            ].map((module, i) => (
                                <div key={i} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                                    <div
                                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                        style={{ background: module.image }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <h3 className="text-xl font-bold mb-1">{module.title}</h3>
                                        <p className="text-white/80 text-sm">{module.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-white dark:bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="bg-sky-50 dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                    Ready to Transform Your School?
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                    Join the network of forward-thinking schools partnering with Myark to deliver world-class innovation education.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="rounded-full px-8 h-12 text-base bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                                        Schedule a Demo
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-300 hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                                        Contact Sales
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
