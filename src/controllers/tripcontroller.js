const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../db/database');
const { calculateTripBudget } = require('../services/budgetCalculator');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 40);
}

// 1. Create a New Trip
async function createTrip(req, res) {
  try {
    const { title, description, start_date, end_date, cover_image, target_budget, currency, is_public } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and end date are required.'
      });
    }

    const tripId = uuidv4();
    const slugBase = slugify(title);
    const shareSlug = `${slugBase}-${uuidv4().substring(0, 6)}`;
    const tripCurrency = currency || 'USD';
    const budget = Number(target_budget) || 0;
    const cover = cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';

    await run(`
      INSERT INTO trips (id, user_id, title, description, start_date, end_date, cover_image, target_budget, currency, is_public, share_slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [tripId, req.user.id, title, description || '', start_date, end_date, cover, budget, tripCurrency, is_public ? 1 : 0, shareSlug]);

    const createdTrip = await get('SELECT * FROM trips WHERE id = ?', [tripId]);

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully.',
      trip: createdTrip
    });
  } catch (err) {
    console.error('Create trip error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create trip.' });
  }
}

// 2. Get All Trips for Current User
async function getUserTrips(req, res) {
  try {
    const trips = await all(`
      SELECT 
        t.*,
        COUNT(DISTINCT s.id) AS stop_count,
        COUNT(DISTINCT a.id) AS activity_count
      FROM trips t
      LEFT JOIN stops s ON t.id = s.trip_id
      LEFT JOIN activities a ON t.id = a.trip_id
      WHERE t.user_id = ?
      GROUP BY t.id
      ORDER BY t.start_date DESC
    `, [req.user.id]);

    const enhancedTrips = trips.map((trip) => {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const days = Math.max(1, Math.round((end - start) / (1000 * 3600 * 24)) + 1);

      return {
        ...trip,
        is_public: Boolean(trip.is_public),
        duration_days: days
      };
    });

    return res.status(200).json({
      success: true,
      count: enhancedTrips.length,
      trips: enhancedTrips
    });
  } catch (err) {
    console.error('Get user trips error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch trips.' });
  }
}

// 3. Get Full Trip Details by ID (Nested Itinerary + Live Budget)
async function getTripById(req, res) {
  try {
    const { id } = req.params;

    const trip = await get('SELECT * FROM trips WHERE id = ?', [id]);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.user_id !== req.user?.id && !trip.is_public) {
      return res.status(403).json({ success: false, message: 'Access denied to this private itinerary.' });
    }

    const stops = await all('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC, arrival_date ASC', [id]);
    const activities = await all('SELECT * FROM activities WHERE trip_id = ? ORDER BY day_number ASC, scheduled_time ASC, order_index ASC', [id]);
    const customExpenses = await all('SELECT * FROM custom_expenses WHERE trip_id = ? ORDER BY expense_date ASC', [id]);

    const stopsWithActivities = stops.map((stop) => ({
      ...stop,
      activities: activities.filter((act) => act.stop_id === stop.id)
    }));

    const budgetAnalytics = calculateTripBudget(trip, stops, activities, customExpenses);

    return res.status(200).json({
      success: true,
      trip: {
        ...trip,
        is_public: Boolean(trip.is_public),
        stops: stopsWithActivities,
        custom_expenses: customExpenses,
        budget_analytics: budgetAnalytics
      }
    });
  } catch (err) {
    console.error('Get trip by ID error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve trip details.' });
  }
}

// 4. Update Trip Metadata
async function updateTrip(req, res) {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, cover_image, target_budget, currency, is_public } = req.body;

    const trip = await get('SELECT * FROM trips WHERE id = ?', [id]);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    if (trip.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await run(`
      UPDATE trips
      SET title = ?, description = ?, start_date = ?, end_date = ?, cover_image = ?, target_budget = ?, currency = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title || trip.title,
      description !== undefined ? description : trip.description,
      start_date || trip.start_date,
      end_date || trip.end_date,
      cover_image !== undefined ? cover_image : trip.cover_image,
      target_budget !== undefined ? Number(target_budget) : trip.target_budget,
      currency || trip.currency,
      is_public !== undefined ? (is_public ? 1 : 0) : trip.is_public,
      id
    ]);

    const updatedTrip = await get('SELECT * FROM trips WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: 'Trip updated successfully.', trip: updatedTrip });
  } catch (err) {
    console.error('Update trip error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update trip.' });
  }
}

