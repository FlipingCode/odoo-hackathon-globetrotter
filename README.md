# GlobeTrotter
GlobeTrotter is a personalized, intelligent, and collaborative platform that transforms the way individuals plan and experience travel. It empowers users to dream, design, and organize trips with ease by offering an end-to-end travel planning tool.
## Features (13 Core Features)
1. **Login / Signup**: Secure entry point for personalized planning.
2. **Dashboard / Home**: Central hub for upcoming trips and inspiration.
3. **Create Trip**: Form to initiate a personalized travel plan.
4. **My Trips (Trip List)**: View and manage all created trips.
5. **Itinerary Builder**: Interactive planner to add cities, dates, and activities.
6. **Itinerary View**: Visual representation of the completed trip.
7. **City Search**: Discover and add relevant cities to your itinerary.
8. **Activity Search**: Browse and select things to do in each destination.
9. **Trip Budget & Cost Breakdown**: Estimated cost tracker.
10. **Trip Calendar**: Calendar-based visualization of the daily flow.
11. **Shared/Public Itinerary View**: Publicly shareable version of the itinerary.
12. **User Profile / Settings**: Account management and preferences.
13. **Admin / Analytics Dashboard**: Track user trends and platform usage.
## Tech Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic, Python-JOSE (JWT Auth).
- **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Lucide React.
## Project Structure
```text
GlobeTrotter/
├── backend/               # FastAPI Server & SQLite Database
│   ├── main.py            # API Entry Point
│   ├── models.py          # SQLAlchemy Models
│   ├── schemas.py         # Pydantic Validation Models
│   ├── database.py        # Database Configuration
│   ├── auth.py            # Authentication Logic
│   ├── routers/           # API Endpoints
│   └── requirements.txt   # Python Dependencies
└── frontend/              # Vite React Application
    ├── src/
    │   ├── App.jsx        # Routing and Layout
    │   ├── pages/         # 12 React Components for the Screens
    │   └── ...
    ├── package.json       # Node Dependencies
    └── tailwind.config.js # Tailwind Styling Configuration
```
