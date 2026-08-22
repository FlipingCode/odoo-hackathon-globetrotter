import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function TripCard({ trip }) {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image Header */}
            <div
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${trip.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{trip.title}</h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30 uppercase tracking-wider">
                        {trip.status}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{trip.startDate} — {trip.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{trip.destinationCount} Destinations</span>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Est. Cost</p>
                        <p className="text-lg font-bold text-gray-900">${trip.totalBudget}</p>
                    </div>
                    <button className="px-5 py-2 bg-gray-50 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                        View Itinerary
                    </button>
                </div>
            </div>
        </div>
    );
}