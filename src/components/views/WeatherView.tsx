import React, { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Info,
  Calendar,
  Umbrella
} from 'lucide-react';
import { Trip, CityStay } from '../../types';

interface WeatherViewProps {
  trip: Trip;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ trip }) => {
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
      case 'cloud-rain': return <CloudRain className="w-8 h-8 text-sky-400" />;
      case 'cloud-sun': return <CloudSun className="w-8 h-8 text-amber-300" />;
      default: return <CloudSun className="w-8 h-8 text-sky-300" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <CloudSun className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Climate & Weather Forecasts</h1>
              <p className="text-xs text-slate-400">Multi-destination seasonal temps, rain probabilities & clothing guidance</p>
            </div>
          </div>
        </div>

        {/* °C / °F Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setUnit('C')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              unit === 'C' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            °C (Celsius)
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              unit === 'F' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            °F (Fahrenheit)
          </button>
        </div>
      </div>

      {/* Cities Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trip.cities.map((city) => {
          const temp = unit === 'C' ? `${city.weather.tempC}°C` : `${city.weather.tempF}°F`;
          return (
            <div
              key={city.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 hover:border-slate-700 transition shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 text-xs font-bold border border-slate-700">
                    {city.country}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1.5">{city.name}</h3>
                  <p className="text-xs text-slate-400">Stay: {city.stayNights} Nights</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                  {getWeatherIcon(city.weather.icon)}
                </div>
              </div>

              {/* Main Temp & Condition */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">{temp}</span>
                <span className="text-sm font-semibold text-sky-300">{city.weather.condition}</span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Precipitation</div>
                    <div className="font-bold text-slate-200">{city.weather.rainChance}% Chance</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center gap-2.5">
                  <Wind className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Breeze</div>
                    <div className="font-bold text-slate-200">12 km/h</div>
                  </div>
                </div>
              </div>

              {/* Climate Clothing Advice */}
              <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <Umbrella className="w-3 h-3" />
                  Clothing Recommendation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {city.weather.tempC > 22
                    ? 'Light breathable fabrics, sunglasses, sun hat, and comfortable walking sneakers.'
                    : 'Layered light sweater, light rain jacket for evening breezes, and sturdy walking shoes.'}
                </p>
              </div>

              {/* Monthly Average Bar */}
              {city.weather.monthlyAvg && city.weather.monthlyAvg.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase mb-2">Annual Trend</div>
                  <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                    {city.weather.monthlyAvg.map((m, idx) => (
                      <div key={idx} className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                        <div className="text-slate-400">{m.month}</div>
                        <div className="font-bold text-white mt-0.5">{unit === 'C' ? `${m.avgC}°` : `${Math.round(m.avgC * 1.8 + 32)}°`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
