import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Calendar, Users, DollarSign, MapPin, Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Trip, TravelPace, TravelStyle } from '../types';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated: (newTrip: Trip) => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ isOpen, onClose, onTripCreated }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // AI Form State
  const [aiDestination, setAiDestination] = useState('Italy & Switzerland scenic lakes and historic cities');
  const [aiDays, setAiDays] = useState(8);
  const [aiTravelers, setAiTravelers] = useState(2);
  const [aiBudgetTier, setAiBudgetTier] = useState('Moderate');
  const [aiPace, setAiPace] = useState<TravelPace>('Balanced');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(['Culture & History', 'Food & Wine']);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualTagline, setManualTagline] = useState('');
  const [manualStartDate, setManualStartDate] = useState('2026-09-15');
  const [manualEndDate, setManualEndDate] = useState('2026-09-25');
  const [manualBudget, setManualBudget] = useState(5000);
  const [manualTravelers, setManualTravelers] = useState(2);
  const [manualCities, setManualCities] = useState([
    { name: 'Tokyo', country: 'Japan', nights: 4, coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kyoto', country: 'Japan', nights: 3, coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  ]);

  if (!isOpen) return null;

  const toggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/gemini/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationPrompt: aiDestination,
          durationDays: aiDays,
          travelersCount: aiTravelers,
          budgetTier: aiBudgetTier,
          pace: aiPace,
          styles: selectedStyles,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate itinerary. Falling back to local template.');
      }

      const generated = data.data;
      const newTrip: Trip = {
        id: `trip-ai-${Date.now()}`,
        title: generated.title || `${aiDestination.split(' ')[0]} Odyssey`,
        tagline: generated.tagline || `An unforgettable ${aiDays}-day multi-city journey across ${aiDestination}`,
        coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
        startDate: '2026-10-01',
        endDate: '2026-10-10',
        travelersCount: aiTravelers,
        travelerNames: Array.from({ length: aiTravelers }, (_, i) => `Traveler ${i + 1}`),
        budgetTotalUSD: generated.budgetTotalUSD || 6000,
        targetCurrency: 'USD',
        pace: aiPace,
        styles: selectedStyles,
        cities: generated.cities || [
          {
            id: 'city-1',
            name: 'Rome',
            country: 'Italy',
            countryCode: 'IT',
            arrivalDate: '2026-10-01',
            departureDate: '2026-10-05',
            stayNights: 4,
            lat: 41.9028,
            lng: 12.4964,
            coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
            timezone: 'GMT+2',
            currency: 'EUR (€)',
            language: 'Italian',
            emergencyNumber: '112',
            highlights: ['Colosseum', 'Vatican', 'Trastevere'],
            weather: { tempC: 22, tempF: 72, condition: 'Sunny', icon: 'sun', rainChance: 10, monthlyAvg: [] },
          },
        ],
        dayPlans: generated.dayPlans || [],
        transits: generated.transits || [],
        accommodations: generated.accommodations || [],
        expenses: [],
        packingList: generated.packingList || [],
        culinarySpots: generated.culinarySpots || [],
        visaHealthInfo: generated.visaHealthInfo || [],
        notes: [
          {
            id: `note-${Date.now()}`,
            title: 'AI Planning Overview',
            category: 'General',
            content: `Generated on ${new Date().toLocaleDateString()} with focus on ${selectedStyles.join(', ')}.`,
            updatedAt: new Date().toISOString().split('T')[0],
            author: 'Globe Trotter AI',
          },
        ],
      };

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onTripCreated(newTrip);
      onClose();
    } catch (err: any) {
      console.warn('AI Gen error, using crafted template:', err);
      setGenerationError(err.message || 'AI generation encountered an issue. Using instant smart template instead.');
      // Create template fallback smoothly
      setTimeout(() => {
        const fallbackTrip: Trip = {
          id: `trip-smart-${Date.now()}`,
          title: `${aiDestination.slice(0, 30)} Journey`,
          tagline: `A tailored ${aiDays}-day multi-city exploration curated for ${aiPace} travel pace.`,
          coverImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
          startDate: '2026-10-01',
          endDate: '2026-10-09',
          travelersCount: aiTravelers,
          travelerNames: ['Traveler 1', 'Traveler 2'],
          budgetTotalUSD: 5500,
          targetCurrency: 'USD',
          pace: aiPace,
          styles: selectedStyles,
          cities: [
            {
              id: `c-1-${Date.now()}`,
              name: 'Zurich & Lucerne',
              country: 'Switzerland',
              countryCode: 'CH',
              arrivalDate: '2026-10-01',
              departureDate: '2026-10-05',
              stayNights: 4,
              lat: 47.3769,
              lng: 8.5417,
              coverImage: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80',
              timezone: 'GMT+2',
              currency: 'CHF',
              language: 'German',
              emergencyNumber: '112 / 117',
              highlights: ['Lake Lucerne Steamboat', 'Mount Pilatus Cogwheel', 'Old Town Bridges'],
              weather: { tempC: 16, tempF: 61, condition: 'Mild Mountain Air', icon: 'cloud-sun', rainChance: 20, monthlyAvg: [] },
            },
            {
              id: `c-2-${Date.now()}`,
              name: 'Lake Como & Milan',
              country: 'Italy',
              countryCode: 'IT',
              arrivalDate: '2026-10-05',
              departureDate: '2026-10-09',
              stayNights: 4,
              lat: 45.4642,
              lng: 9.19,
              coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
              timezone: 'GMT+2',
              currency: 'EUR (€)',
              language: 'Italian',
              emergencyNumber: '112',
              highlights: ['Villa del Balbianello', 'Duomo di Milano', 'Bellagio Waterfront'],
              weather: { tempC: 21, tempF: 70, condition: 'Warm & Sunny', icon: 'sun', rainChance: 15, monthlyAvg: [] },
            },
          ],
          dayPlans: [
            {
              id: 'dp-1',
              dayNumber: 1,
              date: '2026-10-01',
              cityId: 'c-1',
              cityName: 'Zurich & Lucerne',
              theme: 'Arrival & Scenic Lake Lucerne Promenade',
              slots: [
                {
                  id: 's-1',
                  timeSlot: '02:00 PM',
                  period: 'Afternoon',
                  durationHours: 2,
                  costUSD: 0,
                  customTitle: 'Lake Lucerne Chapel Bridge & Old Town Walk',
                  isCustom: true,
                  notes: 'Walk across the 14th-century wooden covered bridge.',
                },
              ],
            },
          ],
          transits: [
            {
              id: `tr-${Date.now()}`,
              fromCity: 'Zurich',
              toCity: 'Milan & Como',
              mode: 'Train',
              carrier: 'SBB Gotthard Panorama Express',
              bookingRef: 'SBB-90211',
              departureDate: '2026-10-05',
              departureTime: '10:15 AM',
              arrivalDate: '2026-10-05',
              arrivalTime: '01:45 PM',
              duration: '3h 30m',
              costUSD: 140,
              status: 'Reserved',
              notes: 'Scenic Alpine rail pass through the Gotthard Base Tunnel.',
            },
          ],
          accommodations: [],
          expenses: [],
          packingList: [
            { id: 'p-1', name: 'Universal Power Adapter', category: 'Electronics', packed: false, quantity: 2, weightGrams: 200, essential: true },
            { id: 'p-2', name: 'Layered Windproof Jacket', category: 'Clothing', packed: false, quantity: 1, weightGrams: 500, essential: true },
          ],
          culinarySpots: [],
          visaHealthInfo: [],
          notes: [],
        };
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onTripCreated(fallbackTrip);
        onClose();
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip: Trip = {
      id: `trip-manual-${Date.now()}`,
      title: manualTitle || 'Custom Multi-City Voyage',
      tagline: manualTagline || `${manualCities.map((c) => c.name).join(' → ')} (${manualCities.reduce((acc, c) => acc + c.nights, 0)} nights)`,
      coverImage: manualCities[0]?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      startDate: manualStartDate,
      endDate: manualEndDate,
      travelersCount: manualTravelers,
      travelerNames: Array.from({ length: manualTravelers }, (_, i) => `Traveler ${i + 1}`),
      budgetTotalUSD: manualBudget,
      targetCurrency: 'USD',
      pace: 'Balanced',
      styles: ['Culture & History', 'Food & Wine'],
      cities: manualCities.map((c, idx) => ({
        id: `city-${idx}-${Date.now()}`,
        name: c.name,
        country: c.country,
        countryCode: c.country.slice(0, 2).toUpperCase(),
        arrivalDate: manualStartDate,
        departureDate: manualEndDate,
        stayNights: c.nights,
        lat: 35.0 + idx * 2,
        lng: 135.0 + idx * 2,
        coverImage: c.coverImage,
        timezone: 'Local GMT',
        currency: 'USD',
        language: 'Local',
        emergencyNumber: '112 / 911',
        highlights: [`${c.name} Historic Center`, 'Local Food Stalls', 'Key Landmarks'],
        weather: { tempC: 22, tempF: 72, condition: 'Pleasant', icon: 'sun', rainChance: 15, monthlyAvg: [] },
      })),
      dayPlans: [],
      transits: [],
      accommodations: [],
      expenses: [],
      packingList: [],
      culinarySpots: [],
      visaHealthInfo: [],
      notes: [],
    };

    confetti({ particleCount: 70, spread: 60 });
    onTripCreated(newTrip);
    onClose();
  };

  const addManualCity = () => {
    setManualCities([
      ...manualCities,
      { name: 'New City', country: 'Country', nights: 3, coverImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80' },
    ]);
  };

  const removeManualCity = (index: number) => {
    setManualCities(manualCities.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Multi-City Itinerary</h2>
              <p className="text-xs text-slate-400">Design your dream route with AI Co-Pilot or build from scratch</p>
            </div>
          </div>
          <button
            id="close-create-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5">
          <button
            id="tab-ai-gen"
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'ai'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Instant Trip Generator
          </button>
          <button
            id="tab-manual-builder"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'manual'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Custom Manual Builder
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'ai' ? (
            <form id="ai-generator-form" onSubmit={handleAIGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Where do you want to travel? (Cities, Countries or Region)
                </label>
                <input
                  id="ai-dest-input"
                  type="text"
                  value={aiDestination}
                  onChange={(e) => setAiDestination(e.target.value)}
                  placeholder="e.g., Tokyo, Kyoto and Osaka or South of France & Amalfi Coast"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    id="ai-days-input"
                    type="number"
                    min={2}
                    max={30}
                    value={aiDays}
                    onChange={(e) => setAiDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Travelers Count
                  </label>
                  <input
                    id="ai-travelers-input"
                    type="number"
                    min={1}
                    max={12}
                    value={aiTravelers}
                    onChange={(e) => setAiTravelers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Travel Pace
                  </label>
                  <select
                    id="ai-pace-select"
                    value={aiPace}
                    onChange={(e) => setAiPace(e.target.value as TravelPace)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Relaxed">Relaxed (1-2 acts/day)</option>
                    <option value="Balanced">Balanced (2-3 acts/day)</option>
                    <option value="Fast-Paced">Fast-Paced (Action-packed)</option>
                  </select>
                </div>
              </div>

              {/* Travel Styles Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Trip Styles & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Culture & History', 'Food & Wine', 'Nature & Adventure', 'Luxury & Relax', 'Budget Backpacker', 'Family Friendly'] as TravelStyle[]).map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        type="button"
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {generationError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  {generationError}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  id="generate-ai-trip-submit"
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini AI is crafting your multi-city route & timeline...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Full Multi-City Itinerary</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form id="manual-builder-form" onSubmit={handleManualCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trip Title
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g., Japan Autumn Maple Trail"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={manualStartDate}
                    onChange={(e) => setManualStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Budget (USD)
                  </label>
                  <input
                    type="number"
                    value={manualBudget}
                    onChange={(e) => setManualBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Cities list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Destination Cities & Stay Lengths
                  </label>
                  <button
                    type="button"
                    onClick={addManualCity}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add City
                  </button>
                </div>

                <div className="space-y-2">
                  {manualCities.map((city, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={city.name}
                        onChange={(e) => {
                          const copy = [...manualCities];
                          copy[idx].name = e.target.value;
                          setManualCities(copy);
                        }}
                        placeholder="City"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      />
                      <input
                        type="text"
                        value={city.country}
                        onChange={(e) => {
                          const copy = [...manualCities];
                          copy[idx].country = e.target.value;
                          setManualCities(copy);
                        }}
                        placeholder="Country"
                        className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={city.nights}
                          onChange={(e) => {
                            const copy = [...manualCities];
                            copy[idx].nights = Number(e.target.value);
                            setManualCities(copy);
                          }}
                          className="w-14 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 text-center"
                        />
                        <span className="text-[11px] text-slate-400">nts</span>
                      </div>
                      {manualCities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeManualCity(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="create-manual-trip-submit"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition"
                >
                  Create Custom Trip Plan
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
