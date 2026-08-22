import React from 'react';
import { 
  ShieldAlert, 
  FileCheck, 
  HeartPulse, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Globe2,
  Lock,
  Hospital
} from 'lucide-react';
import { Trip } from '../../types';

interface VisaHealthViewProps {
  trip: Trip;
}

export const VisaHealthView: React.FC<VisaHealthViewProps> = ({ trip }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Visa, Health & Safety Advisories</h1>
              <p className="text-xs text-slate-400">Entry prerequisites, passport rules, vaccines & destination emergency numbers</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>All Dest Countries Normal Advisory</span>
          </span>
        </div>
      </div>

      {/* Country Entry Dossiers */}
      <div className="space-y-6">
        {trip.cities.map((city) => {
          const info = trip.visaHealthInfo.find(
            (v) => v.country.toLowerCase() === city.country.toLowerCase()
          ) || {
            country: city.country,
            visaRequirement: 'Visa-Free / Electronic Travel Authorization (ETA) up to 90 days for most tourist passports.',
            passportValidityMonths: 6,
            vaccinesRequired: ['Routine Vaccines (MMR, DTP)', 'Covid-19 Booster Recommended'],
            emergencyNumber: city.emergencyNumber || '112',
            healthSafetyTips: 'Tap water is potable. Comprehensive travel medical insurance is strongly advised.',
          };

          return (
            <div
              key={city.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl hover:border-slate-700 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sky-400 text-sm">
                    {city.countryCode}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{city.country}</h3>
                    <p className="text-xs text-slate-400">Destination City Hub: {city.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-rose-400" />
                    <span>Emergency: <strong className="text-white">{info.emergencyNumber}</strong></span>
                  </span>
                </div>
              </div>

              {/* Requirement Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Visa & Entry */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>Visa & Entry Rules</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {info.visaRequirement}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    Passport must have <strong className="text-white">{info.passportValidityMonths}+ months</strong> remaining validity from departure date.
                  </div>
                </div>

                {/* Health & Vaccines */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <HeartPulse className="w-4 h-4" />
                    <span>Health & Vaccines</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {info.vaccinesRequired.map((vac, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs">
                        <span className="text-emerald-400">•</span>
                        <span>{vac}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    No mandatory yellow fever certificates required for transit.
                  </div>
                </div>

                {/* Safety & Local Guidance */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Hospital className="w-4 h-4" />
                    <span>Sanitation & Safety</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {info.healthSafetyTips}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    Keep digital copies of prescriptions and insurance policy IDs on phone.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Quick Numbers Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <Phone className="w-4 h-4" />
          <span>Global Traveler Emergency Protocol</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          In European Union countries (France, Italy, Switzerland, Germany, Netherlands, Spain), dialing <strong>112</strong> connects directly to emergency dispatch in English and local languages. In the United Kingdom, dial <strong>999</strong> or <strong>112</strong>. In Japan, dial <strong>119</strong> for ambulance/fire and <strong>110</strong> for police.
        </p>
      </div>
    </div>
  );
};
