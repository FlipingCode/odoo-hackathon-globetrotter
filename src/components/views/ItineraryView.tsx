import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Train, 
  Sparkles, 
  DollarSign, 
  Star, 
  Check, 
  ArrowRight,
  Filter,
  Tag,
  Map as MapIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Trip, DayPlan, DayActivitySlot, Currency } from '../../types';
import { formatCurrency } from '../../data/mockData';
import { InteractiveMap } from '../InteractiveMap';

interface ItineraryViewProps {
  trip: Trip;
  currency: Currency;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onNavigateToActivities: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  currency,
  onUpdateTrip,
  onNavigateToActivities,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('all');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [showAddSlotModal, setShowAddSlotModal] = useState<boolean>(false);
  const [showDayMap, setShowDayMap] = useState<boolean>(false);


  // New slot form state
  const [newTitle, setNewTitle] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState<'09:00 AM' | '11:30 AM' | '02:00 PM' | '05:00 PM' | '08:00 PM'>('02:00 PM');
  const [newPeriod, setNewPeriod] = useState<'Morning' | 'Afternoon' | 'Evening'>('Afternoon');
  const [newDuration, setNewDuration] = useState(2);
  const [newCost, setNewCost] = useState(25);
  const [newNotes, setNewNotes] = useState('');

  // Filter day plans
  const dayPlans = trip?.dayPlans || [];
  const filteredDayPlans = selectedCityId === 'all'
    ? dayPlans
    : dayPlans.filter((dp) => dp.cityId === selectedCityId);

