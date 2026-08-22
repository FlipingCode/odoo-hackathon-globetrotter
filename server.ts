import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Trip Generator Endpoint
app.post('/api/gemini/plan-trip', async (req, res) => {
  try {
    const { destinationPrompt, durationDays, travelersCount, budgetTier, pace, styles } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: true,
        data: generateFallbackTripData(destinationPrompt, durationDays, travelersCount, budgetTier, pace, styles),
      });
    }

    const systemPrompt = `You are Globe Trotter AI, an expert international multi-city travel planner.
Generate a structured multi-city itinerary matching the user's criteria.
Output pure JSON conforming strictly to the requested schema.`;

    const prompt = `Plan an exceptional ${durationDays || 7}-day multi-city journey for ${travelersCount || 2} traveler(s).
Focus Destination / Region: "${destinationPrompt}".
Travel Pace: ${pace || 'Balanced'}.
Travel Styles: ${(styles || []).join(', ') || 'Culture, Food & Sightseeing'}.
Budget Tier: ${budgetTier || 'Moderate'}.

Return a JSON object containing:
- title (string): Creative and inspiring trip name
- tagline (string): One-sentence journey description
- budgetTotalUSD (number): Total estimated trip budget in USD
- pace (string): 'Relaxed' | 'Balanced' | 'Fast-Paced'
- styles (array of strings)
- cities (array of 2 to 4 cities with: id, name, country, countryCode, stayNights, lat, lng, timezone, currency, language, emergencyNumber, highlights (array), weather object { tempC, tempF, condition, icon, rainChance })
- dayPlans (array of day-by-day plans with dayNumber, cityName, theme, slots with timeSlot, period, durationHours, costUSD, and activity object { title, category, description, durationHours, costUSD, rating, location, bestTimeOfDay, bookingRequired, tags })
- transits (array of inter-city transit segments with fromCity, toCity, mode, carrier, duration, costUSD, notes)
- accommodations (array of stays for each city with name, type, pricePerNightUSD, rating, amenities, proximityToCenter)
- culinarySpots (array of 4 top culinary recommendations across the cities with name, cityName, cuisine, type, mustTryDishes, priceRange, address, dietaryTags)
- packingList (array of 8 essential packing items with name, category, packed: false, quantity, weightGrams, essential)
- visaHealthInfo (array of visa/entry/safety tips for each country with cityName, country, visaRequirement, maxStayDays, healthAdvisory, emergencyContacts)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating trip with Gemini:', error);
    const { destinationPrompt, durationDays, travelersCount, budgetTier, pace, styles } = req.body;
    return res.json({
      success: true,
      data: generateFallbackTripData(destinationPrompt, durationDays, travelersCount, budgetTier, pace, styles),
    });
  }
});

// Helper for offline / fallback trip data
function generateFallbackTripData(dest = 'Japan & East Asia', days = 7, travelers = 2, budget = 'Moderate', pace = 'Balanced', styles: string[] = ['Culture', 'Food']) {
  const destClean = dest.replace(/[^\w\s,&]/gi, '').trim() || 'Grand Explorer';
  return {
    title: `${destClean} Grand Journey`,
    tagline: `A curated ${days}-day expedition featuring premier cultural highlights, scenic routes, and culinary gems.`,
    budgetTotalUSD: travelers * (budget === 'Luxury' ? 3500 : budget === 'Backpacker' ? 1200 : 2200),
    pace: pace || 'Balanced',
    styles: styles.length ? styles : ['Culture & History', 'Food & Wine'],
    cities: [
      {
        id: `c-1-${Date.now()}`,
        name: destClean.split(/[,&]/)[0]?.trim() || 'First City',
        country: 'Destination Region',
        countryCode: 'EX',
        arrivalDate: '2026-10-01',
        departureDate: '2026-10-05',
        stayNights: Math.ceil(days / 2),
        lat: 48.8566,
        lng: 2.3522,
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        timezone: 'GMT+1',
        currency: 'EUR',
        language: 'Local',
        emergencyNumber: '112',
        highlights: ['Historic District Tour', 'Artisan Food Market', 'Iconic Viewpoint'],
        weather: { tempC: 20, tempF: 68, condition: 'Clear Skies', icon: 'sun', rainChance: 10, monthlyAvg: [] },
      },
      {
        id: `c-2-${Date.now()}`,
        name: destClean.split(/[,&]/)[1]?.trim() || 'Second City',
        country: 'Destination Region',
        countryCode: 'EX',
        arrivalDate: '2026-10-05',
        departureDate: '2026-10-08',
        stayNights: Math.floor(days / 2),
        lat: 45.4408,
        lng: 12.3155,
        coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
        timezone: 'GMT+1',
        currency: 'EUR',
        language: 'Local',
        emergencyNumber: '112',
        highlights: ['Scenic Waterfront Canal', 'Old Town Walk', 'Sunset Bistro Rooftop'],
        weather: { tempC: 22, tempF: 72, condition: 'Partly Cloudy', icon: 'cloud-sun', rainChance: 15, monthlyAvg: [] },
      },
    ],
    dayPlans: Array.from({ length: Math.min(days, 10) }, (_, i) => ({
      id: `dp-${i + 1}`,
      dayNumber: i + 1,
      date: `2026-10-0${i + 1}`,
      cityId: i < Math.ceil(days / 2) ? 'c-1' : 'c-2',
      cityName: i < Math.ceil(days / 2) ? (destClean.split(/[,&]/)[0]?.trim() || 'First City') : (destClean.split(/[,&]/)[1]?.trim() || 'Second City'),
      theme: i === 0 ? 'Arrival, Check-in & Sunset Welcome Stroll' : `Exploration & Culinary Highlights (Part ${i})`,
      slots: [
        {
          id: `s-${i}-1`,
          timeSlot: '09:30 AM',
          period: 'Morning',
          durationHours: 2.5,
          costUSD: 25,
          activity: {
            id: `act-${i}-1`,
            cityId: 'c-1',
            cityName: 'Destination',
            title: i === 0 ? 'City Historic Center Walking Tour' : 'Museum of Heritage & Architecture',
            category: 'Sightseeing',
            description: 'Experience centuries of local art and charming cobblestone alleys.',
            durationHours: 2.5,
            costUSD: 25,
            rating: 4.9,
            reviewsCount: 1200,
            imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80',
            location: 'Central Plaza',
            bestTimeOfDay: 'Morning',
            bookingRequired: false,
            tags: ['Culture', 'Walking', 'Iconic'],
          },
        },
      ],
    })),
    transits: [
      {
        id: `tr-${Date.now()}`,
        fromCity: destClean.split(/[,&]/)[0]?.trim() || 'First City',
        toCity: destClean.split(/[,&]/)[1]?.trim() || 'Second City',
        mode: 'Train',
        carrier: 'High-Speed Express Rail',
        bookingRef: 'EXP-4091',
        departureDate: '2026-10-05',
        departureTime: '10:00 AM',
        arrivalDate: '2026-10-05',
        arrivalTime: '12:45 PM',
        duration: '2h 45m',
        costUSD: 65,
        status: 'Reserved',
        notes: 'High speed scenic rail with panoramic coach windows.',
      },
    ],
    accommodations: [],
    packingList: [
      { id: 'p-1', name: 'Universal International Power Adapter', category: 'Electronics', packed: false, quantity: 2, weightGrams: 200, essential: true },
      { id: 'p-2', name: 'Waterproof Lightweight Shell Jacket', category: 'Clothing', packed: false, quantity: 1, weightGrams: 400, essential: true },
      { id: 'p-3', name: 'Comfortable City Walking Shoes', category: 'Clothing', packed: false, quantity: 1, weightGrams: 700, essential: true },
    ],
    culinarySpots: [],
    visaHealthInfo: [],
  };
}

// AI Travel Co-Pilot Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, message, history, tripContext } = req.body;
    const ai = getGeminiClient();

    const userMessage = message || (Array.isArray(messages) ? messages[messages.length - 1]?.text : 'Give me tips for this trip');

    if (!ai) {
      return res.json({
        success: true,
        reply: `Here are expert recommendations for **${tripContext?.title || 'your journey'}**:

