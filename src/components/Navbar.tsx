import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Map as MapIcon, 
  Train, 
  Building2, 
  UtensilsCrossed, 
  SunMedium, 
  Luggage, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Printer, 
  ChevronDown,
  Globe2,
  Share2,
  Check
} from 'lucide-react';
import { Trip, ViewScreen, Currency } from '../types';
import { CURRENCY_RATES, formatCurrency } from '../data/mockData';

interface NavbarProps {
  currentTrip?: Trip;
  trip?: Trip;
  allTrips?: Trip[];
  trips?: Trip[];
  activeView?: ViewScreen;
  currentView?: ViewScreen;
  onSelectView?: (view: ViewScreen) => void;
  onNavigate?: (view: ViewScreen) => void;
  onSelectTrip: (tripId: string) => void;
  activeTripId?: string;
  onOpenCreateModal: () => void;
  onOpenExportModal: () => void;
  selectedCurrency?: Currency;
  currency?: Currency;
  onChangeCurrency?: (curr: Currency) => void;
  onCurrencyChange?: (curr: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTrip,
  trip,
  allTrips,
  trips,
  activeView,
  currentView,
  onSelectView,
  onNavigate,
  onSelectTrip,
  activeTripId,
  onOpenCreateModal,
  onOpenExportModal,
  selectedCurrency,
  currency,
  onChangeCurrency,
  onCurrencyChange,
}) => {
  const [tripDropdownOpen, setTripDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const effectiveTripList = allTrips || trips || [];
  const effectiveTrip = currentTrip || trip || effectiveTripList.find((t) => t.id === activeTripId) || effectiveTripList[0] || {
    id: 'default',
    title: 'My Multi-City Trip',
    tagline: 'Multi-city journey planner',
    cities: [],
    dayPlans: [],
    transits: [],
    accommodations: [],
    packingList: [],
    culinarySpots: [],
    visaHealthInfo: [],
    budgetTotalUSD: 3000,
    startDate: '2026-10-01',
    endDate: '2026-10-10',
    travelersCount: 2,
    travelerNames: ['Traveler 1', 'Traveler 2'],
    pace: 'Balanced',
    styles: ['Culture', 'Food'],
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    expenses: [],
  };

  const currentActiveView = activeView || currentView || 'dashboard';
  const handleSelectView = onSelectView || onNavigate || (() => {});
  const curr = selectedCurrency || currency || 'USD';
  const handleCurrency = onChangeCurrency || onCurrencyChange || (() => {});

  const navItems: { id: ViewScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Overview', icon: <Compass className="w-4 h-4" /> },
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar className="w-4 h-4" /> },
    { id: 'activities', label: 'Activities', icon: <MapPin className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'map', label: 'Route Map', icon: <MapIcon className="w-4 h-4" /> },
    { id: 'transit', label: 'Transits', icon: <Train className="w-4 h-4" /> },
    { id: 'stays', label: 'Stays', icon: <Building2 className="w-4 h-4" /> },
    { id: 'culinary', label: 'Culinary', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'weather', label: 'Weather', icon: <SunMedium className="w-4 h-4" /> },
    { id: 'packing', label: 'Packing', icon: <Luggage className="w-4 h-4" /> },
    { id: 'visa_health', label: 'Visa & Health', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'ai_concierge', label: 'AI Co-Pilot', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
              <Globe2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                  Globe Trotter
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-medium border border-sky-500/30">
                  Multi-City SPA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                Personalized Multi-City Travel Planner & Itinerary Engine
              </p>
            </div>
          </div>

          {/* Active Trip Selector Dropdown */}
          <div className="relative">
            <button
              id="trip-selector-btn"
              onClick={() => setTripDropdownOpen(!tripDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="max-w-[140px] sm:max-w-[220px] truncate">{effectiveTrip.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {tripDropdownOpen && (
              <div className="absolute left-0 sm:right-0 mt-2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Your Multi-City Trips
                </div>
                {effectiveTripList.map((t) => (
                  <button
                    key={t.id}
                    id={`select-trip-${t.id}`}
                    onClick={() => {
                      onSelectTrip(t.id);
                      setTripDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-700/70 transition ${
                      t.id === effectiveTrip.id ? 'bg-sky-600/20 text-sky-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{t.title}</div>
                      <div className="text-xs text-slate-400">
                        {t.cities?.length || 0} Cities • {t.startDate}
                      </div>
                    </div>
                    {t.id === effectiveTrip.id && <span className="text-xs text-sky-400">Active</span>}
                  </button>
                ))}
                <div className="border-t border-slate-700/80 my-1 pt-1">
                  <button
                    id="new-trip-dropdown-btn"
                    onClick={() => {
                      onOpenCreateModal();
                      setTripDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/10 flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Multi-City Trip
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Controls: Currency, Share, Print, New Trip */}
          <div className="flex items-center gap-2">
            {/* Currency Picker */}
            <div className="relative">
              <button
                id="currency-picker-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                title="Change Currency"
              >
                <span>{curr}</span>
                <span className="text-slate-400">{CURRENCY_RATES[curr]?.symbol || '$'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                    Select Currency
                  </div>
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                    <button
                      key={c}
                      id={`curr-${c}`}
                      onClick={() => {
                        handleCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 transition ${
                        curr === c ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <span>{c} ({CURRENCY_RATES[c]?.symbol || '$'})</span>
                      <span className="text-[10px] text-slate-400">{CURRENCY_RATES[c]?.name || c}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Share Link */}
            <button
              id="share-trip-btn"
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition hidden sm:flex items-center gap-1.5"
              title="Share Trip Plan"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Export / Print */}
            <button
              id="export-trip-btn"
              onClick={onOpenExportModal}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5"
              title="Export Itinerary Summary"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* New Trip CTA */}
            <button
              id="header-create-trip-btn"
              onClick={onOpenCreateModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plan Trip</span>
            </button>
          </div>

        </div>
      </div>

      {/* 12 Core Views Navigation Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-2 sm:px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = currentActiveView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleSelectView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
