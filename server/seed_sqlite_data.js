import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import Venue from './models/Venue.js';
import Speaker from './models/Speaker.js';
import Sponsorship from './models/Sponsorship.js';
import Incident from './models/Incident.js';
import Registration from './models/Registration.js';
import Notification from './models/Notification.js';

dotenv.config();

const sqliteData = {
  users: [
    {id: 1, name: "Admin User", email: "admin@eventops.com", role: "admin", created_at: "2026-07-02 15:01:29"},
    {id: 2, name: "Regular User", email: "user@eventops.com", role: "user", created_at: "2026-07-02 15:01:29"},
    {id: 3, name: "Priyanshu Mohanty", email: "priyanshumohanty059@gmail.com", role: "user", created_at: "2026-07-07 15:22:37"},
    {id: 4, name: "Priyanshu Mohanty", email: "manasmohanty058@gmail.com", role: "admin", created_at: "2026-07-21 15:23:52"}
  ],
  events: [
    {id: 1, title: "AI Summit 2026", description: "The future of AI in business", date: "2026-07-10", time: "09:00 AM", location: "Main Hall", capacity: 200, status: "upcoming"},
    {id: 2, title: "Hackathon Night", description: "24-hour coding challenge", date: "2026-07-15", time: "06:00 PM", location: "Room B", capacity: 50, status: "upcoming"},
    {id: 3, title: "Sponsor Meet & Greet", description: "Networking with sponsors", date: "2026-07-20", time: "11:00 AM", location: "Exhibition Hall", capacity: 100, status: "upcoming"}
  ],
  venues: [
    {id: 1, name: "Main Hall", capacity: 60, utilization: 0.36, status: "available"},
    {id: 2, name: "Room A", capacity: 305, utilization: 0.68, status: "available"},
    {id: 3, name: "Room B", capacity: 344, utilization: 0.70, status: "available"},
    {id: 4, name: "Exhibition Hall", capacity: 192, utilization: 0.87, status: "available"},
    {id: 5, name: "Breakout Area", capacity: 74, utilization: 0.42, status: "available"}
  ],
  speakers: [
    {id: 1, name: "Dr. Smith", bio: "AI Researcher", sessionTitle: "Keynote: Future of AI", schedule: "Day 1 9:00", availability: true},
    {id: 2, name: "Prof. Lee", bio: "Data Scientist", sessionTitle: "Data Ethics", schedule: "Day 1 11:00", availability: true},
    {id: 3, name: "Ms. Jones", bio: "Event Manager", sessionTitle: "Operational Excellence", schedule: "Day 2 10:00", availability: true}
  ],
  sponsorships: [
    {id: 1, sponsorName: "Acme Corp", commitment: "$50k", deliverables: "Logo + booth", visibility_score: 85, roi: 1.2},
    {id: 2, sponsorName: "Beta Inc", commitment: "$30k", deliverables: "Session sponsor", visibility_score: 70, roi: 0.9},
    {id: 3, sponsorName: "Gamma Ltd", commitment: "$20k", deliverables: "Networking sponsor", visibility_score: 60, roi: 0.7}
  ],
  incidents: [
    {id: 1, title: "Wi-Fi outage", description: "Main hall connectivity lost", priority: "High", status: "open"},
    {id: 2, title: "Speaker delay", description: "Keynote speaker is late", priority: "Medium", status: "open"},
    {id: 3, title: "Catering shortage", description: "Lunch not enough for attendees", priority: "Low", status: "open"}
  ],
  registrations: [
    {id: 1, user_id: 1, event_id: 1, ticket_type: "VIP", status: "registered", checked_in: false},
    {id: 2, user_id: 2, event_id: 2, ticket_type: "Standard", status: "registered", checked_in: false},
    {id: 3, user_id: 1, event_id: 2, ticket_type: "VIP", status: "registered", checked_in: false},
    {id: 4, user_id: 2, event_id: 2, ticket_type: "Standard", status: "registered", checked_in: false},
    {id: 5, user_id: 2, event_id: 1, ticket_type: "VIP", status: "registered", checked_in: false},
    {id: 6, user_id: 3, event_id: 2, ticket_type: "VIP", status: "registered", checked_in: false}
  ],
  notifications: [
    {id: 1, recipient: "admin@eventops.com", title: "Welcome", message: "Welcome to EventOps AI"},
    {id: 2, recipient: "user@eventops.com", title: "Event Reminder", message: "Your event starts tomorrow"}
  ]
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing data (optional but good for a clean slate)
    console.log('Clearing old data...');
    await User.deleteMany();
    await Event.deleteMany();
    await Venue.deleteMany();
    await Speaker.deleteMany();
    await Sponsorship.deleteMany();
    await Incident.deleteMany();
    await Registration.deleteMany();
    await Notification.deleteMany();

    // ID mappings to link relations
    const userMap = {};
    const eventMap = {};

    console.log('Seeding Users...');
    for (const u of sqliteData.users) {
      const user = await User.create({
        name: u.name,
        email: u.email,
        password: 'password123', // Default dummy password
        role: u.role
      });
      userMap[u.id] = user._id;
    }

    console.log('Seeding Events...');
    for (const e of sqliteData.events) {
      const event = await Event.create({
        title: e.title,
        description: e.description,
        date: e.date,
        time: e.time,
        location: e.location,
        capacity: e.capacity,
        status: e.status
      });
      eventMap[e.id] = event._id;
    }

    const firstEventId = Object.values(eventMap)[0];
    const firstAdminId = Object.values(userMap).find(id => id); // Just taking first user

    console.log('Seeding Venues...');
    for (const v of sqliteData.venues) {
      await Venue.create({
        name: v.name,
        address: 'TBD',
        city: 'TBD',
        capacity: v.capacity
      });
    }

    console.log('Seeding Speakers...');
    for (const s of sqliteData.speakers) {
      await Speaker.create({
        name: s.name,
        bio: s.bio,
        sessionTitle: s.sessionTitle,
        schedule: s.schedule,
        availability: s.availability
      });
    }

    console.log('Seeding Sponsorships...');
    for (const sp of sqliteData.sponsorships) {
      let amount = 0;
      if (sp.commitment.includes('k')) {
        amount = parseInt(sp.commitment.replace(/\D/g,'')) * 1000;
      }
      await Sponsorship.create({
        event: firstEventId, // SQLite didn't have event_id, map to first event
        sponsorName: sp.sponsorName,
        amount: amount || 10000,
        description: sp.deliverables
      });
    }

    console.log('Seeding Incidents...');
    for (const inc of sqliteData.incidents) {
      await Incident.create({
        event: firstEventId, // Fallback mapping
        reportedBy: firstAdminId, // Fallback mapping
        title: inc.title,
        description: inc.description,
        severity: inc.priority
      });
    }

    console.log('Seeding Registrations...');
    for (const reg of sqliteData.registrations) {
      await Registration.create({
        user: userMap[reg.user_id],
        event: eventMap[reg.event_id],
        ticketType: reg.ticket_type,
        status: reg.status,
        checkedIn: reg.checked_in
      });
    }

    console.log('Seeding Notifications...');
    for (const notif of sqliteData.notifications) {
      // Try to find the user by email from our seeded users
      let userId = null;
      const u = sqliteData.users.find(u => u.email === notif.recipient);
      if (u) {
        userId = userMap[u.id];
      }
      await Notification.create({
        user: userId,
        title: notif.title,
        message: notif.message
      });
    }

    console.log('Data Migration Complete! 🎉');
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

seedDatabase();
