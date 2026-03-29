'use client';

import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagSelectorProps {
  initialTags?: string[] | null;
  name?: string;
  placeholder?: string;
}

export function TagSelector({ initialTags = [], name = 'tags', placeholder = 'Add tag and press Enter...' }: TagSelectorProps) {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
        <AnimatePresence mode="popLayout">
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-wider"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-red-500 transition-colors p-0.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 min-w-[140px] text-gray-900 dark:text-white"
        />
      </div>
      
      {/* Hidden input to pass tags as comma separated string to server action */}
      <input type="hidden" name={name} value={tags.join(',')} />
      
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-gray-400 font-medium italic uppercase tracking-widest">Type a tag and press Enter</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tags.length} Tags Added</p>
      </div>
    </div>
  );
}
