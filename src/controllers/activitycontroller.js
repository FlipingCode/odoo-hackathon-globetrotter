const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../db/database');

async function addActivity(req, res) {
  try {
    const { stop_id, name, description, category, estimated_cost, currency, duration_minutes, day_number, scheduled_time, booking_status, location, image_url } = req.body;

    if (!stop_id || !name) {
      return res.status(400).json({ success: false, message: 'stop_id and activity name are required.' });
    }

    const stop = await get(`
      SELECT s.id, s.trip_id, t.user_id, t.currency AS trip_currency 
      FROM stops s JOIN trips t ON s.trip_id = t.id WHERE s.id = ?
    `, [stop_id]);

    if (!stop || stop.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized or stop not found.' });
    }

    const activityId = uuidv4();
    const day = Number(day_number) || 1;
    const maxOrder = await get('SELECT MAX(order_index) as max_order FROM activities WHERE stop_id = ? AND day_number = ?', [stop_id, day]);
    const nextOrder = (maxOrder?.max_order ?? -1) + 1;

    await run(`
      INSERT INTO activities (id, stop_id, trip_id, name, description, category, estimated_cost, currency, duration_minutes, day_number, scheduled_time, booking_status, location, image_url, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      activityId,
      stop_id,
      stop.trip_id,
      name.trim(),
      description || '',
      category || 'Sightseeing',
      Number(estimated_cost) || 0,
      currency || stop.trip_currency || 'USD',
      Number(duration_minutes) || 60,
      day,
      scheduled_time || '10:00',
      booking_status || 'planned',
      location || '',
      image_url || '',
      nextOrder
    ]);

    const createdActivity = await get('SELECT * FROM activities WHERE id = ?', [activityId]);
    return res.status(201).json({ success: true, message: 'Activity added to itinerary.', activity: createdActivity });
  } catch (err) {
    console.error('Add activity error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add activity.' });
  }
}

async function updateActivity(req, res) {
  try {
    const { id } = req.params;
    const { name, description, category, estimated_cost, currency, duration_minutes, day_number, scheduled_time, booking_status, location, image_url, order_index } = req.body;

    const activity = await get('SELECT a.*, t.user_id FROM activities a JOIN trips t ON a.trip_id = t.id WHERE a.id = ?', [id]);
    if (!activity || activity.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await run(`
      UPDATE activities
      SET name = ?, description = ?, category = ?, estimated_cost = ?, currency = ?, duration_minutes = ?, day_number = ?, scheduled_time = ?, booking_status = ?, location = ?, image_url = ?, order_index = ?
      WHERE id = ?
    `, [
      name || activity.name,
      description !== undefined ? description : activity.description,
      category || activity.category,
      estimated_cost !== undefined ? Number(estimated_cost) : activity.estimated_cost,
      currency || activity.currency,
      duration_minutes !== undefined ? Number(duration_minutes) : activity.duration_minutes,
      day_number !== undefined ? Number(day_number) : activity.day_number,
      scheduled_time !== undefined ? scheduled_time : activity.scheduled_time,
      booking_status || activity.booking_status,
      location !== undefined ? location : activity.location,
      image_url !== undefined ? image_url : activity.image_url,
      order_index !== undefined ? Number(order_index) : activity.order_index,
      id
    ]);

    const updatedActivity = await get('SELECT * FROM activities WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Activity updated.', activity: updatedActivity });
  } catch (err) {
    console.error('Update activity error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update activity.' });
  }
}

async function deleteActivity(req, res) {
  try {
    const { id } = req.params;
    const activity = await get('SELECT a.*, t.user_id FROM activities a JOIN trips t ON a.trip_id = t.id WHERE a.id = ?', [id]);
    if (!activity || activity.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await run('DELETE FROM activities WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Activity deleted.' });
  } catch (err) {
    console.error('Delete activity error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete activity.' });
  }
}

// Drag-and-drop batch reorder across days
async function reorderActivities(req, res) {
  try {
    const { trip_id, activities_order } = req.body;
    if (!trip_id || !Array.isArray(activities_order)) return res.status(400).json({ success: false, message: 'Invalid payload.' });

    const trip = await get('SELECT id, user_id FROM trips WHERE id = ?', [trip_id]);
    if (!trip || trip.user_id !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    for (const item of activities_order) {
      await run(`
        UPDATE activities 
        SET day_number = COALESCE(?, day_number), order_index = COALESCE(?, order_index)
        WHERE id = ? AND trip_id = ?
      `, [item.day_number, item.order_index, item.id, trip_id]);
    }

    const updated = await all('SELECT * FROM activities WHERE trip_id = ? ORDER BY day_number ASC, order_index ASC', [trip_id]);
    return res.status(200).json({ success: true, message: 'Activities reordered.', activities: updated });
  } catch (err) {
    console.error('Reorder activities error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder activities.' });
  }
}

module.exports = { addActivity, updateActivity, deleteActivity, reorderActivities };