// 5. Delete Trip
async function deleteTrip(req, res) {
  try {
    const { id } = req.params;
    const trip = await get('SELECT * FROM trips WHERE id = ?', [id]);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    if (trip.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await run('DELETE FROM trips WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Trip deleted successfully.' });
  } catch (err) {
    console.error('Delete trip error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete trip.' });
  }
}

// 6. Public Shared Trip View (slug based)
async function getSharedTrip(req, res) {
  try {
    const { slug } = req.params;
    const trip = await get(`
      SELECT t.*, u.name AS author_name, u.avatar_url AS author_avatar
      FROM trips t
      JOIN users u ON t.user_id = u.id
      WHERE (t.share_slug = ? OR t.id = ?) AND t.is_public = 1
    `, [slug, slug]);

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Shared itinerary not found or is private.' });
    }

    const stops = await all('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [trip.id]);
    const activities = await all('SELECT * FROM activities WHERE trip_id = ? ORDER BY day_number ASC, scheduled_time ASC', [trip.id]);
    const customExpenses = await all('SELECT * FROM custom_expenses WHERE trip_id = ?', [trip.id]);

    const stopsWithActivities = stops.map((stop) => ({
      ...stop,
      activities: activities.filter((act) => act.stop_id === stop.id)
    }));

    const budgetAnalytics = calculateTripBudget(trip, stops, activities, customExpenses);

    return res.status(200).json({
      success: true,
      shared_trip: {
        ...trip,
        stops: stopsWithActivities,
        budget_analytics: budgetAnalytics
      }
    });
  } catch (err) {
    console.error('Get shared trip error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch shared itinerary.' });
  }
}

// 7. Copy / Fork Trip ("Copy Trip" Feature)
async function cloneTrip(req, res) {
  try {
    const { id } = req.params;
    const sourceTrip = await get('SELECT * FROM trips WHERE id = ?', [id]);
    if (!sourceTrip) return res.status(404).json({ success: false, message: 'Source trip not found.' });

    if (sourceTrip.user_id !== req.user.id && !sourceTrip.is_public) {
      return res.status(403).json({ success: false, message: 'Cannot clone private trip.' });
    }

    const newTripId = uuidv4();
    const newTitle = `Copy of ${sourceTrip.title}`;
    const newSlug = `${slugify(newTitle)}-${uuidv4().substring(0, 6)}`;

    await run(`
      INSERT INTO trips (id, user_id, title, description, start_date, end_date, cover_image, target_budget, currency, is_public, share_slug, cloned_from_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `, [newTripId, req.user.id, newTitle, sourceTrip.description, sourceTrip.start_date, sourceTrip.end_date, sourceTrip.cover_image, sourceTrip.target_budget, sourceTrip.currency, newSlug, sourceTrip.id]);

    const originalStops = await all('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [id]);

    for (const stop of originalStops) {
      const newStopId = uuidv4();
      await run(`
        INSERT INTO stops (id, trip_id, city_name, country, latitude, longitude, arrival_date, departure_date, order_index, stay_cost_per_night, transport_cost_to_stop, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [newStopId, newTripId, stop.city_name, stop.country, stop.latitude, stop.longitude, stop.arrival_date, stop.departure_date, stop.order_index, stop.stay_cost_per_night, stop.transport_cost_to_stop, stop.notes]);

      const stopActivities = await all('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
      for (const act of stopActivities) {
        await run(`
          INSERT INTO activities (id, stop_id, trip_id, name, description, category, estimated_cost, currency, duration_minutes, day_number, scheduled_time, booking_status, location, image_url, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned', ?, ?, ?)
        `, [uuidv4(), newStopId, newTripId, act.name, act.description, act.category, act.estimated_cost, act.currency, act.duration_minutes, act.day_number, act.scheduled_time, act.location, act.image_url, act.order_index]);
      }
    }

    const clonedTrip = await get('SELECT * FROM trips WHERE id = ?', [newTripId]);

    return res.status(201).json({
      success: true,
      message: 'Trip copied to your account successfully!',
      trip: clonedTrip
    });
  } catch (err) {
    console.error('Clone trip error:', err);
    return res.status(500).json({ success: false, message: 'Failed to copy trip.' });
  }
}

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getSharedTrip,
  cloneTrip
};