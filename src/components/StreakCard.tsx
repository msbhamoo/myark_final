import { Flame, Zap, Star, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  xp: number;
  level: number;
  nextLevelXp: number;
}

const StreakCard = ({ streak, xp, level, nextLevelXp }: StreakCardProps) => {
  const progressPercentage = (xp / nextLevelXp) * 100;

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Your Progress</h3>
          <div className="badge-streak">
            <Flame className="w-4 h-4" />
            {streak} day streak!
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl bg-muted/50 transition-all hover:bg-muted hover:scale-105 cursor-pointer group">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold font-display">{xp}</div>
            <div className="text-xs text-muted-foreground">XP Earned</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50 transition-all hover:bg-muted hover:scale-105 cursor-pointer group">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold font-display">{level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50 transition-all hover:bg-muted hover:scale-105 cursor-pointer group">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold font-display">12</div>
            <div className="text-xs text-muted-foreground">Goals Done</div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {level}</span>
            <span className="font-medium">{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {nextLevelXp - xp} XP to Level {level + 1}! Keep exploring 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
