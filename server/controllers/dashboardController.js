// ============================================================
// controllers/dashboardController.js - Admin Dashboard Stats
// ============================================================
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';
import Incident from '../models/Incident.js';

// GET /api/dashboard/stats - Returns summary counts for admin dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalRegistrations, totalFeedback, openIncidents] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Event.countDocuments(),
        Registration.countDocuments(),
        Feedback.countDocuments(),
        Incident.countDocuments({ status: 'Open' }),
      ]);

    // Get upcoming events (date >= today)
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .select('title date location status');

    // Get recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('event', 'title');

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalFeedback,
        openIncidents,
      },
      upcomingEvents,
      recentRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
