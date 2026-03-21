import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dmsans',
  display: 'swap',
});

// For backward compatibility with existing tailwind classes if needed, 
// though we will update globals.css to point the variables correctly.
export const syne = bricolage; 
export const inter = dmSans;
