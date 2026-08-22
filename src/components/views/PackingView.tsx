import React, { useState } from 'react';
import { 
  Luggage, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  Scale,
  FileCheck,
  Shirt,
  Smartphone,
  Sparkle,
  HeartPulse,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trip, PackingItem } from '../../types';

interface PackingViewProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const PackingView: React.FC<PackingViewProps> = ({ trip, onUpdateTrip }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Clothing');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemEssential, setNewItemEssential] = useState(false);
  const [isSuggestingAI, setIsSuggestingAI] = useState(false);

  const categories = ['All', 'Documents', 'Clothing', 'Electronics', 'Toiletries', 'Health', 'Gear'];

  const packedCount = trip.packingList.filter((p) => p.packed).length;
  const totalCount = trip.packingList.length;
  const packedPercentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const totalWeightGrams = trip.packingList.reduce((sum, item) => sum + (item.weightGrams || 100) * item.quantity, 0);
  const totalWeightKg = (totalWeightGrams / 1000).toFixed(1);

  const togglePacked = (id: string) => {
    const updated = trip.packingList.map((item) => {
      if (item.id === id) {
        const nextState = !item.packed;
        if (nextState && packedCount + 1 === totalCount) {
          confetti({ particleCount: 60, spread: 60 });
        }
        return { ...item, packed: nextState };
      }
      return item;
    });
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `pack-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      packed: false,
      quantity: newItemQuantity,
      weightGrams: 200,
      essential: newItemEssential,
    };

    onUpdateTrip({
      ...trip,
      packingList: [...trip.packingList, newItem],
    });

    setNewItemName('');
    setNewItemQuantity(1);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateTrip({
      ...trip,
      packingList: trip.packingList.filter((p) => p.id !== id),
    });
  };

  const handleAIPackingSuggestions = async () => {
    setIsSuggestingAI(true);
    try {
      const res = await fetch('/api/gemini/packing-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cities: trip.cities.map((c) => c.name),
          durationDays: trip.dayPlans.length || 8,
          styles: trip.styles,
          seasonOrMonth: 'Autumn / October',
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const newItems: PackingItem[] = data.items.map((item: any, idx: number) => ({
          id: `ai-pack-${Date.now()}-${idx}`,
          name: item.name,
          category: item.category || 'Clothing',
          packed: false,
          quantity: item.quantity || 1,
          weightGrams: item.weightGrams || 200,
          essential: item.essential ?? true,
        }));

        // Append non-duplicate items
        const existingNames = new Set(trip.packingList.map((p) => p.name.toLowerCase()));
        const uniqueNew = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));

        onUpdateTrip({
          ...trip,
          packingList: [...trip.packingList, ...uniqueNew],
        });
      }
    } catch (e) {
      console.error('Packing AI suggestions error:', e);
    } finally {
      setIsSuggestingAI(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Documents': return <FileCheck className="w-4 h-4 text-sky-400" />;
      case 'Clothing': return <Shirt className="w-4 h-4 text-indigo-400" />;
      case 'Electronics': return <Smartphone className="w-4 h-4 text-amber-400" />;
      case 'Toiletries': return <Sparkle className="w-4 h-4 text-emerald-400" />;
      case 'Health': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      default: return <Package className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? trip.packingList
    : trip.packingList.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Luggage className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Smart Packing Checklist</h1>
              <p className="text-xs text-slate-400">Personalized multi-city luggage manager & weight tracker</p>
            </div>
          </div>
        </div>

        <button
          id="ai-packing-generator-btn"
          onClick={handleAIPackingSuggestions}
          disabled={isSuggestingAI}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-2 transition disabled:opacity-50"
        >
          {isSuggestingAI ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing climate & activities...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Auto-Suggest Packing Essentials</span>
            </>
          )}
        </button>
      </div>

      {/* Progress & Stats Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {packedPercentage}% Packed ({packedCount}/{totalCount} Items)
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Estimated luggage dry weight: <span className="text-sky-300 font-bold">~{totalWeightKg} kg ({Math.round(Number(totalWeightKg) * 2.20462)} lbs)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Checked vs Carry-On Ready</span>
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${packedPercentage}%` }}
          />
        </div>
      </div>

      {/* Add Item Quick Bar */}
      <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item (e.g. EU Travel Adapter, Rain Poncho)..."
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
          >
            {categories.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            max={20}
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            className="w-14 px-2 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 text-center"
            title="Quantity"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-md shadow-sky-500/20 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Packing Checklist Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => togglePacked(item.id)}
            className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group ${
              item.packed
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-1 text-slate-400 group-hover:scale-110 transition">
                {item.packed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <div className={`text-xs font-bold ${item.packed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {item.name} {item.quantity > 1 && <span className="text-sky-400 font-normal">x{item.quantity}</span>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                  {item.essential && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Essential
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
