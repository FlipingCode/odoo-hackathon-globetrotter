import { store } from '../js/store.js';
import { renderFilterBar } from '../components/UI.js';

export function ExploreSearch() {
  const activities = store.activities;

  return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-white">Activity Search Pages / City Search Page</h1>
        <p class="text-xs text-slate-400">Screen 8: Discover places, regional adventures, and cost indices</p>
      </div>

      ${renderFilterBar({ searchPlaceholder: "Search Paragliding, Museum tours, Mountain passes..." })}

      <!-- Search Results List (Matching Screen 8 option list) -->
      <div class="space-y-3">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">Results</h2>

        ${activities.map(act => `
          <div class="bg-slate-800/70 border border-slate-700 hover:border-brand-500/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 bg-brand-500/10 text-brand-400 font-medium rounded-md">${act.category}</span>
                <span class="text-xs text-amber-400 flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 fill-amber-400"></i> ${act.rating}</span>
              </div>
              <h3 class="font-bold text-white text-base">${act.name}</h3>
              <p class="text-xs text-slate-400">Location: <span class="text-slate-200">${act.city}</span> • Approx Duration: <span class="text-slate-200">${act.duration}</span></p>
            </div>

            <div class="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-0 pt-2 sm:pt-0 border-slate-700">
              <div class="text-left sm:text-right">
                <span class="text-[10px] text-slate-400 uppercase block">Cost Index</span>
                <span class="text-base font-bold text-emerald-400">$${act.cost}</span>
              </div>
              <button onclick="alert('Added ${act.name} to current trip!');" class="px-4 py-2 bg-slate-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all">
                + Add to Trip
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}