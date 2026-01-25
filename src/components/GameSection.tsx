import StreakCard from "./StreakCard";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Crown, Star, Gift, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Confetti from "./Confetti";

const achievements = [
  { icon: Trophy, label: "First Win", unlocked: true },
  { icon: Medal, label: "Explorer", unlocked: true },
  { icon: Crown, label: "Champion", unlocked: false },
  { icon: Star, label: "All-Star", unlocked: false },
  { icon: Gift, label: "Referrer", unlocked: true },
  { icon: Rocket, label: "Speedster", unlocked: false },
];

const GameSection = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAchievementClick = (unlocked: boolean) => {
    if (unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  return (
    <section className="py-24 px-4 relative">
      <Confetti isActive={showConfetti} />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Level Up Your <span className="gradient-text-primary">Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every opportunity you explore earns you XP. Collect achievements and climb the leaderboard!
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Streak card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <StreakCard
              streak={7}
              xp={1250}
              level={5}
              nextLevelXp={2000}
            />
          </motion.div>

          {/* Achievements card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Achievements</h3>
              <span className="text-sm text-muted-foreground">3/6 unlocked</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {achievements.map(({ icon: Icon, label, unlocked }, index) => (
                <motion.div
                  key={label}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: unlocked ? 1.1 : 1 }}
                  whileTap={{ scale: unlocked ? 0.95 : 1 }}
                  onClick={() => handleAchievementClick(unlocked)}
                  className={`relative p-4 rounded-xl text-center transition-all duration-300 cursor-pointer group ${unlocked
                    ? "bg-accent/10 border border-accent/30 hover:bg-accent/20"
                    : "bg-muted/30 border border-muted opacity-50"
                    }`}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-2 transition-transform ${unlocked ? "text-accent group-hover:rotate-12" : "text-muted-foreground"
                      }`}
                  />
                  <span className="text-xs font-medium">{label}</span>
                  {unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <Button
              variant="accent"
              className="w-full"
              onClick={() => navigate("/profile")}
            >
              View All Achievements
            </Button>
          </motion.div>
        </div>

        {/* Leaderboard teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass-card p-6 md:p-8 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center"
                whileHover={{ rotate: 10 }}
              >
                <Crown className="w-8 h-8 text-accent-foreground" />
              </motion.div>
              <div>
                <h3 className="font-display text-xl font-bold">Weekly Leaderboard</h3>
                <p className="text-muted-foreground">You're currently ranked <span className="text-secondary font-bold">#42</span> 🔥</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🥇", "🥈", "🥉", "4", "5"].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm font-bold"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
              <Button variant="outline">
                See Rankings
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameSection;
