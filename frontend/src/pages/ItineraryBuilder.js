export function ItineraryBuilder() {
  return `
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Build Itinerary Screen</h1>
          <p class="text-xs text-slate-400">Screen 5: Multi-section detailed itinerary & budget allocation</p>
        </div>
        <div class="flex gap-2">
          <a href="#/itinerary-view" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> Preview Flow
          </a>
        </div>
      </div>

      <!-- Sections List (Section 1, 2, 3 as shown in Excalidraw Screen 5) -->
      <div class="space-y-4" id="sections-container">
        
        <!-- Section 1 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-brand-400 font-bold text-sm uppercase tracking-wider">Section 1: Transit & Initial Base</span>
            <button class="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1"><i data-lucide="trash" class="w-3.5 h-3.5"></i> Remove</button>
          </div>
          <textarea rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none" placeholder="All necessary information about this section. This can be travel details, hotel booking or arrival activities...">Arrival at Zurich airport, scenic train pass activation, and transfer to Interlaken valley hotel.</textarea>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Date Range:</span>
              <input type="text" value="Sep 10 to Sep 13" class="bg-transparent text-right font-medium text-white focus:outline-none" />
            </div>
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Section Budget ($):</span>
              <input type="number" value="1200" class="bg-transparent text-right font-semibold text-emerald-400 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-brand-400 font-bold text-sm uppercase tracking-wider">Section 2: High Altitude Mountain Excursions</span>
            <button class="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1"><i data-lucide="trash" class="w-3.5 h-3.5"></i> Remove</button>
          </div>
          <textarea rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none">Zermatt chalet check-in, Matterhorn peak photography tour, and Glacier 3000 suspension bridge walk.</textarea>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Date Range:</span>
              <input type="text" value="Sep 14 to Sep 18" class="bg-transparent text-right font-medium text-white focus:outline-none" />
            </div>
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Section Budget ($):</span>
              <input type="number" value="2000" class="bg-transparent text-right font-semibold text-emerald-400 focus:outline-none" />
            </div>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-brand-400 font-bold text-sm uppercase tracking-wider">Section 3: Cultural Wrap-up & Departure</span>
            <button class="text-slate-400 hover:text-red-400 text-xs flex items-center gap-1"><i data-lucide="trash" class="w-3.5 h-3.5"></i> Remove</button>
          </div>
          <textarea rows="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none">Old town chocolate tasting, Lake Zurich evening cruise, packing and airport departures.</textarea>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Date Range:</span>
              <input type="text" value="Sep 19 to Sep 20" class="bg-transparent text-right font-medium text-white focus:outline-none" />
            </div>
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span class="text-slate-400">Section Budget ($):</span>
              <input type="number" value="1000" class="bg-transparent text-right font-semibold text-emerald-400 focus:outline-none" />
            </div>
          </div>
        </div>

      </div>

      <!-- Add another Section Button (Excalidraw Screen 5 bottom button) -->
      <button onclick="alert('Added a new stop section!');" class="w-full py-4 border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-2xl text-slate-300 hover:text-brand-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all">
        <i data-lucide="plus-circle" class="w-5 h-5"></i> Add another Section
      </button>

    </div>
  `;
}