export function renderNavbar(activeRoute = 'dashboard') {
  const isAuth = activeRoute === 'login' || activeRoute === 'register';
  if (isAuth) return '';

  return `
    <header class="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Logo (Screens 3-12 branding) -->
        <a href="#/dashboard" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <i data-lucide="compass" class="w-6 h-6 text-white"></i>
          </div>
          <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            GlobalTrotter
          </span>
        </a>

        <!-- Main Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <a href="#/dashboard" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'dashboard' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">Discovery</a>
          <a href="#/trips" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'trips' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">My Trips</a>
          <a href="#/explore" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'explore' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">Search Activities</a>
          <a href="#/calendar" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'calendar' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">Calendar</a>
          <a href="#/community" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'community' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">Community</a>
          <a href="#/admin" class="px-3 py-2 text-sm font-medium rounded-lg ${activeRoute === 'admin' ? 'text-brand-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}">Admin Hub</a>
        </nav>

        <!-- Right User Actions -->
        <div class="flex items-center gap-3">
          <a href="#/create-trip" class="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition-all">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Plan a Trip</span>
          </a>

          <!-- Profile Dropdown Trigger (Screen circle in Excalidraw) -->
          <a href="#/profile" class="w-9 h-9 rounded-full ring-2 ring-brand-500/50 overflow-hidden hover:ring-brand-400 transition-all flex items-center justify-center bg-slate-800">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" class="w-full h-full object-cover" />
          </a>
        </div>
      </div>
    </header>
  `;
}