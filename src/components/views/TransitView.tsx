import React, { useState } from 'react';
import { 
  Train, 
  Plane, 
  Bus, 
  Ship, 
  Car, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar
} from 'lucide-react';
import { Trip, TransitSegment, Currency } from '../../types';
import { formatCurrency } from '../../data/mockData';

interface TransitViewProps {
  trip: Trip;
  currency: Currency;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const TransitView: React.FC<TransitViewProps> = ({
  trip,
  currency,
  onUpdateTrip,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [fromCity, setFromCity] = useState(trip.cities[0]?.name || 'London');
  const [toCity, setToCity] = useState(trip.cities[1]?.name || 'Paris');
  const [mode, setMode] = useState<TransitSegment['mode']>('Train');
  const [carrier, setCarrier] = useState('Eurostar Premier');
  const [bookingRef, setBookingRef] = useState('EUR-88419');
  const [depDate, setDepDate] = useState('2026-09-13');
  const [depTime, setDepTime] = useState('10:30 AM');
  const [arrDate, setArrDate] = useState('2026-09-13');
  const [arrTime, setArrTime] = useState('01:45 PM');
  const [duration, setDuration] = useState('2h 15m');
  const [costUSD, setCostUSD] = useState(140);
  const [seatNumber, setSeatNumber] = useState('Coach 5, Seat 32');
  const [notes, setNotes] = useState('Passport control prior to boarding.');

  const getModeIcon = (m: TransitSegment['mode']) => {
    switch (m) {
      case 'Flight': return <Plane className="w-5 h-5 text-sky-400" />;
      case 'Train': return <Train className="w-5 h-5 text-indigo-400" />;
      case 'Bus': return <Bus className="w-5 h-5 text-emerald-400" />;
      case 'Ferry': return <Ship className="w-5 h-5 text-cyan-400" />;
      case 'Rental Car': return <Car className="w-5 h-5 text-amber-400" />;
      default: return <Train className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleAddTransit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSegment: TransitSegment = {
      id: `trans-${Date.now()}`,
      fromCity,
      toCity,
      mode,
      carrier,
      bookingRef,
      departureDate: depDate,
      departureTime: depTime,
      arrivalDate: arrDate,
      arrivalTime: arrTime,
      duration,
      costUSD,
      status: 'Confirmed',
      seatNumber,
      notes,
    };

    onUpdateTrip({
      ...trip,
      transits: [...trip.transits, newSegment],
    });

    setShowAddModal(false);
  };

  const handleDeleteTransit = (id: string) => {
    onUpdateTrip({
      ...trip,
      transits: trip.transits.filter((t) => t.id !== id),
    });
  };

  const totalTransitCost = trip.transits.reduce((sum, t) => sum + t.costUSD, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Train className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Transit & City Transfer Planner</h1>
              <p className="text-xs text-slate-400">Inter-city flights, high-speed rail, terminals & booking references</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            Total Transit: <span className="font-bold text-emerald-400">{formatCurrency(totalTransitCost, currency)}</span>
          </div>
          <button
            id="add-transit-segment-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Connection</span>
          </button>
        </div>
      </div>

      {/* Transit Cards List */}
      <div className="space-y-4">
        {trip.transits.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No transit segments logged yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30"
            >
              + Add First Transit Segment
            </button>
          </div>
        ) : (
          trip.transits.map((segment, idx) => (
            <div
              key={segment.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 hover:border-slate-700 transition shadow-lg space-y-4"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
                    {getModeIcon(segment.mode)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{segment.carrier}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        {segment.mode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Booking Ref: <span className="font-mono text-sky-400 font-semibold">{segment.bookingRef}</span>
                      {segment.seatNumber && <span className="ml-2">• Seat: {segment.seatNumber}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{segment.status}</span>
                  </span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(segment.costUSD, currency)}
                  </span>
                  <button
                    onClick={() => handleDeleteTransit(segment.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transit Flight / Rail Route Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-2">
                {/* Departure */}
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Origin</div>
                  <div className="text-lg font-black text-white">{segment.fromCity}</div>
                  <div className="text-xs text-sky-400 font-semibold">{segment.departureTime}</div>
                  <div className="text-[11px] text-slate-400">{segment.departureDate}</div>
                  {segment.departureTerminal && (
                    <div className="text-[11px] text-slate-400 font-medium">Terminal: {segment.departureTerminal}</div>
                  )}
                </div>

                {/* Duration Arrow Center */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{segment.duration}</span>
                  </span>
                  <div className="w-full flex items-center">
                    <div className="h-0.5 flex-1 bg-slate-700"></div>
                    <div className="p-1.5 rounded-full bg-slate-800 border border-slate-700 text-sky-400">
                      {segment.mode === 'Flight' ? <Plane className="w-3.5 h-3.5" /> : <Train className="w-3.5 h-3.5" />}
                    </div>
                    <div className="h-0.5 flex-1 bg-slate-700"></div>
                  </div>
                  <span className="text-[10px] text-slate-500">Direct Route</span>
                </div>

                {/* Arrival */}
                <div className="space-y-1 md:text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Destination</div>
                  <div className="text-lg font-black text-white">{segment.toCity}</div>
                  <div className="text-xs text-indigo-400 font-semibold">{segment.arrivalTime}</div>
                  <div className="text-[11px] text-slate-400">{segment.arrivalDate}</div>
                  {segment.arrivalTerminal && (
                    <div className="text-[11px] text-slate-400 font-medium">Terminal: {segment.arrivalTerminal}</div>
                  )}
                </div>
              </div>

              {/* Notes & Baggage Tip */}
              {segment.notes && (
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{segment.notes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Transit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Add Transit Connection</h3>
            
            <form onSubmit={handleAddTransit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">From City</label>
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">To City</label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Transport Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="Train">Train / High-Speed Rail</option>
                    <option value="Flight">Flight</option>
                    <option value="Bus">Coach / Bus</option>
                    <option value="Ferry">Ferry / Boat</option>
                    <option value="Rental Car">Rental Car</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Carrier / Line</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g., Eurostar or Air France"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Arrival Time</label>
                  <input
                    type="text"
                    value={arrTime}
                    onChange={(e) => setArrTime(e.target.value)}
                    placeholder="01:45 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Booking Ref</label>
                  <input
                    type="text"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    placeholder="EUR-9921"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={costUSD}
                    onChange={(e) => setCostUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes & Transfer Advice</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Luggage allowances, station terminal info..."
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
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-md"
                >
                  Save Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
