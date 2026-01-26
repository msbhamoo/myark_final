"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Clock, Users, ChevronRight, Bookmark, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap } from "lucide-react";
import { gamificationService } from "@/lib/gamificationService";
import { useAuth } from "@/lib/auth";
import { useStudentAuth } from "@/lib/studentAuth";
import { useToast } from "@/hooks/use-toast";

interface OpportunityCardProps {
  id: string;
  title: string;
  organization: string;
  type: "competition" | "scholarship" | "olympiad" | "workshop";
  deadline: string;
  participants: number;
  prize?: string;
  image?: string;
  featured?: boolean;
  delay?: number;
  views?: number;
  hypes?: number;
}

const typeConfig = {
  competition: {
    label: "Competition",
    class: "bg-primary/20 text-primary border-primary/30",
  },
  scholarship: {
    label: "Scholarship",
    class: "bg-accent/20 text-accent border-accent/30",
  },
  olympiad: {
    label: "Olympiad",
    class: "bg-success/20 text-success border-success/30",
  },
  workshop: {
    label: "Workshop",
    class: "bg-secondary/20 text-secondary border-secondary/30",
  },
};

const OpportunityCard = ({
  id,
  title,
  organization,
  type,
  deadline,
  participants,
  prize,
  featured = false,
  delay = 0,
  views: initialViews,
  hypes: initialHypes = 0,
}: OpportunityCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [views, setViews] = useState(initialViews || 0);
  const [viewingNow, setViewingNow] = useState(10);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialViews) {
      setViews(Math.floor(Math.random() * 10000) + 1000);
    }
    setViewingNow(Math.floor(Math.random() * 50) + 10);
  }, [initialViews]);
  const [hypeCount, setHypeCount] = useState(initialHypes);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const { user } = useAuth();
  const { isAuthenticated, showAuthModal, student, saveOpportunity, unsaveOpportunity, addXPWithPersist } = useStudentAuth();
  const { toast } = useToast();

  const isBookmarked = student?.savedOpportunities?.includes(id) || false;
  const router = useRouter();
  const config = typeConfig[type];

  const handleClick = () => {
    router.push(`/opportunity/${id}`);
  };

  const handleHype = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Gate behind student auth
    if (!isAuthenticated) {
      showAuthModal({
        trigger: 'heart',
        message: "❤️ Heart this opportunity to show your support and earn 2 XP!",
      });
      return;
    }

    if (isLiked) return; // Only allow one hype per session

    // UI Feedback
    setIsLiked(true);
    setHypeCount(prev => prev + 1);
    const newHeart = { id: Date.now(), x: Math.random() * 40 - 20 };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);

    // Gamification Logic
    try {
      await addXPWithPersist(2);
      toast({
        title: "+2 XP ⭐",
        description: "Thanks for the hype!",
        className: "bg-primary text-primary-foreground border-none"
      });
    } catch (error) {
      console.error("Hype error:", error);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Gate behind student auth
    if (!isAuthenticated) {
      showAuthModal({
        trigger: 'save',
        message: "⭐ Save this opportunity to your list and earn 5 XP!",
      });
      return;
    }

    try {
      if (isBookmarked) {
        await unsaveOpportunity(id);
        toast({ title: "Removed", description: "Opportunity removed from saved", className: "bg-muted text-foreground border-none" });
      } else {
        await saveOpportunity(id);
        toast({ title: "+5 XP ⭐", description: "Opportunity saved!", className: "bg-primary text-primary-foreground border-none" });
      }
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.001 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        "group glass-card overflow-hidden cursor-pointer relative",
        featured && "ring-2 ring-primary/50"
      )}
    >
      {/* Animated glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-secondary text-secondary-foreground border-none animate-pulse">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}

      {/* Card content */}
      <div className="p-6 relative">
        {/* Type badge & bookmark */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={cn("text-xs font-medium", config.class)}>
            {config.label}
          </Badge>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={handleHype}
                className={cn(
                  "p-2 rounded-lg transition-all duration-300 hover:scale-125 bg-rose-500/10 text-rose-500 active:scale-90",
                  "group/hype relative"
                )}
              >
                <Heart className="w-4 h-4 group-hover/hype:fill-current" />
                <AnimatePresence>
                  {floatingHearts.map(heart => (
                    <motion.div
                      key={heart.id}
                      initial={{ y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ y: -50, opacity: 0, scale: 1.5, x: heart.x }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 left-0 text-rose-500 pointer-events-none"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </button>
              {hypeCount > 0 && (
                <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-rose-500 text-white px-1 rounded-sm">
                  {hypeCount}
                </span>
              )}
            </div>

            <button
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-lg transition-all duration-300 hover:scale-110",
                isBookmarked
                  ? "bg-secondary/20 text-secondary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark
                className={cn("w-4 h-4 transition-all", isBookmarked && "fill-current")}
              />
            </button>
          </div>
        </div>

        {/* Title & org */}
        <h3 className="font-display text-xl font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{organization}</p>

        {/* Prize/Reward */}
        {prize && (
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 mb-4"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            <span className="text-sm font-medium text-accent">{prize}</span>
          </motion.div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{deadline}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()}</span>
          </div>
        </div>

        {/* Action button */}
        <Button variant="ghost" className="w-full group/btn justify-between hover:bg-primary/10">
          <span>Explore</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Live viewers indicator */}
      <div className="absolute bottom-4 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs text-muted-foreground" suppressHydrationWarning>
          {mounted ? viewingNow : 10} viewing
        </span>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