1. **Optimal Pacing**: Group activities by neighborhood to minimize transit time and leave afternoons open for spontaneous strolls.
2. **Dining Insider Tip**: Look for bustling local eateries situated 2-3 blocks away from main tourist squares for genuine cuisine at half the cost.
3. **Transport & Passes**: Digital transit cards and contactless payment are widely supported across major urban train lines.`,
      });
    }

    const systemInstruction = `You are Globe Trotter AI Co-Pilot, a warm, knowledgeable, concise, and savvy travel concierge.
You assist travelers with multi-city logistics, local hidden gems, pacing advice, dining recommendations, packing tips, transit passes, cultural etiquette, and currency tricks.
Current Trip Context:
Title: ${tripContext?.title || 'World Journey'}
Cities: ${Array.isArray(tripContext?.cities) ? tripContext.cities.join(' -> ') : 'Multiple Destinations'}
Pace: ${tripContext?.pace || 'Balanced'}
Travelers: ${Array.isArray(tripContext?.travelers) ? tripContext.travelers.join(', ') : 'Travelers'}

Format your answer with clear markdown, bullet points where appropriate, and keep suggestions actionable, concise, and inspiring.`;

    let chatContents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      chatContents = history.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: Array.isArray(h.parts) ? h.parts : [{ text: h.text || '' }],
      }));
    } else if (Array.isArray(messages) && messages.length > 0) {
      chatContents = messages.map((m: any) => ({
        role: m.sender === 'ai' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text || '' }],
      }));
    } else {
      chatContents = [{ role: 'user', parts: [{ text: userMessage }] }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I am ready to help you plan your journey!';
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Error in travel chat:', error);
    return res.json({
      success: true,
      reply: `Here are helpful insights for your route:
