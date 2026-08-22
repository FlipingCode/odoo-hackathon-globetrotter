import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  Wifi, 
  Coffee, 
  ShieldCheck,
  Phone,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import { Trip, Accommodation, Currency } from '../../types';
import { formatCurrency } from '../../data/mockData';
import { InteractiveMap } from '../InteractiveMap';

interface StaysViewProps {
  trip: Trip;
  currency: Currency;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const StaysView: React.FC<StaysViewProps> = ({
  trip,
  currency,
  onUpdateTrip,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('Boutique Grand Hotel');
  const [cityId, setCityId] = useState(trip.cities[0]?.id || 'city-1');
  const [cityName, setCityName] = useState(trip.cities[0]?.name || 'London');
  const [type, setType] = useState<Accommodation['type']>('Boutique Hotel');
  const [checkInDate, setCheckInDate] = useState('2026-09-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-13');
  const [nights, setNights] = useState(3);
  const [totalCost, setTotalCost] = useState(650);
  const [address, setAddress] = useState('14 Covent Garden St, City Center');
  const [confirmationCode, setConfirmationCode] = useState('BK-77402');
  const [roomType, setRoomType] = useState('Deluxe King with Balcony');

  const handleAddStay = (e: React.FormEvent) => {
    e.preventDefault();
    const newStay: Accommodation = {
      id: `acc-${Date.now()}`,
      cityId,
      cityName,
      name,
      type,
      address,
      checkInDate,
      checkOutDate,
      nights,
      totalCostUSD: totalCost,
      rating: 4.8,
      confirmationCode,
      roomType,
      amenities: ['High-speed WiFi', 'Artisan Breakfast Included', 'Luggage Storage', '24h Concierge'],
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    };

    onUpdateTrip({
      ...trip,
      accommodations: [...trip.accommodations, newStay],
    });

    setShowAddModal(false);
  };

  const handleDeleteStay = (id: string) => {
    onUpdateTrip({
      ...trip,
      accommodations: trip.accommodations.filter((a) => a.id !== id),
    });
  };

  const totalLodgingCost = trip.accommodations.reduce((sum, a) => sum + a.totalCostUSD, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Accommodations & Stays Hub</h1>
              <p className="text-xs text-slate-400">Multi-city hotels, boutique residences & check-in credentials</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              id="stays-view-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              id="stays-view-map-btn"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            Total: <span className="font-bold text-emerald-400">{formatCurrency(totalLodgingCost, currency)}</span>
          </div>
          <button
            id="add-accommodation-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stay</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Geographical overview of all booked and shortlisted accommodations across your route</span>
            <span className="text-sky-400 font-semibold">Click any hotel pin to view ratings, pricing & confirmation codes</span>
          </div>
          <InteractiveMap
            trip={trip}
            currency={currency}
            height="560px"
            showControls={true}
          />
        </div>
      ) : (
        /* Accommodations Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {trip.accommodations.length === 0 ? (
          <div className="lg:col-span-2 p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No accommodations saved for this trip yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30"
            >
              + Add First Hotel / Stay
            </button>
          </div>
        ) : (
          trip.accommodations.map((stay) => (
            <div
              key={stay.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition shadow-xl flex flex-col justify-between group"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-xs font-bold text-sky-300 border border-slate-700">
                  {stay.cityName} • {stay.type}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-xs font-bold text-emerald-400 border border-slate-700">
                  {formatCurrency(stay.totalCostUSD, currency)} ({stay.nights} nts)
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg sm:text-xl font-black text-white">{stay.name}</h3>
                  <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{stay.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {/* Stay Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-In</span>
                    <div className="font-bold text-white mt-0.5">{stay.checkInDate}</div>
                    <div className="text-[10px] text-sky-400">After 03:00 PM</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Check-Out</span>
                    <div className="font-bold text-white mt-0.5">{stay.checkOutDate}</div>
                    <div className="text-[10px] text-slate-400">Before 11:00 AM</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Confirmation</span>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">{stay.confirmationCode || 'CONF-OK'}</div>
                    <div className="text-[10px] text-slate-400">{stay.roomType}</div>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {(stay.amenities || []).map((am, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-sky-400" />
                      <span>{am}</span>
                    </span>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stay.rating} Guest Rating</span>
                  </span>
                  <button
                    onClick={() => handleDeleteStay(stay.id)}
                    className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Stay</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      )}

      {/* Add Accommodation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Add Accommodation</h3>
            
            <form onSubmit={handleAddStay} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hotel / Property Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <select
                    value={cityName}
                    onChange={(e) => {
                      setCityName(e.target.value);
                      const c = trip.cities.find((city) => city.name === e.target.value);
                      if (c) setCityId(c.id);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    {trip.cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment / Airbnb">Apartment / Airbnb</option>
                    <option value="Resort">Resort</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 28 Rue de Rivoli, Paris"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Check In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Check Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirmation Code</label>
                  <input
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="HOTEL-9901"
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Cost (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-md"
                >
                  Save Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
