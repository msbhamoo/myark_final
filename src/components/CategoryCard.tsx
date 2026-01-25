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
        "group relative glass-card p-6 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in",
        colors.glow
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient border on hover */}


      {/* Icon container */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
        colors.bg,
        "border",
        colors.border
      )}>
        <div className={cn("w-7 h-7", colors.icon)}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold mb-1 group-hover:text-foreground transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        <span className={cn("font-semibold", colors.icon)}>{count}+</span> opportunities
      </p>

      {/* Arrow indicator */}
      <div className={cn(
        "absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0",
        colors.bg
      )}>
        <svg className={cn("w-4 h-4", colors.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default CategoryCard;
