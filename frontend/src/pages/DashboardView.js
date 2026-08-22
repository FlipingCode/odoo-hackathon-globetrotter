import { store } from '../js/store.js';
import { renderFilterBar } from '../components/UI.js';

export function DashboardView() {
  const recentTrips = store.trips;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <!-- Banner Image Section (Wireframe Screen 3) -->
      <div class="relative rounded-3xl overflow-hidden h-72 md:h-96 shadow-2xl border border-slate-800">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80" 
          alt="Banner Image" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8">
          <span class="text-brand-400 font-semibold text-sm tracking-wider uppercase">Dream • Design • Travel</span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white mt-1">Explore The Uncharted Planet</h1>
          <p class="text-slate-300 max-w-xl mt-2 text-sm md:text-base">Organize multi-city trips, compute automatic budgets, and design timeline itineraries effortlessly.</p>
        </div>
      </div>

      <!-- Action Search & Filter Bar -->
      ${renderFilterBar({ searchPlaceholder: "Search destinations, activities, or cities..." })}

      <!-- Top Regional Selections Grid -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i data-lucide="map-pin" class="w-5 h-5 text-brand-400"></i> Top Regional Selections
          </h2>
          <a href="#/explore" class="text-xs text-brand-400 hover:underline">View all</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          ${[
      { name: "Alps, Switzerland", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80", count: "18 Activities" },
      { name: "Kyoto, Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80", count: "24 Activities" },
      { name: "Amalfi, Italy", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80", count: "12 Activities" },
      { name: "Reykjavik, Iceland", img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=400&q=80", count: "15 Activities" },
      { name: "Santorini, Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80", count: "20 Activities" }
    ].map(r => `
            <div class="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-800 border border-slate-700/60 cursor-pointer hover:border-brand-500 transition-all">
              <img src="${r.img}" alt="${r.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                <span class="font-semibold text-xs text-white">${r.name}</span>
                <span class="text-[10px] text-slate-300">${r.count}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Previous / Recent Trips Section -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i data-lucide="compass" class="w-5 h-5 text-brand-400"></i> Previous Trips
          </h2>
          <a href="#/trips" class="text-xs text-brand-400 hover:underline">See full list</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${recentTrips.map(trip => `
            <div class="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group">
              <div class="h-44 overflow-hidden relative">
                <img src="${trip.coverImage}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span class="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold ${trip.status === 'Ongoing' ? 'bg-emerald-500/90 text-white' : trip.status === 'Upcoming' ? 'bg-sky-500/90 text-white' : 'bg-slate-700 text-slate-200'}">
                  ${trip.status}
                </span>
              </div>
              <div class="p-5">
                <h3 class="font-bold text-white text-base">${trip.title}</h3>
                <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${trip.startDate} - ${trip.endDate}
                </p>
                <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span class="text-slate-400">Est. Budget: <b class="text-white">$${trip.totalBudget}</b></span>
                  <a href="#/itinerary-view?id=${trip.id}" class="text-brand-400 font-semibold hover:underline">View Flow →</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}