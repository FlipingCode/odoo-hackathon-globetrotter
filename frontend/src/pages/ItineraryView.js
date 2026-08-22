export function ItineraryView() {
    return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Itinerary View with Budget Section</h1>
          <p class="text-xs text-slate-400">Screen 9: Visual sequential day-wise flowchart & real-time cost breakdown</p>
        </div>
        <div class="flex gap-2">
          <button onclick="window.print();" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Export Plan
          </button>
        </div>
      </div>

      <!-- Flow Chart & Budget Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Day 1, Day 2 Physical Activity Flow -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Day 1 Flow -->
          <div class="space-y-4">
            <div class="inline-block px-4 py-1.5 bg-brand-500/20 text-brand-400 font-bold text-xs rounded-xl border border-brand-500/40">
              DAY 1: Arrival & Valley Exploration
            </div>

            <div class="space-y-4 pl-4 border-l-2 border-brand-500/30">
              
              <!-- Node 1 -->
              <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 relative">
                <div class="font-bold text-white text-sm">Zurich Airport Arrival & Scenic Train to Interlaken</div>
                <div class="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>09:00 AM - 12:30 PM</span>
                  <span class="text-emerald-400 font-mono font-semibold">Expense: $120 (Train Pass)</span>
                </div>
              </div>

              <!-- Flow Arrow Connector -->
              <div class="flex justify-center text-brand-400"><i data-lucide="arrow-down" class="w-5 h-5"></i></div>

              <!-- Node 2 -->
              <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 relative">
                <div class="font-bold text-white text-sm">Tandem Paragliding over Lake Brienz</div>
                <div class="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>02:00 PM - 04:30 PM</span>
                  <span class="text-emerald-400 font-mono font-semibold">Expense: $190</span>
                </div>
              </div>

              <!-- Flow Arrow Connector -->
              <div class="flex justify-center text-brand-400"><i data-lucide="arrow-down" class="w-5 h-5"></i></div>

              <!-- Node 3 -->
              <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 relative">
                <div class="font-bold text-white text-sm">Chalet Check-in & Traditional Fondue Dinner</div>
                <div class="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>07:00 PM</span>
                  <span class="text-emerald-400 font-mono font-semibold">Expense: $65</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Day 2 Flow -->
          <div class="space-y-4">
            <div class="inline-block px-4 py-1.5 bg-brand-500/20 text-brand-400 font-bold text-xs rounded-xl border border-brand-500/40">
              DAY 2: Alpine Heights
            </div>

            <div class="space-y-4 pl-4 border-l-2 border-brand-500/30">
              <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-4 relative">
                <div class="font-bold text-white text-sm">Glacier 3000 Suspension Bridge Excursion</div>
                <div class="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>10:00 AM - 03:00 PM</span>
                  <span class="text-emerald-400 font-mono font-semibold">Expense: $140</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Col: Expense Breakdown Summary (Excalidraw Budget Section) -->
        <div class="space-y-6">
          <div class="bg-slate-800/70 border border-slate-700 rounded-2xl p-5 space-y-4">
            <h3 class="font-bold text-white text-base flex items-center gap-2">
              <i data-lucide="pie-chart" class="w-4 h-4 text-emerald-400"></i> Budget Breakdown
            </h3>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1.5 border-b border-slate-700">
                <span class="text-slate-400">Transport & Rail</span>
                <span class="text-white font-mono font-medium">$520</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-slate-700">
                <span class="text-slate-400">Accommodations</span>
                <span class="text-white font-mono font-medium">$980</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-slate-700">
                <span class="text-slate-400">Activities & Passes</span>
                <span class="text-white font-mono font-medium">$650</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-slate-700">
                <span class="text-slate-400">Meals & Incidentals</span>
                <span class="text-white font-mono font-medium">$340</span>
              </div>
              <div class="flex justify-between pt-2 text-sm font-bold">
                <span class="text-brand-400">Total Estimated Cost</span>
                <span class="text-emerald-400 font-mono">$2,490</span>
              </div>
            </div>

            <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300">
              ✓ Itinerary is within the target threshold of $3,000.
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}