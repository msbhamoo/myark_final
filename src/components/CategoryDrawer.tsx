'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import Link from 'next/link';
import { Category } from '@/lib/types';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDrawer({ isOpen, onClose }: CategoryDrawerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    setCategories(data || []);
  }, [supabase]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
    
    // Lock scroll when open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, categories.length, fetchCategories]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-[70] bg-white dark:bg-[#0a0a0a] rounded-t-[32px] transition-transform duration-500 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } max-h-[85vh] overflow-y-auto shadow-2xl overflow-x-hidden`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mt-4 mb-6" />

        <div className="px-6 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-black text-gray-900 dark:text-white tracking-tight">
              Explore <span className="text-primary italic">Categories</span>
            </h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[20px]">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/opportunities?category=${cat.slug}`}
                onClick={onClose}
                className="flex flex-col p-4 rounded-2xl bg-[#f8fafc] dark:bg-white/5 border border-blue-50/50 dark:border-white/5 active:scale-95 transition-all"
              >
                <span className="text-3xl mb-3">{cat.icon_name}</span>
                <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
            
            <Link
              href="/opportunities"
              onClick={onClose}
              className="flex flex-col p-4 rounded-2xl bg-primary/5 border border-primary/10 active:scale-95 transition-all"
            >
              <span className="text-3xl mb-3">📂</span>
              <span className="text-[13px] font-bold text-primary leading-tight">
                View All
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
