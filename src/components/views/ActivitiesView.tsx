import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  Plus, 
  Sparkles, 
  Check, 
  Filter, 
  Tag, 
  Loader2,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import { Trip, Activity, Currency } from '../../types';
import { EXPLORABLE_ACTIVITIES_CATALOG, formatCurrency } from '../../data/mockData';
import { InteractiveMap } from '../InteractiveMap';

interface ActivitiesViewProps {
  trip: Trip;
  currency: Currency;
  onAddActivityToTripDay: (activity: Activity, dayNumber: number) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  trip,
  currency,
  onAddActivityToTripDay,
}) => {
  const [displayMode, setDisplayMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [isDiscoveringAI, setIsDiscoveringAI] = useState(false);
  const [selectedActivityForDay, setSelectedActivityForDay] = useState<Activity | null>(null);
  const [targetDay, setTargetDay] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);


  // Combine initial catalog + any activities already in trip + AI discovered
  const allTripActivities: Activity[] = [];
  (trip?.dayPlans || []).forEach((dp) => {
    (dp?.slots || []).forEach((s) => {
      if (s?.activity) allTripActivities.push(s.activity);
    });
  });

  const combinedActivities = [
    ...EXPLORABLE_ACTIVITIES_CATALOG,
    ...allTripActivities,
    ...customActivities,
  ].filter((v, i, a) => v && v.id && a.findIndex((t) => t?.id === v.id) === i);

  const categories = [
    'All',
    'Sightseeing',
    'Food & Drink',
    'Museum & Art',
    'Adventure',
    'Relaxation',
    'Nightlife',
    'Shopping',
  ];

  const filteredActivities = combinedActivities.filter((act) => {
    if (!act) return false;
    const titleStr = act.title || '';
    const descStr = act.description || '';
    const tagsArr = Array.isArray(act.tags) ? act.tags : [];
    const cityStr = act.cityName || '';

    const matchesSearch = titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tagsArr.some((t) => typeof t === 'string' && t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cityStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || cityStr.toLowerCase() === selectedCity.toLowerCase();
    const matchesPrice = (act.costUSD || 0) <= maxPrice;

    return matchesSearch && matchesCategory && matchesCity && matchesPrice;
  });

  const handleDiscoverAI = async (cityName: string) => {
    setIsDiscoveringAI(true);
    try {
      const res = await fetch('/api/gemini/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityName,
          category: selectedCategory === 'All' ? 'Top Sights & Food Experiences' : selectedCategory,
          vibe: 'Authentic local immersion and must-visit landmarks',
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const mapped: Activity[] = data.items.map((item: any, idx: number) => ({
          id: `ai-act-${Date.now()}-${idx}`,
          cityId: `city-${cityName.toLowerCase()}`,
          cityName: cityName,
          title: item.title,
          category: item.category || 'Sightseeing',
          description: item.description,
          durationHours: item.durationHours || 2,
          costUSD: item.costUSD || 20,
          rating: item.rating || 4.8,
          reviewsCount: 450 + idx * 80,
          imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
          location: item.location || cityName,
          bestTimeOfDay: item.bestTimeOfDay || 'Morning',
          bookingRequired: item.bookingRequired || false,
          tags: item.tags || ['AI Pick', cityName, 'Must Visit'],
        }));
        setCustomActivities((prev) => [...mapped, ...prev]);
      }
    } catch (e) {
      console.error('Discover AI error:', e);
    } finally {
      setIsDiscoveringAI(false);
    }
  };

  const confirmAddActivity = () => {
    if (!selectedActivityForDay) return;
    onAddActivityToTripDay(selectedActivityForDay, targetDay);
    setAddedSuccess(`Added to Day ${targetDay}!`);
    setTimeout(() => {
      setAddedSuccess(null);
      setSelectedActivityForDay(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Activities & Experiences Search</h1>
              <p className="text-xs text-slate-400">Discover top sights, food crawls & hidden gems across all trip cities</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              id="activities-view-grid-btn"
              onClick={() => setDisplayMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                displayMode === 'grid'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              id="activities-view-map-btn"
              onClick={() => setDisplayMode('map')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                displayMode === 'map'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
          </div>

          <button
            id="ai-discover-cta-btn"
            onClick={() => handleDiscoverAI(trip.cities[0]?.name || 'Paris')}
            disabled={isDiscoveringAI}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isDiscoveringAI ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding local secrets...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Discover</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search text input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="activities-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions, museums, food tours, or tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* City select */}
          <div className="w-full sm:w-48">
            <select
              id="activities-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Cities</option>
              {trip.cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-pill-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional: Interactive Map Explorer vs Grid Cards */}
      {displayMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Explore all experiences, attractions and dining spots plotted geographically</span>
            <span className="text-sky-400 font-semibold">Click any pin on the map to inspect & add to your itinerary</span>
          </div>

          <InteractiveMap
            trip={trip}
            currency={currency}
            height="580px"
            showControls={true}
          />
        </div>
      ) : (
        /* Results Count & Grid */
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <span>Found {filteredActivities.length} experiences</span>
            {selectedCity !== 'All' && <span>Filtering by {selectedCity}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-sm"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={act.imageUrl}
                  alt={act?.title || 'Experience'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-[11px] font-bold text-sky-300 border border-slate-700">
                  {act.cityName}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-xs font-bold text-emerald-300 border border-slate-700">
                  {act.costUSD === 0 ? 'Free Entry' : formatCurrency(act.costUSD, currency)}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold uppercase tracking-wider">
                      {act.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold ml-auto">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{act.rating}</span>
                      <span className="text-slate-500 font-normal">({act.reviewsCount})</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {act?.title || 'Experience'}
                  </h3>

                  <p className="text-slate-300 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>{act.durationHours}h ({act.bestTimeOfDay})</span>
                    </span>
                    <span className="truncate max-w-[140px]">📍 {act.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(act.tags || []).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    id={`add-act-btn-${act.id}`}
                    onClick={() => setSelectedActivityForDay(act)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 hover:border-sky-500 flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Itinerary Day</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Add Activity to Day Modal */}
      {selectedActivityForDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Add Experience to Itinerary</h3>
            <p className="text-xs text-sky-400 font-semibold">{selectedActivityForDay.title}</p>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Itinerary Day:
              </label>
              <select
                id="target-day-selector"
                value={targetDay}
                onChange={(e) => setTargetDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
              >
                {(trip?.dayPlans || []).map((dp) => (
                  <option key={dp.id} value={dp.dayNumber}>
                    Day {dp.dayNumber} ({dp.cityName}) - {dp.theme}
                  </option>
                ))}
              </select>
            </div>

            {addedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{addedSuccess}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedActivityForDay(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                id="confirm-add-activity-btn"
                type="button"
                onClick={confirmAddActivity}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white shadow-md"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