  const activeDayPlan = dayPlans.find((dp) => dp.dayNumber === selectedDayNumber) || dayPlans[0];

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDayPlan) return;

    const newSlot: DayActivitySlot = {
      id: `slot-${Date.now()}`,
      timeSlot: newTimeSlot,
      period: newPeriod,
      durationHours: newDuration,
      costUSD: newCost,
      customTitle: newTitle,
      notes: newNotes,
      isCustom: true,
    };

    const updatedDayPlans = trip.dayPlans.map((dp) => {
      if (dp.id === activeDayPlan.id) {
        return {
          ...dp,
          slots: [...dp.slots, newSlot].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot)),
        };
      }
      return dp;
    });

    onUpdateTrip({ ...trip, dayPlans: updatedDayPlans });
    setNewTitle('');
    setNewNotes('');
    setShowAddSlotModal(false);
  };

  const handleDeleteSlot = (dayId: string, slotId: string) => {
    const updatedDayPlans = trip.dayPlans.map((dp) => {
      if (dp.id === dayId) {
        return {
          ...dp,
          slots: dp.slots.filter((s) => s.id !== slotId),
        };
      }
      return dp;
    });
    onUpdateTrip({ ...trip, dayPlans: updatedDayPlans });
  };

  const handleAddDay = () => {
    const nextDayNum = trip.dayPlans.length + 1;
    const defaultCity = trip.cities[0] || { id: 'city-1', name: 'Destination' };
    const newDay: DayPlan = {
      id: `day-${Date.now()}`,
      dayNumber: nextDayNum,
      date: `2026-09-${10 + nextDayNum}`,
      cityId: defaultCity.id,
      cityName: defaultCity.name,
      theme: `Exploring ${defaultCity.name} Culture & Landmarks`,
      slots: [],
    };
    onUpdateTrip({ ...trip, dayPlans: [...trip.dayPlans, newDay] });
    setSelectedDayNumber(nextDayNum);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & City Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Multi-City Itinerary Timeline</h1>
              <p className="text-xs text-slate-400">Day-by-day interactive schedule, activities & city connections</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="browse-activities-btn"
            onClick={onNavigateToActivities}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Search Activities</span>
          </button>
          <button
            id="add-day-btn"
            onClick={handleAddDay}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Day</span>
          </button>
        </div>
      </div>

      {/* City Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          id="filter-all-cities"
          onClick={() => setSelectedCityId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
            selectedCityId === 'all'
              ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Cities ({trip.dayPlans.length} Days)
        </button>
        {trip.cities.map((city) => {
          const daysCount = trip.dayPlans.filter((dp) => dp.cityId === city.id || dp.cityName.toLowerCase() === city.name.toLowerCase()).length;
          return (
            <button
              key={city.id}
              id={`filter-city-${city.id}`}
              onClick={() => {
                setSelectedCityId(city.id);
                const firstDayOfCity = trip.dayPlans.find((dp) => dp.cityId === city.id || dp.cityName.toLowerCase() === city.name.toLowerCase());
                if (firstDayOfCity) setSelectedDayNumber(firstDayOfCity.dayNumber);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                selectedCityId === city.id
                  ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{city.name}</span>
              <span className="text-[11px] opacity-75">({daysCount}d)</span>
            </button>
          );
        })}
      </div>

      {/* Day Selector Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-slate-800 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {filteredDayPlans.map((dp) => {
          const isSelected = activeDayPlan?.id === dp.id;
          return (
            <button
              key={dp.id}
              id={`day-pill-${dp.dayNumber}`}
              onClick={() => setSelectedDayNumber(dp.dayNumber)}
              className={`px-4 py-2 rounded-xl text-left transition shrink-0 border ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="text-[11px] font-medium opacity-80">{dp.cityName}</div>
              <div className="text-xs font-bold">Day {dp.dayNumber}</div>
              <div className="text-[10px] opacity-75">{dp.slots.length} items</div>
            </button>
          );
        })}
      </div>

      {/* Main Day Timeline Card */}
      {activeDayPlan ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          {/* Day Header Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/30">
                  Day {activeDayPlan.dayNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">{activeDayPlan.date}</span>
                <span className="text-xs font-semibold text-slate-300">📍 {activeDayPlan.cityName}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                {activeDayPlan.theme}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="toggle-day-map-btn"
                onClick={() => setShowDayMap(!showDayMap)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <MapIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>{showDayMap ? 'Hide Map' : 'View Day Map'}</span>
                {showDayMap ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
              </button>

              <button
                id="add-activity-slot-btn"
                onClick={() => setShowAddSlotModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>
          </div>

          {/* Collapsible Interactive Day Map */}
          {showDayMap && (
            <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold text-sky-300">
                  Interactive Waypoint Map for Day {activeDayPlan.dayNumber} ({activeDayPlan.cityName})
                </span>
                <span className="text-[11px] text-slate-500">Includes sights, hotels & dining for this location</span>
              </div>
              <InteractiveMap
                trip={trip}
                selectedCityId={activeDayPlan.cityId}
                currency={currency}
                height="400px"
                showControls={true}
              />
            </div>
          )}

          {/* Slots Timeline List */}
          <div className="p-6 space-y-4">
            {activeDayPlan.slots.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 space-y-3">
                <p className="text-slate-400 text-xs">No scheduled activities for this day yet.</p>
                <button
                  onClick={() => setShowAddSlotModal(true)}
                  className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold border border-sky-500/30"
                >
                  + Add First Activity
                </button>
              </div>
            ) : (
              activeDayPlan.slots.map((slot, index) => {
                const act = slot.activity;
                return (
                  <div
                    key={slot.id}
                    className="relative flex flex-col md:flex-row items-start gap-4 p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition group shadow-sm"
                  >
                    {/* Time Column */}
                    <div className="w-full md:w-36 shrink-0 flex items-center justify-between md:flex-col md:items-start border-b md:border-b-0 md:border-r border-slate-700 pb-2 md:pb-0 md:pr-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot.timeSlot}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 mt-1">
                        {slot.period}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        ⏱️ {slot.durationHours} hours
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">
                              {act?.title || slot.customTitle}
                            </h3>
                            {act?.category && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-medium">
                                {act.category}
                              </span>
                            )}
                          </div>
                          {act?.location && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-sky-400" />
                              <span>{act.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {slot.costUSD > 0 && (
                            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                              {formatCurrency(slot.costUSD, currency)}
                            </span>
                          )}
                          <button
                            id={`delete-slot-${slot.id}`}
                            onClick={() => handleDeleteSlot(activeDayPlan.id, slot.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition opacity-0 group-hover:opacity-100"
                            title="Remove Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed">
                        {act?.description || slot.notes}
                      </p>

                      {/* Tags & Rating */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {act?.rating && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{act.rating}</span>
                            <span className="text-slate-500">({act.reviewsCount})</span>
                          </span>
                        )}
                        {act?.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Image if available */}
                    {act?.imageUrl && (
                      <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                        <img
                          src={act.imageUrl}
                          alt={act?.title || 'Activity'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* City Transit indicator if inter-city day */}
            {activeDayPlan.transitToNextCity && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-medium">
                  <Train className="w-4 h-4 text-sky-400" />
                  <span>City Transfer Segment Day (Departing {activeDayPlan.cityName})</span>
                </div>
                <span className="text-[11px] text-slate-400">View Transits tab for ticket details ➔</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">No day selected</div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white">Add Activity to Day {activeDayPlan.dayNumber}</h3>
            
            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Montmartre Vineyard Walk or Evening Tapas"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Midday)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Late Day)</option>
                    <option value="08:00 PM">08:00 PM (Evening)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Period</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Cost (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Instructions</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ticket details, meeting spot, or recommendations..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold shadow-md"
                >
                  Add to Day {activeDayPlan.dayNumber}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
