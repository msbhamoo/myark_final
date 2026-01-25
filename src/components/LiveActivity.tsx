import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trophy, Bookmark, Send, Flame } from "lucide-react";

interface Activity {
  id: number;
  name: string;
  action: string;
  item: string;
  avatar: string;
  time: string;
  icon: "apply" | "bookmark" | "win" | "streak";
}

const activities: Activity[] = [
  { id: 1, name: "Priya", action: "just applied to", item: "Google Code-In", avatar: "P", time: "2s ago", icon: "apply" },
  { id: 2, name: "Arjun", action: "bookmarked", item: "KVPY Fellowship", avatar: "A", time: "5s ago", icon: "bookmark" },
  { id: 3, name: "Sneha", action: "won", item: "Math Olympiad �x� ", avatar: "S", time: "12s ago", icon: "win" },
  { id: 4, name: "Rahul", action: "is on a", item: "7-day streak! =%", avatar: "R", time: "18s ago", icon: "streak" },
  { id: 5, name: "Ananya", action: "just applied to", item: "Tata Scholarship", avatar: "A", time: "25s ago", icon: "apply" },
  { id: 6, name: "Vikram", action: "unlocked", item: "Explorer Badge", avatar: "V", time: "32s ago", icon: "win" },
  { id: 7, name: "Meera", action: "bookmarked", item: "Web Dev Bootcamp", avatar: "M", time: "45s ago", icon: "bookmark" },
];

const iconConfig = {
  apply: { icon: Send, color: "text-primary" },
  bookmark: { icon: Bookmark, color: "text-secondary" },
  win: { icon: Trophy, color: "text-accent" },
  streak: { icon: Flame, color: "text-secondary" },
};

const LiveActivity = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentIndex];
  const IconComponent = iconConfig[activity.icon].icon;
  const iconColor = iconConfig[activity.icon].color;

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-card px-4 py-3 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {activity.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card flex items-center justify-center`}>
                <IconComponent className={`w-3 h-3 ${iconColor}`} />
              </div>
            </div>
            <div className="text-sm">
              <span className="font-semibold">{activity.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.item}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivity;
