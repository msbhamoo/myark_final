import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  count: number;
  color: "primary" | "secondary" | "accent" | "success";
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "text-primary",
    glow: "group-hover:shadow-[0_0_40px_hsl(185_100%_50%_/_0.3)]",
  },
  secondary: {
    bg: "bg-secondary/10",
    border: "border-secondary/30",
    icon: "text-secondary",
    glow: "group-hover:shadow-[0_0_40px_hsl(15_95%_60%_/_0.3)]",
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/30",
    icon: "text-accent",
    glow: "group-hover:shadow-[0_0_40px_hsl(45_100%_55%_/_0.3)]",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "text-success",
    glow: "group-hover:shadow-[0_0_40px_hsl(150_80%_50%_/_0.3)]",
  },
};

const CategoryCard = ({ icon, title, count, color, delay = 0 }: CategoryCardProps) => {
  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "group relative glass-card p-3 md:p-4 cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:scale-105 animate-fade-in w-[150px] md:w-[180px] shrink-0",
        colors.glow
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon container */}
      <div className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mb-2 md:mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
        colors.bg,
        "border",
        colors.border
      )}>
        <div className={cn("w-4 h-4 md:w-5 md:h-5", colors.icon)}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-sm md:text-base font-bold mb-0.5 group-hover:text-foreground transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-[10px] md:text-xs text-muted-foreground">
        <span className={cn("font-semibold", colors.icon)}>{count}+</span> Quests
      </p>

      {/* Arrow indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-6 h-6 rounded-full hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300",
        colors.bg
      )}>
        <svg className={cn("w-3 h-3", colors.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default CategoryCard;
