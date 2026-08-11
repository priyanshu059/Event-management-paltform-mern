// ============================================================
// controllers/feedbackController.js - Feedback CRUD
// ============================================================
import Feedback from '../models/Feedback.js';

// GET /api/feedback/my - Get current user's own feedback
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id })
      .populate('event', 'title date location');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// PUT /api/feedback/:id - Update own feedback
export const updateFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    // Ensure only owner can update (or admin)
    if (fb.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised' });
    }
    const updated = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getFeedbackForEvent = async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'name');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('event', 'title')
      .populate('user', 'name email');
    res.json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createFeedback = async (req, res) => {
  try {
    // Support both eventId (from form) and event (direct) field names
    const eventId = req.body.eventId || req.body.event;
    if (!eventId) return res.status(400).json({ message: 'eventId is required' });

    // Check if user already submitted feedback for this event
    const existing = await Feedback.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already submitted feedback for this event' });

    const feedback = await Feedback.create({ ...req.body, event: eventId, user: req.user._id });
    res.status(201).json(feedback);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
