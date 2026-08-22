export function AdminDashboard() {
  setTimeout(() => {
    const ctx = document.getElementById('adminChart');
    if (ctx && window.Chart) {
      new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Monthly Trip Creations',
            data: [320, 450, 780, 1100, 1420, 1890],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#cbd5e1' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
          }
        }
      });
    }
  }, 100);

  return `
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      <div>
        <h1 class="text-2xl font-bold text-white">Admin Panel Screen</h1>
        <p class="text-xs text-slate-400">Screen 12: Platform telemetry, manage users, popular cities & analytics</p>
      </div>

      <!-- Navigation Tabs (Screen 12 Excalidraw tabs) -->
      <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button class="px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl">Manage Users</button>
        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700">Popular Cities</button>
        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700">Popular Activities</button>
        <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700">User Trends & Analytics</button>
      </div>

      <!-- Analytics Chart & Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
          <span class="text-xs text-slate-400 font-medium uppercase">Active Platform Users</span>
          <div class="text-2xl font-extrabold text-white mt-1">24,582</div>
          <span class="text-[11px] text-emerald-400 mt-1 block">↑ 18.2% from last month</span>
        </div>
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
          <span class="text-xs text-slate-400 font-medium uppercase">Total Itineraries Built</span>
          <div class="text-2xl font-extrabold text-white mt-1">71,940</div>
          <span class="text-[11px] text-emerald-400 mt-1 block">↑ 24.5% conversion</span>
        </div>
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
          <span class="text-xs text-slate-400 font-medium uppercase">Average Estimated Budget</span>
          <div class="text-2xl font-extrabold text-white mt-1">$2,840</div>
          <span class="text-[11px] text-sky-400 mt-1 block">Across 65 countries</span>
        </div>
      </div>

      <!-- Canvas Line Chart -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl">
        <h3 class="font-bold text-white text-sm mb-4">User Growth and Trip Generation Velocity</h3>
        <canvas id="adminChart" class="max-h-72"></canvas>
      </div>

      <!-- Manage Users Data Table -->
      <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 overflow-x-auto">
        <h3 class="font-bold text-white text-sm mb-4">User Registry Directory</h3>
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-slate-400 uppercase font-semibold">
            <tr>
              <th class="p-3">User ID</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Trips Created</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/60 font-medium">
            <tr>
              <td class="p-3 font-mono">usr-101</td>
              <td class="p-3 text-white">Alex Rivers</td>
              <td class="p-3">alex.rivers@example.com</td>
              <td class="p-3">3 Trips</td>
              <td class="p-3"><button class="text-brand-400 hover:underline">Manage</button></td>
            </tr>
            <tr>
              <td class="p-3 font-mono">usr-102</td>
              <td class="p-3 text-white">Elena Rostova</td>
              <td class="p-3">elena.r@example.com</td>
              <td class="p-3">7 Trips</td>
              <td class="p-3"><button class="text-brand-400 hover:underline">Manage</button></td>
            </tr>
            <tr>
              <td class="p-3 font-mono">usr-103</td>
              <td class="p-3 text-white">Marcus Chen</td>
              <td class="p-3">marcus.c@example.com</td>
              <td class="p-3">12 Trips</td>
              <td class="p-3"><button class="text-brand-400 hover:underline">Manage</button></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `;
}