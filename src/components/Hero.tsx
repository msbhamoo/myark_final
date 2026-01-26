"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Trophy, Zap, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import TypewriterText from "./TypewriterText";

const Hero = () => {
  const [count, setCount] = useState({ opportunities: 0, students: 0, scholarships: 0 });
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount({
        opportunities: Math.floor(8130 * easeOut),
        students: Math.floor(1260 * easeOut),
        scholarships: Math.floor(180 * easeOut),
      });

      if (step >= steps) {
        clearInterval(timer);
        // Add a slow increment for "live" feel
        const liveTimer = setInterval(() => {
          setCount(prev => ({
            ...prev,
            students: prev.students + Math.floor(Math.random() * 2)
          }));
        }, 5000);
        return () => clearInterval(liveTimer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const floatingElements = [
    { icon: Trophy, color: "text-accent", position: "top-20 left-10 md:left-20", delay: 0 },
    { icon: Rocket, color: "text-secondary", position: "top-32 right-10 md:right-32", delay: 0.2 },
    { icon: Zap, color: "text-primary", position: "bottom-32 left-20", delay: 0.4 },
    { icon: Star, color: "text-success", position: "bottom-20 right-20", delay: 0.6 },
  ];

  const typewriterWords = ["Opportunities", "Scholarships", "Competitions", "Dreams", "Success"];

  const socialProofData = [
    { count: 35000, text: "students joined this week", color: "text-primary" },
    { count: 12500, text: "scholarships added today", color: "text-secondary" },
    { count: 1800, text: "competitions ending soon", color: "text-accent" },
    { count: 80000, text: "dreams being built", color: "text-success" },
    { count: 220, text: "new success stories", color: "text-blue-400" },
  ];

  const currentProof = socialProofData[activeWordIndex];

  const indianAvatars = [
    "https://plus.unsplash.com/premium_photo-1682089872205-dbbdb3fb5a86?w=200&h=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=200&h=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1639149888905-fb39793f7e0b?w=200&h=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&auto=format&fit=crop&q=80",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 md:py-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />

      {/* Floating elements */}
      {floatingElements.map(({ icon: Icon, color, position, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} hidden md:block`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.5, type: "spring" }}
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: delay }}
            className="glass-card p-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform"
          >
            <Icon className={`w-8 h-8 ${color}`} />
          </motion.div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4 md:mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-primary">For students who dream BIG</span>
        </motion.div>

        {/* Main heading with typewriter */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6"
        >
          <span className="block mb-2">Unlock Amazing</span>
          <TypewriterText
            words={typewriterWords}
            className="gradient-text-primary"
            onWordChange={setActiveWordIndex}
          />
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-10"
        >
          Discover competitions, scholarships, olympiads & opportunities tailored just for you.
          <span className="text-foreground font-medium"> Level up your journey!</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/profile">
            <Button variant="hero" size="xl" className="group">
              <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:rotate-12" />
              Start Your Quest
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            variant="glass"
            size="xl"
            onClick={() => document.getElementById('trending-opportunities')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See What's Trending
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-8 mt-10 md:mt-16"
        >
          <motion.div
            className="text-center group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl md:text-4xl font-bold font-display gradient-text-primary">
              {count.opportunities}+
            </div>
            <div className="text-sm text-muted-foreground mt-1">Opportunities</div>
          </motion.div>
          <motion.div
            className="text-center group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl md:text-4xl font-bold font-display gradient-text-secondary">
              {(count.students / 1000).toFixed(1)}M+
            </div>
            <div className="text-sm text-muted-foreground mt-1">Students</div>
          </motion.div>
          <motion.div
            className="text-center group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl md:text-4xl font-bold font-display text-success">
              🏆 {count.scholarships}Cr+
            </div>
            <div className="text-sm text-muted-foreground mt-1">Scholarships Won</div>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {indianAvatars.map((url, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: -20, rotate: -20 }}
                  animate={{ scale: 1, x: 0, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  className="relative group"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-background overflow-hidden relative transition-transform group-hover:scale-110 group-hover:z-50 group-hover:border-primary/50 shadow-lg bg-muted">
                    <img
                      src={url}
                      alt={`Student ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground border-4 border-background z-10 shadow-lg"
              >
                +35k
              </motion.div>
            </div>
          </div>
          <div className="text-sm font-medium h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWordIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span className={`font-bold text-lg ${currentProof.color}`}>
                  {currentProof.count.toLocaleString()}+
                </span>
                <span className="text-muted-foreground">{currentProof.text}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