- **Morning Sights**: Visit top landmarks early morning to avoid peak queues.
- **Local Dining**: Reservations are recommended for popular evening bistros.
- **Transit**: Validate train tickets on platforms prior to boarding where applicable.`,
    });
  }
});

// AI Smart Packing Suggestions (supports both /api/gemini/packing and /api/gemini/packing-suggestions)
const handlePackingRequest = async (req: express.Request, res: express.Response) => {
  try {
    const { cities, season, seasonOrMonth, activities, styles, pace, durationDays } = req.body;
    const ai = getGeminiClient();

    const targetCities = Array.isArray(cities) ? cities.join(', ') : 'Destination Cities';
    const targetSeason = season || seasonOrMonth || 'Mild Weather';

    if (!ai) {
      const fallbackList = [
        { name: 'Universal Travel Power Adapter (All Plugs)', category: 'Electronics', quantity: 1, weightGrams: 180, essential: true },
        { name: 'Breathable Rain & Wind Jacket', category: 'Clothing', quantity: 1, weightGrams: 350, essential: true },
        { name: 'Ergonomic Walking Sneakers', category: 'Clothing', quantity: 1, weightGrams: 600, essential: true },
        { name: 'Passport & Travel Document Pouch (RFID Safe)', category: 'Documents', quantity: 1, weightGrams: 120, essential: true },
        { name: 'Compact 10,000mAh Power Bank', category: 'Electronics', quantity: 1, weightGrams: 220, essential: true },
        { name: 'Travel First Aid & Hydration Electrolytes', category: 'Health', quantity: 1, weightGrams: 150, essential: true },
        { name: 'Collapsible Water Bottle', category: 'Gear', quantity: 1, weightGrams: 100, essential: false },
        { name: 'Quick-Dry Microfiber Towel', category: 'Toiletries', quantity: 1, weightGrams: 140, essential: false },
      ];
      return res.json({ success: true, items: fallbackList, packingItems: fallbackList });
    }

    const prompt = `Generate a smart packing list for a ${durationDays || 7}-day trip visiting: ${targetCities}.
Season/Weather: ${targetSeason}.
Travel Styles: ${Array.isArray(styles) ? styles.join(', ') : 'Sightseeing, Dining'}.
Pace: ${pace || 'Balanced'}.

