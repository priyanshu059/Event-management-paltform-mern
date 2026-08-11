// ============================================================
// controllers/reminderController.js - Reminder CRUD
// ============================================================
import Reminder from '../models/Reminder.js';
import Event from '../models/Event.js';

// POST /api/reminders - Create a reminder for an event
export const createReminder = async (req, res) => {
  try {
    const { eventId, remindAt, message } = req.body;
    if (!eventId || !remindAt) {
      return res.status(400).json({ message: 'eventId and remindAt are required' });
    }

    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const reminder = await Reminder.create({
      user: req.user._id,
      event: eventId,
      remindAt: new Date(remindAt),
      message: message || `Reminder for: ${event.title}`,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reminders/my - Get current user's reminders
export const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('event', 'title date location')
      .sort({ remindAt: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reminders/:id - Delete a reminder (owner only)
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    // Only the owner can delete their reminder
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this reminder' });
    }

    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
