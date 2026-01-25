import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Gift, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";

interface DailyRewardProps {
  streak: number;
  onClose: () => void;
}

const DailyReward = ({ streak, onClose }: DailyRewardProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const xpReward = 50 + (streak * 10);

  const handleClaim = () => {
    setShowConfetti(true);
    setClaimed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-card p-8 max-w-sm w-full text-center relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-radial from-secondary/20 via-transparent to-transparent pointer-events-none" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Flame className="w-10 h-10 text-accent-foreground" />
            </div>

            <h2 className="font-display text-2xl font-bold mb-2">
              {streak} Day Streak! 🔥
            </h2>
            <p className="text-muted-foreground mb-6">
              You're on fire! Keep exploring to maintain your streak.
            </p>

            {/* Reward box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-muted/50 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-3">
                <Gift className="w-6 h-6 text-accent" />
                <span className="text-2xl font-bold font-display gradient-text-secondary">
                  +{xpReward} XP
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Daily streak bonus
              </p>
            </motion.div>

            {/* CTA */}
            {!claimed ? (
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleClaim}
              >
                <Sparkles className="w-5 h-5" />
                Claim Reward
              </Button>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-success"
              >
                ✓ Claimed!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DailyReward;
