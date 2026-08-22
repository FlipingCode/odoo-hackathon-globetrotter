import React from 'react';
import { Filter, Plus } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import TripCard from '../components/TripCard';
import mockData from '../utils/mockData.json';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* 1. Banner Image (Screen 3) */}
                <div className="w-full h-72 rounded-3xl mb-10 overflow-hidden relative shadow-lg group cursor-pointer">
                    <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/30 transition-colors z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80"
                        alt="Travel Banner"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                            Where to next?
                        </h2>
                        <p className="text-lg text-white/90 font-medium max-w-xl drop-shadow-md">
                            Plan your dream multi-city itinerary, track your budget, and explore the world.
                        </p>
                    </div>
                </div>

                {/* 2. Global Toolbar (Screen 3) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm cursor-pointer">
                                <option>Group by: Date</option>
                                <option>Group by: Region</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <div className="relative flex-1 md:w-48">
                            <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm cursor-pointer">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Budget</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-bold text-sm">
                        <Plus className="w-4 h-4" /> Plan New Trip
                    </button>
                </div>

                {/* 3. Top Regional Selections */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Top Regional Selections
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {['Europe', 'Asia', 'South America', 'Africa', 'Oceania'].map((region, i) => (
                            <div key={i} className="min-w-[160px] h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 flex items-center justify-center text-blue-900 font-bold shadow-sm hover:shadow-md cursor-pointer transition-shadow">
                                {region}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Previous Trips */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Previous Trips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockData.trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}