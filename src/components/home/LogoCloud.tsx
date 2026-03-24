'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import Image from 'next/image';

interface BrandLogo {
  id: string;
  name: string;
  logo_url: string;
}

export function LogoCloud() {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogos() {
      const { data } = await supabase
        .from('brand_logos')
        .select('id, name, logo_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      setLogos(data || []);
    }
    fetchLogos();
  }, [supabase]);

  return (
    <div className="w-full relative overflow-hidden py-8">
      {/* GRADIENT MASK FOR SMOOTH FADE */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#0a0a0a] to-transparent z-10"></div>
      
      <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-20 items-center">
        {/* DUPLICATE LOGOS FOR CONTINUOUS SCROLL */}
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <div key={`${logo.id}-${index}`} className="flex-shrink-0 h-8 md:h-10 w-28 md:w-32 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <Image 
              src={logo.logo_url} 
              alt={logo.name} 
              fill
              className="object-contain" 
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
