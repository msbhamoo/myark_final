'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

interface Organiser {
  id: string;
  name: string;
}

interface OrganiserSelectorProps {
  initialOrganisers: Organiser[];
  defaultId?: string;
}

export function OrganiserSelector({ initialOrganisers, defaultId }: OrganiserSelectorProps) {
  const [organisers, setOrganisers] = useState<Organiser[]>(initialOrganisers);
  const [selectedId, setSelectedId] = useState(defaultId || '');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleAddOrganiser = async () => {
    if (!newName.trim()) return;
    setLoading(true);

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const { data: newOrg, error } = await supabase
      .from('organisers')
      .insert({
        name: newName.trim(),
        slug: slug,
      })
      .select('id, name')
      .single();

    if (error) {
      alert('Error adding organiser: ' + error.message);
      setLoading(false);
      return;
    }

    if (newOrg) {
      setOrganisers(prev => [...prev, newOrg].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedId(newOrg.id);
      setIsAdding(false);
      setNewName('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select 
          name="organiser_id" 
          value={selectedId} 
          onChange={(e) => setSelectedId(e.target.value)}
          required 
          className="input flex-1"
        >
          <option value="">Select Organiser</option>
          {organisers.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
        <button 
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 h-11 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-lg text-lg font-bold transition-all"
          title="Add New Organiser"
        >
          {isAdding ? '✕' : '+'}
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Organiser Name</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Science Olympiad Foundation" 
                className="input flex-1 bg-white dark:bg-[#111]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOrganiser();
                  }
                }}
              />
              <button 
                type="button"
                onClick={handleAddOrganiser}
                disabled={loading || !newName.trim()}
                className="px-4 bg-primary text-white font-bold rounded-lg text-sm disabled:opacity-50 transition-all"
              >
                {loading ? '...' : 'Add'}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">Adding a new organiser will immediately save it to the database.</p>
        </div>
      )}
    </div>
  );
}
