"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "./CategoryCard";
import {
  Trophy, GraduationCap, BookOpen, Lightbulb, Users, Briefcase,
  Wrench, Medal, Globe, Video, Sparkles, Loader2
} from "lucide-react";
import { OPPORTUNITY_TYPES, type OpportunityTypeConfig } from "@/types/admin";
import { opportunitiesService, settingsService } from "@/lib/firestore";
import type { Opportunity } from "@/types/admin";

// Map string icon names to components
const ICON_MAP: Record<string, any> = {
  'GraduationCap': GraduationCap,
  'Wrench': Wrench,
  'Trophy': Trophy,
  'Medal': Medal,
  'Globe': Globe,
  'Briefcase': Briefcase,
  'BookOpen': BookOpen,
  'Users': Users,
  'Video': Video,
  'Sparkles': Sparkles,
  'Lightbulb': Lightbulb
};

const Categories = () => {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [types, setTypes] = useState<OpportunityTypeConfig[]>(OPPORTUNITY_TYPES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch opportunity types from settings
        const typesData = await settingsService.getOpportunityTypes();
        const currentTypes = typesData.length > 0 ? typesData : OPPORTUNITY_TYPES;
        setTypes(currentTypes);

        const allOpps = await opportunitiesService.getAll({ status: "published" });
        const newCounts: Record<string, number> = {};

        // Initialize counts
        currentTypes.forEach(type => newCounts[type.id] = 0);

        // Count opportunities (safely handling potential type mismatches)
        allOpps.forEach(opp => {
          if (opp.type && newCounts[opp.type] !== undefined) {
            newCounts[opp.type]++;
          }
        });

        setCounts(newCounts);
      } catch (error) {
        console.error("Error fetching category counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const handleCategoryClick = (typeId: string) => {
    router.push(`/explore?category=${typeId}`);
  };

  return (
    <section className="py-12 md:py-24 px-4 relative">
      {/* Background elements */}
      <div className="absolute left-0 top-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div className="text-left">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-2">
              What's Your <span className="gradient-text-secondary">Vibe?</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Pick a category and see what's trending. Updated live.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
            <span>Slide to see more</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <div className="w-1 h-1 rounded-full bg-primary/60" />
              <div className="w-1 h-1 rounded-full bg-primary/30" />
            </div>
          </div>
        </div>

        {/* Category grid */}
        <div className="relative group">
          {/* Faded Edges for Scroll Hint */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none md:block hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          {loading ? (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 overflow-y-hidden">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 w-[150px] md:w-[180px] shrink-0 rounded-2xl bg-muted/50 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 overflow-y-hidden scroll-smooth">
              {types.filter(type => (counts[type.id] || 0) > 0).map((type, index) => {
                const IconComponent = ICON_MAP[type.icon] || Sparkles;
                const variants = ['primary', 'secondary', 'accent', 'success'] as const;
                const colorVariant = variants[index % variants.length];

                return (
                  <div key={type.id} onClick={() => handleCategoryClick(type.id)} className="cursor-pointer">
                    <CategoryCard
                      icon={<IconComponent className="w-full h-full" />}
                      title={type.name}
                      count={counts[type.id] || 0}
                      color={colorVariant}
                      delay={index * 50}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
