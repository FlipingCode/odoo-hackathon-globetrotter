import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  MapPin, 
  Star, 
  Plus, 
  DollarSign, 
  Sparkles, 
  Check, 
  Trash2,
  Coffee,
  Wine,
  ChefHat
} from 'lucide-react';
import { Trip, CulinarySpot, Currency } from '../../types';

interface CulinaryViewProps {
  trip: Trip;
  currency: Currency;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const CulinaryView: React.FC<CulinaryViewProps> = ({
  trip,
  currency,
  onUpdateTrip,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [cityName, setCityName] = useState(trip.cities[0]?.name || 'Rome');
  const [cuisine, setCuisine] = useState('Traditional Italian Trattoria');
  const [priceLevel, setPriceLevel] = useState<'$$' | '$' | '$$$' | '$$$$'>('$$');
  const [mustTryDish, setMustTryDish] = useState('Tonnarelli Cacio e Pepe');
  const [address, setAddress] = useState('Via dei Pettinari 44');
  const [notes, setNotes] = useState('Historic eatery loved by locals. Book 3 days ahead.');

  const filteredSpots = selectedCity === 'All'
    ? trip.culinarySpots
    : trip.culinarySpots.filter((s) => s.cityName.toLowerCase() === selectedCity.toLowerCase());

  const handleAddSpot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpot: CulinarySpot = {
      id: `cul-${Date.now()}`,
      cityId: `city-${cityName.toLowerCase()}`,
      cityName,
      name,
      cuisine,
      priceLevel,
      mustTryDish,
      rating: 4.9,
      address,
      reservationBooked: false,
      notes,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    };

    onUpdateTrip({
      ...trip,
      culinarySpots: [...trip.culinarySpots, newSpot],
    });

    setName('');
    setShowAddModal(false);
  };

  const toggleReservation = (id: string) => {
    const updated = trip.culinarySpots.map((s) => {
      if (s.id === id) return { ...s, reservationBooked: !s.reservationBooked };
      return s;
    });
    onUpdateTrip({ ...trip, culinarySpots: updated });
  };

  const handleDeleteSpot = (id: string) => {
    onUpdateTrip({
      ...trip,
      culinarySpots: trip.culinarySpots.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Gastronomy & Culinary Guide</h1>
              <p className="text-xs text-slate-400">Authentic regional dining, Michelin recommendations & must-eat dishes</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-culinary-spot-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant / Food Spot</span>
          </button>
        </div>
      </div>

      {/* City Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCity('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
            selectedCity === 'All'
              ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Destination Spots ({trip.culinarySpots.length})
        </button>
        {trip.cities.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCity(c.name)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCity.toLowerCase() === c.name.toLowerCase()
                ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Dining Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.length === 0 ? (
          <div className="lg:col-span-3 p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No dining spots added for {selectedCity} yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30"
            >
              + Add First Food Spot
            </button>
          </div>
        ) : (
          filteredSpots.map((spot) => (
            <div
              key={spot.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition shadow-xl flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={spot.imageUrl}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-xs font-bold text-amber-300 border border-slate-700">
                  {spot.cityName} • {spot.priceLevel}
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white">{spot.name}</h3>
                  <div className="text-xs text-amber-400 font-medium">{spot.cuisine}</div>
                </div>
              </div>

              <div className="p-5 space-y-3.5 text-xs flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Must-Try Specialty
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5 block">
                      ⭐ {spot.mustTryDish}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {spot.notes}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{spot.address}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleReservation(spot.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      spot.reservationBooked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{spot.reservationBooked ? 'Table Reserved' : 'Mark Reserved'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSpot(spot.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Add Culinary Recommendation</h3>
            
            <form onSubmit={handleAddSpot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Restaurant / Venue Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Osteria Francescana or Duck & Waffle"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <select
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    {trip.cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price Tier</label>
                  <select
                    value={priceLevel}
                    onChange={(e) => setPriceLevel(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="$">$ (Budget / Street Food)</option>
                    <option value="$$">$$ (Moderate Bistro)</option>
                    <option value="$$$">$$$ (Fine Dining)</option>
                    <option value="$$$$">$$$$ (Michelin Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cuisine Specialty</label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g., Roman Pasta & Natural Wines"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Must-Try Signature Dish</label>
                <input
                  type="text"
                  value={mustTryDish}
                  onChange={(e) => setMustTryDish(e.target.value)}
                  placeholder="e.g., Truffle Tagliolini & Tiramisu"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Address / Neighborhood</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Trastevere, Rome"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Insider Tips / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reservation requirements, dress code, best terrace table..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                />
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
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow-md"
                >
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
