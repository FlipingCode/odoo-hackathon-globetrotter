/**
 * Global reactive mock state for GlobeTrotter
 */
export const store = {
    currentUser: {
        id: "usr-101",
        firstName: "Alex",
        lastName: "Rivers",
        email: "alex.rivers@example.com",
        phone: "+1 (555) 234-5678",
        city: "San Francisco",
        country: "United States",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        bio: "Passionate globetrotter, mountain hiker, and photography enthusiast."
    },

    trips: [
        {
            id: "trip-1",
            title: "Alpine Adventure in Switzerland",
            destination: "Interlaken & Zermatt",
            startDate: "2026-09-10",
            endDate: "2026-09-20",
            status: "Ongoing",
            coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
            totalBudget: 4200,
            spentBudget: 2150,
            sections: [
                { id: "sec-1", name: "Paragliding over Interlaken", dateRange: "Sep 10 - Sep 13", budget: 1200, details: "Scenic flight & mountain hostel stays" },
                { id: "sec-2", name: "Zermatt Matterhorn Glacier Hike", dateRange: "Sep 14 - Sep 18", budget: 2000, details: "Cable car tickets, alpine gear rentals, chalet" },
                { id: "sec-3", name: "Zurich Old Town Exploration", dateRange: "Sep 19 - Sep 20", budget: 1000, details: "Culinary walking tour & airport transfer" }
            ]
        },
        {
            id: "trip-2",
            title: "Kyoto & Tokyo Cultural Odyssey",
            destination: "Japan",
            startDate: "2026-11-05",
            endDate: "2026-11-18",
            status: "Upcoming",
            coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
            totalBudget: 3800,
            spentBudget: 600,
            sections: [
                { id: "sec-4", name: "Historic Kyoto Temples", dateRange: "Nov 05 - Nov 10", budget: 1600, details: "Tea ceremony and bamboo forest tour" }
            ]
        },
        {
            id: "trip-3",
            title: "Amalfi Coast Scenic Drive",
            destination: "Italy",
            startDate: "2026-05-01",
            endDate: "2026-05-10",
            status: "Completed",
            coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
            totalBudget: 3100,
            spentBudget: 3050,
            sections: [
                { id: "sec-5", name: "Positano & Capri Boat Tour", dateRange: "May 01 - May 06", budget: 2200, details: "Vespa rentals, boat charters, coastal villa" }
            ]
        }
    ],

    activities: [
        { id: "act-1", name: "Tandem Paragliding", city: "Interlaken", cost: 190, duration: "3 hrs", category: "Adventure", rating: 4.9 },
        { id: "act-2", name: "Matterhorn Heli-Skiing", city: "Zermatt", cost: 450, duration: "5 hrs", category: "Extreme", rating: 4.8 },
        { id: "act-3", name: "Fushimi Inari Sunrise Walk", city: "Kyoto", cost: 25, duration: "2.5 hrs", category: "Culture", rating: 4.9 },
        { id: "act-4", name: "Capri Grotto Private Boat", city: "Amalfi", cost: 180, duration: "4 hrs", category: "Leisure", rating: 4.7 }
    ],

    communityPosts: [
        {
            id: "comm-1",
            author: "Elena Rostova",
            authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
            title: "7 Days in Iceland Ring Road - Winter Wonderland",
            likes: 342,
            comments: 28,
            cover: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
            content: "Chasing northern lights and walking inside blue ice caves. Here is the full budget breakdown and itinerary!"
        },
        {
            id: "comm-2",
            author: "Marcus Chen",
            authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            title: "Backpacking Vietnam for under $40 a day",
            likes: 512,
            comments: 64,
            cover: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
            content: "From Hanoi's street food corners to Ha Long Bay cruising. Check out the day-wise itinerary."
        }
    ],

    getTripsByStatus(status) {
        return this.trips.filter(t => t.status.toLowerCase() === status.toLowerCase());
    },

    addTrip(trip) {
        this.trips.unshift({ ...trip, id: `trip-${Date.now()}`, sections: [] });
    }
};