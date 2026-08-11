// ============================================================
// controllers/registrationController.js - Event Registration Logic
// ============================================================
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// POST /api/registrations - Register current user for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/registrations/my - Get current user's registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date location status');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/registrations - Get all registrations (admin only)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('event', 'title date')
      .populate('user', 'name email');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/registrations/:id - Update registration status (admin only)
export const updateRegistration = async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json(reg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/registrations/:id - Cancel/delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/registrations/:id/checkin - Toggle check-in status (admin only)
export const checkinRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    reg.checkedIn = !reg.checkedIn;   // toggles true ↔ false
    await reg.save();
    res.json(reg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

