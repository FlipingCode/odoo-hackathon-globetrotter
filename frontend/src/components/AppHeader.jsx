import React from 'react';
import { Search } from 'lucide-react';

export default function AppHeader() {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Global<span className="text-blue-600">Trotter</span>
                </h1>
            </div>

            {/* Global Search & Avatar */}
            <div className="flex items-center gap-6">
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search destinations..."
                        className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-64"
                    />
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">Jash Chaudhari</p>
                        <p className="text-xs text-gray-500">Explorer</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold">
                        JC
                    </div>
                </div>
            </div>
        </header>
    );
}