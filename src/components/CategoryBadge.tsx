import { Category } from '@/lib/types';
import { DEFAULT_CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category?: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  if (!category) return null;

  // Fallback to constants if DB colors are somehow missing
  const fallback = DEFAULT_CATEGORY_COLORS[category.slug] || DEFAULT_CATEGORY_COLORS['innovation'];
  
  const bg = category.bg_color || fallback.bg;
  const text = category.text_color || fallback.text;

  return (
    <div
      className={cn('badge', className)}
      style={{ backgroundColor: bg, color: text }}
    >
      {category.icon_name && (
        <span className="mr-0.5">{category.icon_name}</span>
      )}
      <span>{category.label}</span>
    </div>
  );
}
