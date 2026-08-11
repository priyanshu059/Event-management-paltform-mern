// ============================================================
// controllers/registrationController.js - Event Registration Logic
// ============================================================
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// POST /api/registrations - Register current user for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;   // ✅ Fixed: read ticketType from body

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    // ✅ Fixed: Capacity enforcement — check how many are already registered
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (event.capacity && registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'This event is fully booked' });
    }

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      ticketType: ticketType || 'Standard',    // ✅ Fixed: save chosen ticket type
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

// PUT /api/registrations/:id - Update registration (owner or admin only)
export const updateRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    // ✅ Fixed: IDOR — only owner or admin can update
    const isOwner = reg.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }

    const updated = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/registrations/:id - Cancel/delete registration (owner or admin only)
export const deleteRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });

    // ✅ Fixed: IDOR — only owner or admin can delete
    const isOwner = reg.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    await Registration.findByIdAndDelete(req.params.id);
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
