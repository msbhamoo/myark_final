import { motion } from "framer-motion";
import { 
  School, Users, Trophy, TrendingUp, BarChart3, 
  Target, CheckCircle2, ArrowRight, Star, Zap,
  BookOpen, Award, Globe, Shield, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { value: "500+", label: "Partner Schools", icon: School },
  { value: "50K+", label: "Students Impacted", icon: Users },
  { value: "��10Cr+", label: "Scholarships Won", icon: Trophy },
  { value: "85%", label: "Engagement Rate", icon: TrendingUp },
];

const features = [
  {
    icon: BarChart3,
    title: "School Dashboard",
    description: "Track student engagement, applications, and achievements in real-time with detailed analytics.",
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    description: "AI-powered matching ensures every student sees opportunities relevant to their interests and abilities.",
  },
  {
    icon: Award,
    title: "Achievement Tracking",
    description: "Celebrate student wins with automated recognition, certificates, and showcase opportunities.",
  },
  {
    icon: BookOpen,
    title: "Curriculum Integration",
    description: "Seamlessly integrate with your school's career counseling and extracurricular programs.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Enterprise-grade security with parental controls and data privacy compliance.",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description: "Access competitions, scholarships, and programs from around the world.",
  },
];

const testimonials = [
  {
    quote: "Myark transformed how our students discover and pursue opportunities. We've seen a 3x increase in scholarship applications!",
    author: "Dr. Priya Sharma",
    role: "Principal, Delhi Public School",
    avatar: "P",
  },
  {
    quote: "The gamification keeps students engaged like never before. They're actually excited about career exploration!",
    author: "Rajesh Kumar",
    role: "Career Counselor, Modern School",
    avatar: "R",
  },
  {
    quote: "Finally, a platform that makes opportunity discovery fun and accessible for all students, not just the privileged few.",
    author: "Anita Desai",
    role: "Vice Principal, Kendriya Vidyalaya",
    avatar: "A",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out Myark",
    features: ["Up to 100 students", "Basic analytics", "Email support", "Standard opportunities"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "��999",
    period: "/month",
    description: "For growing schools",
    features: ["Up to 1,000 students", "Advanced analytics", "Priority support", "Premium opportunities", "Custom branding"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large institutions",
    features: ["Unlimited students", "Dedicated success manager", "API access", "White-label solution", "Custom integrations"],
    cta: "Contact Sales",
    popular: false,
  },
];

const ForSchools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-8">
                <School className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">For Schools & Institutions</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                Empower Your Students to{" "}
                <span className="gradient-text-secondary">Dream Bigger</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Partner with Myark to give your students access to 500+ competitions, scholarships, 
                and opportunities�all with gamified engagement that keeps them coming back.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" className="group">
                  <Sparkles className="w-5 h-5" />
                  Schedule a Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="xl">
                  Download Brochure
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="glass-card p-6 rounded-xl text-center group cursor-pointer hover:scale-105 transition-transform"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold font-display gradient-text-secondary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Everything Your School Needs
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A complete platform to discover, track, and celebrate student achievements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl group cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Trusted by Leading Schools
              </h2>
              <p className="text-xl text-muted-foreground">
                See what educators are saying about Myark
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose the plan that fits your school's needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative glass-card p-6 rounded-xl ${
                    plan.popular ? "border-2 border-secondary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-secondary to-accent text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? "hero" : "glass"} 
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-2xl text-center bg-gradient-to-br from-secondary/10 to-accent/10"
            >
              <Zap className="w-12 h-12 mx-auto mb-6 text-secondary" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your School?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 500+ schools already using Myark to help students discover their potential.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" className="group">
                  <Sparkles className="w-5 h-5" />
                  Get Started Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="xl">
                  Talk to Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForSchools;
