import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Users, Flame, ChevronRight as Arrow, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { opportunitiesService } from "@/lib/firestore";
import type { Opportunity } from "@/types/admin";

const TYPE_GRADIENTS: Record<string, string> = {
  competition: "from-cyan-500 to-blue-600",
  scholarship: "from-amber-500 to-orange-600",
  olympiad: "from-emerald-500 to-teal-600",
  workshop: "from-pink-500 to-rose-600",
  internship: "from-violet-500 to-purple-600",
  other: "from-blue-500 to-indigo-600",
};

const StoriesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const data = await opportunitiesService.getAll({ status: "published" });
        // Sort by applicationCount or createdAt to simulate "Trending"
        setOpportunities(data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [opportunities]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[100px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (opportunities.length === 0) return null;

  return (
    <section className="py-8 relative">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-xl font-bold">Trending Now</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "p-2 rounded-full bg-muted transition-all",
                canScrollLeft ? "hover:bg-muted/80 hover:scale-110" : "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "p-2 rounded-full bg-muted transition-all",
                canScrollRight ? "hover:bg-muted/80 hover:scale-110" : "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stories scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
        >
          {opportunities.map((opp, index) => {
            const daysLeft = opp.dates?.registrationEnd
              ? Math.ceil((opp.dates.registrationEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : 0;

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
                className="flex-shrink-0 w-44 cursor-pointer group"
              >
                {/* Card */}
                <div
                  className={cn(
                    "relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br p-4 flex flex-col justify-between transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl",
                    TYPE_GRADIENTS[opp.type] || TYPE_GRADIENTS.other
                  )}
                >
                  {/* Urgent badge */}
                  {daysLeft > 0 && daysLeft <= 7 && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysLeft}d left
                    </div>
                  )}

                  {/* Icon/Emoji */}
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    {opp.type === 'competition' ? '🏆' : opp.type === 'scholarship' ? '🎓' : '🚀'}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-display font-bold text-white line-clamp-2 mb-1">
                      {opp.title}
                    </h3>
                    <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider">{opp.organization}</p>
                    <div className="flex items-center gap-1 mt-2 text-white/80 text-xs">
                      <Users className="w-3 h-3" />
                      {opp.applicationCount?.toLocaleString() || 0} joined
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Arrow className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoriesCarousel;
