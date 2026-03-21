import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showPulse?: boolean;
}

const sizeClasses = {
  xs: 'text-[16px]',
  sm: 'text-[22px]',
  md: 'text-[28px]',
  lg: 'text-[36px]',
  xl: 'text-[48px]',
};

export function Logo({ 
  className, 
  variant = 'light', 
  size = 'md', 
  showPulse = false 
}: LogoProps) {
  return (
    <div className={cn(
      "logo select-none",
      variant === 'dark' && "logo-on-dark",
      sizeClasses[size],
      className
    )}>
      <span className="my">My</span>
      <span className="ark">ark</span>
      
      {showPulse && (
        <div className="pulse-wrap">
          <div className={cn(
            "pulse-ring-el",
            variant === 'dark' ? "pulse-ring-el-dark" : "pulse-ring-el-light"
          )}></div>
          <div className={cn(
            "pulse-core-el",
            variant === 'dark' ? "pulse-core-el-dark" : "pulse-core-el-light"
          )}></div>
        </div>
      )}
    </div>
  );
}
