import { store } from '../js/store.js';
import { renderFilterBar } from '../components/UI.js';

export function CommunityView() {
  const posts = store.communityPosts;

  return `
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-white">Community tab Screen</h1>
        <p class="text-xs text-slate-400">Screen 10: Browse and fork travel logs, community tips, and shared itineraries</p>
      </div>

      ${renderFilterBar({ searchPlaceholder: "Search stories by country, tag or traveler..." })}

      <div class="space-y-6">
        ${posts.map(p => `
          <div class="bg-slate-800/60 border border-slate-700 rounded-3xl overflow-hidden shadow-xl hover:border-slate-600 transition-all">
            <div class="p-5 flex items-center justify-between border-b border-slate-700/60">
              <div class="flex items-center gap-3">
                <img src="${p.authorAvatar}" class="w-10 h-10 rounded-full object-cover border border-brand-500/50" />
                <div>
                  <h3 class="font-bold text-white text-sm">${p.author}</h3>
                  <p class="text-[10px] text-slate-400">Shared an itinerary • 2 days ago</p>
                </div>
              </div>
              <button onclick="alert('Trip copied to your planner!');" class="px-3.5 py-1.5 bg-brand-600/20 text-brand-400 hover:bg-brand-600 hover:text-white border border-brand-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i> Fork Trip
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3">
              <img src="${p.cover}" class="w-full h-48 md:h-full object-cover" />
              <div class="p-6 md:col-span-2 flex flex-col justify-between space-y-3">
                <div>
                  <h2 class="text-lg font-bold text-white">${p.title}</h2>
                  <p class="text-xs text-slate-300 mt-2 leading-relaxed">${p.content}</p>
                </div>
                <div class="flex items-center gap-6 pt-3 text-xs text-slate-400 border-t border-slate-700/50">
                  <span class="flex items-center gap-1.5 text-rose-400"><i data-lucide="heart" class="w-4 h-4 fill-rose-400"></i> ${p.likes} Likes</span>
                  <span class="flex items-center gap-1.5"><i data-lucide="message-square" class="w-4 h-4"></i> ${p.comments} Discussions</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}