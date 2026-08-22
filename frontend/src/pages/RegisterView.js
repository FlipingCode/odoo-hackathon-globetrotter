export function RegisterView() {
  return `
    <div class="min-h-[90vh] py-10 px-4 flex items-center justify-center">
      <div class="w-full max-w-2xl bg-slate-800/70 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur">
        <div class="text-center mb-8">
          <div class="relative w-24 h-24 rounded-full bg-slate-700 mx-auto mb-3 border-2 border-brand-500 flex items-center justify-center overflow-hidden group cursor-pointer">
            <i data-lucide="camera" class="w-8 h-8 text-slate-300"></i>
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">Upload</div>
          </div>
          <h2 class="text-2xl font-bold text-white">Create Traveler Account</h2>
          <p class="text-sm text-slate-400">Screen 2: Registration & Personal Details</p>
        </div>

        <form class="space-y-4" onsubmit="event.preventDefault(); window.location.hash='#/dashboard';">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">First Name</label>
              <input type="text" placeholder="John" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
              <input type="text" placeholder="Doe" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input type="email" placeholder="john.doe@example.com" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">City</label>
              <input type="text" placeholder="London" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Country</label>
              <input type="text" placeholder="United Kingdom" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Additional Information / Travel Preferences</label>
            <textarea rows="3" placeholder="Tell us about your favorite travel styles (backpacking, luxury, eco-tours)..." class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-brand-500 focus:outline-none"></textarea>
          </div>

          <button type="submit" class="w-full py-3.5 bg-brand-600 hover:bg-brand-500 font-semibold text-white rounded-xl shadow-lg transition-all mt-2">
            Register Users
          </button>
        </form>
      </div>
    </div>
  `;
}