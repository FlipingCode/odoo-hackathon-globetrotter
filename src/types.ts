export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR' | 'CHF';

export type TravelPace = 'Relaxed' | 'Balanced' | 'Fast-Paced';
export type TravelStyle = 'Culture & History' | 'Food & Wine' | 'Nature & Adventure' | 'Luxury & Relax' | 'Budget Backpacker' | 'Family Friendly';

export interface Activity {
  id: string;
  cityId: string;
  cityName: string;
  title: string;
  category: 'Sightseeing' | 'Food & Drink' | 'Adventure' | 'Museum & Art' | 'Relaxation' | 'Nightlife' | 'Shopping';
  description: string;
  durationHours: number;
  costUSD: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  location: string;
  bestTimeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  bookingRequired: boolean;
  tags: string[];
}

export interface DayActivitySlot {
  id: string;
  activityId?: string;
  customTitle?: string;
  timeSlot: '09:00 AM' | '11:30 AM' | '02:00 PM' | '05:00 PM' | '08:00 PM';
  period: 'Morning' | 'Afternoon' | 'Evening';
  durationHours: number;
  costUSD: number;
  notes?: string;
  activity?: Activity;
  isCustom?: boolean;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string;
  cityId: string;
  cityName: string;
  theme: string;
  slots: DayActivitySlot[];
  transitToNextCity?: boolean;
}

export interface CityStay {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  arrivalDate: string;
  departureDate: string;
  stayNights: number;
  lat: number;
  lng: number;
  coverImage: string;
  timezone: string;
  currency: string;
  language: string;
  emergencyNumber: string;
  highlights: string[];
  weather: {
    tempC: number;
    tempF: number;
    condition: string;
    icon: string;
    rainChance: number;
    monthlyAvg: { month: string; highC: number; lowC: number; rainDays: number }[];
  };
}

export interface TransitSegment {
  id: string;
  fromCity: string;
  toCity: string;
  mode: 'Flight' | 'Train' | 'Bus' | 'Ferry' | 'Rental Car';
  carrier: string;
  bookingRef: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  costUSD: number;
  status: 'Confirmed' | 'Reserved' | 'Pending' | 'Exploring';
  seatNumber?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  notes?: string;
}

export interface Accommodation {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  type: string;
  address: string;
  checkIn?: string;
  checkOut?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nights: number;
  pricePerNightUSD?: number;
  totalCostUSD: number;
  rating: number;
  coverImage?: string;
  imageUrl?: string;
  bookingStatus?: 'Booked' | 'Saved' | 'Considering';
  confirmationCode?: string;
  roomType?: string;
  amenities: string[];
  proximityToCenter?: string;
}

export interface CulinarySpot {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  cuisine: string;
  type?: string;
  mustTryDishes?: string[];
  mustTryDish?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  address: string;
  dietaryTags?: string[];
  imageUrl: string;
  reservationRecommended?: boolean;
  reservationBooked?: boolean;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Lodging' | 'Transport' | 'Food' | 'Activities' | 'Shopping' | 'Misc';
  amountUSD: number;
  cityId?: string;
  cityName?: string;
  date: string;
  paidBy: string;
  splitAmong: string[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Clothing' | 'Electronics' | 'Toiletries' | 'Documents' | 'Medicine & Health' | 'Adventure Gear';
  packed: boolean;
  quantity: number;
  weightGrams: number;
  essential: boolean;
  notes?: string;
}

export interface VisaHealthInfo {
  cityId: string;
  cityName: string;
  country: string;
  passportValidityMonths: number;
  visaRequirement: 'Visa Free' | 'eVisa Required' | 'Visa on Arrival' | 'Embassy Visa Required';
  maxStayDays: number;
  vaccinesRequired: string[];
  healthAdvisory: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    fire: string;
    touristHelpline: string;
    embassyPhone: string;
  };
  customsAlerts: string[];
}

export interface TripNote {
  id: string;
  title: string;
  category: 'General' | 'Document' | 'Recommendation' | 'Diary';
  content: string;
  updatedAt: string;
  author: string;
}

export interface Trip {
  id: string;
  title: string;
  tagline: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  travelersCount: number;
  travelerNames: string[];
  budgetTotalUSD: number;
  targetCurrency: Currency;
  pace: TravelPace;
  styles: TravelStyle[];
  cities: CityStay[];
  dayPlans: DayPlan[];
  transits: TransitSegment[];
  accommodations: Accommodation[];
  expenses: ExpenseItem[];
  packingList: PackingItem[];
  culinarySpots: CulinarySpot[];
  visaHealthInfo: VisaHealthInfo[];
  notes: TripNote[];
}

export type ViewScreen = 
  | 'dashboard'
  | 'itinerary'
  | 'activities'
  | 'budget'
  | 'map'
  | 'transit'
  | 'stays'
  | 'culinary'
  | 'weather'
  | 'packing'
  | 'visa_health'
  | 'ai_concierge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}
