import { store } from '../js/store.js';

export function ProfileView() {
  const u = store.currentUser;
  const trips = store.trips;

  return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <!-- User Profile Header (Wireframe Screen 7 top block) -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div class="w-28 h-28 rounded-full ring-4 ring-brand-500/30 overflow-hidden shrink-0">
          <img src="${u.avatar}" alt="${u.firstName}" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 text-center md:text-left space-y-1">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-white">${u.firstName} ${u.lastName}</h1>
            <button class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-xl text-slate-200">
              Edit Details
            </button>
          </div>
          <p class="text-xs text-brand-400 font-medium">${u.city}, ${u.country}</p>
          <p class="text-xs text-slate-300 max-w-2xl pt-1">${u.bio}</p>
          <div class="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
            <span><b>Email:</b> ${u.email}</span>
            <span><b>Phone:</b> ${u.phone}</span>
          </div>
        </div>
      </div>

      <!-- Preplanned Trips (Horizontal/Grid cards with View button) -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i data-lucide="bookmark" class="w-5 h-5 text-sky-400"></i> Preplanned Trips
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          ${trips.slice(0, 2).map(t => `
            <div class="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between h-56 group hover:border-brand-500 transition-colors">
              <div>
                <span class="text-[10px] text-brand-400 uppercase tracking-wider font-semibold">${t.destination}</span>
                <h3 class="font-bold text-white text-base mt-1">${t.title}</h3>
                <p class="text-xs text-slate-400 mt-2">${t.sections.length} Activity stops organized</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-700/60">
                <span class="text-xs text-slate-300 font-mono">$${t.totalBudget}</span>
                <a href="#/itinerary-view?id=${t.id}" class="px-4 py-2 bg-slate-700 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all">View</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Previous Trips -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i> Previous Trips
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          ${trips.slice(2).map(t => `
            <div class="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between h-56 group hover:border-emerald-500 transition-colors">
              <div>
                <span class="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Completed</span>
                <h3 class="font-bold text-white text-base mt-1">${t.title}</h3>
                <p class="text-xs text-slate-400 mt-2">${t.startDate} to ${t.endDate}</p>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-slate-700/60">
                <span class="text-xs text-slate-300 font-mono">Cost: $${t.spentBudget}</span>
                <a href="#/itinerary-view?id=${t.id}" class="px-4 py-2 bg-slate-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all">View</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}