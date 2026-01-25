import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import {
  Trophy, GraduationCap, BookOpen, Lightbulb, Users, Briefcase,
  Wrench, Medal, Globe, Video, Sparkles, Loader2
} from "lucide-react";
import { OPPORTUNITY_TYPES } from "@/types/admin";
import { opportunitiesService } from "@/lib/firestore";
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
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const allOpps = await opportunitiesService.getAll({ status: "published" });
        const newCounts: Record<string, number> = {};

        // Initialize counts
        OPPORTUNITY_TYPES.forEach(type => newCounts[type.id] = 0);

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
    navigate(`/explore?category=${typeId}`);
  };

  return (
    <section className="py-24 px-4 relative">
      {/* Background elements */}
      <div className="absolute left-0 top-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What's Your <span className="gradient-text-secondary">Vibe?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pick a category and see what's trending. Real opportunities, updated live.
          </p>
        </div>

        {/* Category grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 rounded-3xl bg-muted/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPPORTUNITY_TYPES.map((type, index) => {
              const IconComponent = ICON_MAP[type.icon] || Sparkles;
              // Simple color mapping logic since we store tailwind classes like "text-blue-500"
              // but CategoryCard likely expects "primary" | "secondary" | "accent" etc.
              // We'll normalize it or update CategoryCard. 
              // For now, let's assume CategoryCard accepts the raw color string or map it.
              // Looking at previous file content, it expected variants. Let's pass a safe default or map dynamically.

              // Quick mapping ensuring visual variety based on index if exact map isn't compatible
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
    </section>
  );
};

export default Categories;
