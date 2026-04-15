'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import Image from 'next/image';

interface BrandLogo {
  id: string;
  name: string;
  logo_url: string;
  is_active: boolean;
  sort_order: number;
}

export default function BrandLogosAdmin() {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLogo, setNewLogo] = useState({ name: '', logo_url: '', sort_order: 0 });
  const supabase = createClient();

  const fetchLogos = useCallback(async () => {
    const { data } = await supabase
      .from('brand_logos')
      .select('*')
      .order('sort_order', { ascending: true });
    setLogos(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLogos();
  }, [fetchLogos]);

  async function handleAdd() {
    if (!newLogo.name || !newLogo.logo_url) return;
    const { error } = await supabase.from('brand_logos').insert([newLogo]);
    if (!error) {
      setNewLogo({ name: '', logo_url: '', sort_order: 0 });
      setIsAdding(false);
      fetchLogos();
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('brand_logos').update({ is_active: !current }).eq('id', id);
    fetchLogos();
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this logo?')) {
      await supabase.from('brand_logos').delete().eq('id', id);
      fetchLogos();
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Partner Logos</h1>
          <p className="text-gray-500 text-sm mt-1">Manage logos for Schools and Organisers shown on the homepage.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="h-10 px-6 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all"
        >
          Add Partner
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Add Brand Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" placeholder="Brand Name" 
              className="px-4 py-2 border rounded-lg"
              value={newLogo.name} onChange={e => setNewLogo({...newLogo, name: e.target.value})}
            />
            <input 
              type="text" placeholder="Logo Image URL" 
              className="px-4 py-2 border rounded-lg"
              value={newLogo.logo_url} onChange={e => setNewLogo({...newLogo, logo_url: e.target.value})}
            />
            <input 
              type="number" placeholder="Order" 
              className="px-4 py-2 border rounded-lg"
              value={newLogo.sort_order} onChange={e => setNewLogo({...newLogo, sort_order: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
            <button onClick={handleAdd} className="px-6 py-2 bg-primary text-white font-bold rounded-lg">Save Logo</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logos.map(logo => (
              <tr key={logo.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2 border border-gray-200 relative overflow-hidden">
                    <Image 
                      src={logo.logo_url} 
                      alt={logo.name} 
                      fill
                      className="object-contain p-1" 
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{logo.name}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleActive(logo.id, logo.is_active)}
                    className={`text-xs px-2 py-1 rounded-full font-bold ${logo.is_active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {logo.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{logo.sort_order}</td>
                <td className="px-6 py-4 text-sm">
                   <button onClick={() => handleDelete(logo.id)} className="text-red-500 font-bold hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {logos.length === 0 && !loading && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No brand logos added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
