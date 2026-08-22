import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Navigation, 
  Compass, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Utensils, 
  Building2, 
  Sparkles, 
  Search,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Trip, CityStay, Activity, Accommodation, CulinarySpot, Currency } from '../types';
import { formatCurrency } from '../data/mockData';

export type MapTileTheme = 'dark' | 'streets' | 'satellite' | 'light';

const TILE_LAYERS: Record<MapTileTheme, { name: string; url: string; attribution: string; maxZoom: number }> = {
  dark: {
    name: 'Dark Canvas',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  streets: {
    name: 'Voyager Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
  },
  light: {
    name: 'Clean Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
};

interface InteractiveMapProps {
  trip: Trip;
  selectedCityId?: string;
  onSelectCity?: (city: CityStay) => void;
  onSelectActivity?: (activity: Activity) => void;
  currency?: Currency;
  height?: string;
  showControls?: boolean;
  initialCityId?: string;
  singleCityMode?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trip,
  selectedCityId,
  onSelectCity,
  onSelectActivity,
  currency = 'USD',
  height = '540px',
  showControls = true,
  initialCityId,
  singleCityMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [currentTheme, setCurrentTheme] = useState<MapTileTheme>('dark');
  const [activeCityId, setActiveCityId] = useState<string>(
    selectedCityId || initialCityId || trip?.cities?.[0]?.id || ''
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showActivities, setShowActivities] = useState(true);
  const [showStays, setShowStays] = useState(true);
  const [showDining, setShowDining] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Sync selectedCityId from props if provided
  useEffect(() => {
    if (selectedCityId && selectedCityId !== activeCityId) {
      setActiveCityId(selectedCityId);
    }
  }, [selectedCityId]);

  const cities = useMemo(() => trip?.cities || [], [trip]);
  const currentCity = useMemo(
    () => cities.find((c) => c.id === activeCityId) || cities[0],
    [cities, activeCityId]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultLat = currentCity?.lat || 48.8566;
    const defaultLng = currentCity?.lng || 2.3522;
    const defaultZoom = singleCityMode ? 12 : 5;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    // Add Zoom Control on top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Tile Layer
    const tileConfig = TILE_LAYERS[currentTheme];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer Groups
    const routeLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    routeLayerRef.current = routeLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Force map to recognize container size
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_LAYERS[currentTheme];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [currentTheme]);

  // Render Markers & Route Lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    if (!cities.length) return;

    // 1. Draw Route Connecting Cities
    if (showRoute && cities.length > 1 && !singleCityMode) {
      const latlngs: L.LatLngExpression[] = cities.map((c) => [c.lat || 0, c.lng || 0]);

      // Outer glow line
      const glowLine = L.polyline(latlngs, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeLayer.addLayer(glowLine);

      // Core animated dash line
      const mainLine = L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeLayer.addLayer(mainLine);
    }

    // 2. City Markers
    cities.forEach((city, index) => {
      const isSelected = city.id === activeCityId;
      const lat = city.lat || 0;
      const lng = city.lng || 0;

      // Custom Glowing City HTML Marker
      const iconHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-30'}">
          <div class="absolute -inset-2 rounded-full ${isSelected ? 'bg-sky-400/40 animate-ping' : 'bg-sky-500/20'}"></div>
          <div class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isSelected ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/50 ring-2 ring-white font-bold' : 'bg-slate-900/90 text-white border border-sky-400/60 shadow-md backdrop-blur-md'}">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-slate-950 text-sky-400' : 'bg-sky-500 text-slate-950'}">
              ${index + 1}
            </span>
            <span class="text-xs font-bold whitespace-nowrap">${city.name}</span>
            <span class="text-[10px] ${isSelected ? 'text-slate-800' : 'text-sky-400'} font-medium">(${city.stayNights}n)</span>
          </div>
        </div>
      `;

      const cityIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-city-marker',
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      const marker = L.marker([lat, lng], { icon: cityIcon });

      // Popup for City
      const popupHtml = `
        <div class="w-64 p-0 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-2xl">
          <div class="relative h-28 w-full overflow-hidden">
            <img src="${city.coverImage}" alt="${city.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between">
              <div>
                <span class="text-[10px] font-black tracking-wider uppercase text-sky-400">Stop #${index + 1}</span>
                <h4 class="text-base font-black text-white leading-tight">${city.name}, ${city.country}</h4>
              </div>
              <span class="px-2 py-0.5 rounded-md bg-sky-500 text-slate-950 text-xs font-extrabold">${city.stayNights} Nights</span>
            </div>
          </div>
          <div class="p-3 space-y-2 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span>Dates:</span>
              <span class="font-semibold text-white">${city.arrivalDate} → ${city.departureDate}</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span>Weather:</span>
              <span class="font-semibold text-amber-400">${city.weather?.tempC || 20}°C (${city.weather?.tempF || 68}°F) • ${city.weather?.condition || 'Pleasant'}</span>
            </div>
            <div class="pt-1 flex flex-wrap gap-1">
              ${(city.highlights || []).slice(0, 3).map((h) => `<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">★ ${h}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, className: 'custom-leaflet-popup' });

      marker.on('click', () => {
        setActiveCityId(city.id);
        if (onSelectCity) onSelectCity(city);
        map.flyTo([lat, lng], 12, { duration: 1.2 });
      });

      markersLayer.addLayer(marker);
    });

    // 3. Activity & Experience Markers
    if (showActivities) {
      // Gather activities for all or active city
      const activitiesToRender: { activity: Activity; lat: number; lng: number }[] = [];

      (trip?.dayPlans || []).forEach((dp) => {
        const city = cities.find((c) => c.id === dp.cityId);
        if (!city) return;

        dp.slots?.forEach((slot, sIdx) => {
          if (slot.activity) {
            // Generate offset coordinates around the city center
            const angle = (sIdx * 65 + (slot.activity.title.length * 20)) % 360;
            const rad = (angle * Math.PI) / 180;
            const distDeg = 0.015 + ((sIdx % 3) * 0.012);
            const aLat = (city.lat || 48.8566) + Math.cos(rad) * distDeg;
            const aLng = (city.lng || 2.3522) + Math.sin(rad) * (distDeg * 1.4);

            activitiesToRender.push({
              activity: slot.activity,
              lat: aLat,
              lng: aLng,
            });
          }
        });
      });

      // Filter by active city if in singleCityMode or user focused
      activitiesToRender.forEach(({ activity, lat, lng }) => {
        if (singleCityMode && activity.cityName !== currentCity?.name) return;

        const categoryColors: Record<string, string> = {
          Sightseeing: 'bg-emerald-500 text-slate-950 border-emerald-400',
          'Food & Drink': 'bg-amber-500 text-slate-950 border-amber-400',
          'Museum & Art': 'bg-purple-500 text-white border-purple-400',
          Adventure: 'bg-rose-500 text-white border-rose-400',
          Relaxation: 'bg-teal-500 text-white border-teal-400',
        };

        const colorClass = categoryColors[activity.category] || 'bg-sky-500 text-slate-950 border-sky-400';

        const actIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group hover:scale-125 transition-transform duration-200">
            <div class="w-7 h-7 rounded-xl ${colorClass} border shadow-lg flex items-center justify-center text-xs font-bold">
              🏛️
            </div>
          </div>
        `;

        const actIcon = L.divIcon({
          html: actIconHtml,
          className: 'custom-act-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const actMarker = L.marker([lat, lng], { icon: actIcon });

        const actPopup = `
          <div class="w-60 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-xl">
            <img src="${activity.imageUrl}" alt="${activity.title}" class="w-full h-24 object-cover" />
            <div class="p-3 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">${activity.category}</span>
                <span class="text-amber-400 font-bold">★ ${activity.rating}</span>
              </div>
              <h4 class="font-bold text-white text-sm leading-snug">${activity.title}</h4>
              <p class="text-slate-400 line-clamp-2 text-[11px]">${activity.description}</p>
              <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <span class="text-slate-400">Duration: ${activity.durationHours}h</span>
                <span class="font-bold text-sky-400">${activity.costUSD > 0 ? formatCurrency(activity.costUSD, currency) : 'Free'}</span>
              </div>
            </div>
          </div>
        `;

        actMarker.bindPopup(actPopup, { maxWidth: 260 });
        markersLayer.addLayer(actMarker);
      });
    }

    // 4. Accommodations / Hotels
    if (showStays && trip.accommodations?.length) {
      trip.accommodations.forEach((acc, aIdx) => {
        const city = cities.find((c) => c.name.toLowerCase() === acc.cityName.toLowerCase() || c.id === acc.cityId);
        if (!city) return;
        if (singleCityMode && city.id !== activeCityId) return;

        const hLat = (city.lat || 48.8566) + 0.008 + (aIdx * 0.005);
        const hLng = (city.lng || 2.3522) - 0.009 - (aIdx * 0.006);

        const hotelIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group hover:scale-125 transition-transform duration-200">
            <div class="w-7 h-7 rounded-xl bg-indigo-600 text-white border border-indigo-400 shadow-lg flex items-center justify-center text-xs font-bold">
              🏨
            </div>
          </div>
        `;

        const hotelIcon = L.divIcon({
          html: hotelIconHtml,
          className: 'custom-hotel-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const hotelMarker = L.marker([hLat, hLng], { icon: hotelIcon });

        const hotelPopup = `
          <div class="w-60 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-xl">
            <img src="${acc.imageUrl || acc.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}" alt="${acc.name}" class="w-full h-24 object-cover" />
            <div class="p-3 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">${acc.type || 'Hotel'}</span>
                <span class="text-amber-400 font-bold">★ ${acc.rating}</span>
              </div>
              <h4 class="font-bold text-white text-sm leading-snug">${acc.name}</h4>
              <p class="text-slate-400 text-[11px]">${acc.address}</p>
              <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <span class="text-slate-400">${acc.nights} nights</span>
                <span class="font-bold text-emerald-400">${formatCurrency(acc.totalCostUSD || 0, currency)}</span>
              </div>
            </div>
          </div>
        `;

        hotelMarker.bindPopup(hotelPopup, { maxWidth: 260 });
        markersLayer.addLayer(hotelMarker);
      });
    }

    // 5. Culinary Spots
    if (showDining && trip.culinarySpots?.length) {
      trip.culinarySpots.forEach((spot, sIdx) => {
        const city = cities.find((c) => c.name.toLowerCase() === spot.cityName.toLowerCase() || c.id === spot.cityId);
        if (!city) return;
        if (singleCityMode && city.id !== activeCityId) return;

        const fLat = (city.lat || 48.8566) - 0.007 - (sIdx * 0.006);
        const fLng = (city.lng || 2.3522) + 0.012 + (sIdx * 0.005);

        const foodIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group hover:scale-125 transition-transform duration-200">
            <div class="w-7 h-7 rounded-xl bg-amber-600 text-white border border-amber-400 shadow-lg flex items-center justify-center text-xs font-bold">
              🍷
            </div>
          </div>
        `;

        const foodIcon = L.divIcon({
          html: foodIconHtml,
          className: 'custom-food-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const foodMarker = L.marker([fLat, fLng], { icon: foodIcon });

        const foodPopup = `
          <div class="w-60 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 shadow-xl">
            <img src="${spot.imageUrl}" alt="${spot.name}" class="w-full h-24 object-cover" />
            <div class="p-3 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">${spot.cuisine}</span>
                <span class="text-emerald-400 font-bold">${spot.priceRange || '$$'}</span>
              </div>
              <h4 class="font-bold text-white text-sm leading-snug">${spot.name}</h4>
              <p class="text-slate-300 text-[11px]">Must try: <strong class="text-amber-400">${spot.mustTryDishes?.[0] || spot.mustTryDish || 'Chef Special'}</strong></p>
            </div>
          </div>
        `;

        foodMarker.bindPopup(foodPopup, { maxWidth: 260 });
        markersLayer.addLayer(foodMarker);
      });
    }

  }, [cities, activeCityId, showActivities, showStays, showDining, showRoute, singleCityMode, trip, currentTheme, currency]);

  // Fit all cities on initial load or reset
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map || !cities.length) return;

    if (cities.length === 1) {
      map.flyTo([cities[0].lat || 48.8566, cities[0].lng || 2.3522], 12, { duration: 1.2 });
      return;
    }

    const bounds = L.latLngBounds(cities.map((c) => [c.lat || 0, c.lng || 0]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, animate: true });
  };

  const handleFlyToCity = (city: CityStay) => {
    setActiveCityId(city.id);
    if (onSelectCity) onSelectCity(city);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([city.lat || 48.8566, city.lng || 2.3522], 13, { duration: 1.2 });
    }
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();
    // Search cities first
    const matchedCity = cities.find(
      (c) => c.name.toLowerCase().includes(query) || c.country.toLowerCase().includes(query)
    );

    if (matchedCity) {
      handleFlyToCity(matchedCity);
      return;
    }

    // Search activities
    let matchedActCoord: { lat: number; lng: number } | null = null;
    (trip?.dayPlans || []).forEach((dp) => {
      const city = cities.find((c) => c.id === dp.cityId);
      dp.slots?.forEach((s) => {
        if (s.activity?.title.toLowerCase().includes(query) && city) {
          matchedActCoord = { lat: city.lat, lng: city.lng };
        }
      });
    });

    if (matchedActCoord && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([(matchedActCoord as any).lat, (matchedActCoord as any).lng], 14, { duration: 1.2 });
    }
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''}`}>
      
      {/* Top Floating Controls Bar */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Left: City Selector Pills & Search */}
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            
            {/* Search Input */}
            <form onSubmit={handleSearchLocation} className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search waypoint or sight..."
                className="w-48 lg:w-60 pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-slate-100 placeholder-slate-400 text-xs border border-slate-700/80 shadow-lg backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* City Quick-Jumps */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-md overflow-x-auto max-w-[80vw] sm:max-w-none">
              <button
                id="map-fit-all-btn"
                onClick={handleFitAll}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1"
                title="Fit all cities on route"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">Full Route</span>
              </button>

              {cities.map((city, idx) => (
                <button
                  key={city.id}
                  id={`map-city-pill-${city.id}`}
                  onClick={() => handleFlyToCity(city)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeCityId === city.id
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${activeCityId === city.id ? 'bg-slate-950 text-sky-400' : 'bg-slate-800 text-slate-300'}`}>
                    {idx + 1}
                  </span>
                  <span>{city.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Map Layer Switcher & Fullscreen */}
          <div className="flex items-center gap-2 pointer-events-auto ml-auto">
            
            {/* Layer Filter Toggles */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-md text-xs">
              <button
                onClick={() => setShowRoute(!showRoute)}
                className={`px-2 py-1 rounded-xl font-medium transition ${showRoute ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                title="Toggle Route Path Line"
              >
                Path
              </button>
              <button
                onClick={() => setShowActivities(!showActivities)}
                className={`px-2 py-1 rounded-xl font-medium transition ${showActivities ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                title="Toggle Sights & Activities"
              >
                Sights
              </button>
              <button
                onClick={() => setShowStays(!showStays)}
                className={`px-2 py-1 rounded-xl font-medium transition ${showStays ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                title="Toggle Accommodations"
              >
                Stays
              </button>
              <button
                onClick={() => setShowDining(!showDining)}
                className={`px-2 py-1 rounded-xl font-medium transition ${showDining ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                title="Toggle Food & Wine"
              >
                Food
              </button>
            </div>

            {/* Tile Theme Dropdown */}
            <div className="relative">
              <button
                id="map-theme-toggle-btn"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold"
                title="Change Map Style"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">{TILE_LAYERS[currentTheme].name}</span>
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 space-y-1">
                  {(Object.keys(TILE_LAYERS) as MapTileTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setCurrentTheme(t);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        currentTheme === t
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{TILE_LAYERS[t].name}</span>
                      {currentTheme === t && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              id="map-fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-xl backdrop-blur-md transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-sky-400" /> : <Maximize2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{ height: isFullscreen ? '100%' : height }}
        className="w-full relative z-10"
      />

      {/* Bottom Floating Legend / Quick Info Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-[400] pointer-events-none flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] text-slate-300 shadow-xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400"></span>
            <span className="font-semibold text-white">City Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Sightseeing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>Hotel Stay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Dining Spot</span>
          </div>
        </div>

        {currentCity && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs text-slate-200 shadow-xl backdrop-blur-md pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Currently focused: <strong className="text-white">{currentCity.name}, {currentCity.country}</strong> ({currentCity.stayNights} nights)</span>
          </div>
        )}
      </div>

    </div>
  );
};
