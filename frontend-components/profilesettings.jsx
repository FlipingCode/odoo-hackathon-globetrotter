import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authcontext';

export default function ProfileSettings() {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'security', 'wishlist', 'danger'
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [currency, setCurrency] = useState(user?.preferred_currency || 'USD');
  const [language, setLanguage] = useState(user?.language || 'en');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Wishlist state
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Status feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatar_url || '');
      setCurrency(user.preferred_currency || 'USD');
      setLanguage(user.language || 'en');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      fetchSavedDestinations();
    }
  }, [activeTab]);

  const fetchSavedDestinations = async () => {
    try {
      setLoadingWishlist(true);
      const res = await axios.get('http://localhost:5000/api/auth/saved-destinations');
      if (res.data.success) {
        setSavedDestinations(res.data.saved_destinations);
      }
    } catch (err) {
      console.error('Failed to fetch saved destinations:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleRemoveSaved = async (cityId) => {
    try {
      await axios.post('http://localhost:5000/api/auth/saved-destinations/toggle', { city_id: cityId });
      setSavedDestinations((prev) => prev.filter((item) => item.id !== cityId));
    } catch (err) {
      console.error('Error removing saved destination:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      setLoading(true);
      await updateProfile({
        name,
        avatar_url: avatarUrl,
        preferred_currency: currency,
        language
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('⚠️ Are you absolutely sure you want to delete your account? All your itineraries and data will be permanently removed!')) {
      try {
        await axios.delete('http://localhost:5000/api/auth/account');
        logout();
      } catch (err) {
        alert('Failed to delete account.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
          alt="Avatar"
          className="w-20 h-20 rounded-2xl border-2 border-indigo-500 shadow-md object-cover bg-slate-100"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span>✈️ {user?.stats?.total_trips || 0} Trips Planned</span>
            <span>•</span>
            <span>⭐ {user?.stats?.total_saved_destinations || 0} Saved Places</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('general'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'general' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          👤 Profile & Preferences
        </button>
        <button
          onClick={() => { setActiveTab('security'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          🔒 Security & Password
        </button>
        <button
          onClick={() => { setActiveTab('wishlist'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'wishlist' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          ❤️ Saved Destinations
        </button>
        <button
          onClick={() => { setActiveTab('danger'); setSuccessMsg(''); setErrorMsg(''); }}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${activeTab === 'danger' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          ⚠️ Danger Zone
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm rounded-xl">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Tab 1: General Profile */}
      {activeTab === 'general' && (
        <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="AUD">AUD ($) - Australian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePasswordSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              New Password (Min 6 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {/* Tab 3: Saved Destinations (Wishlist) */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {loadingWishlist ? (
            <p className="text-sm text-slate-500">Loading your saved destinations...</p>
          ) : savedDestinations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 text-sm">No saved destinations yet. Explore cities and click the ❤️ icon to save them!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDestinations.map((city) => (
                <div key={city.id} className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <img src={city.image_url} alt={city.name} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">{city.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">{city.country}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{city.description}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">~${city.avg_daily_stay_cost}/night</span>
                      <button
                        onClick={() => handleRemoveSaved(city.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6">
          <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-2">Delete Account</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Once you delete your account, there is no going back. All your travel plans, saved stops, custom budgets, and settings will be permanently erased.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow transition text-sm"
          >
            Permanently Delete My Account
          </button>
        </div>
      )}
    </div>
  );
}
