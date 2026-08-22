/**
 * Renders the filter/group/sort action bar matching Screens 3, 6, 8, 10, 11
 */
export function renderFilterBar({ searchPlaceholder = "Search bar...", showGroupBy = true } = {}) {
  return `
    <div class="flex flex-col md:flex-row items-center gap-3 my-6">
      <div class="relative flex-1 w-full">
        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
        <input 
          type="text" 
          placeholder="${searchPlaceholder}" 
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
        />
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        ${showGroupBy ? `
        <button class="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl whitespace-nowrap">
          <i data-lucide="layers" class="w-3.5 h-3.5 text-slate-400"></i> Group by
        </button>` : ''}
        <button class="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl whitespace-nowrap">
          <i data-lucide="filter" class="w-3.5 h-3.5 text-slate-400"></i> Filter
        </button>
        <button class="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl whitespace-nowrap">
          <i data-lucide="arrow-up-down" class="w-3.5 h-3.5 text-slate-400"></i> Sort by...
        </button>
      </div>
    </div>
  `;
}