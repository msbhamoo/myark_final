"use client";

import { motion } from "framer-motion";
import { School, ArrowRight, CheckCircle2, Users, Trophy, Target, BarChart3, Heart, Sparkles, BookOpen, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { schoolDemosService } from "@/lib/firestore";

export default function SchoolsPage() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        schoolName: '',
        contactPerson: '',
        designation: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        studentCount: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await schoolDemosService.create({
                schoolName: formData.schoolName,
                contactPerson: formData.contactPerson,
                designation: formData.designation || undefined,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                state: formData.state || undefined,
                studentCount: formData.studentCount,
                message: formData.message || undefined,
                status: 'pending',
            });

            toast({
                title: "Partnership request submitted!",
                description: "We'll get back to you within 2-3 business days.",
            });

            setShowForm(false);
            setFormData({
                schoolName: '',
                contactPerson: '',
                designation: '',
                email: '',
                phone: '',
                city: '',
                state: '',
                studentCount: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "Error",
                description: "Failed to submit request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center space-y-6 mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-sm"
                        >
                            <School className="w-4 h-4" />
                            Partnership Program
                        </motion.div>
                        <h1 className="text-4xl md:text-7xl font-bold font-display leading-tight">
                            Your Trusted <span className="text-primary italic">Growth Partner</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Join Myark as a strategic partner to empower your students with curated opportunities, 
                            foster holistic development, and showcase real achievements that extend far beyond academics. 
                            Together, we're building future-ready students who thrive in an ever-evolving world.
                        </p>
                    </div>

                    {/* Partnership Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Why Partner with Myark?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                We're not just a platform—we're your ally in student success, 
                                helping you surface the perfect scholarships, competitions, olympiads, 
                                workshops, and career pathways that align with your educational vision.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Target,
                                    title: "Reduce Discovery Friction",
                                    desc: "Our intelligent platform eliminates the overwhelm of opportunity hunting, presenting students with personalized, relevant options that match their interests and capabilities."
                                },
                                {
                                    icon: Sparkles,
                                    title: "Safe Gamification & Motivation",
                                    desc: "Through badges, progress tracking, and achievement milestones, we motivate participation while maintaining a safe, supportive learning environment."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Data-Driven Insights",
                                    desc: "Gain valuable analytics on student engagement, participation rates, and success metrics to inform your educational strategies and celebrate collective achievements."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="p-8 rounded-[30px] bg-muted/50 border border-border/50 text-center"
                                >
                                    <item.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* What Schools Get */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                What Your School Gains
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Our partnership creates mutual value, enhancing your school's reputation 
                                while providing students with unparalleled access to growth opportunities.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Users, title: "Enhanced Visibility", desc: "Showcase your school's success stories and student achievements to a wider community." },
                                { icon: Trophy, title: "Student Success Stories", desc: "Highlight real accomplishments and create inspiring narratives for current and prospective students." },
                                { icon: BookOpen, title: "Structured Access", desc: "Provide organized pathways to scholarships, competitions, and career opportunities aligned with your curriculum." },
                                { icon: BarChart3, title: "Engagement Insights", desc: "Access comprehensive data on student participation and outcomes to drive continuous improvement." }
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className="p-6 rounded-[20px] bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10"
                                >
                                    <benefit.icon className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Student Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                How Students Benefit
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Your students gain access to a comprehensive ecosystem designed to nurture 
                                their potential and prepare them for lifelong success.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Award,
                                    title: "Personalized Opportunities",
                                    desc: "AI-powered recommendations ensure students discover opportunities that truly match their interests, skills, and aspirations."
                                },
                                {
                                    icon: Heart,
                                    title: "Holistic Development",
                                    desc: "Beyond academics, students engage in workshops, competitions, and career exploration that build confidence and real-world skills."
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "Achievement Recognition",
                                    desc: "Earn badges, track progress, and celebrate milestones in a supportive environment that encourages continuous growth."
                                }
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 + i * 0.1 }}
                                    className="p-8 rounded-[30px] bg-muted/30 border border-border/30"
                                >
                                    <benefit.icon className="w-10 h-10 text-secondary mx-auto mb-6" />
                                    <h3 className="text-xl font-bold mb-4 text-center">{benefit.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-center">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Partnership Model */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Our Partnership Model
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                We believe in authentic, value-driven partnerships that strengthen both our communities. 
                                Here's how we work together to create impact.
                            </p>
                        </div>
                        <div className="space-y-8">
                            {[
                                {
                                    step: "01",
                                    title: "Discovery & Alignment",
                                    desc: "We start by understanding your school's unique needs, student demographics, and educational goals to ensure perfect alignment."
                                },
                                {
                                    step: "02",
                                    title: "Seamless Integration",
                                    desc: "Our team provides dedicated support for easy onboarding, training, and integration with your existing systems and workflows."
                                },
                                {
                                    step: "03",
                                    title: "Ongoing Collaboration",
                                    desc: "Regular check-ins, shared success metrics, and collaborative content creation keep our partnership dynamic and impactful."
                                },
                                {
                                    step: "04",
                                    title: "Mutual Growth",
                                    desc: "Together, we celebrate achievements, share insights, and continuously evolve to better serve your students' needs."
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2 + i * 0.1 }}
                                    className="flex items-center gap-8 p-8 rounded-[20px] bg-gradient-to-r from-muted/20 to-muted/10 border border-border/20"
                                >
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">{step.step}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[40px] p-12 border border-primary/10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                            Ready to Build Future-Ready Students Together?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join Myark's network of forward-thinking educational institutions. 
                            Let's create a partnership that empowers your students and elevates your school's impact.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="rounded-full px-8 py-6 text-lg" onClick={() => setShowForm(true)}>
                                Start Your Partnership
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Link href="/contact">
                                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Partnership Form Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Start Your Partnership with Myark</DialogTitle>
                        <DialogDescription>
                            Fill out this form and we'll get back to you within 2-3 business days to discuss how we can work together.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="schoolName">School Name *</Label>
                                <Input
                                    id="schoolName"
                                    required
                                    value={formData.schoolName}
                                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                                    placeholder="Enter your school name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person *</Label>
                                <Input
                                    id="contactPerson"
                                    required
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                    placeholder="Full name of contact person"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                    placeholder="e.g., Principal, Coordinator"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="contact@school.edu"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    required
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="City name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    placeholder="State (optional)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="studentCount">Number of Students *</Label>
                                <Input
                                    id="studentCount"
                                    required
                                    value={formData.studentCount}
                                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                                    placeholder="e.g., 500, 1000-2000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="Tell us about your school's goals, current challenges, or specific areas where you'd like our partnership to focus..."
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Partnership Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
