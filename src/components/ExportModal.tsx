import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';
import { Trip, Currency } from '../types';
import { formatCurrency } from '../data/mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  currency: Currency;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, trip, currency }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const titleSafe = trip.title || 'Globe Trotter Trip';
  const cities = trip.cities || [];
  const transits = trip.transits || [];
  const accommodations = trip.accommodations || [];
  const dayPlans = trip.dayPlans || [];
  const styles = trip.styles || ['Culture & Leisure'];
  const travelerNames = trip.travelerNames || ['Traveler'];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${titleSafe.toLowerCase().replace(/\s+/g, '-')}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const lines = [
      `✈️ GLOBE TROTTER MULTI-CITY ITINERARY: ${titleSafe}`,
      `Dates: ${trip.startDate || 'TBD'} to ${trip.endDate || 'TBD'} | Travelers: ${trip.travelersCount || 1} | Pace: ${trip.pace || 'Balanced'}`,
      `Total Budget: ${formatCurrency(trip.budgetTotalUSD || 0, currency)}`,
      '',
      `📍 CITIES VISITED:`,
      ...cities.map((c, i) => `${i + 1}. ${c.name}, ${c.country} (${c.stayNights} nights) - Currency: ${c.currency}`),
      '',
      `🚆 TRANSIT SEGMENTS:`,
      ...transits.map((t) => `• ${t.fromCity} -> ${t.toCity} by ${t.mode} (${t.carrier}, Ref: ${t.bookingRef}) - Dep: ${t.departureDate} ${t.departureTime}`),
      '',
      `🏨 ACCOMMODATIONS:`,
      ...accommodations.map((a) => `• ${a.cityName}: ${a.name} (${a.nights} nts) - Code: ${a.confirmationCode || 'Reserved'}`),
      '',
      `📅 DAY-BY-DAY SCHEDULE:`,
      ...dayPlans.map((dp) => `Day ${dp.dayNumber} (${dp.cityName}): ${dp.theme} - ${(dp.slots || []).map((s) => s.activity?.title || s.customTitle).filter(Boolean).join(' | ')}`),
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Trip Dossier & Export</h2>
              <p className="text-xs text-slate-400">Printable travel itinerary summary & offline packet</p>
            </div>
          </div>
          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800">
          <div className="text-xs text-slate-400 font-medium">
            Ready for travel briefing & offline printing
          </div>
          <div className="flex items-center gap-2">
            <button
              id="copy-summary-btn"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              id="download-json-btn"
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              id="print-itinerary-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Itinerary</span>
            </button>
          </div>
        </div>

        {/* Printable Preview Document */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900 text-slate-200 text-sm print:bg-white print:text-black print:p-0">
          
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">Globe Trotter Travel Master</span>
                <h1 className="text-2xl font-black text-white mt-1">{titleSafe}</h1>
                <p className="text-slate-400 text-xs mt-0.5">{trip.tagline || 'Multi-city itinerary'}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Estimated Total</div>
                <div className="text-xl font-bold text-emerald-400">{formatCurrency(trip.budgetTotalUSD || 0, currency)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Duration</div>
                <div className="font-semibold text-slate-200">{trip.startDate || 'Upcoming'} → {trip.endDate || 'Upcoming'}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Travelers</div>
                <div className="font-semibold text-slate-200">{trip.travelersCount || 1} ({travelerNames.join(', ')})</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Pace & Styles</div>
                <div className="font-semibold text-slate-200">{trip.pace || 'Balanced'} • {styles[0] || 'Culture'}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="text-slate-400">Route</div>
                <div className="font-semibold text-slate-200">{cities.map((c) => c.name).join(' → ') || 'Custom Route'}</div>
              </div>
            </div>
          </div>

          {/* Cities & Stays */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
              Destination Cities & Accommodations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trip.cities.map((city, idx) => {
                const stay = trip.accommodations.find((a) => a.cityId === city.id || a.cityName.toLowerCase() === city.name.toLowerCase());
                return (
                  <div key={city.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {city.name}, {city.country}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {city.stayNights} Nights
                      </span>
                    </div>
                    {stay ? (
                      <div className="text-xs text-slate-300 border-t border-slate-700/60 pt-2">
                        <div className="font-semibold text-sky-300">{stay.name}</div>
                        <div className="text-slate-400 text-[11px] truncate">{stay.address}</div>
                        <div className="text-slate-400 text-[11px] flex justify-between mt-1">
                          <span>Ref: {stay.confirmationCode || 'CONF-OK'}</span>
                          <span>{formatCurrency(stay.totalCostUSD, currency)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">Stay arrangements in progress</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transit Connections */}
          {trip.transits.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Inter-City Transit Connections
              </h3>
              <div className="space-y-2">
                {trip.transits.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">
                        {t.fromCity} ➔ {t.toCity} ({t.mode})
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {t.carrier} • Ref: <span className="text-sky-300">{t.bookingRef}</span> • Duration: {t.duration}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-200">{t.departureDate}</div>
                      <div className="text-slate-400 text-[11px]">{t.departureTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day by Day Plan Highlights */}
          {trip.dayPlans.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Day-by-Day Schedule
              </h3>
              <div className="space-y-3">
                {trip.dayPlans.map((dp) => (
                  <div key={dp.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                      <span className="font-bold text-sky-400">Day {dp.dayNumber} • {dp.cityName}</span>
                      <span className="text-slate-300 font-medium">{dp.theme}</span>
                    </div>
                    <div className="space-y-1.5 pl-2">
                      {dp.slots.map((s) => (
                        <div key={s.id} className="flex items-start gap-2">
                          <span className="text-slate-400 w-16 text-[11px] shrink-0">{s.timeSlot}</span>
                          <span className="text-slate-200 font-medium">
                            {s.activity?.title || s.customTitle}
                            {s.activity?.durationHours && (
                              <span className="text-slate-400 text-[10px] ml-1.5">({s.activity.durationHours}h)</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