Return a JSON array of 8 to 10 packing items with:
- name (string)
- category ('Clothing' | 'Electronics' | 'Toiletries' | 'Documents' | 'Health' | 'Gear')
- quantity (number)
- weightGrams (number)
- essential (boolean)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ success: true, items: parsed, packingItems: parsed });
  } catch (error: any) {
    console.error('Error generating packing list:', error);
    const fallbackList = [
      { name: 'Universal International Adapter', category: 'Electronics', quantity: 1, weightGrams: 180, essential: true },
      { name: 'Weather-Proof Shell Jacket', category: 'Clothing', quantity: 1, weightGrams: 350, essential: true },
      { name: 'Comfortable Footwear', category: 'Clothing', quantity: 1, weightGrams: 600, essential: true },
      { name: 'Travel Document Organizer', category: 'Documents', quantity: 1, weightGrams: 120, essential: true },
    ];
    return res.json({ success: true, items: fallbackList, packingItems: fallbackList });
  }
};

app.post('/api/gemini/packing', handlePackingRequest);
app.post('/api/gemini/packing-suggestions', handlePackingRequest);

// AI Discover Attractions & Food
app.post('/api/gemini/discover', async (req, res) => {
  try {
    const { city, category, vibe } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const sampleItems = [
        {
          title: `${city || 'Historic'} Iconic Landmark Tour`,
          category: 'Sightseeing',
          description: `Marvel at historical architecture and panoramic vistas across ${city || 'the city'}.`,
          durationHours: 2.5,
          costUSD: 25,
          rating: 4.9,
          location: 'Old Town District',
          bestTimeOfDay: 'Morning',
          bookingRequired: true,
          tags: ['Historic', 'Scenic', 'Must-See'],
        },
        {
          title: `Artisan Food & Neighborhood Wine Crawl`,
          category: 'Food & Drink',
          description: `Sample regional specialties, cheeses, and artisanal bites with local sommeliers.`,
          durationHours: 3.0,
          costUSD: 65,
          rating: 4.8,
          location: 'Culinary Quarter',
          bestTimeOfDay: 'Evening',
          bookingRequired: true,
          tags: ['Foodie', 'Wine', 'Authentic'],
        },
        {
          title: `Hidden Secret Courtyards & Rooftop Viewpoint`,
          category: 'Relaxation',
          description: `Escape the crowds to enjoy quiet gardens and breathtaking city skyline panoramas.`,
          durationHours: 1.5,
          costUSD: 0,
          rating: 4.7,
          location: 'Upper Terraces',
          bestTimeOfDay: 'Afternoon',
          bookingRequired: false,
          tags: ['Secret Gem', 'Photography', 'Free'],
        },
      ];
      return res.json({ success: true, items: sampleItems });
    }

    const prompt = `Provide 4 authentic, highly rated recommendations for the city of "${city || 'Paris'}".
Focus Category: ${category || 'Attractions and Culinary'}.
Vibe / Preference: ${vibe || 'Iconic highlights and local favorites'}.

Return JSON array of items with:
- title (string)
- category ('Sightseeing' | 'Food & Drink' | 'Adventure' | 'Museum & Art' | 'Relaxation' | 'Nightlife' | 'Shopping')
- description (string, 1-2 sentences)
- durationHours (number)
- costUSD (number)
- rating (number, e.g. 4.8)
- location (string)
- bestTimeOfDay ('Morning' | 'Afternoon' | 'Evening' | 'Anytime')
- bookingRequired (boolean)
- tags (array of 3 strings)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ success: true, items: parsed });
  } catch (error: any) {
    console.error('Error in discover:', error);
    const sampleItems = [
      {
        title: `${req.body.city || 'City'} Historic Quarter Walk`,
        category: 'Sightseeing',
        description: 'Explore vibrant squares and historic architectural gems.',
        durationHours: 2,
        costUSD: 0,
        rating: 4.8,
        location: 'City Center',
        bestTimeOfDay: 'Morning',
        bookingRequired: false,
        tags: ['Culture', 'Walk', 'Highlights'],
      },
    ];
    return res.json({ success: true, items: sampleItems });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Globe Trotter Server running on port ${PORT}`);
  });
}

startServer();
