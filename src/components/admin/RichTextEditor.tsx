'use client';

import { useState, useRef } from 'react';

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({ name, defaultValue = '', placeholder = '', rows = 5 }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newValue = `${beforeText}${before}${selectedText}${after}${afterText}`;
    setValue(newValue);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-100">
        <button 
          type="button" 
          onClick={() => insertText('**', '**')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 font-bold transition-colors"
          title="Bold"
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => insertText('*', '*')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 italic transition-colors"
          title="Italic"
        >
          I
        </button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button 
          type="button" 
          onClick={() => insertText('\n- ', '')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 font-bold transition-colors"
          title="Bullet List"
        >
          •
        </button>
        <button 
          type="button" 
          onClick={() => insertText('\n1. ', '')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 font-bold transition-colors"
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button 
          type="button" 
          onClick={() => insertText('[', '](https://)')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 font-bold transition-colors underline"
          title="Link"
        >
          L
        </button>
      </div>

      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-4 text-[14px] leading-relaxed outline-none resize-y min-h-[120px] font-sans text-gray-800"
      />

      {/* Preview toggle hint */}
      <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Markdown Supported</span>
        <span className="text-[10px] text-gray-400 italic">Formatting will be applied on the live site</span>
      </div>
    </div>
  );
}
