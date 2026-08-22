import { store } from '../js/store.js';
import { renderFilterBar } from '../components/UI.js';

export function TripListView() {
  const categories = [
    { title: "Ongoing", trips: store.getTripsByStatus("Ongoing"), badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    { title: "Upcoming", trips: store.getTripsByStatus("Upcoming"), badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
    { title: "Completed", trips: store.getTripsByStatus("Completed"), badgeColor: "bg-slate-700/50 text-slate-300 border-slate-600" }
  ];

  return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-white">User Trip Listing</h1>
        <p class="text-xs text-slate-400">Screen 6: Master overview of all active, queued, and historical plans</p>
      </div>

      ${renderFilterBar({ searchPlaceholder: "Filter trips by name, date or tag..." })}

      <div class="space-y-8">
        ${categories.map(cat => `
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-white">${cat.title}</h2>
              <span class="text-xs px-2 py-0.5 rounded-full border ${cat.badgeColor}">${cat.trips.length}</span>
            </div>

            ${cat.trips.length > 0 ? cat.trips.map(trip => `
              <div class="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-600 transition-colors">
                <div class="flex items-center gap-4">
                  <img src="${trip.coverImage}" class="w-20 h-20 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <h3 class="font-bold text-white text-base">${trip.title}</h3>
                    <p class="text-xs text-slate-400 mt-0.5">${trip.sections.length} Sections • ${trip.destination}</p>
                    <p class="text-xs text-brand-400 mt-1 font-mono">${trip.startDate} to ${trip.endDate}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-3 md:pt-0 border-slate-700/50">
                  <div class="text-left md:text-right">
                    <span class="text-[10px] uppercase text-slate-400 block">Total Budget</span>
                    <span class="text-sm font-bold text-emerald-400">$${trip.totalBudget}</span>
                  </div>
                  <div class="flex gap-2">
                    <a href="#/itinerary-view?id=${trip.id}" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-all">
                      View Itinerary
                    </a>
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                No ${cat.title.toLowerCase()} trips found.
              </div>
            `}
          </div>
        `).join('')}
      </div>

    </div>
  `;
}