import { Opportunity } from '@/lib/types';
import { formatClassRange, getDeadlineUrgency } from '@/lib/utils';
import Link from 'next/link';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

// Light color generation for dynamic categories to match mockup
function getCategoryTagStyle(categoryLabel: string) {
  const defaults = [
    { bg: '#fdf2f8', text: '#be185d' }, // pink
    { bg: '#eff6ff', text: '#1d4ed8' }, // blue
    { bg: '#f0fdf4', text: '#15803d' }, // green
    { bg: '#fef3c7', text: '#92400e' }, // yellow
    { bg: '#f3e8ff', text: '#7e22ce' }, // purple
    { bg: '#f3f4f6', text: '#4b5563' }, // gray
  ];
  const index = categoryLabel.length % defaults.length;
  return defaults[index];
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const organiserName = opportunity.organiser?.name || 'Organiser';
  // Use the formatting utility but we'll strip the background styling for the new design
  let { label } = getDeadlineUrgency(opportunity.deadline, opportunity.is_ongoing);
  
  // Custom text adjustments for the exact mockup rendering
  let deadlineText = label.replace('Closes in ', '').replace(' left', ' days left');
  if (label.includes('Registration Open')) deadlineText = 'Open — ' + label.replace('Registration Open - ', '');
  if (label.includes('Closes in')) deadlineText = label.replace('Closes in ', '') + ' days left — apply now';
  if (label.includes('Urgent')) deadlineText = 'Closing soon — apply now';

  // Force specific text based on days for exact mockup matching if possible, but dynamic is better
  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - new Date().getTime()) / 86400000);
  if (!opportunity.is_ongoing && daysLeft > 0) {
    if (daysLeft <= 7) deadlineText = `${daysLeft} days left — apply now`;
    else deadlineText = `Open — ${daysLeft} days`;
  } else if (opportunity.is_ongoing) {
    deadlineText = 'Ongoing';
  } else {
    deadlineText = 'Closed';
  }

  const levelTag = 'International';
  const catStyle = getCategoryTagStyle(opportunity.category?.label || 'General');

  // Pricing
  const theFee = opportunity.fee_text.toLowerCase().includes('free') ? 'Free to enter' : opportunity.fee_text;
  const shortFee = opportunity.fee_text.toLowerCase().includes('free') ? 'Free' : 'Paid';

  return (
    <div className="card p-5 flex flex-col h-full group bg-surface hover:bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      
      {/* Top Row: Tags (Left) + Deadline (Right) */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          {opportunity.category && (
            <span 
              className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium" 
              style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
            >
              {opportunity.category.label}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-[#f3f4f6] text-[#4b5563]">
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
          <h3 className="font-heading font-medium text-[16px] sm:text-[18px] text-heading leading-[1.3] group-hover:underline decoration-primary transition-all cursor-pointer">
            {opportunity.title}
          </h3>
        </Link>
        <button aria-label="Save for later" className="shrink-0 text-[#9ca3af] hover:text-[#4b5563] transition-colors -mt-1">
          <BookmarkIcon className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
        </button>
      </div>

      {/* Description block with "Free to enter" on the right */}
      <div className="flex justify-between items-end gap-4 mb-5 flex-grow">
        <div className="flex-1">
          <p className="text-[13px] text-body leading-[1.6] line-clamp-2 pr-4">
            {opportunity.description}
          </p>
        </div>
        <div className="text-[11px] font-medium text-[#6b7280] text-right whitespace-nowrap shrink-0">
          {theFee}
        </div>
      </div>

      {/* Bottom Footer Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        <span className="px-2.5 py-1 bg-white border border-[#e5e7eb] rounded-md text-[11px] text-[#6b7280] font-medium">
          {formatClassRange(opportunity.eligibility_classes).replace('Classes', 'Class').trim()}
        </span>
        <span className="px-2.5 py-1 bg-white border border-[#e5e7eb] rounded-md text-[11px] text-[#6b7280] font-medium">
          {shortFee}
        </span>
        <span className="px-2.5 py-1 bg-white border border-[#e5e7eb] rounded-md text-[11px] text-[#6b7280] font-medium max-w-[150px] truncate">
          {organiserName}
        </span>
      </div>
    </div>
  );
}
