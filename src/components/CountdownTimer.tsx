import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  deadline: Date;
  size?: "sm" | "md" | "lg";
}

const CountdownTimer = ({ deadline, size = "md" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deadline.getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const sizeClasses = {
    sm: { container: "gap-1", box: "w-10 h-10", number: "text-sm", label: "text-[8px]" },
    md: { container: "gap-2", box: "w-14 h-14", number: "text-xl", label: "text-[10px]" },
    lg: { container: "gap-3", box: "w-20 h-20", number: "text-3xl", label: "text-xs" },
  };

  const classes = sizeClasses[size];
  const isUrgent = timeLeft.days < 3;

  return (
    <div className={`flex ${classes.container}`}>
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          className={`${classes.box} rounded-xl flex flex-col items-center justify-center ${
            isUrgent ? "bg-destructive/20 border border-destructive/30" : "bg-muted"
          }`}
        >
          <motion.span
            key={item.value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`font-display font-bold ${classes.number} ${isUrgent ? "text-destructive" : ""}`}
          >
            {String(item.value).padStart(2, "0")}
          </motion.span>
          <span className={`${classes.label} text-muted-foreground uppercase`}>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
