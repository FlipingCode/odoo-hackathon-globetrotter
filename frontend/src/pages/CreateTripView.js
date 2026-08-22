import { store } from '../js/store.js';

export function CreateTripView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        <div class="border-b border-slate-700 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Plan a New Trip</h1>
            <p class="text-xs text-slate-400">Screen 4: Initiate multi-city journey parameters</p>
          </div>
          <span class="text-xs px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full font-mono font-medium">Step 1 of 2</span>
        </div>

        <form id="create-trip-form" class="space-y-6">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Trip Title</label>
            <input id="trip-name" type="text" placeholder="e.g. Summer Tour of Northern Italy" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none" required />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select a Place / Region</label>
              <select id="trip-place" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:outline-none">
                <option value="Interlaken, Switzerland">Interlaken, Switzerland</option>
                <option value="Kyoto, Japan">Kyoto, Japan</option>
                <option value="Amalfi Coast, Italy">Amalfi Coast, Italy</option>
                <option value="Reykjavik, Iceland">Reykjavik, Iceland</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Start Date</label>
              <input id="trip-start" type="date" value="2026-09-10" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:outline-none" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">End Date</label>
              <input id="trip-end" type="date" value="2026-09-20" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:outline-none" required />
            </div>
          </div>

          <!-- Suggestions for Places to Visit / Activities to perform (6 card grid in wireframe) -->
          <div class="pt-4">
            <h3 class="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i> Suggestions for Places to Visit / Activities to perform
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${[
      { title: "Mountain Paragliding", place: "Interlaken", time: "Day 1" },
      { title: "Lake Brienz Kayaking", place: "Brienz", time: "Day 2" },
      { title: "Matterhorn Peak Hike", place: "Zermatt", time: "Day 3" },
      { title: "Chalet Cheese Fondue", place: "Grindelwald", time: "Day 4" },
      { title: "Glacier Express Train", place: "Andermatt", time: "Day 5" },
      { title: "Old Town Photography", place: "Zurich", time: "Day 6" },
    ].map(s => `
                <div class="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl hover:border-brand-400 transition-colors cursor-pointer flex flex-col justify-between">
                  <div class="font-semibold text-xs text-white">${s.title}</div>
                  <div class="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>${s.place}</span>
                    <span class="text-brand-400">${s.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <a href="#/dashboard" class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-700">Cancel</a>
            <button type="button" onclick="window.location.hash='#/itinerary-builder';" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl shadow-lg">
              Proceed to Itinerary Builder →
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}