export function LoginView() {
  return `
    <div class="min-h-[85vh] flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-20 h-20 rounded-full bg-slate-700/80 border-2 border-brand-500/50 mx-auto flex items-center justify-center mb-4 overflow-hidden">
            <i data-lucide="user" class="w-10 h-10 text-brand-400"></i>
          </div>
          <h1 class="text-2xl font-bold text-white">Welcome Back</h1>
          <p class="text-sm text-slate-400 mt-1">Sign in to manage your global journeys</p>
        </div>

        <form id="login-form" class="space-y-4" onsubmit="event.preventDefault(); window.location.hash='#/dashboard';">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Username / Email</label>
            <input type="text" required placeholder="Enter username" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-brand-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Password</label>
            <input type="password" required placeholder="••••••••" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-brand-500 focus:outline-none" />
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" class="rounded bg-slate-900 border-slate-700 text-brand-500" /> Remember me
            </label>
            <a href="#" class="text-brand-400 hover:underline">Forgot password?</a>
          </div>

          <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-500/20">
            Login
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-slate-400">
          Don't have an account? 
          <a href="#/register" class="text-brand-400 font-medium hover:underline">Register Users</a>
        </div>
      </div>
    </div>
  `;
}