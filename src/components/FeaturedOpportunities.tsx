"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OpportunityCard from "./OpportunityCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { opportunitiesService } from "@/lib/firestore";
import type { Opportunity } from "@/types/admin";
import { useStudentAuth } from "@/lib/studentAuth";
import QuickQuizModal from "./QuickQuizModal";
import { cn } from "@/lib/utils";

const FeaturedOpportunities = () => {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { student, isAuthenticated, showAuthModal } = useStudentAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isForYou = searchParams.get("filter") === "for-you";

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      showAuthModal({
        trigger: "manual",
        message: "Sign in to save your results and earn 150 XP!"
      });
      return;
    }
    setQuizOpen(true);
  };

  const handleClearFilters = () => {
    router.push("/explore");
  };

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        setLoading(true);
        // Fetch published opportunities
        let data = await opportunitiesService.getAll({ status: "published" });

        // Filter out closed opportunities (deadlines in the past)
        const now = Date.now();
        data = data.filter(opp => {
          if (!opp.dates?.registrationEnd) return true;
          return new Date(opp.dates.registrationEnd).getTime() >= now;
        });

        if (isForYou && student) {
          // Curate opportunities based on student interests and grade
          data = data.sort((a, b) => {
            const aMatch = a.tags?.some(tag => student.interests?.includes(tag)) || a.type.includes(student.interests?.[0]);
            const bMatch = b.tags?.some(tag => student.interests?.includes(tag)) || b.type.includes(student.interests?.[0]);

            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;

            // Grade match
            const aGradeMatch = a.eligibility?.grades?.includes(student.grade as number);
            const bGradeMatch = b.eligibility?.grades?.includes(student.grade as number);

            if (aGradeMatch && !bGradeMatch) return -1;
            if (!aGradeMatch && bGradeMatch) return 1;

            return 0;
          });
        }

        setOpportunities(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, [isForYou, student]);

  return (
    <section id="trending-opportunities" className="py-12 md:py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3">
              {isForYou ? "Curated Just For You ✨" : "Hot Right Now 🔥"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isForYou
                ? "Perfect matches based on your goals and interests"
                : "Trending opportunities handpicked for go-getters like you"}
            </p>
          </div>
          <Button
            variant="outline"
            className="self-start md:self-auto group"
            onClick={handleClearFilters}
          >
            {isForYou ? "View Global 🔥" : "View All"}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Opportunities grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-[40px] bg-muted animate-pulse flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ))}
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, index) => (
              <OpportunityCard
                key={opp.id}
                id={opp.id}
                title={opp.title}
                organization={opp.organizer || "Admin"}
                type={opp.type as any}
                deadline={(() => {
                  if (opp.dates?.registrationEndDescription) return opp.dates.registrationEndDescription;
                  if (!mounted || !opp.dates?.registrationEnd) return "Ending Soon";
                  const end = new Date(opp.dates.registrationEnd).getTime();
                  const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
                  return diff > 0 ? `${diff} days left` : "Ending Soon";
                })()}
                participants={opp.applicationCount || 0}
                prize={opp.prizes?.first || "Certificate"}
                delay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-[40px] border-2 border-dashed border-muted">
            <p className="text-muted-foreground font-medium">New opportunities landing soon!</p>
          </div>
        )}

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "mt-10 md:mt-16 glass-card text-center relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform",
            student?.interests?.length ? "p-4 md:p-8" : "p-6 md:p-12"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 pointer-events-none" />

          <motion.div
            className="absolute top-4 right-8 text-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className={cn("text-left flex-1", !student?.interests?.length && "text-center")}>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                {student?.interests?.length
                  ? "Want to refresh your recommendations? 🔄"
                  : "Can't find what you're looking for?"}
              </h3>
              <p className="text-muted-foreground">
                {student?.interests?.length
                  ? "Update your interests and vibes to get a fresh set of curated opportunities."
                  : "Tell us your interests and we'll curate the perfect opportunities just for you!"}
              </p>
            </div>
            <Button
              variant={student?.interests?.length ? "outline" : "hero"}
              size="lg"
              onClick={handleStartQuiz}
              className={cn("shrink-0", student?.interests?.length && "border-primary/50 hover:bg-primary/10")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {student?.interests?.length ? "Update Quiz" : "Take a Quick Quiz"}
            </Button>
          </div>
        </motion.div>
      </div>
      <QuickQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </section >
  );
};

export default FeaturedOpportunities;
