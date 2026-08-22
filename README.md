# Globe Trotter 🌍✈️

Globe Trotter is an advanced, AI-powered multi-city itinerary planner and travel master application. It is designed to help travelers seamlessly plan, organize, and explore complex journeys spanning multiple destinations.

## ✨ Features

* **Multi-City Itineraries:** Easily plan routes across multiple cities, tracking arrival/departure dates, timezones, and stay durations.
* **Interactive Slippy Map:** A fully integrated geographic map (powered by Leaflet) featuring:
  * 4 distinct map themes (Dark Canvas, Voyager Streets, Satellite, Clean Light)
  * Dynamic route lines connecting your city stops
  * Interactive waypoints for attractions, hotels, and dining spots with detailed popups
* **AI Concierge & Co-Pilot:** An intelligent chat interface loaded with your trip context, ready to provide context-aware recommendations, transit optimization tips, and cultural etiquette.
* **Smart Activity Discovery:** Search, filter, and add experiences to your day plans, or use AI to discover new sights based on your preferences.
* **Accommodations & Dining:** Track your hotel stays, boutique residences, and curated culinary spots complete with cost tracking and booking references.
* **Budget Tracking & Currency Conversion:** Automatically track expenses across different categories (Lodging, Flights, Activities, Dining) and convert them to your preferred currency.
* **Export & Print Hub:** Download your trip as a JSON file or generate a beautiful print-ready itinerary summary to share with fellow travelers.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)

### Installation

1. Navigate to the project directory in your terminal.
2. Install the required dependencies:

```bash
npm install
```

### Running the Development Server

To start the application locally, run the following command:

```bash
npm run dev
```

The application will start, and you can view it in your browser (typically at `http://localhost:5173`).

## 🛠️ Built With

* [React](https://reactjs.org/) - UI Library
* [TypeScript](https://www.typescriptlang.org/) - Type safety
* [Tailwind CSS](https://tailwindcss.com/) - Styling and layout
* [Leaflet](https://leafletjs.com/) - Interactive maps
* [Vite](https://vitejs.dev/) - Frontend tooling and bundling
* [Lucide React](https://lucide.dev/) - Beautiful icon set

## 📦 Project Structure

* `/src/components/` - Reusable UI components (Navbar, Modals, InteractiveMap, etc.)
* `/src/components/views/` - Main feature screens (Dashboard, MapView, AIConcierge, Activities, Stays, etc.)
* `/src/data/` - Mock data and initial state models
* `/src/types.ts` - TypeScript interfaces and type definitions
