// ============================================================
// models/Event.js - Event Model
// ============================================================
// Defines what an "Event" looks like in our database.
// Maps to the Flask Event model from app.py
// ============================================================

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  // Event title (e.g. "AI Summit 2026")
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },

  // Long description of the event
  description: {
    type: String,
    default: '',
  },

  // Date of the event (e.g. "2026-07-10")
  date: {
    type: String,
    default: '',
  },

  // Time of the event (e.g. "09:00 AM")
  time: {
    type: String,
    default: '',
  },

  // Where the event takes place
  location: {
    type: String,
    default: '',
  },

  // Maximum number of people allowed
  capacity: {
    type: Number,
    default: 100,
  },

  // Current status of the event
  // Category of the event (e.g. "Technology", "Workshop")
  category: {
    type: String,
    default: '',
  },

  // Ticket price (0 = Free)
  price: {
    type: Number,
    default: 0,
  },

  // Optional link to a Venue document
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    default: null,
  },

  // Current status of the event
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },

}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
