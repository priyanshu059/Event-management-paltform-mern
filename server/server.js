// ============================================================
// server.js - Main Entry Point for EventOps Backend
// ============================================================
// This is the starting file for our Express server.
// It sets up:
//   1. Express app with middleware (CORS, JSON parsing)
//   2. Connects to MongoDB database
//   3. Registers all API routes
//   4. Starts the reminder scheduler
//   5. Starts the server on PORT 5000
// ============================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { startReminderScheduler } from './services/reminderService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// --- Import all route files ---
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import sponsorshipRoutes from './routes/sponsorshipRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';

// Create Express app
const app = express();

// ---- Middleware ----
// Allow requests from our React frontend (running on port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ---- Connect to MongoDB ----
connectDB();

// ---- Register API Routes ----
// Each route file handles a specific part of the API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/intelligence', intelligenceRoutes);

// ---- Global Error Handler ----
// This catches any errors thrown in our routes
app.use(errorHandler);

// ---- Start Reminder Scheduler ----
// This runs every minute to send reminder notifications
startReminderScheduler();

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ EventOps Server running on http://localhost:${PORT}`);
});