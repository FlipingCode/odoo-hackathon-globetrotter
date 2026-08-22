/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SAMPLE_TRIPS } from './data/mockData';
import { Trip, ViewScreen, Currency, Activity, DayActivitySlot } from './types';
import { Navbar } from './components/Navbar';
import { CreateTripModal } from './components/CreateTripModal';
import { ExportModal } from './components/ExportModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ItineraryView } from './components/views/ItineraryView';
import { ActivitiesView } from './components/views/ActivitiesView';
import { BudgetView } from './components/views/BudgetView';
import { MapView } from './components/views/MapView';
import { TransitView } from './components/views/TransitView';
import { StaysView } from './components/views/StaysView';
import { CulinaryView } from './components/views/CulinaryView';
import { WeatherView } from './components/views/WeatherView';
import { PackingView } from './components/views/PackingView';
import { VisaHealthView } from './components/views/VisaHealthView';
import { AIConciergeView } from './components/views/AIConciergeView';

const STORAGE_KEY_TRIPS = 'globetrotter_trips_v1';
const STORAGE_KEY_ACTIVE_TRIP = 'globetrotter_active_trip_id_v1';
const STORAGE_KEY_CURRENCY = 'globetrotter_currency_v1';

export default function App() {
  // Trips state
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validTrips = parsed.filter((t: any) => t && typeof t === 'object' && t.id && t.title);
          if (validTrips.length > 0) return validTrips;
        }
      }
    } catch (e) {
      console.warn('Could not parse local trips, using defaults');
    }
    return SAMPLE_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TRIP);
    return saved || SAMPLE_TRIPS[0].id;
  });

  const [currentView, setCurrentView] = useState<ViewScreen>('dashboard');
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
    return (saved as Currency) || 'USD';
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save trips to local storage', e);
    }
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TRIP, activeTripId);
  }, [activeTripId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
  }, [currency]);

  // Current active trip with guaranteed non-null fallback
  const activeTrip: Trip = trips.find((t) => t && t.id === activeTripId) || trips[0] || SAMPLE_TRIPS[0];

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const handleTripCreated = (newTrip: Trip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTripId(newTrip.id);
    setCurrentView('dashboard');
  };

  const handleAddActivityToTripDay = (activity: Activity, dayNumber: number) => {
    const updatedDayPlans = activeTrip.dayPlans.map((dp) => {
      if (dp.dayNumber === dayNumber) {
        const newSlot: DayActivitySlot = {
          id: `slot-act-${Date.now()}`,
          timeSlot: '02:00 PM',
          period: 'Afternoon',
          activity,
          durationHours: activity.durationHours,
          costUSD: activity.costUSD,
          notes: activity.description,
        };
        return {
          ...dp,
          slots: [...dp.slots, newSlot],
        };
      }
      return dp;
    });

    handleUpdateTrip({
      ...activeTrip,
      dayPlans: updatedDayPlans,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        trips={trips}
        activeTripId={activeTrip.id}
        onSelectTrip={setActiveTripId}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'dashboard' && (
          <DashboardView
            trip={activeTrip}
            currency={currency}
            onNavigate={setCurrentView}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentView === 'itinerary' && (
          <ItineraryView
            trip={activeTrip}
            currency={currency}
            onUpdateTrip={handleUpdateTrip}
            onNavigateToActivities={() => setCurrentView('activities')}
          />
        )}

        {currentView === 'activities' && (
          <ActivitiesView
            trip={activeTrip}
            currency={currency}
            onAddActivityToTripDay={handleAddActivityToTripDay}
          />
        )}

        {currentView === 'budget' && (
          <BudgetView
            trip={activeTrip}
            currency={currency}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentView === 'map' && (
          <MapView trip={activeTrip} currency={currency} />
        )}

        {currentView === 'transit' && (
          <TransitView
            trip={activeTrip}
            currency={currency}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentView === 'stays' && (
          <StaysView
            trip={activeTrip}
            currency={currency}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentView === 'culinary' && (
          <CulinaryView
            trip={activeTrip}
            currency={currency}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentView === 'weather' && (
          <WeatherView trip={activeTrip} />
        )}

        {currentView === 'packing' && (
          <PackingView
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {currentView === 'visa_health' && (
          <VisaHealthView trip={activeTrip} />
        )}

        {currentView === 'ai_concierge' && (
          <AIConciergeView
            trip={activeTrip}
            currency={currency}
          />
        )}
      </main>

      {/* Modals */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        trip={activeTrip}
        currency={currency}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-400">Globe Trotter</strong> — Personalized Multi-City Travel Planning SPA
          </div>
          <div>
            Powered by Gemini AI Engine & Multi-Destination Logistics
          </div>
        </div>
      </footer>
    </div>
  );
}
