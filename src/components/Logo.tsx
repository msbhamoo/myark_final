import { cn } from '@/lib/utils';

/**
 * BRAND LOGO - PIXEL PERFECT EDITION
 * 
 * Aligns the tagline #beremarkable precisely from 'ark' to 'k'
 */

interface LogoProps {
  className?: string;
  variant?: 'brand' | 'black' | 'white';
  type?: 'full' | 'mark' | 'stacked';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const heights = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 48,
  xl: 80,
};

export function Logo({ 
  className, 
  variant = 'brand', 
  type = 'full',
  size = 'md',
}: LogoProps) {
  
  const h = heights[size];
  const iconColor = variant === 'black' ? '#000000' : (variant === 'white' ? '#FFFFFF' : '#1F58CB');
  const textColor = variant === 'black' ? '#000000' : (variant === 'white' ? '#FFFFFF' : 'var(--color-heading)');
  const overlapOpacity = variant === 'brand' ? '0.2' : (variant === 'white' ? '0.3' : '0.1');

  const IconSVG = (
    <svg 
      width={h * 1.5} 
      height={h} 
      viewBox="580 670 450 260" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path fill={iconColor} opacity={overlapOpacity} d="M1009.65,870.69 C1005.24,864.34 1002.13,856.55 996.66,851.15 C971.32,826.14 930.14,837.67 919.97,872.15 C919.83,872.62 919.66,873.08 919.21,873.78 C918.68,873.6 918.22,873.18 918.24,872.79 C918.71,862.85 919.31,852.92 919.65,842.98 C919.71,841.09 918.75,836.97 C918,836.97 C943.2,811.12 968.66,785.58 994.12,760.05 C1000.13,754.01 1005.67,747.63 1008.7,739.15 C1009.37,740.34 1010.03,741.72 1010.03,743.09 C1010.09,785.01 1010.07,826.94 1010.06,868.86 C1010.06,869.36 1009.65,870.69 z"/>
      <path fill={iconColor} opacity={overlapOpacity} d="M849.79,772.73 C832.35,790.87 814.66,808.69 796.95,826.49 C789.67,833.8 782.5,841.23 775.02,848.33 C767.07,855.87 761.46,864.66 758.8,875.72 C758.35,873.95 757.93,871.86 757.92,869.76 C757.83,856.72 757.84,843.67 757.57,830.21 C764.15,822.8 770.91,815.74 777.8,808.82 C796.44,790.11 815.04,771.37 833.85,752.85 C840.91,745.91 846.09,738.08 848.75,728.23 C849.06,738.53 849.15,759.61 z"/>
      <path fill={iconColor} d="M757.33,829.8 C745.36,841.6 733.35,853.35 721.43,865.2 C704.79,881.77 687.94,898.13 671.69,915.07 C649.4,938.32 613.94,934.14 597.58,907.84 C590.56,896.56 589.57,884.41 592.7,871.66 C594.79,863.14 599.58,856.47 605.68,850.38 C660.5,795.67 715.26,740.88 770.02,686.11 C790.16,665.97 820.03,666.86 838.84,688.23 C847.67,698.25 850.25,710.22 849.34,723.9 C849.18,725.09 849.2,725.57 849.23,726.04 C849.16,726.48 849.1,726.91 848.75,727.9 C846.09,738.08 840.91,745.91 833.85,752.85 C815.04,771.37 796.44,790.11 777.8,808.82 C770.91,815.74 764.15,822.8 757.33,829.8 z"/>
      <path fill={iconColor} d="M917.74,836.66 C900.52,853.76 883.28,870.85 866.07,887.96 C856.75,897.23 847.55,906.6 838.18,915.82 C811.71,941.86 770.53,931.52 760.03,895.93 C758.27,889.98 759.02,883.3 758.82,876.17 C761.46,864.66 767.07,855.87 775.02,848.33 C782.5,841.23 789.67,833.8 796.95,826.49 C814.66,808.69 832.35,790.87 850.06,773.05 C867.63,755.61 885.22,738.18 902.77,720.72 C912.32,711.21 921.62,701.46 931.38,692.18 C936.02,687.77 940.92,682.38 946.67,680.67 C957.4,677.47 968.74,676.28 979.96,680.4 C1003.51,689.03 1015.09,711.73 1008.74,738.73 C1005.67,747.63 1000.13,754.01 994.12,760.05 C968.66,785.58 943.2,811.12 917.74,836.66 z"/>
      <path fill={iconColor} d="M1009.43,871.04 C1013.23,888.27 1010,903.72 997.4,916.56 C983.98,930.25 964.51,934.03 946.77,926.67 C929.29,919.42 918.48,902.91 918.5,883.41 C918.51,880.59 918.78,877.76 919.21,874.25 C919.66,873.08 919.83,872.62 919.97,872.15 C930.14,837.67 971.32,826.14 996.66,851.15 C1002.13,856.55 1005.24,864.34 1009.43,871.04 z"/>
    </svg>
  );

  if (type === 'mark') {
    return (
      <div className={cn("inline-flex flex-col items-center", className)}>
        {IconSVG}
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex select-none group items-center",
      type === 'stacked' ? "flex-col text-center" : "flex-row gap-2.5",
      className
    )}>
      {IconSVG}
      
      <div className="flex flex-col leading-none items-end">
        <span 
          className={cn(
            "font-black tracking-tighter select-none",
            textColor === 'var(--color-heading)' ? "text-heading" : ""
          )}
          style={{ 
            fontSize: h * 0.85,
            lineHeight: 1,
            color: textColor !== 'var(--color-heading)' ? textColor : undefined,
            fontFamily: 'Outfit, sans-serif'
          }}
        >
          myark
        </span>
        
        {/* Aligned Tagline: Starts after 'y' and ends at 'k' */}
        <span 
          className={cn(
            "uppercase tracking-[0.16em] font-black mt-1",
            variant === 'brand' ? "text-[#1F58CB]" : (variant === 'white' ? "text-white" : "text-heading")
          )}
          style={{ 
            fontSize: h * 0.22,
            alignSelf: 'flex-end',
            marginRight: '-1px' // Micro-adjustment for terminal 'k' stem
          }}
        >
          #beremarkable
        </span>
      </div>
    </div>
  );
}
