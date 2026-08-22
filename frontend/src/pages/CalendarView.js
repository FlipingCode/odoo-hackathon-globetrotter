import { renderFilterBar } from '../components/UI.js';

export function CalendarView() {
  return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-white">Calendar View Screen</h1>
        <p class="text-xs text-slate-400">Screen 11: Multi-day schedule and span visualizer</p>
      </div>

      ${renderFilterBar({ searchPlaceholder: "Search calendar entries by city or event..." })}

      <!-- Calendar Container (Matching Excalidraw Screen 11) -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
        
        <div class="flex items-center justify-between border-b border-slate-700 pb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-white">September 2026</h2>
            <span class="text-xs px-2.5 py-0.5 bg-brand-500/20 text-brand-400 rounded-full font-medium">3 Trips Scheduled</span>
          </div>
          <div class="flex gap-2">
            <button class="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 hover:text-white"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
            <button class="p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 hover:text-white"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
          </div>
        </div>

        <!-- 7-Day Header -->
        <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-2 text-xs">
          ${Array.from({ length: 35 }).map((_, idx) => {
    const dayNum = idx - 1;
    const isInside = dayNum >= 1 && dayNum <= 30;
    const isTripSpan = dayNum >= 10 && dayNum <= 20;

    return `
              <div class="min-h-[75px] p-1.5 rounded-xl border ${isTripSpan ? 'bg-slate-800/90 border-brand-500/50' : 'bg-slate-900/60 border-slate-800'} flex flex-col justify-between">
                <span class="${isInside ? 'text-slate-200 font-semibold' : 'text-slate-600'}">${isInside ? dayNum : ''}</span>
                ${isTripSpan ? `
                  <div class="bg-gradient-to-r from-brand-600 to-cyan-600 text-[9px] font-bold text-white px-1.5 py-1 rounded-lg truncate">
                    ${dayNum === 10 ? 'Swiss Tour' : '•••'}
                  </div>
                ` : ''}
              </div>
            `;
  }).join('')}
        </div>

      </div>

    </div>
  `;
}