'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState, useCallback } from 'react';

interface BlogEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function BlogEditor({ name, defaultValue = '', placeholder = 'Start writing your blog post...' }: BlogEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [mode, setMode] = useState<'visual' | 'html'>('visual');
  const [htmlSource, setHtmlSource] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      setHtmlSource(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-gray-800 dark:text-gray-200',
      },
    },
  });

  useEffect(() => {
    if (editor && defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue);
      setHtmlSource(defaultValue);
    }
  }, [defaultValue, editor]);

  const switchToVisual = useCallback(() => {
    if (editor) {
      editor.commands.setContent(htmlSource);
      setContent(htmlSource);
    }
    setMode('visual');
  }, [editor, htmlSource]);

  const switchToHtml = useCallback(() => {
    if (editor) {
      setHtmlSource(editor.getHTML());
    }
    setMode('html');
  }, [editor]);

  const handleHtmlChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlSource(val);
    setContent(val);
  }, []);

  if (!editor) {
    return <div className="animate-pulse bg-gray-100 dark:bg-white/5 h-[400px] rounded-xl"></div>;
  }

  interface MenuButtonProps {
    onClick: () => void | boolean;
    isActive: boolean;
    icon?: React.ReactNode;
    title: string;
    label?: string;
  }

  const MenuButton = ({ onClick, isActive, icon, title, label }: MenuButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
        isActive ? 'bg-[#0066FF] text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'
      }`}
      title={title}
    >
      {icon || <span className="font-bold text-sm tracking-tight">{label}</span>}
    </button>
  );

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition-all bg-white dark:bg-[#161616] group/editor shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50/80 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/10">
        {mode === 'visual' && (
          <>
            <MenuButton 
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              label="B"
              title="Bold"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              label="I"
              title="Italic"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              label="U"
              title="Underline"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              label="S"
              title="Strikethrough"
            />
            
            <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10 mx-1"></div>

            <MenuButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              label="H1"
              title="Heading 1"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              label="H2"
              title="Heading 2"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              label="H3"
              title="Heading 3"
            />

            <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10 mx-1"></div>

            <MenuButton 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              )}
              title="Bullet List"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
              )}
              title="Ordered List"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15h6V9H4v6h2zm12 0h6V9h-8v6h2z"></path></svg>
              )}
              title="Blockquote"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              )}
              title="Code Block"
            />
            
            <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10 mx-1"></div>

            <MenuButton 
              onClick={() => {
                const url = window.prompt('Enter URL');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              isActive={editor.isActive('link')}
              icon={(
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              )}
              title="Insert Link"
            />
            <MenuButton 
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              isActive={false}
              label="—"
              title="Horizontal Rule"
            />
          </>
        )}

        {/* Mode Toggle */}
        <div className="ml-auto flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
          <button
            type="button"
            onClick={switchToVisual}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              mode === 'visual' 
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={switchToHtml}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              mode === 'html' 
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {mode === 'visual' ? (
          <>
            <EditorContent editor={editor} />
            {editor.isEmpty && (
              <div className="absolute top-6 left-6 pointer-events-none text-gray-400 dark:text-gray-600 text-base italic">
                {placeholder}
              </div>
            )}
          </>
        ) : (
          <textarea
            value={htmlSource}
            onChange={handleHtmlChange}
            className="w-full min-h-[400px] p-6 bg-gray-900 dark:bg-[#0d0d0d] text-blue-400 font-mono text-sm leading-relaxed resize-y focus:outline-none"
            placeholder="<p>Write your HTML here...</p>"
            spellCheck={false}
          />
        )}
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={content} />

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
        <div className="flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full ${mode === 'visual' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
           {mode === 'visual' ? 'WYSIWYG Mode' : 'HTML Source Mode'}
        </div>
        <div className="group-hover/editor:text-[#0066FF] dark:group-hover/editor:text-blue-400 transition-colors italic">
           Blog Editor — Tiptap Rich Text
        </div>
      </div>
    </div>
  );
}
