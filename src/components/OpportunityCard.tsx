import { Opportunity } from '@/lib/types';
import { formatClassRange, getDeadlineUrgency, getDaysUntilDeadline } from '@/lib/utils';
import Link from 'next/link';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function getCategoryTagClass(categoryLabel: string) {
  const defaults = [
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  ];
  const index = categoryLabel.length % defaults.length;
  return defaults[index];
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const organiserName = opportunity.organiser?.name || 'Organiser';
  // Use the formatting utility but we'll strip the background styling for the new design
  const { label } = getDeadlineUrgency(opportunity.deadline, opportunity.is_ongoing);
  
  // Custom text adjustments for the exact mockup rendering
  let deadlineText = label.replace('Closes in ', '').replace(' left', ' days left');
  if (label.includes('Registration Open')) deadlineText = 'Open — ' + label.replace('Registration Open - ', '');
  if (label.includes('Closes in')) deadlineText = label.replace('Closes in ', '') + ' days left — apply now';
  if (label.includes('Urgent')) deadlineText = 'Closing soon — apply now';

  // Force specific text based on days for exact mockup matching if possible, but dynamic is better
  const daysLeft = getDaysUntilDeadline(opportunity.deadline);
  
  if (!opportunity.is_ongoing && daysLeft !== null && daysLeft > 0) {
    if (daysLeft <= 7) deadlineText = `${daysLeft} days left — apply now`;
    else deadlineText = `Open — ${daysLeft} days`;
  } else if (opportunity.is_ongoing) {
    deadlineText = 'Ongoing';
  } else if (daysLeft !== null && daysLeft <= 0) {
    deadlineText = 'Closed';
  } else {
    deadlineText = 'Open registration';
  }

  const levelTag = 'International';
  const catClass = getCategoryTagClass(opportunity.category?.label || 'General');

  // Pricing
  const theFee = opportunity.fee_text.toLowerCase().includes('free') ? 'Free to enter' : opportunity.fee_text;
  const shortFee = opportunity.fee_text.toLowerCase().includes('free') ? 'Free' : 'Paid';

  return (
    <div className="card p-5 flex flex-col h-full group bg-surface hover:bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-none">
      
      {/* Top Row: Tags (Left) + Deadline (Right) */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          {opportunity.category && (
            <span 
              className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold ${catClass}`} 
            >
              {opportunity.category.label}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
            {levelTag}
          </span>
        </div>
        
        <div className="text-[11px] font-medium text-heading whitespace-nowrap shrink-0">
          {deadlineText}
        </div>
      </div>

      {/* Main Content Area */}
      {/* Title block with bookmark on the right */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <Link href={`/opportunities/${opportunity.slug}`} className="flex-1 outline-none">
          <h3 className="font-heading font-extrabold text-[16px] sm:text-[18px] text-heading leading-[1.3] group-hover:underline decoration-primary transition-all cursor-pointer">
            {opportunity.title}
          </h3>
        </Link>
        <button aria-label="Save for later" className="shrink-0 text-[#9ca3af] hover:text-[#4b5563] transition-colors -mt-1">
          <BookmarkIcon className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
        </button>
      </div>

      {/* Description block with "Free to enter" on the right */}
      <div className="flex justify-between items-start gap-4 mb-5 flex-grow">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-body leading-[1.6] line-clamp-2 pr-4">
            {opportunity.description}
          </p>
        </div>
        <div className="text-[11px] font-medium text-[#6b7280] text-right sm:max-w-[40%] leading-relaxed">
          {theFee}
        </div>
      </div>

      {/* Bottom Footer Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        <span className="px-2.5 py-1 bg-gray-50 dark:bg-white/5 border border-[var(--color-border-default)] rounded-md text-[11px] text-muted font-medium">
          {formatClassRange(opportunity.eligibility_classes).replace('Classes', 'Class').trim()}
        </span>
        <span className="px-2.5 py-1 bg-gray-50 dark:bg-white/5 border border-[var(--color-border-default)] rounded-md text-[11px] text-muted font-medium">
          {shortFee}
        </span>
        <span className="px-2.5 py-1 bg-gray-50 dark:bg-white/5 border border-[var(--color-border-default)] rounded-md text-[11px] text-muted font-medium max-w-[150px] truncate">
          {organiserName}
        </span>
      </div>
    </div>
  );
}
