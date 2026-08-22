import { renderNavbar } from '../components/Navbar.js';
import { LoginView } from '../pages/LoginView.js';
import { RegisterView } from '../pages/RegisterView.js';
import { DashboardView } from '../pages/DashboardView.js';
import { CreateTripView } from '../pages/CreateTripView.js';
import { ItineraryBuilder } from '../pages/ItineraryBuilder.js';
import { TripListView } from '../pages/TripListView.js';
import { ProfileView } from '../pages/ProfileView.js';
import { ExploreSearch } from '../pages/ExploreSearch.js';
import { ItineraryView } from '../pages/ItineraryView.js';
import { CommunityView } from '../pages/CommunityView.js';
import { CalendarView } from '../pages/CalendarView.js';
import { AdminDashboard } from '../pages/AdminDashboard.js';

const routes = {
    '': DashboardView,
    'dashboard': DashboardView,
    'login': LoginView,
    'register': RegisterView,
    'create-trip': CreateTripView,
    'itinerary-builder': ItineraryBuilder,
    'trips': TripListView,
    'profile': ProfileView,
    'explore': ExploreSearch,
    'itinerary-view': ItineraryView,
    'community': CommunityView,
    'calendar': CalendarView,
    'admin': AdminDashboard,
};

function router() {
    const hash = window.location.hash.slice(2).split('?')[0] || 'dashboard';
    const pageRenderer = routes[hash] || DashboardView;

    // Mount Navbar
    document.getElementById('navbar-mount').innerHTML = renderNavbar(hash);

    // Mount View
    document.getElementById('app-root').innerHTML = pageRenderer();

    // Re-initialize Lucide icon SVG glyphs
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
}

// Router Event Listeners
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);