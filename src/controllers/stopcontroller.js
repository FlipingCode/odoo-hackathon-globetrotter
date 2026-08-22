const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../db/database');

async function addStop(req, res) {
  try {
    const { trip_id, city_name, country, latitude, longitude, arrival_date, departure_date, stay_cost_per_night, transport_cost_to_stop, notes } = req.body;

    if (!trip_id || !city_name || !country || !arrival_date || !departure_date) {
      return res.status(400).json({ success: false, message: 'Trip ID, city name, country, arrival and departure dates are required.' });
    }

    const trip = await get('SELECT id, user_id FROM trips WHERE id = ?', [trip_id]);
    if (!trip || trip.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized or trip not found.' });
    }

    const maxOrder = await get('SELECT MAX(order_index) as max_order FROM stops WHERE trip_id = ?', [trip_id]);
    const nextOrder = (maxOrder?.max_order ?? -1) + 1;

    const stopId = uuidv4();
    await run(`
      INSERT INTO stops (id, trip_id, city_name, country, latitude, longitude, arrival_date, departure_date, order_index, stay_cost_per_night, transport_cost_to_stop, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [stopId, trip_id, city_name.trim(), country.trim(), latitude || null, longitude || null, arrival_date, departure_date, nextOrder, Number(stay_cost_per_night) || 0, Number(transport_cost_to_stop) || 0, notes || '']);

    const createdStop = await get('SELECT * FROM stops WHERE id = ?', [stopId]);
    return res.status(201).json({ success: true, message: `Stop in ${city_name} added.`, stop: createdStop });
  } catch (err) {
    console.error('Add stop error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add stop.' });
  }
}

async function updateStop(req, res) {
  try {
    const { id } = req.params;
    const { city_name, country, latitude, longitude, arrival_date, departure_date, order_index, stay_cost_per_night, transport_cost_to_stop, notes } = req.body;

    const stop = await get('SELECT s.*, t.user_id FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?', [id]);
    if (!stop || stop.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized or stop not found.' });

    await run(`
      UPDATE stops 
      SET city_name = ?, country = ?, latitude = ?, longitude = ?, arrival_date = ?, departure_date = ?, order_index = ?, stay_cost_per_night = ?, transport_cost_to_stop = ?, notes = ?
      WHERE id = ?
    `, [city_name || stop.city_name, country || stop.country, latitude !== undefined ? latitude : stop.latitude, longitude !== undefined ? longitude : stop.longitude, arrival_date || stop.arrival_date, departure_date || stop.departure_date, order_index !== undefined ? Number(order_index) : stop.order_index, stay_cost_per_night !== undefined ? Number(stay_cost_per_night) : stop.stay_cost_per_night, transport_cost_to_stop !== undefined ? Number(transport_cost_to_stop) : stop.transport_cost_to_stop, notes !== undefined ? notes : stop.notes, id]);

    const updatedStop = await get('SELECT * FROM stops WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Stop updated.', stop: updatedStop });
  } catch (err) {
    console.error('Update stop error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update stop.' });
  }
}

async function deleteStop(req, res) {
  try {
    const { id } = req.params;
    const stop = await get('SELECT s.*, t.user_id FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?', [id]);
    if (!stop || stop.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized or stop not found.' });

    await run('DELETE FROM stops WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Stop and activities deleted.' });
  } catch (err) {
    console.error('Delete stop error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete stop.' });
  }
}

async function reorderStops(req, res) {
  try {
    const { trip_id, stops_order } = req.body;
    if (!trip_id || !Array.isArray(stops_order)) return res.status(400).json({ success: false, message: 'Invalid payload.' });

    const trip = await get('SELECT id, user_id FROM trips WHERE id = ?', [trip_id]);
    if (!trip || trip.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    for (const item of stops_order) {
      await run('UPDATE stops SET order_index = ? WHERE id = ? AND trip_id = ?', [item.order_index, item.id, trip_id]);
    }

    const updatedStops = await all('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [trip_id]);
    return res.status(200).json({ success: true, message: 'Stops reordered.', stops: updatedStops });
  } catch (err) {
    console.error('Reorder stops error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder stops.' });
  }
}

module.exports = { addStop, updateStop, deleteStop, reorderStops };