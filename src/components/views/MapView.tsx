import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  MapPin, 
  Navigation, 
  Plane, 
  Train, 
  SunMedium, 
  Clock, 
  Compass, 
  Info,
  Calendar,
  DollarSign,
  Building2,
  Utensils,
  Sparkles,
  ExternalLink,
  Phone,
  Shield,
  Layers
} from 'lucide-react';
import { Trip, CityStay, Currency } from '../../types';
import { InteractiveMap } from '../InteractiveMap';
import { formatCurrency } from '../../data/mockData';

interface MapViewProps {
  trip: Trip;
  currency?: Currency;
}

export const MapView: React.FC<MapViewProps> = ({ trip, currency = 'USD' }) => {
  const cities = trip?.cities || [];
  const [selectedCityId, setSelectedCityId] = useState<string>(cities[0]?.id || '');

  const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0] || {
    id: 'default-city',
    name: 'Destination',
    country: 'Region',
    countryCode: 'XX',
    arrivalDate: '2026-10-01',
    departureDate: '2026-10-05',
    stayNights: 3,
    lat: 48.8566,
    lng: 2.3522,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    timezone: 'GMT+1',
    currency: 'USD',
    language: 'English',
    emergencyNumber: '112',
    highlights: ['City Center Tour', 'Old Town Walk'],
    weather: { tempC: 22, tempF: 72, condition: 'Sunny', icon: 'sun', rainChance: 10, monthlyAvg: [] },
  };

  // Distance calculation helper (Haversine formula)
  const calcDistance = (lat1: number = 0, lon1: number = 0, lat2: number = 0, lon2: number = 0) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return isNaN(d) ? 0 : Math.round(d);
  };

  // Calculate total route distance
  let totalDistanceKm = 0;
  for (let i = 0; i < cities.length - 1; i++) {
    totalDistanceKm += calcDistance(
      cities[i].lat,
      cities[i].lng,
      cities[i + 1].lat,
      cities[i + 1].lng
    );
  }

  // City-specific items
  const cityStays = (trip?.accommodations || []).filter(
    (a) => a.cityId === selectedCity.id || a.cityName.toLowerCase() === selectedCity.name.toLowerCase()
  );

  const cityDining = (trip?.culinarySpots || []).filter(
    (d) => d.cityId === selectedCity.id || d.cityName.toLowerCase() === selectedCity.name.toLowerCase()
  );

  const cityDayPlans = (trip?.dayPlans || []).filter(
    (dp) => dp.cityId === selectedCity.id || dp.cityName.toLowerCase() === selectedCity.name.toLowerCase()
  );

  const cityActivitiesCount = cityDayPlans.reduce((acc, dp) => acc + (dp.slots?.length || 0), 0);

  // Inbound & Outbound transit
  const inboundTransit = (trip?.transits || []).find((t) => t.toCity.toLowerCase() === selectedCity.name.toLowerCase());
  const outboundTransit = (trip?.transits || []).find((t) => t.fromCity.toLowerCase() === selectedCity.name.toLowerCase());

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <MapIcon className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Interactive Journey Route & Location Map</h1>
              <p className="text-xs text-slate-400">Live multi-layer map with zoom, street tiles, satellite imagery, attraction pins & route lines</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Total Route: ~{totalDistanceKm.toLocaleString()} km ({Math.round(totalDistanceKm * 0.621371).toLocaleString()} mi)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
            {cities.length} City Stops • {trip?.pace || 'Balanced'} Pace
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Click any city pin or attraction marker to inspect photos, details, and exact coordinates</span>
          <span className="text-sky-400 font-medium hidden sm:inline">Use mouse wheel or pinch to zoom • Drag to explore</span>
        </div>

        <InteractiveMap
          trip={trip}
          selectedCityId={selectedCityId}
          onSelectCity={(city) => setSelectedCityId(city.id)}
          currency={currency}
          height="540px"
          showControls={true}
        />
      </div>

      {/* Selected Location In-Depth Inspector Panel */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-start gap-4">
            <img
              src={selectedCity.coverImage}
              alt={selectedCity.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-700 shadow-xl shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold">
                  Stop #{cities.findIndex((c) => c.id === selectedCity.id) + 1}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{selectedCity.country} ({selectedCity.countryCode})</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                  {selectedCity.stayNights} Nights
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedCity.name}</h2>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  {selectedCity.arrivalDate} ➔ {selectedCity.departureDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {(selectedCity.lat || 0).toFixed(4)}°N, {(selectedCity.lng || 0).toFixed(4)}°E
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedCity.timezone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>Weather</span>
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {selectedCity.weather?.tempC || 20}°C / {selectedCity.weather?.tempF || 68}°F
              </div>
              <div className="text-[10px] text-slate-400">{selectedCity.weather?.condition || 'Pleasant'} • {selectedCity.weather?.rainChance || 15}% rain</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Currency & Lang</span>
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{selectedCity.currency}</div>
              <div className="text-[10px] text-slate-400">{selectedCity.language}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Emergency</span>
              </div>
              <div className="text-sm font-bold text-rose-300 mt-0.5">{selectedCity.emergencyNumber}</div>
              <div className="text-[10px] text-slate-400">Police / Medical</div>
            </div>
          </div>

        </div>

        {/* Location Highlights & Itinerary Connections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Key Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Location Highlights</span>
            </h3>
            <div className="space-y-2">
              {(selectedCity.highlights || []).map((highlight, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Stays & Dining in this City */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Mapped Stays & Gastronomy</span>
            </h3>

            <div className="space-y-2">
              {cityStays.length > 0 ? (
                cityStays.map((stay) => (
                  <div key={stay.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">{stay.name}</span>
                      <span className="text-amber-400 text-[11px] font-bold">★ {stay.rating}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{stay.nights} nights ({stay.type || 'Hotel'})</span>
                      <span className="font-semibold text-emerald-400">{formatCurrency(stay.totalCostUSD || 0, currency)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 italic">
                  No accommodations linked for this waypoint yet.
                </div>
              )}

              {cityDining.slice(0, 1).map((spot) => (
                <div key={spot.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-400" />
                      {spot.name}
                    </span>
                    <span className="text-emerald-400 text-[11px] font-bold">{spot.priceRange || '$$'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Cuisine: {spot.cuisine} • Must try {spot.mustTryDishes?.[0] || 'Chef Special'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Transit In & Out */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>Transit Segments</span>
            </h3>

            <div className="space-y-2">
              {inboundTransit && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-sky-400">Inbound Transit</span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">{inboundTransit.mode}</span>
                  </div>
                  <div className="font-bold text-white">{inboundTransit.fromCity} ➔ {inboundTransit.toCity}</div>
                  <div className="text-[11px] text-slate-400">{inboundTransit.carrier} • {inboundTransit.departureDate} {inboundTransit.departureTime}</div>
                </div>
              )}

              {outboundTransit && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-purple-400">Outbound Transit</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">{outboundTransit.mode}</span>
                  </div>
                  <div className="font-bold text-white">{outboundTransit.fromCity} ➔ {outboundTransit.toCity}</div>
                  <div className="text-[11px] text-slate-400">{outboundTransit.carrier} • {outboundTransit.departureDate} {outboundTransit.departureTime}</div>
                </div>
              )}

              {!inboundTransit && !outboundTransit && (
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 italic">
                  Local exploration stop or terminal waypoint.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* City Waypoint Cards Grid */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          All Journey Waypoints (Click to focus on map)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city, idx) => (
            <div
              key={city.id}
              id={`waypoint-card-${city.id}`}
              onClick={() => setSelectedCityId(city.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition space-y-3 ${
                selectedCity.id === city.id
                  ? 'bg-slate-900 border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {city.arrivalDate} ➔ {city.departureDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-base">{city.name}</h4>
                <p className="text-xs text-slate-400">{city.country} • {city.stayNights} Nights</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-amber-400 font-medium">★ {city.weather?.tempC || 20}°C</span>
                <span className="text-sky-400 font-semibold text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Focus Map
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
