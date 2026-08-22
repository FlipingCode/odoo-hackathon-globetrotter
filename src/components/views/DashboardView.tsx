import React from 'react';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Train, 
  Building2, 
  Luggage, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  CloudSun,
  ShieldAlert,
  Users
} from 'lucide-react';
import { Trip, ViewScreen, Currency } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface DashboardViewProps {
  trip: Trip;
  currency: Currency;
  onNavigate: (view: ViewScreen) => void;
  onOpenCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trip,
  currency,
  onNavigate,
  onOpenCreateModal,
}) => {
  const cities = trip?.cities || [];
  const dayPlans = trip?.dayPlans || [];
  const expenses = trip?.expenses || [];
  const packingList = trip?.packingList || [];

  // Calculations
  const totalNights = cities.reduce((sum, c) => sum + (c.stayNights || 0), 0);
  const totalActivities = dayPlans.reduce((sum, dp) => sum + (dp.slots?.length || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amountUSD || 0), 0);
  const budgetRemaining = Math.max(0, (trip?.budgetTotalUSD || 3000) - totalExpenses);
  const packedCount = packingList.filter((p) => p.packed).length;
  const packedPercentage = packingList.length > 0 
    ? Math.round((packedCount / packingList.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Multi-City Route */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
        <div className="absolute inset-0">
          <img
            src={trip?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={trip?.title || 'Trip'}
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-semibold text-xs border border-sky-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Multi-City Itinerary
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-xs border border-indigo-500/30">
              {trip?.pace || 'Balanced'} Pace
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-xs border border-emerald-500/30">
              {cities.length} Cities • {totalNights} Nights
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {trip?.title || 'My Multi-City Journey'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 font-normal max-w-2xl leading-relaxed">
              {trip?.tagline || 'Curated journey across premier world destinations'}
            </p>
          </div>

          {/* City Waypoints Visual String */}
          <div className="pt-2">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Journey Route:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {cities.map((city, idx) => (
                <React.Fragment key={city.id}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-white shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{city.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({city.stayNights}n)</span>
                  </div>
                  {idx < cities.length - 1 && (
                    <div className="text-slate-500 font-bold text-xs flex items-center">
                      ➔
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              id="dashboard-itinerary-cta"
              onClick={() => onNavigate('itinerary')}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/25 flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Day Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="dashboard-co-pilot-cta"
              onClick={() => onNavigate('ai_concierge')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI Co-Pilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('itinerary')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Planned Days</span>
            <Calendar className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{trip.dayPlans.length || totalNights} Days</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>{totalActivities} Scheduled activities</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('budget')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Budget Status</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(trip.budgetTotalUSD, currency)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {formatCurrency(totalExpenses, currency)} logged • {formatCurrency(budgetRemaining, currency)} left
          </div>
        </div>

        <div 
          onClick={() => onNavigate('transit')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Transit Legs</span>
            <Train className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{trip.transits.length} Segments</div>
          <div className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Eurostar & Flights Confirmed</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('packing')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Packing Check</span>
            <Luggage className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{packedPercentage}%</div>
          <div className="text-xs text-slate-400 mt-1">
            {packedCount} of {trip.packingList.length} items packed
          </div>
        </div>
      </div>

      {/* Destination Cities Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Destinations & City Hubs
            </h2>
            <p className="text-xs text-slate-400">Curated multi-city stops with local timezones, highlights & weather</p>
          </div>
          <button
            id="view-all-cities-map"
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trip.cities.map((city, idx) => (
            <div
              key={city.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition group flex flex-col justify-between shadow-sm"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={city.coverImage}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-[11px] font-bold text-sky-300 border border-slate-700">
                  Stop {idx + 1}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">{city.name}</h3>
                    <div className="text-xs text-slate-300 font-medium">{city.country}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-lg bg-sky-500/80 text-white text-[11px] font-bold">
                      {city.stayNights} Nights
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                {/* Weather & Currency quick badges */}
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{city.weather.tempC}°C ({city.weather.condition})</span>
                  </div>
                  <div className="font-semibold text-slate-300">{city.currency}</div>
                </div>

                {/* Highlights */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                    Top Highlights
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {city.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-sky-400">•</span>
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Emergency: {city.emergencyNumber}</span>
                  <button
                    onClick={() => onNavigate('activities')}
                    className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Activities →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Feature Cards: Day Highlight & Co-Pilot Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Day 1 Quick Preview */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {trip.dayPlans[0]?.theme || 'Journey Itinerary Spotlight'}
                </h3>
                <p className="text-xs text-slate-400">
                  {trip.dayPlans[0]?.cityName || trip.cities[0]?.name} • Day 1 ({trip.startDate})
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('itinerary')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
            >
              Full Schedule →
            </button>
          </div>

          <div className="space-y-3">
            {(trip.dayPlans[0]?.slots || []).map((slot) => (
              <div
                key={slot.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
              >
                <div className="w-20 shrink-0 text-xs font-bold text-sky-400">
                  {slot.timeSlot}
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-white text-sm">
                    {slot.activity?.title || slot.customTitle}
                  </div>
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">
                    {slot.activity?.description || slot.notes}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                    <span>Duration: {slot.durationHours}h</span>
                    {slot.costUSD > 0 && <span>Est: {formatCurrency(slot.costUSD, currency)}</span>}
                    {slot.activity?.location && <span className="text-slate-400 truncate">📍 {slot.activity.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Travel Concierge Snapshot */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">AI Travel Concierge</h3>
                <p className="text-[11px] text-slate-400">Powered by Gemini AI Engine</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need personalized dining spots, rail pass advice, or secret photo viewpoints across {trip.cities.map((c) => c.name).join(', ')}?
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => onNavigate('ai_concierge')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-xs text-slate-200 transition"
              >
                💡 "What is the best scenic train route from {trip.cities[0]?.name}?"
              </button>
              <button
                onClick={() => onNavigate('ai_concierge')}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-xs text-slate-200 transition"
              >
                🍷 "Top 3 hidden local food markets in {trip.cities[1]?.name || 'the next city'}?"
              </button>
            </div>
          </div>

          <button
            id="open-concierge-from-dashboard"
            onClick={() => onNavigate('ai_concierge')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat with AI Co-Pilot</span>
          </button>
        </div>

      </div>
    </div>
  );
};
